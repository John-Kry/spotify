import React, { useEffect, useState } from 'react'
import accessTokenStore from './accessTokenStore'
import axios from 'axios'
import bulma from 'bulma'
var arr = window.location.href.split("/");
const spotifyLoginLink = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=http:%2F%2F${arr[2]}%2FauthenticationCallback&scope=user-read-private%20user-read-email%20user-top-read%20user-modify-playback-state&response_type=token&state=123`
function Root(props) {
    let [topTracks, setTopTracks] = useState([])
    useEffect(() => {
        if (!accessTokenStore.getAccessToken())
            window.location = spotifyLoginLink
        if (accessTokenStore.getAccessToken() && topTracks.length === 0) {
            axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50', { headers: { 'Authorization': "Bearer " + accessTokenStore.getAccessToken() } })
                .then((result) => {
                    setTopTracks(result.data.items)
                })
        }
    });
    return (
        <div className="App">
                {topTracks.map((track) => {
                    return <div class="columns">
                        <div class="column">
                           <span id="title"onClick={() => {
                                    axios.put("https://api.spotify.com/v1/me/player/play", { uris: [track.uri] }, { headers: { 'Authorization': "Bearer " + accessTokenStore.getAccessToken() } })
                                }}>{track.name}</span> by <span id="artist">{track.artists[0].name}</span>  
                           </div>
                    </div>
                })}
            </div>)
    }
export default Root