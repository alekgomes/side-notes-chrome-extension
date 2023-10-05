import type { Note } from "../types"

export default function scrollToClicked(note: Note) {
  const element = document.querySelector(`[data-sidenotes-id="${note.id}"]`)
  element?.scrollIntoView({ block: "center" })
}
