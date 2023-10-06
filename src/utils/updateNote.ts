import { Note } from "../types"

export default function updateNote(
  noteKey: string,
  noteId: number,
  attr: string,
  newValue: any
) {
  chrome.storage.local.get(function (result) {
    const notesArray = result[noteKey]

    const newNotes = notesArray.map((currNote: Note) => {
      if (currNote.id == noteId) {
        currNote[attr] = newValue
      }
      return currNote
    })

    chrome.storage.local.set({ [noteKey]: newNotes }).then(() => {
      console.log(`Updated ${attr} to ${newValue}`)
    })
  })
}
