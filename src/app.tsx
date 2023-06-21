import { useLayoutEffect, useState } from "preact/hooks"

import "./app.css"

export function App() {
  const [notes, setNotes] = useState([])

  useLayoutEffect(() => {
    requestNotes()
  }, [])

  const requestNotes = async () => {
    // const [tab] = await chrome.tabs.query({
    //   active: true,
    //   lastFocusedWindow: true,
    // })
    // const response = await chrome.tabs.sendMessage(tab.id || 0, {
    //   type: "GET_DATA",
    // })

    const DB_NAME = "side-notes"
    const DB_VERSION = 1
    const STORE_NOTES = "notes"

    let db

    const dbConnection = indexedDB.open(DB_NAME, DB_VERSION)
    dbConnection.onsuccess = (event) => {
      db = event.target.result
      const transaction = db.transaction([STORE_NOTES], "readonly")
      const store = transaction.objectStore(STORE_NOTES)
      const getAllRequest = store.getAll()

      getAllRequest.onsuccess = (e) => {
        console.log(e)
        setNotes(e.target.result)
      }
    }
  }

  const requestDelete = async (noteId: any) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })
    const response = await chrome.tabs.sendMessage(tab.id || 0, {
      type: "DeleteData",
      payload: noteId,
    })

    console.log(response)
  }

  const handleNavigation = (url: URL) => {
    window.open(url, "_blank", "noreferrer")
  }

  return (
    <>
      <h1>Side Notes</h1>
      <ol>
        {notes.map((note: any) => (
          <li className={"listItem"} onClick={() => handleNavigation(note.url)}>
            <p> {note.content}</p>
            <p>
              <i>
                <small>{note.date}</small>
              </i>
            </p>
            <small className={"listItem__actions"}>
              <i onClick={() => requestDelete(note.id)}>apagar</i>
            </small>
          </li>
        ))}
      </ol>
    </>
  )
}
