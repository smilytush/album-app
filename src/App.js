import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
// Helper function to generate random names
function getRandomName() {
  const names = ['John', 'Emma', 'Sophia', 'Michael', 'Olivia', 'William', 'Ava', 'James', 'Isabella'];
  return names[Math.floor(Math.random() * names.length)];
}

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/albums')
      .then(response => response.json())
      .then(data => setAlbums(data));
  }, []);

  const handleCardClick = (album) => {
    setSelectedAlbum(album);
  }

  const handleItemClick = (item) => {
    item.seen = true;
    setSelectedAlbum(prevAlbum => ({
      ...prevAlbum,
      items: prevAlbum.items.map(i => (i.id === item.id ? item : i))
    }));
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const filteredAlbums = albums.filter(album => album.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="App">
      <header className="App-header">
        <h1>Albums</h1>
        <input type="text" placeholder="Search albums" onChange={handleSearch} />
      </header>
      <div className="album-container">
        {filteredAlbums.slice(0, 8).map(album => (
          <div
            className={`album-card ${selectedAlbum === album ? 'selected' : ''}`}
            key={album.id}
            onClick={() => handleCardClick(album)}
          >
            <span className="album-label">{`${getRandomName()} - ${album.userId}`}</span>
            <span className="item-count">{album.items && album.items.filter(item => !item.seen).length}</span>
          </div>
        ))}
      </div>
      {selectedAlbum && (
        <div className="item-list">
          <h2>{`${getRandomName()} - ${selectedAlbum.userId}`}</h2>
          <ul>
            {selectedAlbum.items && selectedAlbum.items.map(item => (
              <li
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={item.seen ? 'seen' : ''}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}



export default App;
