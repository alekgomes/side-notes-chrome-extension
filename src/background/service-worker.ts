import { GET_NOTE_FROM_USER, Note } from "../types"

chrome.contextMenus.create(
  {
    id: "sideNotes",
    title: "Side Notes",
    contexts: ["selection"],
  },
  () => console.log("contextMenus created")
)

chrome.contextMenus.onClicked.addListener(async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  })

  const note = await chrome.tabs.sendMessage(tab.id || 0, {
    type: GET_NOTE_FROM_USER,
  })

  const key = note.origin
  let previousNoteAtId: Note[] = []

  chrome.storage.local.get(function (result) {
    Object.entries(result).map((obj) => {
      if (obj[0] === key) previousNoteAtId.push(...obj[1])
    })

    const notes = [...previousNoteAtId, note]
    chrome.storage.local.set({ [key]: notes }).then(() => {
      console.log("note added to storage.local ", { note })

      chrome.tabs.sendMessage(tab.id || 0, {
        type: "UPDATE",
        payload: note,
      })
    })
  })
})
