declare class Doc {
  id: string
  slug: string
  title: string
  pages: Page[]
  nav: string
  sidebar: string
  createdAt: Date
  updatedAt: Date
}

declare class Page {
  id: string
  slug: string
  title: string
  doc: Doc
  createdAt: Date
  updatedAt: Date
}