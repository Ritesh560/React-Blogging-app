import React, { useEffect, useState } from "react"
import Page from "./page"
import { useParams, Link } from "react-router-dom"
import Axios from "axios"

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
          <a href="#" className="text-primary mr-2" title="Edit">
            <i className="fas fa-edit"></i>
          </a>
          <a className="delete-post-button text-danger" title="Delete">
            <i className="fas fa-trash"></i>
          </a>
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username} </Link> on {dateFormatted}
      </p>

      <div className="body-content">{post.body}</div>
    </Page>
  )
}

export default ViewSinglePost