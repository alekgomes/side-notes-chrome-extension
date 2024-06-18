export default function getHtmlContent(ctx = window) {
  var selection = ctx.getSelection();
  var range = selection?.getRangeAt(0);
  var content = range?.cloneContents();
  var nodes = Array.from(content?.childNodes);
  var filteredNodes = nodes.filter((node) => Boolean(node.textContent?.trim()));
  var serializedRange = JSON.stringify({
    startContainer: range.startContainer,
    startOffset: range.startOffset,
    endContainer: range.endContainer,
    endOffset: range.endOffset,
  });
  var mappedNodes = filteredNodes.map((node) => {
    return {
      nodeName:
        node.nodeName == "#text" ? node.parentElement?.nodeName : node.nodeName,
      textContent: node.textContent?.trim(),
      range: serializedRange,
    };
  });

  return mappedNodes;
}



// https://stackoverflow.com/questions/23479533/how-can-i-save-a-range-object-from-getselection-so-that-i-can-reproduce-it-on
