import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import { useParams, Link, withRouter } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token })
        setPost(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log(error.response.data)
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])

  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username
    }
    return false
  }

  async function deleteHandler() {
    const areYouSure = window.confirm("Do you really want to delete this post?")
    if (areYouSure) {
      try {
        const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } })
        if (response.data === "Success") {
          // 1. display flash message
          appDispatch({ type: "flashMessage", value: "Post was successfully deleted." })
          // 2. redirect back to the current user's profile
          props.history.push(`/profile/${appState.user.username}`)
        }
      } catch (error) {
        console.log(error.response.data)
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <a onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </a>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4 d-flex align-items-center">
        <Link to={`/profile/${post.author.username}`}>
          <span className="user-avatar-sm mr-2">{post.author.username?.[0]}</span>
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`} className="font-weight-bold mx-1">
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className="body-content">{post.body}</div>
    </Page>
  )
}

export default withRouter(ViewSinglePost)
