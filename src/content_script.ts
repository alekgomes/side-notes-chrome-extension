window.onload = () => {
  console.log("onload from content_script.js")

  const DB_NAME = "side-notes"
  const DB_VERSION = 1

  let db: any

  const dbConnection = indexedDB.open(DB_NAME, DB_VERSION)

  dbConnection.onerror = (e) => console.log("ERROR:", e)

  dbConnection.onupgradeneeded = (event: any) => {
    console.log("onupgradeneeded")
    db = event.target.result

    if (!db.objectStoreNames.contains("notes")) {
      db.createObjectStore("notes", { autoIncrement: true })
    }
  }

  dbConnection.onsuccess = (event: any) => {
    db = event.target.result
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "saveSelection") {
      const transaction = db.transaction(["notes"], "readwrite")

      transaction.oncomplete = (event: any) => {
        console.log(event)
      }

      transaction.onerror = (event: any) => {
        console.log(event)
      }

      const objectStore = transaction.objectStore("notes")

      console.log(window.getSelection())

      const content = window.getSelection()?.toString() || ''

      const date = Date.now()

      const encodedContent = encodeURIComponent(content);
      const highlightPrefix = '#:~:text='
      const url = window.location.href + highlightPrefix + encodedContent

      const data = {
        content,
        data: date,
        url,
      }
      
      const objectStoreRequest = objectStore.add(data)

      objectStoreRequest.onsuccess = (e: any) => console.log(e)
      objectStoreRequest.onerror = (e: any) => console.log(e)
    }

    if (request.type === "getData") {
      const transaction = db.transaction(["notes"], "readonly")
      const store = transaction.objectStore("notes")
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

    if (request.type === "deleteData") {
      const transaction = db.transaction(["notes"], "readwrite")
      const store = transaction.objectStore("notes")
      const deleteRequest = store.delete(request.payload)
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
  })
}
