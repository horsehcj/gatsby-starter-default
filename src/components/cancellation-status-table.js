import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import "./cancellation-status-table.scss"
import Moment from 'react-moment';
import axios from "axios";
import cn from 'classnames';

const CancellationStatusDate = (props) => {
  const [isFetching, setIsFetching] = useState(true)
  const [todaysCancellations, setTodaysCancellations] = useState({})

  useEffect(() => {
    axios.get("https://us-central1-court-finder-37f55.cloudfunctions.net/widgets/get-todays-cancellations")
      .then((val) => {
        if (val.data) {
          setIsFetching(false)
          setTodaysCancellations(val.data[0]);
        }
      })
  }, [])

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
      <p className="intro">康民署嘅羽毛球場館好多時都有唔同原因放番出嚟，例如活動取消，又或者原定嘅活動順利舉行，本身預留嘅場地會提供番俾市民預訂等等。呢個網頁會監察著康體通有冇突然放番啲場出嚟，然後以最快速度話俾大家知，所以如果想第一時間得到最新羽毛球場空缺資訊，記得㩒右上角〝網站推送通知〞，然後㩒〝允許〞或者 "Accept"，你可以選擇收到一個或多個區嘅通知。<br /><span className="red">iPhone 用戶未能使用網站推送功能，請等待即將推出嘅 iPhone app</span><br /><Link className="iwtpb-button" to="/court-availability">未來十日場地狀況 ></Link></p>
      { isFetching && (
          <div className="cancellation-status-current-date is-fetching">
            <div className="cancellation-status-current-date-label">
              <p className="bold">今日</p>
            </div>
            <div className="cancellation-status-current-times">
              <div className="cancellation-status-current-time">
                <div className="cancellation-status-current-time-label">
                  <p className="loading">
                    00:00
                  </p>
                </div>
                <div className="cancellation-status-current-time-court">
                  <p className="loading cancellation-status-current-time-court-date-label">
                    xxxx Xxx 2020 (Xxx)
                  </p>
                  <div className="cancellation-status-current-time-court-details">
                    <p className="loading">
                      XXX體育館 00:00 有X個場被取消
                    </p>
                    <p className="loading">
                      XXX體育館 00:00 有X個場被取消
                    </p>
                    <p className="loading">
                      XXX體育館 00:00 有X個場被取消
                    </p>
                    <p className="loading">
                      XXX體育館 00:00 有X個場被取消
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}

      { !isFetching && todaysCancellations.times && todaysCancellations.times.length > 0 && (
          <div className="cancellation-status-current-date">
            <div className="cancellation-status-current-date-label">
              <p className="bold">今日</p>
            </div>
            <div className="cancellation-status-current-times">
              { todaysCancellations.times.sort(compare2).map((currectTime) => {
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
      )}

      { !isFetching && todaysCancellations.times && !todaysCancellations.times.length && (
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
                  今日未有球場被放出嚟
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


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
