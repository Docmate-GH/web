function wrapProvider(item) {
  return {
    ...item,
    wrappers: ['@/client', '@/wrapper']
  }
}

export default [
  { exact: true, path: '/', component: 'index' },
  { exact: true, path: '/doc/new', component: 'doc/create' },
  { path: '/doc/:docSlug', component: 'doc/admin', routes: [
    { path: '/doc/:docSlug/:pageSlug', component: 'page/edit' }
  ] },

].map(wrapProvider)