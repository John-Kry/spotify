import React from "react";
import axios from "axios";
import accessTokenStore from "./accessTokenStore";

function Song(props) {
	const { index, track, isPlaying, duration } = props;
	const artistsArray = track.artists.map(artist => {
		return artist.name;
	});
	let cardStyle;
	if (isPlaying) cardStyle = { backgroundColor: "#fdc3ff" };
	else cardStyle = {};
	return (
		<div className="card">
			<div className={"card-content"} style={cardStyle}>
				<p
					className="title"
					onClick={() => {
						axios.put(
							"https://api.spotify.com/v1/me/player/play",
							{ uris: [track.uri] },
							{
								headers: {
									Authorization:
										"Bearer " +
										accessTokenStore.getAccessToken()
								}
							}
						);
					}}>
					{index + 1}. {track.name}
				</p>
				<p className="subtitle">
					{artistsArray.join(", ")}
					<br />
					{duration}
				</p>
			</div>
		</div>
	);
}
export default Song;
