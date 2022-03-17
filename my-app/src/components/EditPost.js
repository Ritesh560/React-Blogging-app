import React, { useEffect, useContext } from "react"
import Page from "./page"
import { useParams } from "react-router-dom"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import StateContext from "../StateContext"

import LoadingDotsIcon from "./LoadingDotsIcon"

function EditPost() {
  const appDispatch = useContext(StateContext)

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
        draft.title.value = action.value
        return
      case "updateBody":
        draft.body.value = action.value
        return
      case "submitpost":
        draft.sendCount++
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, origionalState)

  function handelSubmit(e) {
    e.preventDefault()
    dispatch({ type: "submitpost" })
  }

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`)
        dispatch({ type: "fetchComplete", value: response.data })
      } catch (e) {
        console.log("There was an error")
      }
    }
    fetchPost()
  }, [])

  useEffect(() => {
    if (state.sendCount) {
      async function fetchPost() {
        try {
          const response = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appDispatch.user.token })
          alert("congrats its Successful:)")
        } catch (e) {
          console.log("There was an error")
        }
      }
      fetchPost()
    }
  }, [state.sendCount])

  if (state.isFetching) {
    return (
      <page title="...">
        <LoadingDotsIcon />
      </page>
    )
  }

  return (
    <Page title="Edit Post">
      <form onSubmit={handelSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input value={state.title.value} onChange={(e) => dispatch({ type: "updateTitle", value: e.target.value })} autoFocus name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea name="body" value={state.body.value} onChange={(e) => dispatch({ type: "updateBody", value: e.target.value })} id="post-body" className="body-content tall-textarea form-control" type="text" />
        </div>

        <button className="btn btn-primary">Save Updates</button>
      </form>
    </Page>
  )
}

export default EditPost
