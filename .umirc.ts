import routes from './routes'

require('dotenv').config()

const isProd = process.env.NODE_ENV === 'production'

const scripts = [
  '//cdn.jsdelivr.net/npm/codemirror@5.56.0/lib/codemirror.js',
  '//cdn.jsdelivr.net/npm/codemirror@5.56.0/mode/markdown/markdown.js',
  '//cdn.jsdelivr.net/npm/react@16.13.1/umd/react.production.min.js'
]

const externals = {}

if (process.env.WEB_EXTERNAL === 'true') {
  externals['react'] = 'window.React'
  scripts.push('//cdn.jsdelivr.net/npm/react@16.13.1/umd/react.production.min.js')

  externals['react-dom'] = 'window.ReactDOM'
  scripts.push('//cdn.jsdelivr.net/npm/react-dom@16.13.1/umd/react-dom.production.min.js')
}

export default {
  title: 'Docmate',

  manifest: {},

  define: {
    GQL_PATH: process.env.GQL_PATH || '',
    USE_OAUTH: process.env.USE_OAUTH || '',
    // github client id
    GH_CLIENT_ID: process.env.GH_CLIENT_ID || '',
    GH_REDIRECT_URI: process.env.GH_REDIRECT_URI || '',
    GH_SCOPE: process.env.GH_SCOPE || ''
  },

  hash: true,

  publicPath: '/static/',

  forkTSChecker: {},

  cssnano: {
    calc: false,
  },

  proxy: {
    '/api': {
      target: 'http://localhost:3000'
    }
  },

  externals,
  scripts,

  styles: [
    '//cdn.jsdelivr.net/npm/codemirror@5.56.0/lib/codemirror.css',
    '//cdn.jsdelivr.net/npm/codemirror@5.56.0/theme/neo.css'

  ],

  routes
}