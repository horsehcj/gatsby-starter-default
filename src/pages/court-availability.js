import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import RealtimeAvailability from "../components/realtime-availability"

const IndexPage = ({data}) => (
  <Layout>
    <SEO
      title="康文署羽毛球場"
      lang="zh-hk"
    />
    <div className="modules-container">
      <RealtimeAvailability displayedmodule={1} />
    </div>
  </Layout>
)

export default IndexPage
