import React, { Component } from "react"
import "./cancellation-status-table.scss"
import Moment from 'react-moment';

class CancellationStatusDate extends Component {
  render() {
    return (
      <div className="cancellation-status-table">
        { this.props.cancellations.reverse().map((currectDate) => {
            return (
              <div key={currectDate.date} className="cancellation-status-current-date">
                <div className="cancellation-status-current-date-label">
                  <p>
                    {currectDate.date.substring(0, 4)}<br />
                    {currectDate.date.substring(4, 6)}<br />
                    {currectDate.date.substring(6)}
                  </p>
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
                                  <p>源禾路體育館 9:00 有4個場被取消</p>
                                  <p>源禾路體育館 9:00 有4個場被取消</p>
                                  <p>源禾路體育館 9:00 有4個場被取消</p>
                                  <p>源禾路體育館 9:00 有4個場被取消</p>
                                  <p>源禾路體育館 9:00 有4個場被取消</p>
                                  <p>源禾路體育館 9:00 有4個場被取消</p>
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
