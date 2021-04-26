import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import Logo from "../images/i-want-to-book-court.png";
import "./header.scss"
import firebase from "gatsby-plugin-firebase"
import axios from "axios";

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const Header = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [alreadySubscribe, setAlreadySubscribe] = useState(false)
  const [showSubscribsionBar, setShowSubscribsionBar] = useState(false)
  const [subscribe, setSubscribe] = useState({
    kowloon: true,
    hongkong: true,
    nte: true,
    ntw: true
  })

  const areaName = {
    kowloon: '九龍',
    hongkong: '香港島',
    nte: '新界東',
    ntw: '新界西'
  }

  useEffect(() => {
    const firebaseToken = getCookie('lcsdFirebaseToken')
    if( firebaseToken ) {
      axios.get("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/get-settings?token=" + firebaseToken)
        .then((val) => {
          if (val.data) {
            setAlreadySubscribe(true)
            setSubscribe({
              kowloon: val.data.kowloon,
              hongkong: val.data.hongkong,
              nte: val.data.nte,
              ntw: val.data.ntw
            })
          } else {
            document.cookie = "lcsdFirebaseToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }
        })

      firebase.messaging().onMessage((payload) => {
        window.location.reload();
      });

      firebase.messaging.onTokenRefresh(() => {
        firebase.messaging().getToken()
          .then((refreshedFirebaseToken) => {
            console.log('lcsdFirebaseToken: ' + refreshedFirebaseToken)
            setTokenSentToServer(false);
            sendTokenToServer(refreshedFirebaseToken);
          })
      });
    }
  })

  const onChangeSubscribe = e => {
    const key = e.target.value;

    setSubscribe({
      ...subscribe,
      [key]: !subscribe[key]
    })
  };

  const toggleSubscribsionBar = () => {
    this.setState({ showSubscribsionBar: !showSubscribsionBar });
  }

  const sendTokenToServer = (currentToken) => {
    if (!isTokenSentToServer()) {
      document.cookie = "lcsdFirebaseToken=" + currentToken + "; expires=Sun, 18 Dec 2033 12:00:00 UTC";

      let body = {
        token: currentToken,
        settings: subscribe
      };

      axios.post("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/webpushuser", body)
        .then(() => {
          setTokenSentToServer(true);
        })
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }

  const setTokenSentToServer = (sent) => {
    window.localStorage.setItem('sentToServer', sent ? 0 : 0);
  }

  const isTokenSentToServer = () => {
    return window.localStorage.getItem('sentToServer') === 1;
  }

  const requestNotificationPermission = () => {
    if (firebase.messaging.isSupported()) {
      setIsLoading(true)
      firebase.messaging()
        .requestPermission()
        .then(() => firebase.messaging().getToken())
        .then((lcsdFirebaseToken) => {
          document.cookie = "lcsdFirebaseToken=" + lcsdFirebaseToken + "; expires=Sun, 18 Dec 2033 12:00:00 UTC";

          let body = {
            token: lcsdFirebaseToken,
            settings: subscribe
          };

          return axios.post("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/webpushuser", body)
        })
        .then((res) => {
          setAlreadySubscribe(true)
          setShowSubscribsionBar(false)

          setTimeout(() => {
            setIsLoading(false)
          }, 300)
        })
        .catch((err) => {
          setIsLoading(false)
          alert('請再試一次')
          console.log(err)
        });
    } else {
      alert('網站推送只適用係電腦及 Android 手機 - Chrome, Firefox 或 Edge 17+，iPhone app 正在研發中。')
    } 
  }

  return (
    <React.Fragment>
      <header>
        <h1>
          <img src={Logo} alt="" />
          <Link to="/">{props.siteTitle}</Link>
        </h1>

        <button className={alreadySubscribe? '': 'non-register'} onClick={toggleSubscribsionBar}>
          {alreadySubscribe? '更新網站推送通知' : '網站推送通知'}
        </button>
      </header>

      <div className={`area-selection-container ${showSubscribsionBar ? "active" : ""}`}>
        <p>
          請選擇你想收到的通知內容:
        </p>
        <div className="area-selection">
          { Object.keys(subscribe).map((item) => {
              return (
                <div key={item} className="form-group">
                  <input id={item} type="checkbox" value={item} onChange={onChangeSubscribe} checked={subscribe[item]} />
                  <label htmlFor={item} className="noselect">{areaName[item]}</label>
                </div>
              )
            })
          }
        </div>
        <button className="subscribe-button noselect" onClick={requestNotificationPermission} onKeyDown={requestNotificationPermission}>
          {isLoading? '請等等...' : (alreadySubscribe? '更新' : '確認')}
        </button>
      </div>
    </React.Fragment>
  )
}

export default Header
