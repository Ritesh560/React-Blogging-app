import React, { useContext } from "react"
import { Link } from "react-router-dom"
import HeaderLoggedIn from "./HeaderLoggedIn"
import StateContext from "../StateContext"

function Header(props) {
  const appState = useContext(StateContext)

  return (
    <header className="header-bar bg-primary mb-3 sticky-top">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            BlogHub
          </Link>
        </h4>
        {appState.loggedIn && (
          <div className="d-flex align-items-center">
            <HeaderLoggedIn />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
