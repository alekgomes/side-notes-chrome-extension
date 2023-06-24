window.onload = () => {
  chrome.runtime.onMessage.addListener(({ type }, _sender, sendResponse) => {
    switch (type) {
      case "GET_NOTE_FROM_USER": {
        return sendResponse({
          content: window.getSelection()?.toString(),
          data: Date.now(),
          url: window.location.href,
        })
      }
    }
  })
}
