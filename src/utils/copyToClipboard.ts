export default function copyToClipboard(event: Event) {
  const { target } = event
  const parentElement = target.parentElement
  const granParentElement = parentElement.parentElement
  const innerText = granParentElement.innerText

  window.navigator.clipboard.writeText(innerText)
  parentElement.remove()
}
