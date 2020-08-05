function wrapProvider(item) {
  return {
    ...item,
    wrappers: ['@/client', '@/wrapper']
  }
}

export default [
  { exact: true, path: '/', component: 'index' },
  {
    path: '/admin',
    routes: [
      {
        path: '/admin/doc/:docId',
        component: 'admin/doc/index',
        routes: [
          {
            path: '/admin/doc/:docId/page/:pageSlug',
            component: 'admin/doc/page'
          }
        ]
      }
    ].map(wrapProvider)
  }
].map(wrapProvider)