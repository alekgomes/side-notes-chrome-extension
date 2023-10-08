/**
 * @jest-environment jsdom
 */

import { expect, test, vi } from "vitest"
import deleteNote from "../deleteNote"
import removeHighlightFromDeletedNote from "../removeHighlightFromDeletedNote"

const finalStorage = [
  {
    color: "#FFFD98",
    date: 1696693699728,
    htmlContent: "I have one for you all.",
    id: 1696693699728,
    origin: "https://dev.to",
    textContent: "I have one for you all.",
    url: "https://dev.to/sarthology/internet-and-shadow-groups-14bo",
  },
]

const chromeMock = {
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
}

vi.stubGlobal("chrome", chromeMock)

const mockGet = vi
  .spyOn(window.chrome.storage.local, "get")
  .mockImplementation(() => finalStorage)
const mockSet = vi.spyOn(window.chrome.storage.local, "set")

vi.mock("../removeHighlightFromDeletedNote")

test("Should call chrome.storage.local.get", () => {
  // SETUP
  const note = {
    color: "#FFFD98",
    date: 1696693758045,
    htmlContent: "And to where, you might wonder...",
    id: 1696693758045,
    origin: "https://dev.to",
    textContent: "And to where, you might wonder...",
    url: "https://dev.to/sarthology/internet-and-shadow-groups-14bo",
  }
  // ACT
  deleteNote(note)

  // ASSERT
  expect(mockGet).toBeCalled()
  expect(mockSet).toBeCalledWith({ "https://dev.to": finalStorage })
  expect(removeHighlightFromDeletedNote).toBeCalled()
})
