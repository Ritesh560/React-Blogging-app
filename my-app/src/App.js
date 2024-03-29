import "./App.css"
import "./common/common.css"
import React, { useEffect, Suspense } from "react"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import Axios from "axios"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// My Components
import LoadingDotsIcon from "./components/LoadingDotsIcon"
import FlashMessages from "./components/FlashMessages"
import Header from "./components/Header"
import Home from "./components/Home"
import HomeGuest from "./components/HomeGuest"
import Profile from "./components/Profile"
import EditPost from "./components/EditPost"
import About from "./components/About"
import Terms from "./components/Terms"
import NotFound from "./components/NotFound"
import Footer from "./components/Footer"

Axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL || ""

const CreatePost = React.lazy(() => import("./components/CreatePost"))
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"))
const Search = React.lazy(() => import("./components/Search"))
const Chat = React.lazy(() => import("./components/Chat"))

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("BlogHubToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("BlogHubToken"),
      username: localStorage.getItem("BlogHubUsername"),
      avatar: localStorage.getItem("BlogHubAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  }

  function ourReducer(draft, action) {
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
        draft.isSearchOpen = true
        return
      case "closeSearch":
        draft.isSearchOpen = false
        return
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen
        return
      case "closeChat":
        draft.isChatOpen = false
        return
      case "incrementUnreadChatCount":
        draft.unreadChatCount++
        return
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0
        return
      default:
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("BlogHubToken", state.user.token)
      localStorage.setItem("BlogHubUsername", state.user.username)
      localStorage.setItem("BlogHubAvatar", state.user.avatar)
    } else {
      localStorage.removeItem("BlogHubToken")
      localStorage.removeItem("BlogHubUsername")
      localStorage.removeItem("BlogHubAvatar")
    }
  }, [state.loggedIn])

  // Check if token has expired or not on first render
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/checkToken", { token: state.user.token }, { cancelToken: ourRequest.token })
          if (!response.data) {
            dispatch({ type: "logout" })
            dispatch({ type: "flashMessage", value: "Your session has expired. Please log in again." })
          }
        } catch (error) {
          console.log(error.response.data)
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [])

  return (
    <div className="App">
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          <BrowserRouter>
            <FlashMessages messages={state.flashMessages} />
            <Header />
            <Suspense fallback={<LoadingDotsIcon />}>
              <Switch>
                <Route path="/" exact>
                  {state.loggedIn ? <Home /> : <HomeGuest />}
                </Route>
                <Route path="/profile/:username">
                  <Profile />
                </Route>
                <Route path="/post/:id" exact>
                  <ViewSinglePost />
                </Route>
                <Route path="/post/:id/edit" exact>
                  <EditPost />
                </Route>
                <Route path="/create-post">
                  <CreatePost />
                </Route>
                <Route path="/about-us">
                  <About />
                </Route>
                <Route path="/terms">
                  <Terms />
                </Route>
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Suspense>
            <CSSTransition timeout={330} in={state.isSearchOpen} classNames="search-overlay" unmountOnExit>
              <div className="search-overlay">
                <Suspense fallback="">
                  <Search />
                </Suspense>
              </div>
            </CSSTransition>
            <Suspense fallback="">{state.loggedIn && <Chat />}</Suspense>
            <Footer />
          </BrowserRouter>
        </DispatchContext.Provider>
      </StateContext.Provider>
    </div>
  )
}

export default App
