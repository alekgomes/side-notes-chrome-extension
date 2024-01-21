const isSameNode = (currentNode, noteContent) => {
  return (
    // currentNode.nodeName == noteContent.nodeName &&
    currentNode.textContent?.trim().includes(noteContent.textContent?.trim())
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

  let parentNode;

  while (treeWalker.nextNode()) {
    let currentNode = treeWalker.currentNode;

    note.htmlContent.forEach((noteContent) => {
      if (isSameNode(currentNode, noteContent)) {
        parentNode = currentNode;
      }
    });
  }
  return parentNode;
}
