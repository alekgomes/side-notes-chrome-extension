import { GET_NOTE_FROM_USER } from "../types"
import "./style.css"
// Styles needs to be imported from content_script since plugin can't
// find it from manifest.json.
// https://github.com/aklinker1/vite-plugin-web-extension/issues/118#issuecomment-1588132764

function wrapTextWithSpan(rootNode, note, backgroundColor) {
  const stack = [rootNode]

  while (stack.length > 0) {
    const node = stack.pop()

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent
      const index = text.indexOf(note.content)

      if (index !== -1) {
        const beforeText = text.substring(0, index)
        const afterText = text.substring(index + note.content.length)

        const span = document.createElement("span")
        span.style.backgroundColor = backgroundColor
        span.textContent = note.content
        span.dataset.sidenotes = note.data

        const parentNode = node.parentNode
        parentNode.insertBefore(document.createTextNode(beforeText), node)
        parentNode.insertBefore(span, node)
        parentNode.insertBefore(
          document.createTextNode(afterText),
          node.nextSibling
        )
        parentNode.removeChild(node)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
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

window.onload = async () => {
  console.log("loaded")
  chrome.storage.local.get(function (result) {
    if (result.hasOwnProperty(window.origin)) {
      result[window.origin].map((note: any) => {
        wrapTextWithSpan(document.body, note, "transparent")
        scrollToClicked(note)
      })
    }
  })

  chrome.runtime.onMessage.addListener(
    async ({ type }, _sender, sendResponse) => {
      switch (type) {
        case GET_NOTE_FROM_USER: {
          let outterHTML

          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const span = document.createElement("span")
            span.classList.add("sidenote__note")
            range.surroundContents(span)
            outterHTML = span.outerHTML
          }

          return sendResponse({
            content: window.getSelection()?.toString(),
            date: Date.now(),
            origin: window.location.origin,
            url: window.location.href,
          })
        }
      }
    }
  )
}
