import './App.css'
import Track from './components/Track'
import useFetch from './utils/fetcher'
import Loader from './components/Loader'
import Error from './components/Error'
import MoreButton from './components/MoreButton'
import { FaSpotify } from "react-icons/fa"
import { useState } from 'react'

const expandBy = 10

function App() {
  const { data, error, loading } = useFetch("https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF")
  const [itemsLoaded, setItemsLoaded] = useState(expandBy)

  const showMore = () => {
    setItemsLoaded(prevCount => prevCount + expandBy);
  }

  return (
    <div className="App">
      {
        loading ?
          <Loader/> :
        error ?
          <Error err={error}/> :

        <div className='container flex flex-col gap-1'>
          <div className="title flex flex-row gap-02">
            <div>
              <FaSpotify/>
            </div>
            <div>
              Top 50 Global Charts
            </div>
          </div>
          <div className="grid">
            {
              data &&
              data.slice(0, itemsLoaded).map((item, index) => {
                return (
                  <Track 
                    item={item} 
                    index={index} 
                    key={item.track.id}
                  />
                )
              })
            }
          </div>
          <MoreButton more={showMore} done={data && (data.length <= itemsLoaded)}/>
        </div>
      }
    </div>
  )
}

export default App
