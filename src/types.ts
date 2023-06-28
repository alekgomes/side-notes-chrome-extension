export interface Note {
  content: String
  date: Date
  origin: URL
  url: URL
  id: Number
}

export const SAVE_SELECTION = "SaveSelection"
export const GET_DATA = "GetData"
export const DELETE_DATA = "DeleteData"
export const GET_NOTE_FROM_USER = "GetNoteDataFromUser"

export type Filter = "originIndex" | "contentIndex" | ""
