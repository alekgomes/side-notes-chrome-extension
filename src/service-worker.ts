import { DB_NAME, DB_VERSION, STORE_NOTES } from "./config"

let db

const dbConnection = indexedDB.open(DB_NAME, DB_VERSION)

dbConnection.onerror = (e) => console.log("ERROR:", e)

dbConnection.onupgradeneeded = (event) => {
  console.log("onupgradeneeded")
  db = event.target.result

  if (!db.objectStoreNames.contains(STORE_NOTES)) {
    db.createObjectStore(STORE_NOTES, { autoIncrement: true })
  }
}

dbConnection.onsuccess = (event) => {
  db = event.target.result
}

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

  const note = await chrome.tabs.sendMessage(tab.id, {
    type: "GetNoteDataFromUser",
  })

  const transaction = db.transaction([STORE_NOTES], "readwrite")

  transaction.oncomplete = (event) => {
    console.log(event)
  }

  transaction.onerror = (event) => {
    console.log(event)
  }

  const objectStore = transaction.objectStore(STORE_NOTES)
  console.log(note)
  const objectStoreRequest = objectStore.add(note)

  objectStoreRequest.onsuccess = (e) => console.log(e)
  objectStoreRequest.onerror = (e) => console.log(e)
})

chrome.runtime.onMessage.addListener(
  ({ type, payload }, _sender, sendResponse) => {
    console.log("ON_MESSAGE", type, SAVE_SELECTION)
    switch (type) {
      case "GET_DATA": {
        console.log("GET_DATA")
        const transaction = db.transaction([STORE_NOTES], "readonly")
        const store = transaction.objectStore(STORE_NOTES)
        const getAllRequest = store.getAll()
        getAllRequest.onsuccess = (e) => {
          console.log(e)
          sendResponse(e.target.result)
        }

        getAllRequest.onerror = (e) => {
          sendResponse(e)
        }
        return true
      }

      case "DELETE_DATA": {
        const transaction = db.transaction([STORE_NOTES], "readwrite")
        const store = transaction.objectStore(STORE_NOTES)
        const deleteRequest = store.delete(payload)
        deleteRequest.onsuccess = (e) => {
          console.log(e)
          sendResponse(e)
        }

        deleteRequest.onerror = (e) => {
          console.log(e)
          sendResponse(e)
        }
        return true
      }
    }
  }
)
