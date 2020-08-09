import routes from './routes'

export default {
  title: 'Docmate',

  define: {
    GRAPHQL_URL: process.env.NODE_ENV === 'production' ? 'http://docmate.io:8080/v1/graphql' : 'http://localhost:8080/v1/graphql'
  },

  manifest: {},

  hash: true,

  publicPath: '/static/',
  
  proxy: {
    '/graphql': {
      target: 'http://localhost:8080/v1/graphql',
      changeOrigin: true
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