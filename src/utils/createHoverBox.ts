import type { Note } from "../types"
import copyToClipboard from "./copyToClipboard"
import iconFactory from "./iconFactory"
import deleteNote from "./deleteNote"
import handleColorPickerClick from "./handleColorPickerClick"

export default function createHoverBox(highlightNode: HTMLElement, note: Note) {
  const hoverDiv = document.createElement("div")
  const trashIcon = iconFactory("gg-trash", () => deleteNote(note))
  const colorIcon = iconFactory("gg-color-picker", () =>
    handleColorPickerClick(highlightNode)
  )
  const copyIcon = iconFactory("gg-copy", () => copyToClipboard(note))

  hoverDiv.classList.add("hoverDiv")
  hoverDiv.appendChild(trashIcon)
  hoverDiv.appendChild(colorIcon)
  hoverDiv.appendChild(copyIcon)
  return hoverDiv
}
