import routes from './routes'
const isProd = process.env.NODE_ENV === 'production'

export default {
  title: 'Docmate',

  manifest: {},

  hash: true,

  publicPath: '/static/',

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