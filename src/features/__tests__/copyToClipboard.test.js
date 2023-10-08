/**
 * @jest-environment jsdom
 */

import { expect, test, vi } from "vitest"
import copyToClipboard from "../copyToClipboard"

const writeText = vi.fn()

Object.assign(navigator, {
  clipboard: {
    writeText,
  },
})

test("Should copy marked text to clipboard when copy icon is clicked", () => {
  // SETUP
  const note = {
    id: 1696596348926,
    textContent:
      "I was preparing my portfolio for the job hunt and I thought I might need something more.",
  }
  // ACT
  copyToClipboard(note)

  // ASSERT
  expect(navigator.clipboard.writeText).toBeCalledWith(note.textContent)
})
