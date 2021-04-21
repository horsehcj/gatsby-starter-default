import React from "react"
import "./index-modules.scss"
import CancellationStatusTable from "../components/cancellation-status-table"
import ReadtimeAvailability from "../components/realtime-availability"

const IndexModules = (props) => {
  return (
    <div className="index-modules-container">
      <CancellationStatusTable cancellations={props.cancellations} displayedmodule={2} />
      <ReadtimeAvailability displayedmodule={2} />
    </div>
  )
}

export default IndexModules
