import styled from "styled-components"
export const HoverBox = styled.div`
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

export const StyledHighlight = styled.span`
  background-color: red;
  position: relative;

  &:hover .hoverBox {
    scale: 1;
  }
`
