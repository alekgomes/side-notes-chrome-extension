import type { Note } from "../types"
import copyToClipboard from "./copyToClipboard"
import iconFactory from "./iconFactory"
import deleteNote from "./deleteNote"
import handleColorPickerClick from "./handleColorPickerClick"

export default function createHighlight(note: Note) {
  const highlight = document.createElement("mark")

  highlight.textContent = note.content
  highlight.dataset.sidenotesId = note.id
  highlight.style.background = note.color

  const hoverDiv = document.createElement("div")
  const trashIcon = iconFactory("gg-trash", () => deleteNote(note))
  const colorIcon = iconFactory("gg-color-picker", () =>
    handleColorPickerClick(highlight)
  )
  const copyIcon = iconFactory("gg-copy", copyToClipboard)

  hoverDiv.classList.add("hoverDiv")

  highlight.classList.add("sidenote-highlight")

  hoverDiv.appendChild(trashIcon)
  hoverDiv.appendChild(colorIcon)
  hoverDiv.appendChild(copyIcon)

  highlight.appendChild(hoverDiv)

  return highlight
}
