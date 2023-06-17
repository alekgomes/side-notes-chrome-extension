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

  chrome.tabs.sendMessage(tab.id , {
    type: "saveSelection",
  })
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  )
 
})
