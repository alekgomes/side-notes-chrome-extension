const defaultColor = "#FFFD98";

// {
//   textContent: window.getSelection()?.toString(),
//   htmlContent: getHtmlContent(),
//   date: Date.now(),
//   id: Date.now(),
//   color: "#FFFD98",
//   origin: window.location.origin,
//   url: window.location.href,
// }

// returns element if content is a partial text
function getCommonContainer(cc) {
  if (cc.nodeType == 3) {
    return getCommonContainer(cc.parentElement);
  } else {
    return cc;
  }
}

function noteFactory() {
  const selection = window.getSelection(); // TO-DO => e se não tiver seleção diponível? -> enviar toast de erro
  const range = selection.getRangeAt(0);
  const cloned = range.cloneContents();
  const commonAncestorContainer = window
    .getSelection()
    .getRangeAt(0).commonAncestorContainer;

  const commonContainer = getCommonContainer(commonAncestorContainer);

  var notes = [];

  var filteredNodes = [...cloned.childNodes].filter((el) =>
    Boolean(el.textContent.trim()),
  );

  filteredNodes.forEach((node) => {
    getTagAndContent(node);
  });

  function getTagAndContent(node) {
    // nodeType == 3 => partial text node
    if (node.nodeType == 3) {
      notes.push({
        tag: "#text",
        content: node.textContent,
        origin: window.location.origin,
        color: defaultColor,
        id: Date.now(),
        commonAncestor: {
          tag: getCommonContainer(commonContainer.tagName),
          innerHTML: getCommonContainer(commonContainer.innerHTML),
        },
      });
      return;
    }
    // handles entire single element
    if (node.children.length == 0) {
      notes.push({
        tag: node.tagName,
        content: node.textContent,
        origin: window.location.origin,
        color: defaultColor,
        id: Date.now(),
        commonAncestor: {
          tag: getCommonContainer(commonContainer.tagName),
          innerHTML: getCommonContainer(commonContainer.innerHTML),
        },
      });
    } else {
      // If not partial text and not entire element, traverse content recusirvely
      [...node.children]
        .filter((el) => Boolean(el.textContent.trim())) // .map makes more sense here
        .forEach((node) => getTagAndContent(node));
    }
  }

  console.log("noteFactory", notes);
  return notes;
}

export default noteFactory;
