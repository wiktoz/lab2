import constants from "./constants.json"
import { useEffect, useState } from "react"

const storage_items = "spotify_items"
const storage_items_exp = "spotify_items_exp"
const storage_token = "token"
const storage_token_exp = "token_exp"

const storage_items_exp_time = 3600000 // in ms

export default function useFetch(url){

    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true)

            const storedData = localStorage.getItem(storage_items)
            const nextRefreshTime = localStorage.getItem(storage_items_exp)
            const currentTime = Date.now()
    
            if(storedData && (nextRefreshTime > currentTime)) {
                setData(JSON.parse(storedData))
                setError(null)
                setLoading(false)
                return
            }
    
            const { data, err } = await fetchData(url)

            if(err) {
                setError(err)
                setLoading(false)
                return
            }
    
            setData(data)
            setError(null)
            setLoading(false)
        }

        fetchAll()
        
    }, [url]);    

    return { data, error, loading }
}

const cleanList = (list) => {
    return list.tracks.items.map(item => {
        return {
            id: item.track.id,
            name: item.track.name,
            img_url: item.track.album.images[0].url,
            spotify_url: item.track.external_urls.spotify,
            artists: item.track.album.artists.map(artist => {
                return {
                    id: artist.id,
                    name: artist.name
                }
            })
        }
    })
}

const fetchData = async (url) => {
    try {
        let storedToken = localStorage.getItem(storage_token)
        let expToken = localStorage.getItem(storage_token_exp)

        // Re-fetch token if is expired or not in localStorage
        if (!storedToken || !expToken || expToken < Date.now()) {
            const { token, token_exp, err } = await fetchToken()

            if (err) {
                throw new Error(err)
            }

            storedToken = token
            expToken = token_exp
        }

        // Fetch data
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${storedToken}`
            }
        })

        if (!response.ok) {
            throw new Error("Cannot fetch data")
        }

        const fetchedData = await response.json()

        // Clean data from unnecessary data
        const cleanData = cleanList(fetchedData)

        // Update localStorage
        localStorage.setItem(storage_items, JSON.stringify(cleanData))
        localStorage.setItem(storage_items_exp, Date.now() + storage_items_exp_time)

        return { data: cleanData, err: null }

    } catch (err) {
        return { data: null, err: err.message }
    }
}

const fetchToken = async () => {
    try {
        const formData = new URLSearchParams();
        formData.append("grant_type", constants.grant_type)
        formData.append("client_id", constants.client_id)
        formData.append("client_secret", constants.client_secret)

        const response = await fetch(constants.token_endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString()
        });

        if(!response.ok) {
            throw new Error("Cannot fetch token")
        }

        const data = await response.json()
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('token_exp', Date.now() + data.expires_in)

        return { token: data.access_token, token_exp: data.expires_in, err: null }

    } catch (err) {
      return { token: null, token_exp: null, err: err }
    }
}