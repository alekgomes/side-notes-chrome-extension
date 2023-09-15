import { Note } from "./types"

const defaultColors = ["#FFFD98", "#BDE4A7", "#9FBBCC", "#7A9CC6"]

export function injectIconCssLink() {
  // inject icons
  const trashIconLink = document.createElement("link")
  const colorIconLink = document.createElement("link")
  const copyIconLink = document.createElement("link")

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

  copyIconLink.setAttribute("rel", "stylesheet")
  copyIconLink.setAttribute(
    "href",
    "https://unpkg.com/css.gg@2.0.0/icons/css/copy.css"
  )

  document.head.appendChild(trashIconLink)
  document.head.appendChild(colorIconLink)
  document.head.appendChild(copyIconLink)
}

export const removeHighlightFromDeletedNote = (payload: Note) => {
  const deletedNote = document.querySelector(
    `[data-sidenotes-id="${payload.id}"]`
  )
  deletedNote.classList.add("deleted")
}

export const scrollToClicked = (note: any) => {
  const element = document.querySelector(`[data-sidenotes-id="${note.id}"]`)
  element?.scrollIntoView({ block: "center" })
}

const deleteNote = (note: Note) => {
  const key = note.origin
  chrome.storage.local.get(function (result) {
    const notesArray = result[key]
    const filteredNotes = notesArray.filter(
      (currNote) => currNote.id !== note.id
    )

    chrome.storage.local.set({ [key]: filteredNotes }).then(() => {
      removeHighlightFromDeletedNote(note)
    })
  })
}

const iconFactory = (className: string, onClick?: () => void) => {
  const icon = document.createElement("i")
  icon.classList.add(className)
  if (onClick) icon.addEventListener("click", onClick)
  return icon
}

export const updateNote = (
  noteKey: string,
  noteId: number,
  attr: string,
  newValue: any
) => {
  chrome.storage.local.get(function (result) {
    const notesArray = result[noteKey]

    const newNotes = notesArray.map((currNote) => {
      if (currNote.id == noteId) {
        currNote[attr] = newValue
      }
      return currNote
    })

    chrome.storage.local.set({ [noteKey]: newNotes }).then(() => {
      console.log(`Updated ${attr} to ${newValue}`)
    })
  })
}

const handleColorSelection = (event: Event) => {
  const { target } = event
  const key = window.location.origin
  const parentElement = target.parentElement
  const granParentElement = parentElement.parentElement
  const noteId = granParentElement.dataset.sidenotesId
  const bgColor = target.style.background

  granParentElement.style.background = target.style.background

  updateNote(key, noteId, "color", bgColor)

  granParentElement.classList.remove("color-picker--open")
  parentElement.remove()
}

const handleColorPickerClick = (parentNode: HTMLElement) => {
  const colorSelector = document.createElement("div")
  colorSelector.classList.add("sidenotes__color-selector")

  parentNode.classList.add("color-picker--open")

  defaultColors.forEach((color) => {
    const colorDiv = document.createElement("div")
    colorDiv.classList.add("color-selector__color")
    colorDiv.style.background = color
    colorDiv.addEventListener("click", handleColorSelection)
    colorSelector.appendChild(colorDiv)
  })

  parentNode.appendChild(colorSelector)
}

const createHighlight = (note: Note) => {
  const highlight = document.createElement("span")

  highlight.textContent = note.content
  highlight.dataset.sidenotesId = note.id
  highlight.style.background = note.color

  const hoverDiv = document.createElement("div")
  const trashIcon = iconFactory("gg-trash", () => deleteNote(note))
  const colorIcon = iconFactory("gg-color-picker", () =>
    handleColorPickerClick(highlight)
  )
  const copyIcon = iconFactory("gg-copy")

  hoverDiv.classList.add("hoverDiv")

  highlight.classList.add("sidenote-highlight")

  hoverDiv.appendChild(trashIcon)
  hoverDiv.appendChild(colorIcon)
  hoverDiv.appendChild(copyIcon)

  highlight.appendChild(hoverDiv)

  return highlight
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
