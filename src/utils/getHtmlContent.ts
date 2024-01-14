export default function getHtmlContent(context = window) {
  const selection = context.window.getSelection();
  const div = document.createElement("div");
  const range = selection.getRangeAt(0);
  const content = range.cloneContents();
  div.append(content);

  // When select a single element, the innertHtml will return
  // only the text for that element.
  // The following handles selection of multiples tags selection
  // inside the if statement and single element selections
  // inside the else statement.
  const fragmentContainsTag = Boolean(div.children[0]?.tagName);
  if (fragmentContainsTag) {
    return div.innerHTML;
  } else {
    return selection?.focusNode?.parentElement.outerHTML;
  }
}
