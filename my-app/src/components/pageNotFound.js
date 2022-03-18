import React from "react"
import Page from "./page"
import { Link } from "react-router-dom"

function PageNotFound() {
  return (
    <page title="Not Found">
      <div className="text-center">
        <h1>404</h1>
        <h2> Page not Found.</h2>
        <p className="lead text-muted">
          Go Back to <Link to="/">HomePage</Link>.{" "}
        </p>
      </div>
    </page>
  )
}

export default PageNotFound
