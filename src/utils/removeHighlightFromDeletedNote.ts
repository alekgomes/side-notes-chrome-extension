import type { Note } from "../types"

export default function removeHighlightFromDeletedNote(payload: Note) {
  const deletedNote = document.querySelector(
    `[data-sidenotes-id="${payload.id}"]`
  )
  deletedNote.classList.add("deleted")
}
