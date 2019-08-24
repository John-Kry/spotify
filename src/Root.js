import React, { useEffect, useState } from 'react'
import accessTokenStore from './accessTokenStore'
import axios from 'axios'
import bulma from 'bulma'
var arr = window.location.href.split("/");
const spotifyLoginLink = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=http:%2F%2F${arr[2]}%2FauthenticationCallback&scope=user-read-private%20user-read-email%20user-top-read%20user-modify-playback-state&response_type=token&state=123`
const durationMap = {
    "week": "short_term",
    "month": "medium_term",
    "year": "long_term"
}
function Root(props) {
    let [topTracks, setTopTracks] = useState([])
    let [duration, setDuration] = useState("short_term")
    if (!accessTokenStore.getAccessToken())
        window.location = spotifyLoginLink
    useEffect(() => {
        updateTracks()
    }, [duration]);
    function updateTracks() {
        axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${duration}&limit=50`, { headers: { 'Authorization': "Bearer " + accessTokenStore.getAccessToken() } })
            .then((result) => {
                setTopTracks(result.data.items)
            })
    }
    function handleDurationClick(e) {
        setDuration(durationMap[e.target.name])
    }
    return (
        <div className="App">
            <div className="header">
                <div>
                    <h1 className="header-title">Your Top <i>Spotify</i> Tracks</h1>
                </div>
                <div className="columns ">
                    <div className="column">
                        <button className={"header-button"} name="week" onClick={handleDurationClick}>Past week</button>
                        <button className="header-button" name="month" onClick={handleDurationClick}>Past month</button>
                        <button className="header-button" name="year" onClick={handleDurationClick}>Past year</button>
                    </div>
                </div>
            </div>
            {topTracks.map((track ,index) => {
                return <div className="columns" key={index}>
                    <div className="column">
                        <span id="title" onClick={() => {
                            axios.put("https://api.spotify.com/v1/me/player/play", { uris: [track.uri] }, { headers: { 'Authorization': "Bearer " + accessTokenStore.getAccessToken() } })
                        }}>{index +1}. {track.name}</span> by <span id="artist">{track.artists[0].name}</span>
                    </div>
                </div>
            })}
        </div>)
}
export default Root