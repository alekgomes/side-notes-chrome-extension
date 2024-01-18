/**
 * @jest-environment jsdom
 */

import { beforeEach, expect, test, vi } from "vitest";
import wrapTextWithSpan from "../addMarkup";
import { findParentNode } from "../../utils";
import { JSDOM } from "jsdom";
import addMarkup from "../addMarkup";

let jsdom;

beforeEach(function createDOM() {
  // DOM string based on Github's landing page
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

test("Works with whole single element", () => {
  // SETUP
  const note = {
    color: "#FFFD98",
    date: 1703866304019,
    htmlContent:
      '<span style="font-size: 1.2em">Let’s build from&nbsp;here</span>',
    id: 1703866304019,
    origin: "https://github.com",
    textContent: "Let’s build from here",
    url: "https://github.com/",
  };

  const foundElement = findParentNode(jsdom.window.document.body, note);
  const node = addMarkup(foundElement, note);

  const mark = node.querySelector("mark");

  expect(mark.textContent).equal(note.textContent);
});

test("Should correctly wrap only couple of words within element", () => {
  // SETUP
  const note = {
    color: "#FFFD98",
    date: 1704582419815,
    htmlContent:
      '<p class="f2-mktg text-normal color-fg-muted mb-3 mb-md-10 position-relative z-1">\n          The world’s leading AI-powered developer platform.\n        </p>',
    id: 1704582419815,
    origin: "https://github.com",
    textContent: "The world’s leading",
    url: "https://github.com/",
  };

  // ACT
  const foundElement = findParentNode(jsdom.window.document.body, note);
  const parent = wrapTextWithSpan(foundElement, note);
  const mark = parent.querySelector("MARK");
  // ASSERT
  expect(mark).toBeTruthy();
  expect(mark.textContent).toBe(note.textContent);
});

test("Should entirely wrap contiguous HTML nodes", () => {
  // SETUP
  const note = {
    color: "#FFFD98",
    date: 1704915673681,
    htmlContent:
      '<h1 class="h0-mktg mb-3 position-relative z-2"><span style="font-size: 1.2em">Let’s build from&nbsp;here</span>\n        </h1>\n\n        <p class="f2-mktg text-normal color-fg-muted mb-3 mb-md-10 position-relative z-1">\n          The world’s leading AI-powered developer platform.</p>',
    id: 1704915673681,
    origin: "https://github.com",
    textContent:
      "Let’s build from here\nThe world’s leading AI-powered developer platform.",
    url: "https://github.com/",
  };

  // ACT
  const foundElement = findParentNode(jsdom.window.document.body, note);
  const parent = wrapTextWithSpan(foundElement, note);
  const mark = parent.querySelector("MARK");

  console.log(mark.textContent);

  // ASSERT
  expect(mark).toBeTruthy();
  expect(mark.textContent).toBe(note.textContent);
});

test("Should correctly wrap text with <strong> element", () => {
  // SETUP
  const note = {
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

  // ACT
  const foundElement = findParentNode(jsdom.window.document.body, note);
  wrapTextWithSpan(foundElement, note);

  // ASSERT
  expect(jsdom.window.document.querySelector("MARK").textContent).toBe(
    note.textContent,
  );
});

test("Should correctly wraps text that spans through multiples tags", () => {
  // SETUP
  const note = {
    textContent: "This text should be wrapped",
    htmlContent: "This text should be wrapped",
  };

  const domString = `
    <body>
      <section>
        <p>This text <strong>should</strong> be wrapped</p>
      </section>
    </body>
  `;

  const jsdom = new JSDOM(domString, {
    url: "http://localhost:3000",
    contentType: "text/html",
    includeNodeLocations: true,
  });

  // ACT
  wrapTextWithSpan(jsdom.window.document.body, note);

  // ASSERT
  expect(jsdom.window.document.querySelector("MARK")).toBeTruthy();
  expect(jsdom.window.document.querySelector("MARK").textContent).toContain(
    "This text should be wrapped",
  );
});

  
