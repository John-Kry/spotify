import React, { useEffect, useState } from "react";
import accessTokenStore from "./accessTokenStore";
import axios from "axios";
import bulma from "bulma";
import Song from "./Song";
import { ClipLoader } from "react-spinners";

var arr = window.location.href.split("/");
const spotifyLoginLink = `https://accounts.spotify.com/authorize?client_id=${
	process.env.REACT_APP_CLIENT_ID
	}&redirect_uri=http:%2F%2F${
	arr[2]
	}%2FauthenticationCallback&scope=user-read-private%20user-read-email%20user-top-read%20user-modify-playback-state%20user-read-playback-state&response_type=token&state=123`;
const durationMap = {
	week: {
		displayValue: "Week",
		value: "short_term"
	},
	month: {
		displayValue: "Month",
		value: "medium_term"
	},
	year: {
		displayValue: "Year",
		value: "long_term"
	}
};

function Root(props) {
	const [topTracks, setTopTracks] = useState([]);
	const [duration, setDuration] = useState("week");
	const [profile, setProfile] = useState({ images: [{ url: "" }] });
	const [playingNow, setPlayingNow] = useState("");
	const [loading, setLoading] = useState(true);
	const [availableDevices, setAvailableDevices] = useState([]);
	const forceUpdate = useForceUpdate();
	function useForceUpdate() {
		const [value, set] = useState(true); //boolean state
		return () => set(!value); // toggle the state to force render
	}
	if (!accessTokenStore.getAccessToken()) window.location = spotifyLoginLink;
	useEffect(() => {
		updateTracks();
		function updateTracks() {
			setLoading(true);
			axios
				.get(
					`https://api.spotify.com/v1/me/top/tracks?time_range=${durationMap[duration].value}&limit=50`,
					{
						headers: {
							Authorization:
								"Bearer " + accessTokenStore.getAccessToken()
						}
					}
				)
				.then(result => {
					console.log(result.data.items);
					setTopTracks(result.data.items);
					setLoading(false);
					window.scrollTo(0, 0);
				});
		}
	}, [duration]);
	useEffect(() => {
		getUserProfileData();
		function getUserProfileData() {
			axios
				.get(`https://api.spotify.com/v1/me`, {
					headers: {
						Authorization:
							"Bearer " + accessTokenStore.getAccessToken()
					}
				})
				.then(result => {
					console.log(result.data);
					setProfile(result.data);
				});
		}
		getPlayingNow();
		function getPlayingNow() {
			setInterval(() => {
				axios
					.get(
						"https://api.spotify.com/v1/me/player/currently-playing",
						{
							headers: {
								Authorization:
									"Bearer " +
									accessTokenStore.getAccessToken()
							}
						}
					)
					.then(result => {
						if (result.data.item && result.data.item.name)
							setPlayingNow(result.data.item.name);
					});
			}, 500);
		}
		getAvailableDevices();
		function getAvailableDevices() {
			axios
				.get(`https://api.spotify.com/v1/me/player/devices`, {
					headers: {
						Authorization:
							"Bearer " + accessTokenStore.getAccessToken()
					}
				})
				.then(response => {
					console.log(response.data.devices);
					setAvailableDevices(response.data.devices);
				});
		}
	}, []);

	useEffect(() => {
		for (const i in topTracks) {
			if (playingNow === topTracks[i].name) {
				topTracks[i].isPlaying = true;
				continue
			}
			topTracks[i].isPlaying = false;
		}
		forceUpdate();
	}, [playingNow]);

	function handleDurationClick(e) {
		setDuration(e.target.name);
	}
	let availableDevicesArray = availableDevices.map(device => {
		return device.name;
	});
	return (
		<div className="App">
			<div className="header">
				<div className="header-content">
					{profile.display_name && profile.display_name + "'s"} Top{" "}
					<i>Spotify</i> Tracks
				</div>
				<div className="header-button-container">
					<button
						className={"header-button"}
						name="week"
						onClick={handleDurationClick}>
						Past week
				</button>
					<button
						className=" header-button"
						name="month"
						onClick={handleDurationClick}>
						Past month
				</button>
					<button
						className="header-button"
						name="year"
						onClick={handleDurationClick}>
						Past year
				</button>
				</div>
				<h3 className="header-content">
					Currently: {durationMap[duration].displayValue}
				</h3>
				<h3 className="header-content">Playing Now: {playingNow}</h3>
				<h3 className="header-content">
					Available Devices: {availableDevicesArray.join(", ")}
				</h3>
			</div>
			{
				<div className="topTracksList">
					{!loading ? (
						topTracks.map((track, index) => {
							const duration = millisToMinutesAndSeconds(
								track.duration_ms
							);
							return (
								<Song
									track={track}
									index={index}
									duration={duration}
									albumImage={track.album.images}
									isPlaying={track.isPlaying}
									key={index}></Song>
							);
						})
					) : (
							<div className="loadingList">
								<ClipLoader
									sizeUnit={"px"}
									size={100}
									color={"#fdc3ff"}
									loading={true}
								/>
							</div>
						)}
				</div>
			}
		</div>
	);
}
function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
export default Root;
