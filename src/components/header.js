import React, { Component } from "react"
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

class Header extends Component {
  componentDidMount() {
    const firebaseToken = getCookie('lcsdFirebaseToken')
    if( firebaseToken ) {
      axios.get("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/get-settings?token=" + firebaseToken)
        .then((val) => {
          if (val.data) {
            this.setState({ alreadySubscribe: true });

            this.setState({ subscribe: {
              kowloon: val.data.kowloon,
              hongkong: val.data.hongkong,
              nte: val.data.nte,
              ntw: val.data.ntw
            }});
          } else {
            document.cookie = "lcsdFirebaseToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }
        })

      firebase.messaging().onMessage((payload) => {
        window.location.reload();
      });

      firebase.messaging().onTokenRefresh(() => {
        firebase.messaging().getToken()
          .then((refreshedFirebaseToken) => {
            console.log('lcsdFirebaseToken: ' + refreshedFirebaseToken)
            this.setTokenSentToServer(false);
            this.sendTokenToServer(refreshedFirebaseToken);
          })
      });

      firebase.messaging().getToken()
        .then((refreshedFirebaseToken) => {
          console.log('lcsdFirebaseToken: ' + refreshedFirebaseToken)
          this.setTokenSentToServer(false);
          this.sendTokenToServer(refreshedFirebaseToken);
        })
    }
  }

  state = {
    isLoading: false,
    alreadySubscribe: false,
    showSubscribsionBar: false,
    areaName: {
      kowloon: '九龍',
      hongkong: '香港島',
      nte: '新界東',
      ntw: '新界西'
    },
    subscribe: {
      kowloon: true,
      hongkong: true,
      nte: true,
      ntw: true
    }
  };

  onChangeSubscribe = e => {
    const key = e.target.value;

    this.setState(state => ({
      subscribe: {
        ...state.subscribe,
        [key]: !state.subscribe[key]
      }
    }));
  };

  toggleSubscribsionBar = () => {
    this.setState({ showSubscribsionBar: !this.state.showSubscribsionBar });
  }

  sendTokenToServer(currentToken) {
    console.log("sendTokenToServer: " + currentToken)

    if (!this.isTokenSentToServer()) {
      document.cookie = "lcsdFirebaseToken=" + currentToken + "; expires=Sun, 18 Dec 2033 12:00:00 UTC";

      let body = {
        token: currentToken,
        settings: this.state.subscribe
      };

      axios.post("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/webpushuser", body)
        .then(() => {
          this.setTokenSentToServer(true);
        })
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }
  }

  setTokenSentToServer = (sent) => {
    console.log("setTokenSentToServer: " + sent)
    window.localStorage.setItem('sentToServer', sent ? 0 : 0);
  }

  isTokenSentToServer = () => {
    console.log("isTokenSentToServer")
    return window.localStorage.getItem('sentToServer') == 1;
  }

  requestNotificationPermission = () => {
    if (firebase.messaging.isSupported()) {
      this.setState({ isLoading: true });
      firebase.messaging()
        .requestPermission()
        .then(() => firebase.messaging().getToken())
        .then((lcsdFirebaseToken) => {
          document.cookie = "lcsdFirebaseToken=" + lcsdFirebaseToken + "; expires=Sun, 18 Dec 2033 12:00:00 UTC";

          let body = {
            token: lcsdFirebaseToken,
            settings: this.state.subscribe
          };

          return axios.post("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/webpushuser", body)
        })
        .then((res) => {
          this.setState({ alreadySubscribe: true });
          this.setState({ showSubscribsionBar: false });

          setTimeout(() => {
            this.setState({ isLoading: false });
          }, 300)
        })
        .catch((err) => {
          this.setState({ isLoading: false });
          alert('請再試一次')
          console.log(err)
        });
    } else {
      alert('網站推送只適用係 Chrome, Firefox 或 Edge 17+')
    } 
  }

  render() {
    const { siteTitle } = this.props;
    const { subscribe } = this.state;
    const { areaName, alreadySubscribe, showSubscribsionBar, isLoading } = this.state;

    return (
      <React.Fragment>
        <header>
          <h1>
            <img src={Logo} alt="" />
            {siteTitle}
          </h1>

          <button className={alreadySubscribe? '': 'non-register'} onClick={this.toggleSubscribsionBar}>
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
                    <input id={item} type="checkbox" value={item} onChange={this.onChangeSubscribe} checked={subscribe[item]} />
                    <label htmlFor={item} className="noselect">{areaName[item]}</label>
                  </div>
                )
              })
            }
          </div>
          <button className="subscribe-button noselect" onClick={this.requestNotificationPermission} onKeyDown={this.requestNotificationPermission}>
            {isLoading? '請等等...' : (alreadySubscribe? '更新' : '確認')}
          </button>
        </div>
      </React.Fragment>
    )
  }
}

export default Header
