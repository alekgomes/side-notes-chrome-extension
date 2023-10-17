import type { Note } from "../types"

export default function findParentNode(
  rootNode: HTMLElement,
  note: Note
): HTMLElement {
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
