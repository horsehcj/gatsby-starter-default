import React, { Component } from "react"
import "./index-modules.scss"
import CancellationStatusTable from "../components/cancellation-status-table"
import ReadtimeAvailability from "../components/realtime-availability"

class IndexModules extends Component {
  state = {
    displayedModule: 2
  }

  render() {
    return (
      <div className="index-modules-container">
        <CancellationStatusTable cancellations={this.props.cancellations} displayedmodule={this.state.displayedModule} />
        <ReadtimeAvailability displayedmodule={this.state.displayedModule} />
      </div>
    )
  }
}

export default IndexModules
