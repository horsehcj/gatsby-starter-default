import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import "./cancellation-status-table.scss"
import RecruitPartner from "./recruit-partners"
import Moment from 'react-moment';
import axios from "axios";
import cn from 'classnames';

const CancellationStatusDate = (props) => {
  const [isFetching, setIsFetching] = useState(false)
  const [todaysCancellations, setTodaysCancellations] = useState({})

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

  const getDataFromFirebase = () => {
    axios.get("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/get-todays-cancellations")
      .then((val) => {
        if (val.data) {
          setIsFetching(false)
          setTodaysCancellations(val.data[0]);
          document.cookie = "lf=" + new Date().getTime();
        }
      })
  }

  // useEffect(() => {
  //   if (getCookie('lf') === "" || getCookie('lf') < new Date().getTime() - 5000) {
  //     getDataFromFirebase()
  //   } else {
  //     setTimeout(() => {
  //       getDataFromFirebase()
  //     }, 5000)
  //   }
  // }, [])

  const setDisplayDate = (date) => {
    return <p>{date.substring(0, 4)}<br />{date.substring(4, 6)}<br />{date.substring(6)}</p>
  }

  const compare1 = (a, b) => {
    if (a.date*1 > b.date*1) return -1;
    if (b.date*1 > a.date*1) return 1;
    return 0;
  }

  const compare2 = (a, b) => {
    if (a.time*1 > b.time*1) return -1;
    if (b.time*1 > a.time*1) return 1;
    return 0;
  }

  const compare3 = (a, b) => {
    if (a.time*1 > b.time*1) return 1;
    if (b.time*1 > a.time*1) return -1;
    return 0;
  }

  return (
    <div className={cn("cancellation-status-table", props.displayedmodule === 1 && "hide")}>
      <RecruitPartner />
      <p className="intro">康民署嘅羽毛球場館好多時都有唔同原因放番出嚟，例如活動取消，又或者原定嘅活動順利舉行，本身預留嘅場地會提供番俾市民預訂等等。呢個網頁會監察著康體通有冇突然放番啲場出嚟，然後以最快速度話俾大家知<br /><Link className="iwtpb-button" to="/court-availability">未來十日場地狀況 ></Link></p>

      <div className="cancellation-status-current-date no-data">
        <div className="cancellation-status-current-date-label">
          <p className="bold">今日</p>
        </div>
        <div className="cancellation-status-current-times">
          <div className="cancellation-status-current-time">
            <div className="cancellation-status-current-time-label">
              <p className="hide">
                00:00
              </p>
            </div>
            <div className="cancellation-status-current-time-court">
              <p className="bold loading cancellation-status-current-time-court-date-label">
                放場資訊服務已經停止<br />謝謝大家
              </p>
            </div>
          </div>
        </div>
      </div>


      { props.cancellations.sort(compare1).map((currectDate, i) => {
        return (
          <div key={i} className="cancellation-status-current-date">
            <div className="cancellation-status-current-date-label">
              {setDisplayDate(currectDate.date)}
            </div>
            <div className="cancellation-status-current-times">
              { currectDate.times.sort(compare2).map((currectTime) => {
                return (
                  <div key={currectTime.time} className="cancellation-status-current-time">
                    <div className="cancellation-status-current-time-label">
                      <p>{currectTime.time.substring(0, 2)}:{currectTime.time.substring(2, 4)}<span>放場</span></p>
                    </div>
                    <div className="cancellation-status-current-time-court">
                      { currectTime.dates.map((date) => {
                        return (
                          <React.Fragment key={date.date}>
                            <p className="cancellation-status-current-time-court-date-label">
                              <Moment format="Do MMM YYYY (ddd)">
                                {date.date}
                              </Moment>
                            </p>
                            <div className="cancellation-status-current-time-court-details">
                              { date.courts.map((court) => {
                                return (
                                  <React.Fragment key={court.id}>
                                    { court.availabilities.sort(compare3).map((availability) => {
                                      return (
                                        <p key={availability.time}>{court.id} {availability.time.substring(0,2)}:{availability.time.substring(2,4)} 有{availability.qty}個場被取消</p>
                                      )
                                    })}
                                  </React.Fragment>
                                )
                              })}
                            </div>
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CancellationStatusDate
