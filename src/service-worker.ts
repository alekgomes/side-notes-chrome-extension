import { DB_NAME, DB_VERSION, STORE_NOTES } from "./config"

let db: IDBDatabase

const dbConnection: IDBOpenDBRequest = indexedDB.open(DB_NAME, DB_VERSION)

dbConnection.onerror = (e) => console.log("ERROR:", e)
dbConnection.onupgradeneeded = (event: any) => {
  db = event.target.result

  if (!db.objectStoreNames.contains(STORE_NOTES)) {
    const objectStore = db.createObjectStore(STORE_NOTES, {
      keyPath: "id",
      autoIncrement: true,
    })
    objectStore.createIndex("originIndex", "origin", { unique: false })
    objectStore.createIndex("contentIndex", "content", { unique: false })
  }
}

dbConnection.onsuccess = (event: any) => {
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

  const note = await chrome.tabs.sendMessage(tab.id || 0, {
    type: "GET_NOTE_FROM_USER",
  })

  const transaction = db.transaction([STORE_NOTES], "readwrite")

  transaction.oncomplete = (event) => {
    console.log(event)
  }

  transaction.onerror = (event) => {
    console.log("transaction.onerror: ", event)
  }

  const objectStore = transaction.objectStore(STORE_NOTES)
  const objectStoreRequest = objectStore.add(note)

  objectStoreRequest.onsuccess = (e) => console.log(e)
  objectStoreRequest.onerror = (e) => console.log(e)
})


