import type { Note } from "../types"
import createHoverBox from "../utils/createHoverBox"

export const findParentNode = (
  rootNode: HTMLElement,
  note: Note
): HTMLElement => {
  const treeWalker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_ELEMENT
  )

  let parentNode: HTMLElement = document.createElement("p")

  while (treeWalker.nextNode()) {
    const currentNode = treeWalker.currentNode as HTMLElement

    if (currentNode.textContent?.includes(note.textContent)) {
      parentNode = currentNode
    }
  }

  return parentNode
}

export default function wrapTextWithSpan(rootNode: HTMLElement, note: Note) {
  const node = findParentNode(rootNode, note)
  const innerHTML = node.innerHTML
  const index = innerHTML.indexOf(note.htmlContent)
  const htmlBefore = innerHTML.substring(0, index)
  const htmlAfter = innerHTML.substring(index + note.htmlContent.length)

  node.innerHTML = `${htmlBefore}<mark data-sidenotes-id=${note.id} style="background-color:${note.color} " class="sidenote-highlight">${note.htmlContent}</mark>${htmlAfter}`

  const highlight = node.querySelector("mark")
  const hoverBox = createHoverBox(highlight, note)
  highlight?.appendChild(hoverBox)
}
