import { createHoverBox } from "../utils";

function findTextNode(cc, mark) {
  return [...cc.childNodes].find((node) =>
    node.textContent.trim().includes(mark.content.trim()),
  );
}

function removeEmpty(element) {
  return Boolean(element.textContent.trim());
}

function findTextNodeNew(childNodesArr, mark) {
  const filtered = childNodesArr.filter(removeEmpty);
  const container = filtered.find((el) =>
    el.textContent.trim().includes(mark.content.trim()),
  );
  debugger;
  if (
    container.nodeType == 3 &&
    container.textContent.trim().includes(mark.content.trim())
  ) {
    return container;
  } else {
    return findTextNodeNew([...container.childNodes], mark);
  }
}

function getCommonContainer(cc) {
  if (cc.nodeType == 3) {
    return getCommonContainer(cc.parentElement);
  } else {
    return cc;
  }
}

function findCommonContainer(note, context) {
  const tags = [...context.querySelectorAll(note.commomContainer.tag)];
  const commonContainer = tags.find(
    (tag) => tag.innerHTML.trim() == note.commomContainer.innerHTML.trim(),
  );
  return commonContainer;
}

const applyTransformation = (node) => {
  var mark = document.createElement("mark");
  var range = window.document.createRange();
  range.setStart(node.textNode, node.initialIdx);
  range.setEnd(node.textNode, node.finalIdx);
  range.surroundContents(mark);
};

export default function addMarkup(notes, context = document) {
  const nodes = [];
  const notesArr = [notes];

  notesArr.forEach((note) => {
    const commonContainer = getCommonContainer(
      findCommonContainer(note, context),
    );

    note.marks.forEach((mark) => {
      if (mark.tag == "#text") {
        const textNode = findTextNodeNew([...commonContainer.childNodes], mark);
        const initialIdx = textNode.textContent.indexOf(mark.content);
        const finalIdx = initialIdx + mark.content.length;
        nodes.push({ textNode, initialIdx, finalIdx });
      } else {
        let node;
        [...commonContainer.querySelectorAll(mark.tag)].forEach((domNode) => {
          if (domNode.textContent.trim().includes(mark.content.trim())) {
            node = domNode;
          }
        });

        const initialIdx = node.textContent.trim().indexOf(mark.content.trim());

        var textNode = [...node.childNodes].filter((el) =>
          Boolean(el.textContent.trim()),
        )[0];

        const finalIdx = mark.content.length;
        nodes.push({ textNode, initialIdx, finalIdx });
      }
    });
  });

  nodes.forEach(applyTransformation);
}
