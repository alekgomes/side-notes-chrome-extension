const isSameNode = (currentNode, searchingNode) => {
  // check if text node
  if (searchingNode.nodeType === 3) {
    return currentNode.textContent.trim() == searchingNode.textContent.trim();
  }
  return (
    currentNode.tagName == searchingNode.tagName &&
    currentNode.textContent?.trim().includes(searchingNode.textContent?.trim())
  );
};

export default function findParentNode(rootNode, note) {
  const treeWalker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: function (node) {
        if (node.tagName === "SCRIPT" || node.tagName == "BODY") {
          // Ignora nós de script e body
          return NodeFilter.FILTER_REJECT;
        }

        // Aceita todos os outros nós
        return NodeFilter.FILTER_ACCEPT;
      },
    },
  );

  const parser = new DOMParser();
  const parsedHtmlContent = Array.from(
    parser.parseFromString(note.htmlContent, "text/html").body.childNodes,
  );

  let foundNodes = [];

  while (treeWalker.nextNode()) {
    let currentNode = treeWalker.currentNode;
    parsedHtmlContent.forEach((el) => {
      if (isSameNode(currentNode, el)) {
        foundNodes.push(currentNode);
      }
    });
  }

  return foundNodes;
}
