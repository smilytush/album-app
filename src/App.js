import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [allId, setAllId] = useState([]);
  const [userId, setUserId] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [totalTitles , setTotalTitles] = useState();
// Helper function to generate random names
function getRandomName() {
  const names = ['John', 'Emma', 'Sophia', 'Michael', 'Olivia', 'William', 'Ava', 'James', 'Isabella'];
  return names[Math.floor(Math.random() * names.length)];
}

  useEffect(() => {
    async function fetchData(){
    const data = await (
          await fetch(
            "https://jsonplaceholder.typicode.com/albums"
          )
        ).json();
        await setAlbums(data);

        let id = new Set()
        data.map(album => {
          id.add(album.userId)
        })
        setAllId([...id]);
        let obj = {};
        id.forEach(elem =>{ 
          obj[elem] = []
          data.forEach(album=>{
            if(album.userId == elem){
              obj[elem].push(album.title)
            }
          })
        });
        setUserId({...obj});
        console.log(obj)
        
        let noOfTitles = []
        id.forEach(elem => noOfTitles.push(obj[elem].length))
        setTotalTitles([...noOfTitles])
    }
    fetchData()

  }, []);

  const showList = (e) => {
    // console.log(e.target)
    setCurrentId(parseInt(e.target.innerHTML));
  }

  const selectTitle = (e) => {
    e.target.className = "selected"
    let title = e.target.innerHTML
    const updatedUserId = {...userId};
    let indexToRemove = updatedUserId[currentId].indexOf(title);
    updatedUserId[currentId].splice(indexToRemove,1);
    let noOfTitles = []
    allId.forEach(elem => noOfTitles.push(updatedUserId[elem].length))
    // setAllId(allId)
    setTotalTitles(noOfTitles)
    // setUserId(userId)
    console.log(allId)
    console.log(userId)

  }
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
  // console.log(albums)
  return (
    <div className="App">
      <header className="App-header">
        <h1>Albums</h1>
        <input type="text" placeholder="Search albums" onChange={handleSearch} />
      </header>
      <div className="album-container" >
        {allId.map(elem => 
          <div
            className="albumCard"
            key={elem}
            value = {elem}
          >
            <span onClick={showList} className="album-label">{elem}</span>
            <span className="title-count">{totalTitles[elem-1]}</span>
          </div>
        )}
      </div>
        <div className="item-list">
          <ul>
            Section Title
            {
              userId.hasOwnProperty(currentId)?userId[currentId].map(elem =>{
                return <li onClick={selectTitle} >{elem}</li>
              }):
              ""
            }
          </ul>
        </div>
    </div>
  );
}



export default App;
