import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import IndexModules from "../components/index-modules"

const IndexPage = ({data}) => (
  <Layout>
    <SEO
      title="顯示被放出嚟嘅康文署羽毛球場嘅網站"
      lang="zh-hk"
    />
    <IndexModules cancellations={data.cancellationStatus.cancellations} />
  </Layout>
)

export const query = graphql`
  query CourtsQuery {
    cancellationStatus {
      cancellations {
        date
        times {
          time
          dates {
            date
            courts {
              id
              availabilities {
                time
                qty
              }
            }
          }
        }
      }
    }
  }
`;

export default IndexPage
