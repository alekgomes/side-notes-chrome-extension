import { GET_NOTE_FROM_USER } from "./types"

window.onload = () => {
  chrome.runtime.onMessage.addListener(({ type }, _sender, sendResponse) => {
    console.log("clicado")
    switch (type) {
      case GET_NOTE_FROM_USER: {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          var span = document.createElement("span")
          span.style.background = "rgba(255,0,0)"
          span.dataset.sidenoteId = "algumId"
          range.surroundContents(span)
        }

        return sendResponse({
          content: window.getSelection()?.toString(),
          date: Date.now(),
          origin: window.location.origin,
          url: window.location.href,
        })
      }
    }
  })
}
