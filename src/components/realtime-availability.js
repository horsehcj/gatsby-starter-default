import React, { Component } from "react"
import "./realtime-availability.scss"
import Moment from 'react-moment';
import axios from "axios";
const moment = require('moment-timezone');
const venues = require('./../../resources/venues.json');

const key = 'I really want to play badminton';
const encryptor = require('simple-encryptor')(key);

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

class ReadtimeAvailability extends Component {
  componentDidMount() {
    axios.get("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/get-court-availabitity?date=" + this.state.seletectedDate)
      .then((val) => {
        if (val.data) {
          this.setState({ seletectedDate: this.state.seletectedDate });
          this.setState({ courtAvailability: {[this.state.seletectedDate]: encryptor.decrypt(val.data).data} })
        }
      })

    let cf = getCookie('f')
    if (cf) {
      this.setState({ area: JSON.parse(cf) });
    }

    document.getElementById('date-selection').scrollLeft = document.getElementById('date-selection').scrollWidth;
  }

  state = {
    seletectedDate: moment().tz("America/Danmarkshavn").add((Number(moment().tz("Asia/Hong_Kong").format('HH')) < 8?9:10),'days').format('YYYYMMDD'),
    courtAvailability: {},
    showFilter: false,
    area : {
      KLN: {
        KC: true,
        KT: true,
        WTS: true,
        YTM: true,
        SSP: true
      },
      HK: {
        WCH: true,
        EN: true,
        SN: true,
        CW: true
      },
      NTE: {
        SK: true,
        ST: true,
        N: true,
        TP: true
      },
      NTW: {
        TM: true,
        YL: true,
        IS: true,
        TW: true,
        KWT: true
      }
    },
    areaName: {
      KC: '九龍城',
      KT: '官塘',
      WTS: '黃大仙',
      YTM: '油尖旺',
      SSP: '深水埗',
      WCH: '灣仔',
      EN: '東區',
      SN: '南區',
      CW: '中西區',
      SK: '西貢',
      ST: '沙田區',
      N: '北區',
      TP: '大埔區',
      TM: '屯門區',
      YL: '元朗區',
      IS: '離島區',
      TW: '荃灣區',
      KWT: '葵青區'
    }
  }

  selectDate = (date) => {
    this.setState({ seletectedDate: date });

    if (!this.state.courtAvailability[date]) {
      axios.get("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/get-court-availabitity?date=" + date)
        .then((val) => {
          if (val.data) {
            this.setState(prevState => ({
              courtAvailability:{
                ...prevState.courtAvailability,
                [this.state.seletectedDate]: encryptor.decrypt(val.data).data
              }
            }))
          }
        })
    }
  }

  toggleFilter = () => {
    this.setState({ showFilter: !this.state.showFilter });
  }

  confirmFilter = () => {
    document.cookie = "f=" + JSON.stringify(this.state.area) + "; expires=Sun, 18 Dec 2033 12:00:00 UTC"
    this.toggleFilter()
  }

  onChangeFilter = (area, region) => {
    this.setState(prevState => ({
      area: {
        ...prevState.area,
        [area]: {
          ...prevState.area[area],
          [region]: !this.state.area[area][region]
        }
      }
    }));
  }

