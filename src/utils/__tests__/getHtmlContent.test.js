/**
 * @jest-environment jsdom
 */

import { beforeEach, expect, test, vi } from "vitest"
import { JSDOM } from "jsdom"
import getHtmlContent from '../getHtmlContent'

let domString;
let jsdom;

beforeEach(function createDOM() {
  // DOM string based on Github's landing page
  domString = `
  <ul>
    <li>
      <strong>NTFS</strong> (New Technology File System) mainly used on Windows systems
    </li>
    <li>
      <strong>EXT4</strong> (Extended File System) mainly used on Linux systems</li>
    <li>
      <strong>APFS</strong> (Apple File System) mainly used on MacOSX systems
    </li>
    <li>
      <strong>FAT32</strong> (File Allocation Table) which is currently at the verge of extinction.
    </li>
  </ul>
  `;

  jsdom = new JSDOM(domString, {
    url: "http://localhost:3000",
    contentType: "text/html",
    includeNodeLocations: true,
  });
});

test("Should return correct value for selection including only a few words in the node", () => {
  // SETUP
  // Creates Selection around text of interest
  const li = jsdom.window.document.querySelector("li").childNodes[2];
  const content = li.textContent;
  const idxStart = content.indexOf("on Windows");
  const idxEnd = idxStart + "on Windows".length;
  const range = jsdom.window.document.createRange();
  const selection = jsdom.window.getSelection();

  range.setStart(li, idxStart);
  range.setEnd(li, idxEnd);

  selection.addRange(range);

  // ACTION
  const result = getHtmlContent(jsdom.window);

  // ASSERT
  expect(result[0]).toHaveProperty("nodeName");
  expect(result[0].nodeName).toBe("#text");
  expect(result[0]).toHaveProperty("textContent");
  expect(result[0].textContent).toBe("on Windows");
});

test("Should return correct values when select entire HTML node", () => {
  // SETUP
  // Creates Selection around LI
  const li = jsdom.window.document.querySelector("li");
  const selection = jsdom.window.getSelection();
  const range = jsdom.window.document.createRange();
  range.setStartBefore(li.firstChild);
  range.setEndAfter(li.lastChild);
  selection.addRange(range);
  // ACTION
  const result = getHtmlContent(jsdom.window);
  // ASSERT

  expect(result.length).toBe(2);
  expect(result[0]).toHaveProperty("nodeName");
  expect(result[0].nodeName).toBe("STRONG");
  expect(result[0]).toHaveProperty("textContent");
  expect(result[0].textContent).toBe("NTFS");
  expect(result[1]).toHaveProperty("nodeName");
  expect(result[1].nodeName).toBe("#text");
  expect(result[1]).toHaveProperty("textContent");
  expect(result[1].textContent.trim()).toBe(
    "(New Technology File System) mainly used on Windows systems",
  );
});

test("Should return correct values when select two entire HTML nodes", () => {
  // SETUP
  // Creates Selection around LI
  const li = jsdom.window.document.querySelectorAll("li");
  const selection = jsdom.window.getSelection();
  const range = jsdom.window.document.createRange();

  range.setStartBefore(li[0]);
  range.setEndAfter(li[1]);
  selection.addRange(range);
  // ACTION
  const result = getHtmlContent(jsdom.window);
  // ASSERT
  expect(result[0]).toHaveProperty("nodeName");
  expect(result[0].nodeName).toBe("LI");
  expect(result[0]).toHaveProperty("textContent");
  expect(result[0].textContent).toBe(
    "NTFS (New Technology File System) mainly used on Windows systems",
  );
  expect(result[1]).toHaveProperty("nodeName");
  expect(result[1].nodeName).toBe("LI");
  expect(result[1]).toHaveProperty("textContent");
  expect(result[1].textContent).toBe(
    "EXT4 (Extended File System) mainly used on Linux systems",
  );
});

test("Should return correct values when select one entire HTML node and part of the next", () => {
  // SETUP
  // Creates Selection around LI
  const li = jsdom.window.document.querySelectorAll("li");
  const selection = jsdom.window.getSelection();
  const range = jsdom.window.document.createRange();
  const idxEnd = " (Extended File System)".length;

  // Select the 1° LI entirely and until "(Extended File System)" of the 2° LI
  range.setStartBefore(li[0]);
  range.setEnd(li[1].childNodes[2], idxEnd);
  selection.addRange(range);

  // ACTION
  const result = getHtmlContent(jsdom.window);
  // ASSERT
  expect(result[0]).toHaveProperty("nodeName");
  expect(result[0].nodeName).toBe("LI");
  expect(result[0]).toHaveProperty("textContent");
  expect(result[0].textContent).toBe(
    "NTFS (New Technology File System) mainly used on Windows systems",
  );
  expect(result[1]).toHaveProperty("nodeName");
  expect(result[1].nodeName).toBe("LI");
  expect(result[1]).toHaveProperty("textContent");
  expect(result[1].textContent).toBe("EXT4 (Extended File System)");
});

