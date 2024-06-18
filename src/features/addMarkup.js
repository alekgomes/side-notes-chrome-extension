import { createHoverBox } from "../utils";

function findTextNode(cc, note) {
  return [...cc.childNodes].find((node) =>
    node.textContent.trim().includes(note.content.trim()),
  );
}

function getCommonContainer(cc) {
  if (cc.nodeType == 3) {
    return getCommonContainer(cc.parentElement);
  } else {
    return cc;
  }
}

function findCommonContainer(note, context) {
  const tags = [...context.querySelectorAll(note.commonAncestor.tag)];
  const commonContainer = tags.find(
    (tag) => tag.innerHTML.trim() == note.commonAncestor.innerHTML.trim(),
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

  notes.forEach((note) => {
    const commonContainer = getCommonContainer(
      findCommonContainer(note, context),
    );

    if (note.tag == "#text") {
      const textNode = findTextNode(commonContainer, note);
      const initialIdx = textNode.textContent.indexOf(note.content);
      const finalIdx = initialIdx + note.content.length;
      nodes.push({ textNode, initialIdx, finalIdx });
    } else {
      let node;
      [...commonContainer.querySelectorAll(note.tag)].forEach((domNode) => {
        if (domNode.textContent.trim().includes(note.content.trim())) {
          node = domNode;
        }
      });

      const initialIdx = node.textContent.trim().indexOf(note.content.trim());
      var textNode = [...node.childNodes].filter((el) =>
        Boolean(el.textContent.trim()),
      )[0];

      const finalIdx = note.content.length;
      nodes.push({ textNode, initialIdx, finalIdx });
    }
  });

  nodes.forEach(applyTransformation);
}
