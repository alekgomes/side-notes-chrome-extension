export default function injectIconCssLink() {
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
