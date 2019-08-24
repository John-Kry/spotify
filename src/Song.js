import React from 'react'
import axios from 'axios'
import accessTokenStore from './accessTokenStore'

function Song(props) {
    const { index, track } = props
    const artistsArray = track.artists.map((artist)=>{
        return artist.name
    })
    return (
        <div class="card" >
            <div class="card-content">
                <p class="title" onClick={() => {
                            axios.put("https://api.spotify.com/v1/me/player/play", { uris: [track.uri] }, { headers: { 'Authorization': "Bearer " + accessTokenStore.getAccessToken() } })
                        }}>{index +1}. {track.name}</p>
                <p class="subtitle">
                    {artistsArray.join(', ')}
                    <br/>
                {props.duration}
                </p>
            </div>
        </div >
    )
}
export default Song