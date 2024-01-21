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
}
