import { wrapTextWithSpan } from "./app"
import { GET_NOTE_FROM_USER } from "../types"
import "./style.css"
// Styles needs to be imported from content_script since plugin can't
// find it from manifest.json.
// https://github.com/aklinker1/vite-plugin-web-extension/issues/118#issuecomment-1588132764

function injectIconCssLink() {
  // inject icons
  const trashIconLink = document.createElement("link")
  const colorIconLink = document.createElement("link")

  trashIconLink.setAttribute(
    "href",
    "https://unpkg.com/css.gg@2.0.0/icons/css/trash.css"
  )
  trashIconLink.setAttribute("rel", "stylesheet")
  colorIconLink.setAttribute(
    "href",
    "https://unpkg.com/css.gg@2.0.0/icons/css/color-picker.css"
  )
  colorIconLink.setAttribute("rel", "stylesheet")

  document.head.appendChild(trashIconLink)
  document.head.appendChild(colorIconLink)
}

window.onload = async () => {
  injectIconCssLink()

  chrome.storage.local.get(function (result) {
    if (result.hasOwnProperty(window.origin)) {
      result[window.origin].map((note: any) => {
        wrapTextWithSpan(document.body, note)
      })
    }
  })

  chrome.runtime.onMessage.addListener(
    async ({ type }, _sender, sendResponse) => {
      switch (type) {
        case GET_NOTE_FROM_USER: {
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

  chrome.runtime.onMessage.addListener(async ({ type, payload }, _sender) => {
    switch (type) {
      case "UPDATE": {
        wrapTextWithSpan(document.body, payload)
      }
    }
  })
}
