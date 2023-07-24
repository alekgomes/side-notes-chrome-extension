export interface Note {
  content: String
  date: Date
  origin: URL
  url: URL
  id: Number
  outterHTML: any
}

export const SAVE_SELECTION = "SaveSelection"
export const GET_ALL_NOTES = "GET_ALL_NOTES"
export const DELETE_DATA = "DeleteData"
export const GET_NOTE_FROM_USER = "GetNoteDataFromUser"

export type Filter = "originIndex" | "contentIndex" | ""
