import updateNote from "./updateNote"

export default function handleColorSelection(event: Event) {
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
