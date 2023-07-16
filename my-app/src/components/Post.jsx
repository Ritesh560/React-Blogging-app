import React from "react"
import { Link } from "react-router-dom"

function Post(props) {
  const post = props.post

  function trimParagraph(paragraph) {
    if (paragraph.length <= 150) {
      return paragraph
    } else {
      const trimmedText = paragraph.substring(0, 150)
      return trimmedText + "..."
    }
  }

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{post.title}</h5>
        <p className="card-text">{trimParagraph(post.body)}</p>

        <Link onClick={props.onClick} to={`/post/${post._id}`} className="btn btn-primary pointer">
          Read More
        </Link>
      </div>
    </div>
  )
}

export default Post
