import React, {useEffect} from 'react'
import accessTokenStore from './accessTokenStore'
import axios from 'axios'
function Root(props) {
    useEffect(() => {
        console.log(accessTokenStore.getAccessToken())
        if(accessTokenStore.getAccessToken()){
            axios.get('https://api.spotify.com/v1/me', {headers:{'Authorization': "Bearer " +accessTokenStore.getAccessToken()}})
            .then((result)=>{
                console.log(result)
            })
        }
    });
    return (
<div className="App">
    HELLO 
    <a href="https://accounts.spotify.com/authorize?client_id=&redirect_uri=http:%2F%2Flocalhost:3000%2FauthenticationCallback&scope=user-read-private%20user-read-email&response_type=token&state=123">Login To Spotify</a>

    </div>)
}
export default Root