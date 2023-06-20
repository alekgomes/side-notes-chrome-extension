import { useLayoutEffect, useState } from "preact/hooks"

import "./app.css"

export function App() {
  const [notes, setNotes] = useState([])

  useLayoutEffect(() => {
    requestNotes()
  }, [])

  const requestNotes = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })
    const response = await chrome.tabs.sendMessage(tab.id || 0, {
      type: "getData",
    })
    setNotes(response)
  }

  const requestDelete = async (noteId: any) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })
    const response = await chrome.tabs.sendMessage(tab.id || 0, {
      type: "deleteData",
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
