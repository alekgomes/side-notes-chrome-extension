export default function iconFactory(
  iconSrc: string,
  className: string,
  onClick?: () => void
) {
  const icon = document.createElement("img")
  const iconUrl = chrome.runtime.getURL(iconSrc)
  icon.setAttribute("src", iconUrl)
  icon.classList.add(className)
  if (onClick) icon.addEventListener("click", onClick)
  return icon
}
