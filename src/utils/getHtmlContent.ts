export default function getHtmlContent(ctx = window) {
  var selection = ctx.getSelection();
  var range = selection?.getRangeAt(0);
  var content = range?.cloneContents();
  var nodes = Array.from(content?.childNodes);
  var filteredNodes = nodes.filter((node) => Boolean(node.textContent?.trim()));
  var mappedNodes = filteredNodes.map((node) => {
    return { nodeName: node.nodeName, textContent: node.textContent?.trim() };
  });

  return mappedNodes;

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
