import React, { useEffect, useContext } from "react"
import Page from "./page"
import { useParams, Link, withRouter } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

import LoadingDotsIcon from "./LoadingDotsIcon"
import PageNotFound from "./pageNotFound"

function EditPost(props) {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  const origionalState = {
    title: {
      value: "",
      hasError: false,
      message: "",
    },
    body: {
      value: "",
      hasError: false,
      message: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  }

  function ourReducer(draft, action) {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case "fetchComplete":
        draft.title.value = action.value.title
        draft.body.value = action.value.body
        draft.isFetching = false
        return
      case "updateTitle":
        draft.title.hasError = false
        draft.title.value = action.value
        return
      case "updateBody":
        draft.body.hasError = false
        draft.body.value = action.value
        return
      case "submitpost":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCount++
        }
        return
      case "updateRequestStarted":
        draft.isSaving = true
        return
      case "updateRequestFinished":
        draft.isSaving = false
        return
      case "titleRules":
        if (!draft.title.value.trim()) {
          draft.title.hasError = true
          draft.title.message = "Title field is Required"
        }
        return

      case "bodyRules":
        if (!draft.body.value.trim()) {
          draft.body.hasError = true
          draft.body.message = "Body field is Required"
        }
        return
      case "pageNotFound":
        draft.notFound = true
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, origionalState)

  function handelSubmit(e) {
    e.preventDefault()
    dispatch({ type: "titleRules", value: state.title.value })
    dispatch({ type: "bodyRules", value: state.body.value })
    dispatch({ type: "submitpost" })
  }

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`)
        if (response.data) {
          dispatch({ type: "fetchComplete", value: response.data })
          if (appState.user.username !== response.data.author.username) {
            appDispatch({ type: "flashMessage", value: "You do not have permission to edit that post." })
            props.history.push("/")
          }
        } else {
          dispatch({ type: "pageNotFound" })
        }
      } catch (e) {
        console.log("There was an error")
      }
    }
    fetchPost()
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "updateRequestStarted" })

      async function fetchPost() {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token })
          dispatch({ type: "updateRequestFinished" })
          appDispatch({ type: "flashMessage", value: "Post was Updated." })
        } catch (e) {
          console.log("There was an error")
        }
      }
      fetchPost()
    }
  }, [state.sendCount])

  if (state.notFound) {
    return <PageNotFound />
  }

  if (state.isFetching) {
    return (
      <page title="...">
        <LoadingDotsIcon />
      </page>
    )
  }

  return (
    <Page title="Edit Post">
      <Link to={`/post/${state.id}`} className="small font-weight-bold">
        &laquo; Back to Post
      </Link>

      <form onSubmit={handelSubmit} className="mt-3">
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input onBlur={(e) => dispatch({ type: "titleRules", value: e.target.value })} value={state.title.value} onChange={(e) => dispatch({ type: "updateTitle", value: e.target.value })} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
          {state.title.hasError && <div className="alert alert-danger small liveValidateMessage">{state.title.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onBlur={(e) => dispatch({ type: "bodyRules", value: e.target.value })} name="body" value={state.body.value} onChange={(e) => dispatch({ type: "updateBody", value: e.target.value })} id="post-body" className="body-content tall-textarea form-control" type="text" />
          {state.body.hasError && <div className="alert alert-danger small liveValidateMessage">{state.body.message}</div>}
        </div>

        <button className="btn btn-primary" disabled={state.isSaving}>
          <>{state.isSaving ? <>Saving...</> : <>Save Updates</>}</>
        </button>
      </form>
    </Page>
  )
}

export default withRouter(EditPost)
