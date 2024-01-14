import { createHoverBox } from "../utils";

export default function addMarkup(nodeToWrap, note) {
  console.log("nodeToWrap", nodeToWrap.innerHTML);
  const initalIdx = nodeToWrap.textContent.indexOf(note.textContent);
  console.log("initalIdx", initalIdx);
  const finalIdx = initalIdx + note.textContent.length;
  console.log("finalIdx", finalIdx);
  const innerHTMLBefore = nodeToWrap.textContent.substring(0, initalIdx);
  console.log("innerHTMLBefore", innerHTMLBefore);
  const innerHTMLAfter = nodeToWrap.textContent.substring(finalIdx);
  console.log("innerHTMLAfter", innerHTMLAfter);
  const innerContent = nodeToWrap.textContent.substring(initalIdx, finalIdx);
  console.log("innerContent", innerContent);

  nodeToWrap.innerHTML = `${innerHTMLBefore}<mark data-sidenotes-id=${note.id} style="background-color:${note.color}" class="sidenote-highlight">${innerContent}</mark>${innerHTMLAfter}`;

  return nodeToWrap;
}
