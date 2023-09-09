import React from "preact/compat"
import { StyledHighlight, HoverBox } from "./styles"

const Highlight: React.FC = ({ children }) => {
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

export default Highlight
