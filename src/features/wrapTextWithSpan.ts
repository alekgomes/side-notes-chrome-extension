import type { Note } from "../types"
import { createHoverBox, findParentNode } from "../utils"


export default function wrapTextWithSpan(rootNode: HTMLElement, note: Note) {
  const node = findParentNode(rootNode, note)
  const innerHTML = node.innerHTML
  const index = innerHTML.indexOf(note.htmlContent)
  const htmlBefore = innerHTML.substring(0, index)
  const htmlAfter = innerHTML.substring(index + note.htmlContent.length)

  node.innerHTML = `${htmlBefore}<mark data-sidenotes-id=${note.id} style="background-color:${note.color} " class="sidenote-highlight">${note.htmlContent}</mark>${htmlAfter}`

  const highlight = node.querySelector("mark")!
  const hoverBox = createHoverBox(highlight, note)
  highlight?.appendChild(hoverBox)
}
