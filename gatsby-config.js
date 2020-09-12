module.exports = {
  siteMetadata: {
    title: `顯示被放出嚟嘅康文署羽毛球場嘅網站`,
    description: `康民署嘅羽毛球場館好多時都有唔同原因放番出嚟，例如活動取消，又或者原定嘅活動順利舉行，本身預留嘅場地會提供番俾市民預訂等等。呢個網頁會監察著康體通有冇突然放番啲場出嚟，然後以最快速度話俾大家知。`,
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
        background_color: `#0C0344`,
        theme_color: `#0C0344`,
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
          projectId: "court-finder-37f55",
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
