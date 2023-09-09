import { render } from "preact"
import { Highlight } from "../components/Highlight"
import { useEffect } from "preact/hooks"
import { Note } from "../types"

export function wrapTextWithSpan(rootNode: HTMLElement, note: Note) {
  const stack: Node[] = [rootNode]

  while (stack.length > 0) {
    const node = stack.pop()

    if (node?.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || ""
      const index = text.indexOf(note.content)
      if (index !== -1) {
        const beforeText = text.substring(0, index)
        const afterText = text.substring(index + note.content.length)

        const HighlightNode = () => (
          <>
            {beforeText}
            <Highlight>{note.content}</Highlight>
            {afterText}
          </>
        )
        node.parentNode && render(<HighlightNode />, node.parentNode)
      }
    } else if (node?.nodeType === Node.ELEMENT_NODE) {
      const children = node.childNodes
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
}

const scrollToClicked = (note: any) => {
  if (note.clicked) {
    const element = document.querySelector(`[data-sidenotes="${note.data}"]`)
    element?.scrollIntoView({ block: "center" })
  }
}

const App = () => {
  useEffect(() => {
    chrome.storage.local.get(function (result) {
      if (result.hasOwnProperty(window.origin)) {
        result[window.origin].map((note: any) => {
          wrapTextWithSpan(document.body, note)
          scrollToClicked(note)
        })
      }
    })
    chrome.runtime.onMessage.addListener(async ({ type, payload }, _sender) => {
      switch (type) {
        case "UPDATE": {
          wrapTextWithSpan(document.body, payload)
        }
      }
    })
  }, [])

  return <>""</>
}

export default App
