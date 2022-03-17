import React, { useEffect, useState } from "react"
import Page from "./page"
import { useParams, Link } from "react-router-dom"
import Axios from "axios"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"

import LoadingDotsIcon from "./LoadingDotsIcon"

function ViewSinglePost() {
  const { id } = useParams()
  const [isLoading, setisLoading] = useState(true)
  const [post, setPost] = useState({})

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`)
        setPost(response.data)
        setisLoading(false)
      } catch (e) {
        console.log("There was an error")
      }
    }
    fetchPost()
  }, [])

  console.log(post)

  if (isLoading) {
    return (
      <page title="...">
        <LoadingDotsIcon />
      </page>
    )
  }

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title} </h2>
        <span className="pt-2">
          <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
            <i className="fas fa-edit"></i>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />{" "}
          <Link to={`/post/${post._id}/delete`} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
            <i className="fas fa-trash"></i>
          </Link>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} alt=":)" />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username} </Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} allowedTypes={["paragraph", "text", "emphasis", "strong", "heading", "list", "listItem"]} />
      </div>
    </Page>
  )
}

export default ViewSinglePost
