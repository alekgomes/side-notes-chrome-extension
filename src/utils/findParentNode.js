const isSameNode = (currentNode, searchingNode) => {
  return (
    currentNode.tagName == searchingNode.tagName &&
    currentNode.textContent?.trim().includes(searchingNode.textContent?.trim())
  );
};

const includesNode = (currentNode, note) => {
  console.log(
    currentNode.innerHTML.trim().length,
    "||",
    note.htmlContent.trim().length,
    "\n\n",
  );

  return currentNode.innerHTML.includes(note.htmlContent);
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
  // console.log("parsedHtmlContent", parsedHtmlContent[0].innerHTML);

  let parentNode;

  while (treeWalker.nextNode()) {
    let currentNode = treeWalker.currentNode;

    parsedHtmlContent.forEach((el) => {
      if (isSameNode(currentNode, el)) {
        parentNode = currentNode.parentNode;
      }
    });
  }
  return parentNode;
}
