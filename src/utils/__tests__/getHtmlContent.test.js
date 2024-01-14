/**
 * @jest-environment jsdom
 */

import { beforeEach, expect, test, vi } from "vitest"
import { JSDOM } from "jsdom"
import getHtmlContent from '../getHtmlContent'

let domString
let jsdom

beforeEach(function createDOM() {
  // DOM string based on Github's landing page
  domString = 
  `
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
  </div>
  `

  jsdom = new JSDOM(domString, {
    url: "http://localhost:3000",
    contentType: "text/html",
    includeNodeLocations: true,
  })
})

test('Should return correct HTML for single element selection', () => {
  // SETUP
  // Creates Selection around span
  
  const span = jsdom.window.document.querySelector('span')
  const selection = jsdom.window.getSelection()
  const range = jsdom.window.document.createRange()

  range.setStartBefore(span)
  range.setEndAfter(span)
  selection.addRange(range)  
  

  // ACTION
  const nodes = getHtmlContent(jsdom)

  // ASSERT
  expect(nodes).toBe(`<span style="font-size: 1.2em">Let’s build from&nbsp;here</span>`)
})

test('Should return correct HTML for sibling element selection', () => {
  // SETUP
  // Creates Selection around H1 and P   
  const h1 = jsdom.window.document.querySelector('h1.h0-mktg.mb-2.position-relative.z-2')
  const p = jsdom.window.document.querySelector('p.f2-mktg.text-normal.color-fg-muted.mb-3.mb-md-10.position-relative.z-1')
  const selection = jsdom.window.getSelection()
  const range = jsdom.window.document.createRange()  
  range.setStartBefore(h1)
  range.setEndAfter(p)
  selection.addRange(range)
  // ACTION
  const nodes = getHtmlContent(jsdom)  
  // ASSERT
  expect(nodes).toBe(`<h1 class="h0-mktg mb-2 position-relative z-2"><span style="font-size: 1.2em">Let’s build from&nbsp;here</span></h1>
    <p class="f2-mktg text-normal color-fg-muted mb-3 mb-md-10 position-relative z-1">
      The world’s leading AI-powered developer platform.
    </p>`
  )  
})

