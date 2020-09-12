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

exports.sourceNodes = async ({actions, createNodeId, createContentDigest}) => {
  const { createNode } = actions;
  const firebaseResult = await fetch('https://court-finder-37f55.firebaseio.com/cancellation_status.json')
  const resultData = await firebaseResult.json()

  const processContent = content => {
    let cancellations_data = []
    let currentDateObj = {}
    let timeObj = {}
    let dateObj = {}
    let datesArr = []
    let courtsArr = []
    let courtObj = {}

    for (const currentDate in content) {
      // reset
      currentDateObj = {}

      currentDateObj['date'] = currentDate
      currentDateObj['times'] = []

      for (const currentTime in content[currentDate]) {
        timeObj = {}
        datesArr = []

        timeObj['time'] = currentTime

        for (const date in content[currentDate][currentTime]) {
          dateObj = {}
          courtsArr = []

          dateObj['date'] = date

          for (const court in content[currentDate][currentTime][date]) {
            courtObj = {}
            courtObj['id'] = court
            courtObj['availabilities'] = []

            for (const availability in content[currentDate][currentTime][date][court]) {
              courtObj['availabilities'].push({
                time: availability,
                qty: content[currentDate][currentTime][date][court][availability]
              })
            }

            courtsArr.push(courtObj)
          }

          dateObj['courts'] = courtsArr
          datesArr.push(dateObj)
        }

        timeObj['dates'] = datesArr
        currentDateObj['times'].push(timeObj)
      }

      cancellations_data.push(currentDateObj)
    }

    const nodeId = createNodeId(`iwanttoplaybadminton`)
    const nodeData = Object.assign({}, content, {
        cancellations: cancellations_data,
        id: nodeId,
        parent: null,
        children: [],
        internal: {
          type: `CancellationStatus`,
          contentDigest: createContentDigest(content),
        },
    })
    return nodeData
  }

  createNode(processContent(resultData))
}