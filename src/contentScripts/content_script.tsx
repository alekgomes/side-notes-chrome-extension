import { wrapTextWithSpan } from "./app"
import Type from "../enums"
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
    async ({ type, payload }, _sender, sendResponse) => {
      switch (type) {
        case Type.GET_NOTE_FROM_USER: {
          return sendResponse({
            content: window.getSelection()?.toString(),
            date: Date.now(),
            id: Date.now(),
            origin: window.location.origin,
            url: window.location.href,
          })
        }

        case Type.DELETE_NOTE: {
          const deletedNote = document.querySelector(
            `[data-sidenotes-id="${payload.id}"]`
          )
          deletedNote.classList.add("deleted")
        }
      }
    }
  )

  chrome.runtime.onMessage.addListener(async ({ type, payload }, _sender) => {
    switch (type) {
      case Type.UPDATE: {
        wrapTextWithSpan(document.body, payload)
      }
    }
  })
}
