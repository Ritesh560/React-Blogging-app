import React, { useContext, useEffect } from "react"
import Page from "./Page"
import StateContext from "../StateContext"
import { useImmer } from "use-immer"
import LoadingDotsIcon from "./LoadingDotsIcon"
import Axios from "axios"
import { Link } from "react-router-dom"
import Post from "./Post"

function Home() {
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  })

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchData() {
      try {
        const response = await Axios.post("/getHomeFeed", { token: appState.user.token }, { cancelToken: ourRequest.token })
        setState((draft) => {
          draft.isLoading = false
          draft.feed = response.data
        })
      } catch (error) {
        console.log(error.response.data)
      }
    }
    fetchData()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (state.isLoading) {
    return <LoadingDotsIcon />
  }

  return (
    <Page title="Your Feed">
      {state.feed.length > 0 && (
        <>
          <div className="d-flex justify-content-between">
            <h2 className="text-center mb-4">The Latest Posts on BlogHub.</h2>
            <Link className="btn btn-sm btn-info mr-4 d-flex align-items-center p-2" to="/create-post" style={{ height: "40px", borderRadius: "5px" }}>
              <i className="fas fa-plus"></i> <span className="ml-2">Create Post</span>
            </Link>
          </div>
          <div className="list-group">
            {state.feed.map((post) => {
              return <Post post={post} key={post._id} />
            })}
          </div>
        </>
      )}
      {state.feed.length === 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{appState.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead h3 mt-3 text-muted text-center">Start exploring and connect with other users!</p>
        </>
      )}
    </Page>
  )
}

export default Home
