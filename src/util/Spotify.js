let accessToken;
const client_id = 'your client id here';
const redirect_uri = "http://localhost:3000/";
const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const newAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const newExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

    if (newAccessToken && newExpiresIn) {
            accessToken = newAccessToken[1];
            let expiresIn = Number(newExpiresIn[1]);
            //Clear the parameters from the URL, so the app doesn't try grabbing the access token after it has expired
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            let accessUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&show_dialog=true&redirect_uri=${redirect_uri}`;
            window.location = accessUrl;
        }
  },
  search(searchTerm) {
    return fetch('https://cors-anywhere.herokuapp.com/' + `https://api.spotify.com/v1/search?type=track&q=${searchTerm}&limit=10`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        }
    ).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (jsonResponse.tracks) {
                return jsonResponse.tracks.items.map(track => ({
                        id: track.id,
                        name: track.name,
                        artist: track.artists[0].name,
                        album: track.album.name,
                        uri: track.uri
                    }

                ));
            } else {
                //return empty array
                return [];
            }
          })
  },
  savePlaylist(playlistName, trackURIs) {
        if (!(playlistName && trackURIs)) {
            return;
        }

        const headers = {'Authorization': 'Bearer ' + accessToken};
        let userId;
        fetch('https://cors-anywhere.herokuapp.com/' + 'https://api.spotify.com/v1/me', {headers: headers})
            .then(response => {
                return response.json();
            }).then(jsonResponse => {
            if (!jsonResponse.id) {
                return;
            }

            userId = jsonResponse.id;
            fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({name: playlistName})
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (!jsonResponse.id) {
                    return;
                }

                let playlistID = jsonResponse.id;

                fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({uris: trackURIs})
                })
            })

        })
    }
};

export default Spotify;
