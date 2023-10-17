import type { Note } from "../types"
import copyToClipboard from "../features/copyToClipboard"
import iconFactory from "./iconFactory"
import deleteNote from "../features/deleteNote"
import handleColorPickerClick from "./handleColorPickerClick"


export default function createHoverBox(highlightNode: HTMLElement, note: Note) {
  const hoverDiv = document.createElement("div")
  const trashIcon = iconFactory("icons/trash-icon.svg", "gg-trash", () =>
    deleteNote(note)
  )
  const colorIcon = iconFactory(
    "icons/color-picker.svg",
    "gg-color-picker",
    () => handleColorPickerClick(highlightNode)
  )
  const copyIcon = iconFactory("icons/copy.svg", "gg-copy", () =>
    copyToClipboard(note)
  )

  hoverDiv.classList.add("hoverDiv")
  hoverDiv.appendChild(trashIcon)
  hoverDiv.appendChild(colorIcon)
  hoverDiv.appendChild(copyIcon)
  return hoverDiv
}

