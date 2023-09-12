import { Note } from "./types"

export function injectIconCssLink() {
  // inject icons
  const trashIconLink = document.createElement("link")
  const colorIconLink = document.createElement("link")

  trashIconLink.setAttribute(
    "href",
    "https://unpkg.com/css.gg@2.0.0/icons/css/trash.css"
  )
  trashIconLink.setAttribute("rel", "stylesheet")
  colorIconLink.setAttribute(
    "href",
    "https://unpkg.com/css.gg@2.0.0/icons/css/color-picker.css"
  )
  colorIconLink.setAttribute("rel", "stylesheet")

  document.head.appendChild(trashIconLink)
  document.head.appendChild(colorIconLink)
}

export const removeHighlightFromDeletedNote = (payload: Note) => {
  const deletedNote = document.querySelector(
    `[data-sidenotes-id="${payload.id}"]`
  )
  deletedNote.classList.add("deleted")
}

export const scrollToClicked = (note: any) => {
  if (note.clicked) {
    const element = document.querySelector(`[data-sidenotes="${note.data}"]`)
    element?.scrollIntoView({ block: "center" })
  }
}

const deleteNote = (note: Note) => {
  const key = note.origin
  chrome.storage.local.get(function (result) {
    const notesArray = result[key]
    const filteredNotes = notesArray.filter(
      (currNote) => currNote.date !== note.date
    )

    chrome.storage.local.set({ [key]: filteredNotes }).then(() => {
      removeHighlightFromDeletedNote(note)
    })
  })
}

const createHighlight = (note: Note) => {
  const span = document.createElement("span")

  span.textContent = note.content
  span.dataset.sidenotesId = note.id

  const hoverDiv = document.createElement("div")
  const trashIcon = document.createElement("i")
  const colorIcon = document.createElement("i")

  hoverDiv.classList.add("hoverDiv")
  trashIcon.classList.add("gg-trash")
  colorIcon.classList.add("gg-color-picker")

  trashIcon.onclick = () => deleteNote(note)

  span.classList.add("sidenote-highlight")

  hoverDiv.appendChild(trashIcon)
  hoverDiv.appendChild(colorIcon)

  span.appendChild(hoverDiv)

  return span
}

export function wrapTextWithSpan(rootNode: HTMLElement, note: Note) {
  const stack: Node[] = [rootNode]

  while (stack.length > 0) {
    const node = stack.pop()

    if (node?.nodeType === Node.TEXT_NODE) {
      // maybe use Range.surroundContents()

      const text = node.textContent
      const index = text.indexOf(note.content)

      if (index !== -1) {
        const beforeText = text.substring(0, index)
        const afterText = text.substring(index + note.content.length)

        const highlight = createHighlight(note)

        const parentNode = node.parentNode
        parentNode?.insertBefore(document.createTextNode(beforeText), node)
        parentNode?.insertBefore(highlight, node)
        parentNode?.insertBefore(
          document.createTextNode(afterText),
          node.nextSibling
        )
        parentNode?.removeChild(node)
      }
    } else if (node?.nodeType === Node.ELEMENT_NODE) {
      const children = node.childNodes
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
}
