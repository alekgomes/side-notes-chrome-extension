/**
 * @jest-environment jsdom
 */

import { expect, test } from "vitest"
import wrapTextWithSpan, { findParentNode } from "../wrapTextWithSpan"
import { JSDOM } from "jsdom"

test("Should return the correct parent node of the provided text", () => {
  // SETUP
  const note = {
    textContent: "this text should be wrapped",
  }

  const domString = `
      <body>
        <section>
          <p>It's a little tricky to find texts</p>
          <p>All of this text should be wrapped but there's more here than only that</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eius, dolorum temporibus commodi dignissimos dolor deserunt iste optio, nulla, impedit voluptates in provident tempore. Nam sed minima itaque ex fugit.</p>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quos deserunt quisquam, nesciunt voluptate tempora in quod saepe quibusdam facere eveniet, aliquid fugiat distinctio dignissimos alias tempore dolores laborum exercitationem quaerat!
          Itaque quo sunt qui officiis maiores. Veniam quaerat voluptas eos neque, aut sit doloremque dolorum molestias beatae ut ipsam, harum sed quibusdam et voluptatem deleniti aspernatur molestiae quas aliquid quisquam.</p>
        </section>
      </body>
    `

  const jsdom = new JSDOM(domString, {
    url: "http://localhost:3000",
    contentType: "text/html",
    includeNodeLocations: true,
  })

  // ACT
  const res = findParentNode(jsdom.window.document.body, note)

  // ASSERT
  expect(res.textContent).toBe(
    "All of this text should be wrapped but there's more here than only that"
  )
})

test("Should correctly wrap only couple of words within element", () => {
  // SETUP
  const note = {
    textContent: "text should",
    htmlContent: "text should",
  }

  const domString = `
    <body>
      <section>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga quod dolorum maxime sint corrupti accusamus praesentium iure ullam? Laboriosam, ipsum beatae! Illo magni neque possimus praesentium vel eum ut dolores?</p>
        <p>This text should be wrapped</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat velit ipsam impedit possimus deserunt? Alias odit rerum iusto earum ducimus, facere optio fugiat magni temporibus, quibusdam recusandae asperiores impedit ipsam!</p>
      </section>
    </body>
  `

  const jsdom = new JSDOM(domString, {
    url: "http://localhost:3000",
    contentType: "text/html",
    includeNodeLocations: true,
  })

  // ACT
  wrapTextWithSpan(jsdom.window.document.body, note)

  // ASSERT
  expect(jsdom.window.document.querySelector("MARK")).toBeTruthy()
  expect(jsdom.window.document.querySelector("MARK").textContent).toBe(
    "text should"
  )
})

test("Should wrap contiguous text", () => {
  // SETUP
  const note = {
    textContent: "This text should be wrapped",
    htmlContent: "This text should be wrapped",
  }

  const domString = `
    <body>
      <section>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga quod dolorum maxime sint corrupti accusamus praesentium iure ullam? Laboriosam, ipsum beatae! Illo magni neque possimus praesentium vel eum ut dolores?</p>
        <p>This text should be wrapped</p>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat velit ipsam impedit possimus deserunt? Alias odit rerum iusto earum ducimus, facere optio fugiat magni temporibus, quibusdam recusandae asperiores impedit ipsam!</p>
      </section>
    </body>
  `

  const jsdom = new JSDOM(domString, {
    url: "http://localhost:3000",
    contentType: "text/html",
    includeNodeLocations: true,
  })

  // ACT
  wrapTextWithSpan(jsdom.window.document.body, note)

  // ASSERT
  expect(jsdom.window.document.querySelector("MARK")).toBeTruthy()
  expect(jsdom.window.document.querySelector("MARK").textContent).contains(
    "This text should be wrapped"
  )
})

test("Should correctly wraps text that spans through multiples tags", () => {
  // SETUP
  const note = {
    textContent: "This text should be wrapped",
    htmlContent: "This text should be wrapped",
  }

  const domString = `
    <body>
      <section>
        <p>This text <strong>should</strong> be wrapped</p>
      </section>
    </body>
  `

  const jsdom = new JSDOM(domString, {
    url: "http://localhost:3000",
    contentType: "text/html",
    includeNodeLocations: true,
  })

  // ACT
  wrapTextWithSpan(jsdom.window.document.body, note)

  // ASSERT
  expect(jsdom.window.document.querySelector("MARK")).toBeTruthy()
  expect(jsdom.window.document.querySelector("MARK").textContent).toContain(
    "This text should be wrapped"
  )
})

test("Should wrap text and keep its previous styling", () => {
  // SETUP
  const note = {
    htmlContent: "all of this this text <strong>should</strong> be wrapped",
    textContent: "all of this this text should be wrapped",
    id: 13123123332,
  }

  const domString = `
    <body>
      <section>
        <p>Almost all of this this text <strong>should</strong> be wrapped</p>
      </section>
    </body>
  `

  const jsdom = new JSDOM(domString, {
    url: "http://localhost:3000",
    contentType: "text/html",
    includeNodeLocations: true,
  })

  // ACT
  wrapTextWithSpan(jsdom.window.document.body, note)

  // ASSERT
  expect(jsdom.window.document.querySelector("MARK")).toBeTruthy()
  expect(jsdom.window.document.querySelector("strong").textContent).toBe(
    "should"
  )
})
