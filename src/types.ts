export type Note = {
  textContent: string
  date: Date
  origin: URL
  url: URL
  color: string
  id: number
  htmlContent: string
}

export type Filter = "originIndex" | "contentIndex" | ""
