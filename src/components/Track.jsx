import { FaPlayCircle } from "react-icons/fa"

const Track = ({item, index}) => {
    return (
        <div className="card flex flex-col align-between">
            <div className="flex flex-col gap-1">
                <div>
                    <img src={item.img_url} alt={item.name} className="album-img" />
                </div>
                <div className="flex flex-col gap-02">
                    <div className='title'>
                        #{index+1} {item.name}
                    </div>
                    <div className='artist'>
                    {
                        item.artists.map((artist, index) => {
                        return (
                            <span key={artist.id}>
                                {artist.name}
                                {index < item.artists.length - 1 && ', '}
                            </span>
                        )
                        })
                    }
                    </div>
                </div>
            </div>
            <div className="play-icon mt-2">
                <a href={item.spotify_url} target="_blank">
                    <FaPlayCircle />
                </a>
            </div>
        </div>
    )
}

export default Track