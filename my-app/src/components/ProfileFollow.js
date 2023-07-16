import React, { useState, useEffect, useContext } from "react"
import Axios from "axios"
import { useParams, Link } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import StateContext from "../StateContext"

function ProfileFollow(props) {
  const appState = useContext(StateContext)
  const action = props.action
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [people, setPeople] = useState([])

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()

    async function fetchPeople() {
      try {
        const response = await Axios.get(`/profile/${username}/${action}`, { cancelToken: ourRequest.token })
        setPeople(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log(error.response.data)
      }
    }
    fetchPeople()
    return () => {
      ourRequest.cancel()
    }
  }, [username, action])

  if (isLoading) return <LoadingDotsIcon />

  return (
    <div className="list-group">
      {people.length > 0 &&
        people.map((follower, index) => {
          return (
            <Link key={index} to={`/profile/${follower.username}`} className="list-group-item list-group-item-action">
              <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
            </Link>
          )
        })}
      {people.length == 0 && action == "following" && appState.user.username == username && <p className="lead text-muted text-center">You aren&rsquo;t following anyone yet.</p>}
      {people.length == 0 && action == "following" && appState.user.username != username && <p className="lead text-muted text-center">{username} isn&rsquo;t following anyone yet.</p>}
      {people.length == 0 && action == "followers" && appState.user.username == username && <p className="lead text-muted text-center">You don&rsquo;t have any followers yet.</p>}
      {people.length == 0 && action == "followers" && appState.user.username != username && (
        <p className="lead text-muted text-center">
          {username} doesn&rsquo;t have any followers yet.
          {appState.loggedIn && " Be the first to follow them!"}
          {!appState.loggedIn && (
            <>
              {" "}
              If you want to follow them you need to <Link to="/">sign up</Link> for an account first.{" "}
            </>
          )}
        </p>
      )}
    </div>
  )
}

export default ProfileFollow
