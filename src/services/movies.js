import axios from "axios"

const baseUrl = 'https://api.themoviedb.org/3/'
const API_KEY = import.meta.env.VITE_API_KEY

export const getMovies = async(genre) => {
    const response = await axios.get(`${baseUrl}${genre}/movie/day?api_key=${API_KEY}&page=1`)
    return response.data.results
}

export const getTrending = async() => {
    const response = await axios.get(`${baseUrl}trending/all/day?api_key=${API_KEY}`)
    return response.data.results
}
export const getTop = async(type) => {
    const response = await axios.get(`${baseUrl}${type}/top_rated?api_key=${API_KEY}`)
    return response.data.results
}

export const getSimilar = async(type, id) => {
    const response = await axios.get(`${baseUrl}${type}/${id}/similar?api_key=${API_KEY}`)
    return response.data.results
}