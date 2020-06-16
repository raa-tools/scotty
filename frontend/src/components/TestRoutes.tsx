import React, { ReactElement } from "react"
import { Route } from "react-router-dom"

import BeamingModal from "./BeamingModal"
import Loading from "./Loading"
import LinkModal from "./LinkModal"
import NavBar from "./NavBar"
import ToolBar from "./ToolBar"
import ZoomBar from "./ZoomBar"
import Room from "./Room"

const TestRoutes = (): ReactElement => {
  return (
    <>
      <Route path="/test/Loading" component={Loading} />

      <Route
        path="/test/BeamingModal"
        render={(): ReactElement => (
          <BeamingModal
            filename="filename.pdf"
            message="Message from server"
            handleTryAgain={(): void => {}}
          />
        )}
      />

      <Route
        path="/test/BeamingModal-error"
        render={(): ReactElement => (
          <BeamingModal
            filename="filename.pdf"
            error="Error message"
            handleTryAgain={(): void => {}}
          />
        )}
      />

      <Route
        path="/test/LinkModal"
        render={(): ReactElement => <LinkModal link="http://testlink.com" />}
      />

      <Route
        path="/test/NavBar"
        render={(): ReactElement => (
          <NavBar
            roomID="1234"
            filename="test"
            users={[]}
            handleClose={(): void => {}}
          />
        )}
      />

      <Route path="/test/ZoomBar" render={(): ReactElement => <ZoomBar />} />

      <Route path="/test/ToolBar" render={(): ReactElement => <ToolBar />} />

      <Route
        path="/test/Room"
        render={(): ReactElement => <Room id="room-test" filename="file.pdf" />}
      />
    </>
  )
}

export default TestRoutes
