import { useLayoutEffect } from "preact/hooks"

import "./app.css"

export function App() {
  const initializeUI = (data: any) => {
    console.log(data)
  }

  useLayoutEffect(() => {
    console.log("useLayoutEffect()")

    chrome.runtime.sendMessage({action: 'getData'}, (response) => {
      // 3. Got an asynchronous response with the data from the service worker
      console.log("received user data", response)
      initializeUI(response)
    })
  })

  return (
    <>
      <h1>Side Notes</h1>
    </>
  )
}
