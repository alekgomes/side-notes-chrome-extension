import { DB_NAME, DB_VERSION, STORE_NOTES } from "./config"

let db: IDBDatabase

export const deleteNote = (noteId: String) => {
  return new Promise((resolve, reject) => {
    const dbConnection = indexedDB.open(DB_NAME, DB_VERSION)
    dbConnection.onsuccess = (event: any) => {
      db = event.target?.result
      const transaction = db.transaction([STORE_NOTES], "readwrite")
      const store = transaction.objectStore(STORE_NOTES)
      const deleteRequest = store.delete(noteId)

      deleteRequest.onsuccess = (e: any) => {
        db.close()
        resolve(e)
      }

      deleteRequest.onerror = (e: any) => {
        db.close()
        reject(e)
      }
    }
  })
}

export const getAllNotes = () => {
  return new Promise((resolve, reject) => {
    const dbConnection = indexedDB.open(DB_NAME, DB_VERSION)
    dbConnection.onsuccess = (event: any) => {
      db = event.target?.result
      const transaction = db.transaction([STORE_NOTES], "readonly")
      const store = transaction.objectStore(STORE_NOTES)
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = (e: any) => {
        console.log("onsuccess: ", e)
        resolve(e)
        db.close()
      }
    }
  })
}

export const getFilteredNotes = (inputValue: String) => {
  return new Promise((resolve, reject) => {
    const dbConnection = indexedDB.open(DB_NAME, DB_VERSION)

    dbConnection.onsuccess = (event: any) => {
      db = event.target?.result
      const transaction = db.transaction([STORE_NOTES], "readonly")
      const store = transaction.objectStore(STORE_NOTES)

      const range = IDBKeyRange.bound(
        "https://" + inputValue,
        "https://" + inputValue + "\uffff"
      ) // Crie uma faixa de chave para correspondência parcial
      const index = store.index("originIndex")

      const results = []
      index.openCursor(range).onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          console.log("Open Cursor Event: ", event)
          console.log("Open Cursor Cursor: ", cursor)
          results.push(event.target.result.value)
          cursor.continue()
        } else {
          resolve(results)
          console.log("No more cursor: results[] ", results)
        }
      }
    }
  })
}
