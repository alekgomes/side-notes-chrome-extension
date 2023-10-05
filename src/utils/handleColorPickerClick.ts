const defaultColors = ["#FFFD98", "#BDE4A7", "#9FBBCC", "#7A9CC6"]

export default function handleColorPickerClick(parentNode: HTMLElement) {
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
