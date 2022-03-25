import React, { useContext, useEffect } from "react"
import { useImmer } from "use-immer"
import axios from "axios"

import DispatchContext from "../DispatchContext"

function Search() {
  const appDispatch = useContext(DispatchContext)

  const [state, setState] = useImmer({
    searchTerm: "",
    result: [],
    show: "NoData",
    requestCount: 0,
  })

  useEffect(() => {
    document.addEventListener("keyup", handelSearchKeyPress)
    return () => document.removeEventListener("keyup", handelSearchKeyPress)
  }, [])

  function handelSearchKeyPress(e) {
    e.preventDefault()
    if (e.keyCode === 27) {
      appDispatch({ type: "closeSearch" })
    }
  }

  function handelInput(e) {
    const value = e.target.value

    if (value.trim()) {
      setState((draft) => {
        draft.searchTerm = value
        draft.show = "loading"
      })
    } else {
      setState((draft) => {
        draft.show = "neither"
      })
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      setState((draft) => {
        draft.requestCount++
      })
    }, 3000)

    return () => clearTimeout(delay)
  }, [state.searchTerm])

  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = axios.CancelToken.source()

      async function fetchResults() {
        try {
          const response = await axios.post("/search", { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token })

          setState((draft) => {
            draft.result = response.data
            draft.show = "results"
          })
        } catch (e) {
          console.log("There is a problem or request is candeled.")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.requestCount])

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input onChange={handelInput} autoFocus type="text" autoComplete="off" id="live-search-field" className="live-search-field" placeholder="Enter the Text for Search here." />
          <span onClick={() => appDispatch({ type: "closeSearch" })} className="close-live-search">
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className={"circle-loader " + (state.show === "loading" ? "circle-loader--visible" : "")}></div>
          <div className={"live-search-results " + (state.show === "results" ? "live-search-results--visible" : "")}>
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> (3 items found)
              </div>
              <a href="#" className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" alt="img" /> <strong>Example Post #1</strong>
                <span className="text-muted small">by brad on 2/10/2020 </span>
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128" alt="img" /> <strong>Example Post #2</strong>
                <span className="text-muted small">by barksalot on 2/10/2020 </span>
              </a>
              <a href="#" className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128" alt="img" /> <strong>Example Post #3</strong>
                <span className="text-muted small">by brad on 2/10/2020 </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
