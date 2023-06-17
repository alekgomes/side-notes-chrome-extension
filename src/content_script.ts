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
    db.createObjectStore("notes", { keyPath: "id", autoIncrement: true })
  }

  dbConnection.onsuccess = (event: any) => {
    db = event.target.result
  }

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log(request)
    if (request.type === "saveSelection") {
      const transaction = db.transaction(["notes"], "readwrite")

      transaction.oncomplete = (event: any) => {
        console.log(event)
      }

      transaction.onerror = (event: any) => {
        console.log(event)
      }

      const objectStore = transaction.objectStore("notes")

      const objectStoreRequest = objectStore.add(
        {content: window.getSelection()?.toString()}
      )
      objectStoreRequest.onsuccess = (e: any) => console.log(e)
      objectStoreRequest.onerror = (e: any) => console.log(e)
    }
  })
}
