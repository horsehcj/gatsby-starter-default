import React, { Component } from "react"
import "./cancellation-status-table.scss"
import Moment from 'react-moment';

class CancellationStatusDate extends Component {
  render() {
    const d = new Date();
    const month = ('0'+(d.getMonth()+1)).slice(-2)
    const day = ('0'+d.getDate()).slice(-2)

    function SetDisplayDate(date) {
      if (date === d.getFullYear()+month+day) {
        return <p>今日</p>
      } else {
        return <p>{date.substring(0, 4)}<br />{date.substring(4, 6)}<br />{date.substring(6)}</p>
      }
    }

    return (
      <div className="cancellation-status-table">
        { this.props.cancellations.reverse().map((currectDate) => {
            return (
              <div key={currectDate.date} className="cancellation-status-current-date">
                <div className="cancellation-status-current-date-label">
                  {SetDisplayDate(currectDate.date)}
                </div>
                <div className="cancellation-status-current-times">
                  { currectDate.times.reverse().map((currectTime) => {
                    return (
                      <div key={currectTime.time} className="cancellation-status-current-time">
                        <div className="cancellation-status-current-time-label">
                          <p>{currectTime.time.substring(0, 2)}:{currectTime.time.substring(2, 4)}</p>
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
                                        { court.availabilities.map((availability) => {
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
          })
        }
      </div>
    )
  }
}

export default CancellationStatusDate
