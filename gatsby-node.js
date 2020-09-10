const fetch = require('node-fetch')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const firebaseResult = await fetch('https://court-finder-37f55.firebaseio.com/cancellation_status.json')
  const resultData = await firebaseResult.json()

  // createNode({
  //   // nameWithOwner and url are arbitrary fields from the data
  //   nameWithOwner: resultData.full_name,
  //   url: resultData.html_url,
  //   // required fields
  //   id: 'example-build-time-data',
  //   parent: null,
  //   children: [],
  //   internal: {
  //     type: `Example`,
  //     contentDigest: createContentDigest(resultData),
  //   },
  // })
}