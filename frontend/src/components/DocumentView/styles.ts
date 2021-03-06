import styled from "styled-components"

type DocumentContainerProps = {
  showScrollbars: boolean
}

export const DocumentContainer = styled.div<DocumentContainerProps>`
  margin: 3rem auto 0 auto;
  height: calc(100vh - 3rem);
  width: 100vw;
  overflow: ${(props): string => (props.showScrollbars ? "scroll" : "hidden")};
`

type PageContainerProp = {
  disablePan: boolean
  scale: number
  mouseDown: boolean
}

export const PageContainer = styled.div.attrs((props: PageContainerProp) => {
  const transform = `scale(${props.scale})`

  let cursor = "default"
  if (props.scale > 1 && !props.disablePan) {
    cursor = props.mouseDown ? "grabbing" : "grab"
  }

  return {
    style: {
      cursor,
      transform,
    },
  }
})<PageContainerProp>`
  box-sizing: border-box;
  margin: auto;
  padding: 2rem;
  height: 100%;
  display: flex;
  transform-origin: top left;
`

export const Page = styled.img`
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  background-color: white;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.25);
`
