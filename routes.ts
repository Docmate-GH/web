function wrapProvider(item) {
  return {
    ...item,
    wrappers: ['@/client', '@/wrapper']
  }
}

export default [
  { exact: true, path: '/', component: 'index' },
  { path: '/doc/:docId', component: 'doc/admin', routes: [
    { path: '/doc/:docId/:pageSlug', component: 'page/edit' }
  ] },

].map(wrapProvider)