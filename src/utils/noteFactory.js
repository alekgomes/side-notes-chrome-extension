const defaultColor = "#FFFD98";

// returns element if content is a partial text
function getCommonContainer(cc) {
  if (cc.nodeType == 3) {
    return getCommonContainer(cc.parentElement);
  } else {
    return cc;
  }
}

function removeEmpty(element) {
  return Boolean(element.textContent.trim());
}

const nodes = [];
function getFilteredSingleElements(clonedContent) {
  const filtered = [...clonedContent.childNodes].filter(removeEmpty);
  filtered.forEach((el) => {
    if (el.nodeType == 3 || el.children.length == 0) {
      nodes.push(el);
    } else getFilteredSingleElements(el);
  });

  return nodes;
}

function noteFactory(context = window) {
  const selection = context.getSelection(); // TO-DO => e se não tiver seleção diponível? -> enviar toast de erro
  const range = selection.getRangeAt(0);

  const cloned = range.cloneContents();
  const commonAncestorContainer = context
    .getSelection()
    .getRangeAt(0).commonAncestorContainer;

  const filteredNodes = getFilteredSingleElements(cloned);

  const commonContainer = getCommonContainer(commonAncestorContainer);
  debugger;
  var note = {
    id: Date.now(),
    origin: context.location.origin,
    color: defaultColor,
    marks: [],
    commomContainer: {
      tag: commonContainer.tagName,
      innerHTML: commonContainer.innerHTML,
    },
  };

  filteredNodes.forEach((node) => {
    if (node.children && node.children.length > 0) {
      [...node.children]
        .filter((el) => Boolean(el.textContent.trim())) // .map makes more sense here
        .forEach((node) => getTagAndContent(node));
    } else {
      getTagAndContent(node);
    }
  });

  function getTagAndContent(node) {
    // nodeType == 3 => partial text node
    if (node.nodeType == 3) {
      note.marks.push({
        tag: "#text",
        content: node.textContent,
      });
      return;
    }

    if (node.children.length == 0) {
      note.marks.push({
        tag: node.tagName,
        content: node.textContent,
      });
    } else {
      [...node.children]
        .filter((el) => Boolean(el.textContent.trim()))
        .map((node) => getTagAndContent(node));
    }
  }

  return note;
}

export default noteFactory;
