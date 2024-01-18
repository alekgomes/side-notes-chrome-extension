import { createHoverBox } from "../utils";

export default function addMarkup(nodeToWrap, note) {
  const initalIdx = nodeToWrap.textContent.indexOf(note.textContent);
  const finalIdx = initalIdx + note.textContent.length;
  const innerHTMLBefore = nodeToWrap.textContent.substring(0, initalIdx);
  const innerHTMLAfter = nodeToWrap.textContent.substring(finalIdx);
  const innerContent = nodeToWrap.textContent.substring(initalIdx, finalIdx);

  nodeToWrap.innerHTML = `${innerHTMLBefore}<mark data-sidenotes-id=${note.id} style="background-color:${note.color}" class="sidenote-highlight">${innerContent}</mark>${innerHTMLAfter}`;

  return nodeToWrap;
}
