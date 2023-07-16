import React, { useEffect, useContext, useState } from "react"
import Page from "./Page"
import { useImmerReducer } from "use-immer"
import { CSSTransition } from "react-transition-group"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import Spinner from "../libs/components/Spinner/Spinner"

function HomeGuest() {
  const appDispatch = useContext(DispatchContext)
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErrors: false,
      message: "",
    },
    submitCount: 0,
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true
          draft.username.message = "Username cannot exceed 30 characters."
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = "Username can only contain letters and numbers."
        }
        return
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "Username must be at least 3 characters."
        }
        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++
        }
        return
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = "That username is already taken."
        } else {
          draft.username.isUnique = true
        }
        return
      case "emailImmediately":
        draft.email.hasErrors = false
        draft.email.value = action.value
        return
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide a valid email address."
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++
        }
        return
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = "That email is already being used."
        } else {
          draft.email.isUnique = true
        }
        return
      case "passwordImmediately":
        draft.password.hasErrors = false
        draft.password.value = action.value
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true
          draft.password.message = "Passwod cannot exceed 50 characters."
        }
        return
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true
          draft.password.message = "Password must be at least 12 characters."
        }
        return
      case "submitForm":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++
        } else if (isLogin && draft.username.value && draft.password.value && !loading) {
          draft.submitCount++
        }
        return
      default:
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    if (state.username.checkCount && !isLogin) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value }, { cancelToken: ourRequest.token })
          dispatch({ type: "usernameUniqueResults", value: response.data })
        } catch (error) {
          console.log(error.response.data)
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.username.checkCount])

  useEffect(() => {
    if (state.email.checkCount && !isLogin) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesEmailExist", { email: state.email.value }, { cancelToken: ourRequest.token })
          dispatch({ type: "emailUniqueResults", value: response.data })
        } catch (error) {
          console.log(error.response.data)
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.email.checkCount])

  useEffect(() => {
    if (state.submitCount) {
      setLoading(true)
      const ourRequest = Axios.CancelToken.source()
      if (!isLogin) {
        async function fetchResults() {
          try {
            const response = await Axios.post("/register", { username: state.username.value, email: state.email.value, password: state.password.value }, { cancelToken: ourRequest.token })
            appDispatch({ type: "login", data: response.data })
            appDispatch({ type: "flashMessage", value: "Congrats! Welcome to your new account." })
            setLoading(false)
          } catch (error) {
            console.log(error.response.data)
            setLoading(false)
          }
        }
        fetchResults()
      } else {
        try {
          const handleLogin = async () => {
            const response = await Axios.post("/login", { username: state.username.value, password: state.password.value }, { cancelToken: ourRequest.token })
            if (response.data) {
              appDispatch({ type: "login", data: response.data })
              appDispatch({ type: "flashMessage", value: "You have successfully logged in." })
              setLoading(false)
            } else {
              console.log("Incorrect username / password: " + response.data)
              appDispatch({ type: "flashMessage", value: "Invalid username or password." })
              setLoading(false)
            }
          }
          handleLogin()
        } catch (error) {
          console.log(error.response.data)
          setLoading(false)
        }
      }
      return () => ourRequest.cancel()
    }
  }, [state.submitCount])

  function handleSubmit(event) {
    event.preventDefault()
    dispatch({ type: "usernameImmediately", value: state.username.value })
    dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true })
    dispatch({ type: "emailImmediately", value: state.email.value })
    dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true })
    dispatch({ type: "passwordImmediately", value: state.password.value })
    dispatch({ type: "passwordAfterDelay", value: state.password.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <Page title="Welcome!" wide={true}>
      <div className="row align-items-center justify-content-center ">
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5 p-5 shadowed-background">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-dark mb-1 h5">
                <small>Username</small>
              </label>
              <input onChange={(event) => dispatch({ type: "usernameImmediately", value: event.target.value })} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
              {!isLogin && (
                <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
                </CSSTransition>
              )}
            </div>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="email-register" className="text-dark mb-1 h5">
                  <small>Email</small>
                </label>
                <input onChange={(event) => dispatch({ type: "emailImmediately", value: event.target.value })} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
                <CSSTransition in={state.email.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.email.message}</div>
                </CSSTransition>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="password-register" className="text-dark mb-1 h5">
                <small>Password</small>
              </label>
              <input onChange={(event) => dispatch({ type: "passwordImmediately", value: event.target.value })} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
              {!isLogin && (
                <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
                </CSSTransition>
              )}
            </div>
            <button type="submit" className="py-2.5 mt-4 btn btn-lg btn-block action-button">
              {loading ? <Spinner /> : `Sign ${isLogin ? "in" : "up"}`}
            </button>
            <div onClick={() => setIsLogin((prev) => !prev)} className="text-right small text-primary mt-2 pointer" style={{ textDecoration: "underline" }}>
              {isLogin ? "New user? Register here" : "Already have an account? Login here"}
            </div>
          </form>
        </div>
      </div>
    </Page>
  )
}

export default HomeGuest
