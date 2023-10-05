import type { Note } from "../types"
import createHighlight from "./createHighlight"

export default function wrapTextWithSpan(rootNode: HTMLElement, note: Note) {
  const stack: Node[] = [rootNode]

  while (stack.length > 0) {
    const node = stack.pop()

    if (node?.nodeType === Node.TEXT_NODE) {
      // maybe use Range.surroundContents()

      const text = node.textContent
      const index = text.indexOf(note.content)

      if (index !== -1) {
        const beforeText = text.substring(0, index)
        const afterText = text.substring(index + note.content.length)

        const highlight = createHighlight(note)

        const parentNode = node.parentNode
        parentNode?.insertBefore(document.createTextNode(beforeText), node)
        parentNode?.insertBefore(highlight, node)
        parentNode?.insertBefore(
          document.createTextNode(afterText),
          node.nextSibling
        )
        parentNode?.removeChild(node)
      }
    } else if (node?.nodeType === Node.ELEMENT_NODE) {
      const children = node.childNodes
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
}
