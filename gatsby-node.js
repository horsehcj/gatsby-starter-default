const fetch = require('node-fetch')

// gatsby-node.js
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /firebase/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}

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