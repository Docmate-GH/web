import routes from './routes'

export default {
  title: 'Docmate',
  
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