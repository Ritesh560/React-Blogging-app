import React, { useContext } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import ReactTooltip from "react-tooltip"
import { LogOut } from "../libs/assets/icons"

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  function handleLoggedOut() {
    appDispatch({ type: "logout" })
  }

  function handleSearch(e) {
    e.preventDefault()
    appDispatch({ type: "openSearch" })
  }

  return (
    <div className="d-flex align-items-center my-3 my-md-0">
      <div className="mr-4">
        <div data-for="search" data-tip="Search" onClick={handleSearch} className="text-white header-search-icon relative pointer">
          {/* Replace with your search icon */}
          <i className="fas fa-search fa-lg"></i>
        </div>
        <ReactTooltip place="bottom" id="search" className="custom-tooltip" />
      </div>
      {/* <span
        data-for="chat"
        data-tip="Chat"
        className="mr-2 text-white header-chat-icon d-flex align-items-center"
      >
        <i className="fas fa-comment fa-lg"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" /> */}
      <div className="mr-4">
        <Link to={`/profile/${appState.user.username}`} data-for="profile" data-tip="My Profile" className="d-flex align-items-center">
          <img className="small-header-avatar" src={appState.user.avatar} alt="Avatar" />
        </Link>
        <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
      </div>
      {/* <Link className="btn btn-sm btn-success mr-4" to="/create-post">
        <i className="fas fa-plus"></i> Create Post
      </Link> */}
      <div>
        <LogOut onClick={handleLoggedOut} data-for="logout" data-tip="Logout" className="pointer" />
        <ReactTooltip place="bottom" id="logout" className="custom-tooltip" />
      </div>
    </div>
  )
}

export default HeaderLoggedIn
