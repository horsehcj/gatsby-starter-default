module.exports = {
  siteMetadata: {
    title: `顯示被放出嚟嘅康文署羽毛球場的網站`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@iwanttoplaybadminton`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/fav-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [require("tailwindcss")]
      }
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyCz8uvhrsRuHd-ptHfpkzl8rTWhGXbWWTw",
          authDomain: "court-finder-37f55.firebaseapp.com",
          databaseURL: "https://court-finder-37f55.firebaseio.com",
          projectId: "court-finder-37f55",
          storageBucket: "court-finder-37f55.appspot.com",
          messagingSenderId: "590505064574",
          appId: "1:590505064574:web:d89abfa45de77c9a13802f"
        }
      }
    }
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
