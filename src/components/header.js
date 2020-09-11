import React, { Component } from "react"
import Logo from "../images/i-want-to-book-court.png";

import "./header.scss"

class Header extends Component {
  state = {
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

  render() {
    const { siteTitle } = this.props;
    const { subscribe } = this.state;
    const { areaName } = this.state;

    return (
      <header>
        <h1>
          <img src={Logo} alt="" />
          {siteTitle}
        </h1>

        <button>
          網站推送通知
        </button>

        <div className="area-selection-container">
          <p>
            請選擇你想收到的通知內容
          </p>
          <div className="area-selection">
            { Object.keys(subscribe).map((item) => {
                return (
                  <div className="form-group">
                    <input id={item} type="checkbox" value={item} onChange={this.onChangeSubscribe} checked={subscribe[item]} />
                    <label htmlFor={item} className="noselect">{areaName[item]}</label>
                  </div>
                )
              })
            }
          </div>
          <div className="subscribe-button noselect">
            確認
          </div>
        </div>
      </header>
    )
  }
}

export default Header
