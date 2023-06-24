window.onload = () => {
  chrome.runtime.onMessage.addListener(({ type }, _sender, sendResponse) => {
    switch (type) {
      case "GET_NOTE_FROM_USER": {
        return sendResponse({
          content: window.getSelection()?.toString(),
          date: Date.now(),
          origin: window.location.origin,
          url: window.location.href,
        })
      }
    }
  })
}
