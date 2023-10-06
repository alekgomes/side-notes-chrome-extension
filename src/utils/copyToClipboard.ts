export default function copyToClipboard({
  target,
}: {
  target: HTMLElement
}): void {
  const parentElement = target.parentElement
  const granParentElement = parentElement?.parentElement
  const innerText = granParentElement?.innerText

  window.navigator.clipboard.writeText(innerText ?? "")
}
