import React, { useEffect, useState } from 'react'
import accessTokenStore from './accessTokenStore'
import axios from 'axios'
import bulma from 'bulma'
import Song from './Song';
var arr = window.location.href.split("/");
const spotifyLoginLink = `https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=http:%2F%2F${arr[2]}%2FauthenticationCallback&scope=user-read-private%20user-read-email%20user-top-read%20user-modify-playback-state&response_type=token&state=123`
const durationMap = {
    "week": {
        displayValue: "Week",
        value: "short_term"
    },
    "month": {
        displayValue: "Month",
        value: "medium_term"
    },
    "year": {
        displayValue: "Year",
        value: "long_term"
    }
}
function Root(props) {
    let [topTracks, setTopTracks] = useState([])
    let [duration, setDuration] = useState("week")
    let [profile, setProfile] = useState({ images: [{ url: "" }] })
    if (!accessTokenStore.getAccessToken())
        window.location = spotifyLoginLink
    useEffect(() => {
        updateTracks()
    }, [duration]);
    useEffect(() => {
        getUserProfileData()
    }, [])
    function updateTracks() {
        axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${durationMap[duration].value}&limit=50`, { headers: { 'Authorization': "Bearer " + accessTokenStore.getAccessToken() } })
            .then((result) => {
                console.log(result.data.items)
                setTopTracks(result.data.items)
            })
    }
    function getUserProfileData() {
        axios.get(`https://api.spotify.com/v1/me`, { headers: { 'Authorization': "Bearer " + accessTokenStore.getAccessToken() } })
            .then((result) => {
                console.log(result.data)
                setProfile(result.data)
            })
    }
    function handleDurationClick(e) {
        setDuration(e.target.name)
    }
    return (
        <div className="App">
            <div className="header">
                <div className="columns">
                    <div className="column">
                        <span className="header-title">{profile.display_name && profile.display_name + "'s"} Top <i>Spotify</i> Tracks</span>
                    </div>
                </div>
            <div className="columns">
                <div className="column">
                    <button className={"header-button"} name="week" onClick={handleDurationClick}>Past week</button>
                    <button className="header-button" name="month" onClick={handleDurationClick}>Past month</button>
                    <button className="header-button" name="year" onClick={handleDurationClick}>Past year</button>
                </div>
            </div>
            <div className="columns">
                <div className="column">
                    <h3 className="header-selected">Currently: {durationMap[duration].displayValue}</h3>
                </div>
            </div>
        </div>
            {
        topTracks.map((track, index) => {
            const duration = millisToMinutesAndSeconds(track.duration_ms)
            return <Song track={track} index={index}></Song>
        })
    }
        </div >)
}
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
export default Root