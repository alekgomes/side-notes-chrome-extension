import { wrapTextWithSpan } from "../utils"
import Type from "../enums"
import { injectIconCssLink, removeHighlightFromDeletedNote } from "../utils"
import "./style.css"
// Styles needs to be imported from content_script since plugin can't
// find it from manifest.json.
// https://github.com/aklinker1/vite-plugin-web-extension/issues/118#issuecomment-1588132764

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
          removeHighlightFromDeletedNote(payload)
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
