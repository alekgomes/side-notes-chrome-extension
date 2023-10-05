import type { Note } from "../types"
import removeHighlightFromDeletedNote from "./removeHighlightFromDeletedNote"

export default function deleteNote(note: Note) {
  const key = note.origin
  chrome.storage.local.get(function (result) {
    const notesArray = result[key]
    const filteredNotes = notesArray.filter(
      (currNote) => currNote.id !== note.id
    )

    chrome.storage.local.set({ [key]: filteredNotes }).then(() => {
      removeHighlightFromDeletedNote(note)
    })
  })
}
