export default function iconFactory(className: string, onClick?: () => void) {
  const icon = document.createElement("i")
  icon.classList.add(className)
  if (onClick) icon.addEventListener("click", onClick)
  return icon
}
