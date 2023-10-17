import { wrapTextWithSpan, removeHighlightFromDeletedNote } from "../utils"
import Type from "../enums"

import "./style.css"
// Styles needs to be imported from content_script since plugin can't
// find it from manifest.json.
// https://github.com/aklinker1/vite-plugin-web-extension/issues/118#issuecomment-1588132764

window.onload = async () => {
  chrome.storage.local.get(function (result) {
    if (result.hasOwnProperty(window.origin)) {
      result[window.origin].map(async (note: any) => {
        wrapTextWithSpan(document.body, note)
        if (note.clicked) {
          const element = document.querySelector(
            `[data-sidenotes-id="${note.id}"]`
          )
          element?.scrollIntoView({ block: "center" })

          chrome.runtime.sendMessage({
            type: Type.UPDATE_CLICKED,
            payload: note,
          })
        }
      })
    }
  })

  const getHtmlContent = () => {
    const div = document.createElement("div")
    const fragment = window.getSelection()?.getRangeAt(0).cloneContents()!
    div.appendChild(fragment)

    return div.innerHTML
  }

  chrome.runtime.onMessage.addListener(
    async ({ type, payload }, _sender, sendResponse) => {
      switch (type) {
        case Type.GET_NOTE_FROM_USER: {
          return sendResponse({
            textContent: window.getSelection()?.toString(),
            htmlContent: getHtmlContent(),
            date: Date.now(),
            id: Date.now(),
            color: "#FFFD98",
            origin: window.location.origin,
            url: window.location.href,
          })
        }

        case Type.DELETE_NOTE: {
          return removeHighlightFromDeletedNote(payload)
        }

        case Type.UPDATE: {
          return wrapTextWithSpan(document.body, payload)
        }
      }
    }
  )
}
