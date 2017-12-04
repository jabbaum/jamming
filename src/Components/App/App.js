import React from 'react';
import './App.css';
import Playlist from '../Playlist/Playlist';
import SearchResults from '../SearchResults/SearchResults';
import SearchBar from '../SearchBar/SearchBar';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'testing playlist name',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    let updatedplaylist = this.state.playlistTracks;
    if (this.state.playlistTracks.indexOf(track) === -1) {
      updatedplaylist = updatedplaylist.push(track);
      this.setState({ playlistTracks: updatedplaylist });
    }
  }
  removeTrack(track) {
    let updatedplaylist = this.state.playlistTracks;
    updatedplaylist.splice(this.state.updatedplaylist.indexOf(track), 1);
    this.setState({playlistTracks: updatedplaylist});
  }
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => {
        return track.uri;
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
  }
  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => this.setState({searchResults: tracks}));
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        <SearchBar onSearch={this.search} />
          <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
