import routes from './routes'

export default {
  proxy: {
    '/graphql': {
      target: 'http://localhost:8080/v1/graphql',
      changeOrigin: true
    }
  },

  routes
}