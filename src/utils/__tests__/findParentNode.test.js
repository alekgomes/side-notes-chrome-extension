/**
 * @jest-environment jsdom
 */

import { beforeEach, expect, test, vi } from "vitest";
import { JSDOM } from "jsdom";
import findParentNode from "../findParentNode";

const singleElementNote = {
  color: "#FFFD98",
  date: 1705867141085,
  htmlContent: [
    {
      nodeName: "#text",
      textContent: "Let’s build from here",
    },
  ],
  id: 1705867141085,
  origin: "https://github.com",
  textContent: "Let’s build from here",
  url: "https://github.com/",
};

const noteMultipleSelection = {
  color: "#FFFD98",
  date: 1703697626122,
  htmlContent:
    '<h1 class="h0-mktg mb-2 position-relative z-2"><span style="font-size: 1.2em">Let’s build from&nbsp;here</span>\n        </h1>\n\n        <p class="f2-mktg text-normal color-fg-muted mb-3 mb-md-10 position-relative z-1">\n          The world’s leading AI-powered developer platform.</p>',
  id: 1703697626122,
  origin: "https://github.com",
  textContent:
    "Let’s build from here\nThe world’s leading AI-powered developer platform.",
  url: "https://github.com/",
};

const textSelection = {
  color: "#FFFD98",
  date: 1705006437056,
  htmlContent:
    "It's often used for multimedia files like images, audio, and video. Examples include <strong>JPEG</strong> for images, <strong>MP3</strong> for audio or <strong>MP4</strong> for video.",
  id: 1705006437056,
  origin: "https://dev.to",
  textContent:
    "It's often used for multimedia files like images, audio, and video. Examples include JPEG for images, MP3 for audio or MP4 for video.",
  url: "https://dev.to/joelbonetr/cs-fundamentals-how-data-storage-actually-works-1o4a",
};

let jsdom;

beforeEach(function buildDOM() {
  // exemple from Github landing page
  const domString = `
  <div>
    <h1 class="h0-mktg mb-2 position-relative z-2"><span style="font-size: 1.2em">Let’s build from&nbsp;here</span></h1>
    <p class="f2-mktg text-normal color-fg-muted mb-3 mb-md-10 position-relative z-1">
      The world’s leading AI-powered developer platform.
    </p>
    <div class="d-flex flex-column flex-md-row">
      <div class="border-top border-md-left mx-md-3 mb-3 mb-md-0"></div>
      <a class="btn-mktg home-campaign-enterprise btn-muted-mktg" href="/organizations/enterprise_plan? data-test-selector="start-trial-button">
        Start a free enterprise trial
      </a>
    </div>
    <ul>
    <li>
      <strong>Lossless Compression</strong> retains all the original data when decompressed. Common algorithms include <strong>ZIP</strong> and <strong>GZIP</strong>. It's ideal for text files and documents.
    </li>
    <li>
      <strong>Lossy Compression:</strong> This sacrifices some data to achieve higher compression ratios. It's often used for multimedia files like images, audio, and video. Examples include <strong>JPEG</strong> for images, <strong>MP3</strong> for audio or <strong>MP4</strong> for video.
    </li>
  </ul> 
  </div>
  `;

  jsdom = new JSDOM(domString, {
    url: "http://localhost:3000",
    contentType: "text/html",
    includeNodeLocations: true,
  });
});

test("It returns the parent element for single element selection", () => {
  const result = findParentNode(jsdom.window.document.body, singleElementNote);
  expect(result.tagName).equal("SPAN");
  expect(result.innerHTML).toBe("Let’s build from&nbsp;here"); // usando innerHTML por conta do &nbsp
});

test.skip("It returns the parent element for multiple elements selection", () => {
  const result = findParentNode(
    jsdom.window.document.body,
    noteMultipleSelection,
  );

  expect(result.tagName).equal("DIV");
});

test.skip("It returns the parent element for text selection", () => {
  const result = findParentNode(jsdom.window.document.body, textSelection);

  expect(result.tagName).equal("LI");
});

// test("It should return DOM nodes that matches the note's htmlContent for SINGLE element", () => {
//   // ACT
//   const result = findParentNode(jsdom.window.document.body, noteSingleElement);

//   // ASSERT
//   expect(result[0].tagName).equal(`P`);
//   expect(result[0].textContent.trim()).equal(
//     noteSingleElement.textContent.trim(),
//   );
// });

// test("It should return DOM nodes that matches the note's htmlContent for MULTIPLE elements", () => {
//   // ACT
//   const result = findParentNode(
//     jsdom.window.document.body,
//     noteMultipleSelection,
//   );

//   // ASSERT
//   expect(result[0].tagName).equal(`H1`);
//   expect(result[0].textContent).equal("Let’s build from here");
//   expect(result[1].tagName).equal(`P`);
//   expect(result[1].textContent.trim()).equal(
//     "The world’s leading AI-powered developer platform.",
//   );
// });

// test("It should correctly return partial text containing HTML nodes", () => {
//   // SETUP
  // const note = {
  //   color: "#FFFD98",
  //   date: 1705006437056,
  //   htmlContent:
  //     "It's often used for multimedia files like images, audio, and video. Examples include <strong>JPEG</strong> for images, <strong>MP3</strong> for audio or <strong>MP4</strong> for video.",
  //   id: 1705006437056,
  //   origin: "https://dev.to",
  //   textContent:
  //     "It's often used for multimedia files like images, audio, and video. Examples include JPEG for images, MP3 for audio or MP4 for video.",
  //   url: "https://dev.to/joelbonetr/cs-fundamentals-how-data-storage-actually-works-1o4a",
  // };

//   // ACT
//   const result = findParentNode(jsdom.window.document.body, note);

//   // It's expected that each part to be broken up into a node
//   // ASSERT
//   expect(result.length).equal(7);
//   expect(result[0].textContent).equal(
//     " This sacrifices some data to achieve higher compression ratios. It's often used for multimedia files like images, audio, and video. Examples include ",
//   );
//   expect(result[3].textContent).equal("MP3");
//   expect(result[6].textContent.trim()).equal("for video.");
// });
