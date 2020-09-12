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
          this.setState({ alreadySubscribe: true });

          this.setState({ subscribe: {
            kowloon: val.data.kowloon,
            hongkong: val.data.hongkong,
            nt: val.data.nt,
            id: val.data.id
          }});
        })
    }

    firebase.messaging().onMessage((payload) => {
      window.location.reload();
    });
  }

  state = {
    isLoading: false,
    alreadySubscribe: false,
    showSubscribsionBar: false,
    areaName: {
      kowloon: '九龍',
      hongkong: '香港島',
      nt: '新界',
      id: '離島'
    },
    subscribe: {
      kowloon: true,
      hongkong: true,
      nt: true,
      id: false
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

  requestNotificationPermission = () => {
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

          <button onClick={this.toggleSubscribsionBar}>
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
