import "./App.css"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import React, { useState, useContext, useReducer, useEffect } from "react"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// ------  My components -------
import Header from "./components/header"
import Body from "./components/body"
import Home from "./components/home"
import Footer from "./components/footer"
import About from "./components/about"
import Terms from "./components/terms"
import CreatePost from "./components/createPost"
import ViewSinglePost from "./components/viewSinglePost"
import FlashMessages from "./components/flashMessages"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import PageNotFound from "./components/pageNotFound"
import Search from "./components/search"

import Axios from "axios"
Axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexAppToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexAppToken"),
      username: localStorage.getItem("complexAppUsername"),
      avatar: localStorage.getItem("complexAppAvatar"),
    },
    isSearching: false,
  }

  function ourReducer(draft, action) {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
      case "openSearch":
        draft.isSearching = true
        return
      case "closeSearch":
        draft.isSearching = false
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexAppToken", state.user.token)
      localStorage.setItem("complexAppUsername", state.user.username)
      localStorage.setItem("complexAppAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("complexAppToken")
      localStorage.removeItem("complexAppUsername")
      localStorage.removeItem("complexAppAvatar")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <Body />}
            </Route>
            <Route path="/about-us">
              <About />
            </Route>
            <Route path="/profile/:username">
              <Profile />
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route path="/post/:id" exact>
              <ViewSinglePost />
            </Route>
            <Route path="/post/:id/edit" exact>
              <EditPost />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route>
              <PageNotFound />
            </Route>
          </Switch>
          <CSSTransition timeout={330} in={state.isSearching} classNames="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
