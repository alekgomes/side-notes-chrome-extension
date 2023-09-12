export type Note = {
  content: string
  date: Date
  origin: URL
  url: URL
  id: number
  outterHTML: any
}

export type Filter = "originIndex" | "contentIndex" | ""
