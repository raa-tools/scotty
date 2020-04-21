import React, { useState, useEffect, ReactElement } from "react"
import { RouteComponentProps, useHistory, withRouter } from "react-router-dom"
import randomColor from "randomcolor"

// Utils, etc.
import {
  RoomData,
  JoinRoomData,
  MouseMoveData,
  SyncDocData,
  SyncPageData,
  User,
  UsersData,
} from "../../../../backend/src/sockets/types"
import socket from "../../socket"
import roundTo from "../../utils/roundTo"

// Components
import NavBar, { PageOption } from "./NavBar"
import Pointer from "../Pointer"
import { LocationState } from "../Home"
import LinkModal from "../LinkModal"
import DocumentView from "../DocumentView"

import { RoomBackground } from "./styles"

const roundTo3 = roundTo(3)
enum ZOOMLIMIT {
  MIN = 1,
  MAX = 5,
}

interface PropTypes extends RouteComponentProps {
  id: string
  filename: string
}

const Room: React.FC<PropTypes> = ({
  id,
  filename,
  location,
}): ReactElement => {
  const [pageNum, setPageNum] = useState(1)
  const handleChangePage = (option: PageOption): void => {
    const { offset, goto } = option
    setPageNum(current => {
      let newPageNum: number
      if (offset) {
        newPageNum = current + offset
      } else if (goto) {
        newPageNum = goto
      }

      if (newPageNum <= pages.length && newPageNum >= 1) {
        socket.emit("client change page", { roomID: id, pageNum: newPageNum })
        return newPageNum
      }

      return current
    })
  }

  const [scale, setScale] = useState(1)
  const handleZoom = (offset: number): void => {
    console.log(offset, ZOOMLIMIT.MIN)
    setScale(prev => {
      return prev + offset < ZOOMLIMIT.MIN || prev + offset > ZOOMLIMIT.MAX
        ? prev
        : prev + offset
    })
  }

  const handleMouseMove = (ev?: MouseEvent): void => {
    const mouseX: number = ev ? roundTo3(ev.clientX / windowWidth) : null
    const mouseY: number = ev ? roundTo3(ev.clientY / windowHeight) : null

    const mouseMoveData: MouseMoveData = {
      roomID: id,
      mouseX,
      mouseY,
    }

    socket.emit("mousemove", mouseMoveData)
  }

  const [windowWidth, setWindowWidth] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const handleWindowResize = (): void => {
    setWindowWidth(window.innerWidth)
    setWindowHeight(window.innerHeight)
  }

  const [pointerColor, setPointerColor] = useState("")
  const [pages, setPages] = useState([])
  const [userID, setUserID] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [pdfUrl, setPdfUrl] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    const color = randomColor({ luminosity: "bright" })
    setPointerColor(color)

    const joinRoomData: JoinRoomData = { roomID: id, pointerColor: color }
    socket.emit("join room", joinRoomData)

    socket.on("sync document", (data: SyncDocData): void => {
      setUserID(data.userID)
      setPdfUrl(data.pdfUrl)
      setPages(data.pages)
    })

    socket.on("sync page", (data: SyncPageData): void => {
      setPageNum(data.pageNum)
    })

    socket.on("update users", (data: UsersData): void => {
      setUsers(data.users)
    })

    socket.on("error", (data: Error): void => {
      setError(data.message)
    })

    handleWindowResize()
    window.addEventListener("resize", handleWindowResize)

    return (): void => {
      socket.off("sync document")
      socket.off("sync page")
      socket.off("update users")
      socket.off("error")
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  const [showMouse, setShowMouse] = useState(false)
  useEffect(() => {
    if (showMouse) {
      document.addEventListener("mousemove", handleMouseMove)
    } else {
      handleMouseMove()
    }

    return (): void => {
      document.removeEventListener("mousemove", handleMouseMove)
    }
  }, [showMouse])

  const handlePointerToggle = (): void => {
    setShowMouse(prev => !prev)
  }

  const history = useHistory()
  const handleClose = (): void => {
    const leaveRoomData: RoomData = { roomID: id }
    socket.emit("leave room", leaveRoomData)
    history.push("/")
  }

  const renderPointers = (): ReactElement => {
    return (
      <>
        {users.map(user => {
          if (user.id !== userID && user.mouseX && user.mouseY) {
            return (
              <Pointer
                key={user.id}
                x={user.mouseX * windowWidth}
                y={user.mouseY * windowHeight}
                color={user.pointerColor}
              />
            )
          }
        })}
      </>
    )
  }

  const renderModal = (): ReactElement => {
    if (!location?.state) return null
    return (location.state as LocationState).host ? (
      <LinkModal link={window.location.toString()} />
    ) : null
  }

  const renderRoom = (): ReactElement => {
    return (
      <RoomBackground>
        {renderModal()}
        {renderPointers()}
        <NavBar
          pageNum={pageNum}
          maxPage={pages.length}
          filename={filename}
          users={users}
          showMouse={showMouse}
          pointerColor={pointerColor}
          handleChangePage={handleChangePage}
          handleZoom={handleZoom}
          handleClose={handleClose}
          handlePointerToggle={handlePointerToggle}
        />
        {pdfUrl ? (
          <DocumentView src={`${pdfUrl}/${pages[pageNum - 1]}`} scale={scale} />
        ) : null}
      </RoomBackground>
    )
  }

  return <div>{error ? `ERROR: ${error}` : renderRoom()}</div>
}

export default withRouter(Room) as any
