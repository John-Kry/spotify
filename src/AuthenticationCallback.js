import React, {useEffect} from 'react'
import queryString from 'query-string'
import accessTokenStore from './accessTokenStore'
function AutheticationCallback(props) {
    useEffect(() => {
        const accessToken = queryString.parse(props.location.hash).access_token
        accessTokenStore.setAccessToken(accessToken)
        props.history.push('/')
    });

    return (
<div className="App">
    </div>)
}
export default AutheticationCallback