import React, { useContext } from "react"
import { Link } from "react-router-dom"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import ReactTooltip from "react-tooltip"
import { LogOut } from "../libs/assets/icons"

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  function HandelLoggedOut() {
    appDispatch({ type: "logout" })
  }

  function handelSearch(e) {
    e.preventDefault()
    appDispatch({ type: "openSearch" })
  }

  return (
    <div className="d-flex align-items-center my-3 my-md-0">
      <a data-for="search" data-tip="Search" onClick={handelSearch} href="#" className="text-white mr-4 header-search-icon">
        <i className="fas fa-search fa-lg"></i>
      </a>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
      <span data-for="chat" data-tip="Chat" className="mr-2 text-white header-chat-icon d-flex align-items-center">
        <i className="fas fa-comment fa-lg"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
      <Link data-for="profile" data-tip="My Profile" to={`/profile/${appState.user.username}`} className="mr-4 d-flex align-items-center">
        <img className="small-header-avatar" src={appState.user.avatar} />
      </Link>
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />{" "}
      <Link className="btn btn-sm btn-success mr-4" to="/create-post">
        Create Post
      </Link>{" "}
      <LogOut onClick={HandelLoggedOut} data-for="logout" data-tip="logout" className="pointer" />
      <ReactTooltip place="bottom" id="logout" className="custom-tooltip" />
    </div>
  )
}

export default HeaderLoggedIn
