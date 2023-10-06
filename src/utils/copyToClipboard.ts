import type { Note } from "../types"

export default function copyToClipboard(note: Note): void {
  window.navigator.clipboard.writeText(note.textContent)
}
