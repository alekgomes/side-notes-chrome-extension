import { GET_NOTE_FROM_USER } from "./types"


// function wrapTextWithSpan(text) {
//   // Busca todos os nós de texto no documento
//   const walker = document.createTreeWalker(
//     document.body,
//     NodeFilter.SHOW_TEXT,
//     null,
//     false
//   )

//   while (walker.nextNode()) {
//     // Verifica se o nó de texto atual contém o texto desejado
//     if (walker.currentNode.textContent.includes(text)) {
//       // Cria um novo elemento span e define o texto como seu conteúdo
//       const span = document.createElement("span")
//       span.style.backgroundColor = "red"

//       span.textContent = text

//       // Substitui o texto desejado pela tag span no nó de texto atual
//       walker.currentNode.textContent = walker.currentNode.textContent.replace(
//         text,
//         span.outerHTML
//       )
//     }
//   }
// }

// Use a função, passando o texto que você deseja envolver com uma tag span

function wrapTextWithSpan(rootNode, textToFind, backgroundColor) {
  const stack = [rootNode]

  while (stack.length > 0) {
    const node = stack.pop()

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent
      const index = text.indexOf(textToFind)

      if (index !== -1) {
        const beforeText = text.substring(0, index)
        const afterText = text.substring(index + textToFind.length)

        const span = document.createElement("span")
        span.style.backgroundColor = backgroundColor
        span.textContent = textToFind

        const parentNode = node.parentNode
        parentNode.insertBefore(document.createTextNode(beforeText), node)
        parentNode.insertBefore(span, node)
        parentNode.insertBefore(
          document.createTextNode(afterText),
          node.nextSibling
        )
        parentNode.removeChild(node)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const children = node.childNodes
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
}

window.onload = async () => {
  chrome.storage.local.get(function (result) {
    if (result.hasOwnProperty(window.origin)) {
      result[window.origin].map((r: any) => {        
        wrapTextWithSpan(document.body, r.content , "red")
      })
    }
  })

  chrome.runtime.onMessage.addListener(
    async ({ type }, _sender, sendResponse) => {
      switch (type) {
        case GET_NOTE_FROM_USER: {
          let outterHTML

          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const span = document.createElement("span")
            span.style.background = "rgba(255,0,0)"
            range.surroundContents(span)
            outterHTML = span.outerHTML
          }

          return sendResponse({
            content: window.getSelection()?.toString(),
            date: Date.now(),
            origin: window.location.origin,
            url: window.location.href,
          })
        }
      }
    }
  )
}
