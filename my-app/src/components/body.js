import React, { useContext, useState } from "react"
import Page from "./page"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import Spinner from "../libs/components/Spinner/Spinner"

function Body() {
  const [username, setUsername] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const appDispatch = useContext(DispatchContext)

  async function HandleSubmit(e) {
    e.preventDefault()
    if (loading) return

    if (!isLogin) {
      try {
        setLoading(true)
        const response = await Axios.post("/register", { username, email, password })
        setIsLogin(true)
        appDispatch({ type: "login", data: response.data })
        setLoading(false)
      } catch (e) {
        setLoading(false)
        console.log("errorrrr")
      }
    } else {
      try {
        setLoading(true)
        const response = await Axios.post("/login", { username, password })
        if (response.data) {
          appDispatch({ type: "login", data: response.data })
          setLoading(false)
        } else {
          console.log("incorrect Username/Password")
          setLoading(false)
        }
      } catch (e) {
        console.log("error in logging in")
      }
    }
  }

  return (
    <>
      <Page wide="true" title="Welcome">
        <div className="row align-items-center justify-content-center ">
          <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5 p-5 shadowed-background">
            <form onSubmit={HandleSubmit}>
              <div className="form-group">
                <label htmlFor="username-register" className="text-dark mb-1 h5">
                  <small>Username</small>
                </label>
                <input onChange={(e) => setUsername(e.target.value)} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" />
              </div>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="email-register" className="text-dark mb-1 h5">
                    <small>Email</small>
                  </label>
                  <input onChange={(e) => setEmail(e.target.value)} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="password-register" className="text-dark mb-1 h5">
                  <small>Password</small>
                </label>
                <input onChange={(e) => setPassword(e.target.value)} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
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
    </>
  )
}

export default Body
