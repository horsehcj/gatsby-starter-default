import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import CancellationStatusTable from "../components/cancellation-status-table"

const IndexPage = ({data}) => (
  <Layout>
    <SEO title="Home" />
    <CancellationStatusTable cancellations={data.cancellationStatus.cancellations} />
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
