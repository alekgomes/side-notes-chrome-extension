/**
 * @jest-environment jsdom
 */

import { expect, test, vi } from "vitest"
import createHoverBox from "../createHoverBox"
import { JSDOM } from "jsdom"
import { fireEvent } from "@testing-library/dom"
import handleColorPickerClick from "../handleColorPickerClick"

const note = {
  htmlContent: "This <strong>is</strong> a note",
  textContent: "This is a note",
}

const domString = `
  <p>
    <mark>${note.htmlContent}</mark>
  </p>
`
const jsdom = new JSDOM(domString, {
  url: "http://localhost:3000",
  contentType: "text/html",
  includeNodeLocations: true,
})

vi.mock("../handleColorPickerClick")

const chromeMock = {
  runtime: {
    getURL: vi.fn(),
  },
}

vi.stubGlobal("chrome", chromeMock)

test("It should return div with the three icons inside", () => {
  // SETUP
  const highlightNode = jsdom.window.document.querySelector("mark")
  // ACT
  const hoverBox = createHoverBox(highlightNode, note)
  // ASSERT
  const icons = hoverBox.querySelectorAll("img")
  expect(icons.length).toBe(3)
})

test("Click the color-picker icon should call the handler", () => {
  // SETUP
  const highlightNode = jsdom.window.document.querySelector("mark")
  const hoverBox = createHoverBox(highlightNode, note)

  // ACT
  const colorPicker = hoverBox.querySelector(".gg-color-picker")

  fireEvent.click(colorPicker)

  // ASSERT
  expect(handleColorPickerClick).toHaveBeenCalledOnce()
})
