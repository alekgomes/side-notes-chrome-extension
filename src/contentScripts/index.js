import {
  wrapTextWithSpan,
  removeHighlightFromDeletedNote,
  getHtmlContent,
  findParentNode,
  noteFactory,
} from "../utils";
import Type from "../enums";

import "./style.css";
// Styles must be imported from content_script since plugin can't
// find it from manifest.json.
// https://github.com/aklinker1/vite-plugin-web-extension/issues/118#issuecomment-1588132764

window.onload = async () => {
  chrome.runtime.onMessage.addListener(
    async ({ type, payload }, _sender, sendResponse) => {
      switch (type) {
        case "GET_NOTE_FROM_USER": {
          return sendResponse(noteFactory());
        }

        case "DELETE_NOTE": {
          return removeHighlightFromDeletedNote(payload);
        }

        case "UPDATE": {
          return wrapTextWithSpan(payload);
        }
      }
    },
  );

  chrome.storage.local.get(function (result) {
    if (result.hasOwnProperty(window.origin)) {
      result[window.origin].map(async (note) => {
        const node = findParentNode(document.body, note);
        wrapTextWithSpan(node, note);

        if (note.clicked) {
          const element = document.querySelector(
            `[data-sidenotes-id="${note.id}"]`,
          );
          element?.scrollIntoView({ block: "center" });

          chrome.runtime.sendMessage({
            type: "UPDATE_CLICKED",
            payload: note,
          });
        }
      });
    }
  });
};
