import { render, h } from "preact"
import styled from "styled-components"
import { useEffect } from "preact/hooks"

const HoverBox = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  width: 250px;
  top: 0;
  right: 0;
  scale: 0;
  z-index: 199;
  transform: translateY(-100%);
  transform-origin: center;
  background-color: rgba(255, 255, 255, 0.8);
  transition: scale 250ms cubic-bezier(0.86, 0, 0.07, 1);

  i {
    cursor: pointer;
  }
`

const StyledHighlight = styled.span`
  background-color: red;
  position: relative;

  &:hover .hoverBox {
    scale: 1;
  }
`

const Highlight = ({ children }) => {
  return (
    <StyledHighlight>
      <HoverBox className="hoverBox">
        <i className="gg-trash" />
        <i className="gg-color-picker" />
      </HoverBox>
      {children}
    </StyledHighlight>
  )
}

function wrapTextWithSpan(rootNode, note) {
  const stack = [rootNode]

  while (stack.length > 0) {
    const node = stack.pop()

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent
      const index = text.indexOf(note.content)
      if (index !== -1) {
        const beforeText = text.substring(0, index)
        const afterText = text.substring(index + note.content.length)

        const HighlightNode = () => (
          <>
            {beforeText}
            <Highlight>{note.content}</Highlight>
            {afterText}
          </>
        )
        render(<HighlightNode />, node.parentNode)
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const children = node.childNodes
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
}

const scrollToClicked = (note: any) => {
  if (note.clicked) {
    const element = document.querySelector(`[data-sidenotes="${note.data}"]`)
    element?.scrollIntoView({ block: "center" })
  }
}

const App = () => {
  useEffect(() => {
    chrome.storage.local.get(function (result) {
      if (result.hasOwnProperty(window.origin)) {
        result[window.origin].map((note: any) => {
          wrapTextWithSpan(document.body, note)
          scrollToClicked(note)
        })
      }
    })
  }, [])
}

export default App
