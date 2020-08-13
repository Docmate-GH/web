import routes from './routes'
const isProd = process.env.NODE_ENV === 'production'

export default {
  title: 'Docmate',

  manifest: {},

  define: {
    GQL_PATH: process.env.GQL_PATH || ''
  },

  hash: true,

  publicPath: '/static/',

  forkTSChecker: {},

  proxy: {
    '/api': {
      target: 'http://localhost:3000'
    }
  },

  scripts: [
    { src: '//cdn.jsdelivr.net/npm/codemirror@5.56.0/lib/codemirror.js' },
    { src: '//cdn.jsdelivr.net/npm/codemirror@5.56.0/mode/markdown/markdown.js' }
  ],

  styles: [
    '//cdn.jsdelivr.net/npm/codemirror@5.56.0/lib/codemirror.css',
    '//cdn.jsdelivr.net/npm/codemirror@5.56.0/theme/neo.css'

  ],

  routes
}