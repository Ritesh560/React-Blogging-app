import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Axios from "axios"
import LoadingDotsIcon from "./LoadingDotsIcon"

function ProfilePosts() {
  const { username } = useParams()
  const [isLoading, setisLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token })
        setisLoading(false)
        setPosts(response.data)
      } catch (e) {
        console.log("There is an  error or a cancel request.")
      }
    }
    fetchPosts()
    return () => {
      ourRequest.cancel()
    }
  }, [])

  if (isLoading)
    return (
      <div>
        <LoadingDotsIcon />
      </div>
    )
  return (
    <div className="list-group">
      {posts.map((post) => {
        const date = new Date(post.createdDate)
        const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

        return (
          <Link key={post._id} to={`/post/${post._id}`} className="list-group-item list-group-item-action">
            <img className="avatar-tiny" src={post.author.avatar} alt=":)" /> <strong>{post.title}</strong> <span className="text-muted small">on {dateFormatted} </span>
          </Link>
        )
      })}
    </div>
  )
}

export default ProfilePosts
