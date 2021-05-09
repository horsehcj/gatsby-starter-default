import React, { useState, useEffect } from "react"
import "./realtime-availability.scss"
import Moment from 'react-moment';
import axios from "axios";
import cn from 'classnames';
const moment = require('moment-timezone');
const venues = require('../../resources/venues.js').default;
const areaName = require('../../resources/area.js').default;

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

const ReadtimeAvailability = (props) => {
  const [selectedDate, setSelectedDate] = useState(moment().tz("America/Danmarkshavn").add((Number(moment().tz("Asia/Hong_Kong").format('HH')) < 8?6:7),'days').format('YYYYMMDD'))
  const [courtAvailability, setCourtAvailability] = useState({})
  const [showFilter, setShowFilter] = useState(false)
  const [area, setArea] = useState(
    {
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
    }
  )

  const getCookie = (cname) => {
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

  const getAvaFromFirebase = () => {
    axios.get("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/get-court-availabitity?date=" + selectedDate)
      .then((val) => {
        if (val.data) {
          let newData = {}
          newData[selectedDate] = encryptor.decrypt(val.data).data

          setCourtAvailability(newData)
          document.cookie = "lfa=" + new Date().getTime();
        }
      })

    let cf = getCookie('f')
    if (cf) {
      setArea(JSON.parse(cf))
    }

    document.getElementById('date-selection').scrollLeft = document.getElementById('date-selection').scrollWidth;
  }

  useEffect(() => {
    if (getCookie('lfa') === "" || getCookie('lfa') < new Date().getTime() - 5000) {
      getAvaFromFirebase()
    } else {
      setTimeout(() => {
        getAvaFromFirebase()
      }, 5000)
    }
  }, [selectedDate])

  const selectDate = (date) => {
    setSelectedDate(date)

    if (!courtAvailability[date]) {
      axios.get("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/get-court-availabitity?date=" + date)
        .then((val) => {
          if (val.data) {
            let newData = {}
            newData[date] = encryptor.decrypt(val.data).data

            setCourtAvailability({
              ...courtAvailability,
              ...newData
            })
          }
        })
    }
  }

  const toggleFilter = () => {
    setShowFilter(!showFilter)
  }

  const confirmFilter = () => {
    document.cookie = "f=" + JSON.stringify(area) + "; expires=Sun, 18 Dec 2033 12:00:00 UTC"
    toggleFilter()
  }

  const onChangeFilter = (selectedArea, selectedRegion) => {
    let newData = Object.assign({}, area[selectedArea])
    newData[selectedRegion] = !area[selectedArea][selectedRegion]

    setArea({
      ...area,
      [selectedArea]: newData
    })
  }

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

  let todayCourtAvailability = courtAvailability[selectedDate]
  let filteredCourtAvailabilityArr, filteredCourtAvailabilityObj

  if (todayCourtAvailability) {
    filteredCourtAvailabilityArr = todayCourtAvailability.filter((stadium) => {
      return area[venues[stadium.venue].region][venues[stadium.venue].district]
    })

    filteredCourtAvailabilityObj = {}

    for (let i = 0; i < filteredCourtAvailabilityArr.length; i++) {
      filteredCourtAvailabilityObj[filteredCourtAvailabilityArr[i].venue] = filteredCourtAvailabilityArr[i].freeCourts
    }
  }

  const filteringSections = [
    {label: "九龍區", value: "KLN"},
    {label: "香港區", value: "HK"},
    {label: "新界東區", value: "NTE"},
    {label: "新界西區", value: "NTW"},
  ]

  return (
    <div className={cn("court-availability-table", props.displayedmodule === 2 && "hide")}>
      <div id="date-selection" className="date-selection">
        {
          Array(displayDays).fill().map((d, i) => {
            let date = moment().tz("Asia/Hong_Kong").add(i,'days').format('YYYYMMDD')

            return (
              <button key={i} className={cn('date-button', date === selectedDate && 'active')} onClick={() => selectDate(date)}>
                <Moment format="DD/MM">
                  {date}
                </Moment> ({day[moment(date, 'YYYYMMDD').format('d')]})
              </button>
            )
          })
        }
      </div>

      <div className="court-availability">
        <div className="court-row court-row-header">
          <div className="court-label" role="button" onClick={toggleFilter} tabIndex={0} onKeyDown={toggleFilter}>顯示場館 ▼</div>
          {
            [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((h, i) => {
              return <div className="court-timeslot" key={i}>{h}</div>
            })
          }
        </div>

        { todayCourtAvailability && Object.keys(filteredCourtAvailabilityObj).map((court, i) => {
          return (
            <div className={cn("court-row", i%2 !== 0 && "even")} key={court}>
              <div className="court-label">
                {venues[court].name.TC}
              </div>

              { Object.keys(filteredCourtAvailabilityObj[court]).map((no) => {
                return (
                  <div
                    key={no}
                    className={cn(
                      "court-timeslot",
                      (no > 10 || moment(selectedDate, 'YYYYMMDD').format('d') === '6' || moment(selectedDate, 'YYYYMMDD').format('d') === '0') && "peak",
                      filteredCourtAvailabilityObj[court][no] === 0 && "empty"
                    )}>
                      {filteredCourtAvailabilityObj[court][no]}
                  </div>
                )
              })}
            </div>
          )
        })}

        {
          !todayCourtAvailability && (<p className="loading">Loading...</p>)
        }
      </div>

      <div className={cn("filter-container", showFilter && "active")}>
        {
          filteringSections.map((section, i) => {
            return (
              <div key={i} className="filter-districts-container">
                <h2>{section.label}</h2>

                <div className="filter-districts">
                  { Object.keys(area[section.value]).map((item) => {
                    return (
                      <div key={item} className="form-group">
                        <input id={item} type="checkbox" value={item} onChange={() => onChangeFilter(section.value, item)} checked={area[section.value][item]} />
                        <label htmlFor={item} className="noselect">{areaName[item]}</label>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        }
        <button onClick={confirmFilter}>確定</button>
      </div>
    </div>
  )
}

export default ReadtimeAvailability
