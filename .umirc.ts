import routes from './routes'

export default {
  proxy: {
    '/graphql': {
      target: 'http://localhost:3000/graphql',
      changeOrigin: true
    }
  },

  routes
}