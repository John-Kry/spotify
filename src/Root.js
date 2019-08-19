import React, { useEffect, useState } from 'react'
import accessTokenStore from './accessTokenStore'
import axios from 'axios'
console.log(window.location.href)
var arr = window.location.href.split("/");
console.log(arr)
const spotifyLoginLink = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=http:%2F%2F${arr[2]}%2FauthenticationCallback&scope=user-read-private%20user-read-email%20user-top-read%20user-modify-playback-state&response_type=token&state=123`
function Root(props) {
    let [topTracks, setTopTracks] = useState([])
    useEffect(() => {
        console.log(accessTokenStore.getAccessToken())
        if (accessTokenStore.getAccessToken() && topTracks.length == 0) {
            axios.get('https://api.spotify.com/v1/me/top/tracks', { headers: { 'Authorization': "Bearer " + accessTokenStore.getAccessToken() } })
                .then((result) => {
                    console.log(result.data.items)
                    setTopTracks(result.data.items)
                })
        }
    });
    return (
        <div className="App">
            HELLO
            <ul>
        {topTracks.map((track) => {
                return <li>{track.name}<button onClick={()=>{
                    axios.put("https://api.spotify.com/v1/me/player/play",{uris: [track.uri]},{ headers: { 'Authorization': "Bearer " + accessTokenStore.getAccessToken() } })
                }}>Play Now!</button></li>
            })}
            </ul>
            <a href={spotifyLoginLink}>Login To Spotify</a>

        </div>)
}
export default Root