  render() {
    const { courtAvailability, seletectedDate, showFilter, area, areaName } = this.state;

    let dateBtnsDom, courtAvailabilityDom, filterDom
    let dateBtnDom = []

    const displayDays = Number(moment().tz("Asia/Hong_Kong").format('HH')) < 8? 7: 8
    const day = {
      '0': '日',
      '1': '一',
      '2': '二',
      '3': '三',
      '4': '四',
      '5': '五',
      '6': '六'
    }

    for (let j=1; j<displayDays; j++) {
      let buttonClassName = 'date-button'
      let date = moment().tz("Asia/Hong_Kong").add(j,'days').format('YYYYMMDD')

      if(date === seletectedDate) {
        buttonClassName += ' active'
      }

      dateBtnDom.push(
        <button key={date} className={buttonClassName} onClick={() => this.selectDate(date)}>
          <Moment format="DD/MM">
            {date}
          </Moment> ({day[moment(date, 'YYYYMMDD').format('d')]})
        </button>
      )
    }

    dateBtnsDom = (
      <div id="date-selection" className="date-selection">
        {dateBtnDom}
      </div>
    )

    if (courtAvailability[seletectedDate]) {
      let todayCourtAvailability = courtAvailability[seletectedDate]
      let filteredCourtAvailabilityArr = todayCourtAvailability.filter((stadium) => {
        return area[venues[stadium.venue].region][venues[stadium.venue].district]
      })

      let filteredCourtAvailabilityObj = {}

      for (let i = 0; i < filteredCourtAvailabilityArr.length; i++) {
        filteredCourtAvailabilityObj[filteredCourtAvailabilityArr[i].venue] = filteredCourtAvailabilityArr[i].freeCourts
      }

      courtAvailabilityDom = (
        <div className="court-availability">
          <div className="court-row court-row-header">
            <div className="court-label" role="button" onClick={this.toggleFilter} tabIndex={0} onKeyDown={this.toggleFilter}>顯示場館 ▼</div>
            <div className="court-timeslot">7</div>
            <div className="court-timeslot">8</div>
            <div className="court-timeslot">9</div>
            <div className="court-timeslot">10</div>
            <div className="court-timeslot">11</div>
            <div className="court-timeslot">12</div>
            <div className="court-timeslot">1</div>
            <div className="court-timeslot">2</div>
            <div className="court-timeslot">3</div>
            <div className="court-timeslot">4</div>
            <div className="court-timeslot">5</div>
            <div className="court-timeslot">6</div>
            <div className="court-timeslot">7</div>
            <div className="court-timeslot">8</div>
            <div className="court-timeslot">9</div>
            <div className="court-timeslot">10</div>
          </div>
          { Object.keys(filteredCourtAvailabilityObj).map((court, i) => {
            let rowClass="court-row"

            if(i%2 !== 0) {
              rowClass+=" even"
            }

            return (
              <div className={rowClass} key={court}>
                <div className="court-label">
                  {venues[court].name.TC}
                </div>

                { Object.keys(filteredCourtAvailabilityObj[court]).map((no) => {
                  let timeslotClass = "court-timeslot"

                  if (no > 10 || moment(seletectedDate, 'YYYYMMDD').format('d') === '6' || moment(seletectedDate, 'YYYYMMDD').format('d') === '0') {
                    timeslotClass += " peak"
                  }

                  if (filteredCourtAvailabilityObj[court][no] === 0) {
                    timeslotClass += " empty"
                  }

                  return (
                    <div key={no} className={timeslotClass}>{filteredCourtAvailabilityObj[court][no]}</div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )

      let filterClass = "filter-container"

      if (showFilter) {
        filterClass += " active"
      }

      filterDom = (
        <div className={filterClass}>
          <div className="filter-districts-container">
            <h2>九龍區</h2>

            <div className="filter-districts">
              { Object.keys(area.KLN).map((item) => {
                  return (
                    <div key={item} className="form-group">
                      <input id={item} type="checkbox" value={item} onChange={() => this.onChangeFilter('KLN', item)} checked={area.KLN[item]} />
                      <label htmlFor={item} className="noselect">{areaName[item]}</label>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="filter-districts-container">
            <h2>香港區</h2>

            <div className="filter-districts">
              { Object.keys(area.HK).map((item) => {
                  return (
                    <div key={item} className="form-group">
                      <input id={item} type="checkbox" value={item} onChange={() => this.onChangeFilter('HK', item)} checked={area.HK[item]} />
                      <label htmlFor={item} className="noselect">{areaName[item]}</label>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="filter-districts-container">
            <h2>新界東區</h2>

            <div className="filter-districts">
              { Object.keys(area.NTE).map((item) => {
                  return (
                    <div key={item} className="form-group">
                      <input id={item} type="checkbox" value={item} onChange={() => this.onChangeFilter('NTE', item)} checked={area.NTE[item]} />
                      <label htmlFor={item} className="noselect">{areaName[item]}</label>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className="filter-districts-container">
            <h2>新界西區</h2>

            <div className="filter-districts">
              { Object.keys(area.NTW).map((item) => {
                  return (
                    <div key={item} className="form-group">
                      <input id={item} type="checkbox" value={item} onChange={() => this.onChangeFilter('NTW', item)} checked={area.NTW[item]} />
                      <label htmlFor={item} className="noselect">{areaName[item]}</label>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <button onClick={this.confirmFilter}>確定</button>
        </div>
      )
    } else {
      courtAvailabilityDom = <p className="loading">Loading...</p>
    }

    let tableClass = "court-availability-table"
    if (this.props.displayedmodule === 2) {
      tableClass+= " hide"
    }

    return (
      <div className={tableClass}>
        {dateBtnsDom}
        {courtAvailabilityDom}
        {filterDom}
      </div>
    )
  }
}

export default ReadtimeAvailability
