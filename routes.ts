function wrapProvider(item) {
  return {
    ...item,
    wrappers: ['@/client', '@/wrapper']
  }
}

export default [
  {
    path: '/app', component: 'index', routes: [
      {
        path: '/app',
        exact: true,
        component: 'team/index',
        routes: [
          {
            path: '/app',
            exact: true,
            component: 'team/docs'
          }
        ]
      },
      {
        path: '/app/team/:teamId',
        component: 'team/index',
        routes: [
          {
            exact: true,
            path: '/app/team/:teamId',
            component: 'team/docs'
          },
          {
            exact: true,
            path: '/app/team/:teamId/settings',
            component: 'team/settings'
          }
        ]
      }
    ]
  },
  {
    path: '/admin',
    routes: [
      {
        path: '/admin/doc/:docId',
        component: 'admin/doc/index',
        routes: [
          {
            path: '/admin/doc/:docId',
            component: 'admin/doc/settings'
          },
          {
            path: '/admin/doc/:docId/page/:pageSlug',
            component: 'admin/doc/page'
          }
        ]
      }
    ].map(wrapProvider)
  },{
    path: '/join/:inviteId',
    component: 'join/index'
  }
].map(wrapProvider)