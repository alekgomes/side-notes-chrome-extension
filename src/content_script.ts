const Actions = {
  SAVE_SELECTION: "SaveSelection",
  GET_DATA: "GetData",
  DELETE_DATA: "DeleteData",
}
interface Note {
  content: String
  date: Date
  url: String
}

const { SAVE_SELECTION, GET_DATA, DELETE_DATA } = Actions

window.onload = () => {
  console.log("onload from content_script.js")

  const DB_NAME = "side-notes"
  const DB_VERSION = 1
  const STORE_NOTES = "notes"

  let db: any

  const dbConnection = indexedDB.open(DB_NAME, DB_VERSION)

  dbConnection.onerror = (e) => console.log("ERROR:", e)

  dbConnection.onupgradeneeded = (event: any) => {
    console.log("onupgradeneeded")
    db = event.target.result

    if (!db.objectStoreNames.contains(STORE_NOTES)) {
      db.createObjectStore(STORE_NOTES, { autoIncrement: true })
    }
  }

  dbConnection.onsuccess = (event: any) => {
    db = event.target.result
  }

  chrome.runtime.onMessage.addListener(
    ({ type, payload }, sender, sendResponse) => {
      switch (type) {
        case SAVE_SELECTION: {
          const transaction = db.transaction([STORE_NOTES], "readwrite")

          transaction.oncomplete = (event: Event) => {
            console.log(event)
          }

          transaction.onerror = (event: Event) => {
            console.log(event)
          }

          const objectStore = transaction.objectStore(STORE_NOTES)

          const objectStoreRequest = objectStore.add({
            content: window.getSelection()?.toString(),
            data: Date.now(),
            url: window.location.href,
          })

          objectStoreRequest.onsuccess = (e: Event) => console.log(e)
          objectStoreRequest.onerror = (e: Event) => console.log(e)

          break
        }
        case GET_DATA: {
          console.log("GET_DATA")
          const transaction = db.transaction([STORE_NOTES], "readonly")
          const store = transaction.objectStore(STORE_NOTES)
          const getAllRequest = store.getAll()
          getAllRequest.onsuccess = (e: any) => {
            console.log(e)
            sendResponse(e.target.result)
          }

          getAllRequest.onerror = (e: any) => {
            sendResponse(e)
          }
          return true
        }

        case DELETE_DATA: {
          const transaction = db.transaction([STORE_NOTES], "readwrite")
          const store = transaction.objectStore(STORE_NOTES)
          const deleteRequest = store.delete(payload)
          deleteRequest.onsuccess = (e: any) => {
            console.log(e)
            sendResponse(e)
          }

          deleteRequest.onerror = (e: any) => {
            console.log(e)
            sendResponse(e)
          }
          return true
        }

        case "NoteDataFromUser": {
          return sendResponse({
            content: window.getSelection()?.toString(),
            data: Date.now(),
            url: window.location.href,
          })
        }
      }
    }
  )
}
