import React, { Component } from "react"
import Logo from "../images/i-want-to-book-court.png";
import "./header.scss"
import { requestFirebaseNotificationPermission } from '../firebaseInit'

class Header extends Component {
  state = {
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
    requestFirebaseNotificationPermission()
      .then((firebaseToken) => {
        // eslint-disable-next-line no-console
        console.log(firebaseToken);
      })
      .catch((err) => {
        return err;
      });
  }

  render() {
    const { siteTitle } = this.props;
    const { subscribe } = this.state;
    const { areaName } = this.state;
    const { showSubscribsionBar } = this.state;

    return (
      <React.Fragment>
        <header>
          <h1>
            <img src={Logo} alt="" />
            {siteTitle}
          </h1>

          <button onClick={this.toggleSubscribsionBar}>
            網站推送通知
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
            確認
          </button>
        </div>
      </React.Fragment>
    )
  }
}

export default Header
