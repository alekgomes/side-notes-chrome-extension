import type { Note } from "../types"
import createHoverBox from "./createHoverBox"

export const findParentNode = (rootNode: HTMLElement, note: Note) => {
  const treeWalker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_ELEMENT
  )

  let parentNode

  while (treeWalker.nextNode()) {
    const currentNode = treeWalker.currentNode

    if (currentNode.textContent?.includes(note.textContent)) {
      parentNode = currentNode
    }
  }

  return { node: parentNode }
}

export default function wrapTextWithSpan(rootNode: HTMLElement, note: Note) {
  const { node } = findParentNode(rootNode, note)

  const hoverBox = createHoverBox()

  node.innerHTML = `<mark data-sidenoteid=${note.id} style="background: ${
    note.color ?? ""
  }" class="sidenote-highlight">${hoverBox.outerHTML}${node.innerHTML}</mark>`
}
