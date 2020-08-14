function wrapProvider(item) {
  return {
    ...item,
    wrappers: ['@/client', '@/wrapper']
  }
}

export default [
  {
    path: '/sign',
    exact: true,
    component: 'sign/index'
  },
  {
    path: '/doc',
    routes: [
      {
        path: '/doc/:docId',
        component: 'doc/index',
        routes: [
          {
            path: '/doc/:docId',
            component: 'doc/settings'
          },
          {
            path: '/doc/:docId/page/:pageSlug',
            component: 'doc/page'
          }
        ]
      }
    ].map(wrapProvider)
  },
  {
    path: '/join/:inviteId',
    component: 'join/index'
  },
  {
    path: '/', component: 'index', routes: [
      {
        path: '/',
        exact: true,
        component: 'team/index',
        routes: [
          {
            path: '/',
            exact: true,
            component: 'team/docs'
          }
        ]
      },
      {
        path: '/team/:teamId',
        component: 'team/index',
        routes: [
          {
            exact: true,
            path: '/team/:teamId',
            component: 'team/docs'
          },
          {
            exact: true,
            path: '/team/:teamId/settings',
            component: 'team/settings'
          }
        ]
      }
    ]
  },
].map(wrapProvider)