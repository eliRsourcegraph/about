// @ts-check
const path = require('path')

module.exports = {
  siteMetadata: {
    title: `Sourcegraph`,
    description: `Find and fix things across all of your code with Sourcegraph universal code search.`,
    siteUrl: `https://about.sourcegraph.com`,
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        sitemap: 'https://about.sourcegraph.com/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/../docs/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/../blogposts/`,
        ignore: [`${__dirname}/../blogposts/liveblogs/**/*`],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `liveblog`,
        path: `${__dirname}/../blogposts/liveblogs`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `press`,
        path: `${__dirname}/../press-releases/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `podcast`,
        path: `${__dirname}/../podcast/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-prismjs`,
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-unwrap-images`,
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 880,
              linkImagesToOriginal: false,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-TB4NLS7',

        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: true,

        // datalayer to be set before GTM is loaded
        // should be an object or a function that is executed in the browser
        // Defaults to null.
        defaultDataLayer: { platform: 'gatsby' },

        // Specify optional GTM environment details.
        //gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_AUTH_STRING",
        //gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIRONMENT_PREVIEW_NAME",
        //dataLayerName: "YOUR_DATA_LAYER_NAME",
      },
    },
    {
      resolve: 'gatsby-plugin-advanced-sitemap',
      options: {
        exclude: ['404', '404.html', '/dev-404-page', '/uninstall/'],
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      options: {
        noTrailingSlash: false,
        siteUrl: `https://about.sourcegraph.com`,
      },
      resolve: `gatsby-plugin-react-helmet-canonical-urls`,
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.publishDate,
                  url: site.siteMetadata.siteUrl + '/' + edge.node.fields.blogType + '/' + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + '/' + edge.node.fields.blogType + '/' + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  filter: { fields: { blogType: { in: ["blog","podcast"] } } }
                  sort: { order: DESC, fields: [frontmatter___publishDate] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug, blogType }
                      frontmatter {
                        title
                        publishDate
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "Sourcegraph blog RSS feed",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: "^/blog/",
            // optional configuration to specify external rss feed, such as feedburner
            link: "https://feeds.feedburner.com/sourcegraph/blog",
          },
        ],
      },
    },
    `gatsby-plugin-catch-links`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-json`,
    `gatsby-plugin-typescript`,
    `gatsby-plugin-sass`,
  ],
}
