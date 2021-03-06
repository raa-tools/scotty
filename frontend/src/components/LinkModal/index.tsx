import React, { ReactElement, FC, useRef, useEffect, useState } from "react"

import { Island, ModalCover } from "../globalStyles"
import {
  LinkInput,
  InputContainer,
  OKButton,
  Title,
  Body,
  CopyButton,
} from "./styles"

type PropTypes = {
  link: string
}

const LinkModal: FC<PropTypes> = ({ link }): ReactElement => {
  const [show, setShow] = useState(true)
  const handleOK = (): void => {
    setShow(false)
  }

  const inputRef = useRef(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleFocus = (): void => {
    inputRef.current.select()
  }

  const handleCopy = (): void => {
    inputRef.current.select()
    document.execCommand("copy")
  }

  const renderModal = (): ReactElement => {
    return (
      <ModalCover>
        <Island>
          <Title>Greetings Earthling</Title>
          <Body>
            You’re all set! Copy and share the following link to invite others
            to view this document.
          </Body>

          <InputContainer>
            <LinkInput
              ref={inputRef}
              readOnly
              value={link}
              onFocus={handleFocus}
            />
            <CopyButton
              width="2.25rem"
              height="2.25rem"
              image="/static/icons/copyPasteboard.svg"
              imageHover="/static/icons/copyPasteboardLight.svg"
              imageActive="/static/icons/copyPasteboardLight.svg"
              onClick={handleCopy}
            />
          </InputContainer>

          <OKButton onClick={handleOK}>OK</OKButton>
        </Island>
      </ModalCover>
    )
  }

  return show ? renderModal() : null
}

export default LinkModal
