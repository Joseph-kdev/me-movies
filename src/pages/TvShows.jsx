import FilterComponent from '../components/FilterComponent'
import { Nav } from '../components/Nav'
import './stylesheets/categories.css'
export const TvShows = () => {
    const tvGenres = [
          {
            "id": 10759,
            "name": "Action & Adventure"
          },
          {
            "id": 16,
            "name": "Animation"
          },
          {
            "id": 35,
            "name": "Comedy"
          },
          {
            "id": 80,
            "name": "Crime"
          },
          {
            "id": 99,
            "name": "Documentary"
          },
          {
            "id": 18,
            "name": "Drama"
          },
          {
            "id": 10751,
            "name": "Family"
          },
          {
            "id": 10762,
            "name": "Kids"
          },
          {
            "id": 9648,
            "name": "Mystery"
          },
          {
            "id": 10763,
            "name": "News"
          },
          {
            "id": 10764,
            "name": "Reality"
          },
          {
            "id": 10765,
            "name": "Sci-Fi & Fantasy"
          },
          {
            "id": 10766,
            "name": "Soap"
          },
          {
            "id": 10767,
            "name": "Talk"
          },
          {
            "id": 10768,
            "name": "War & Politics"
          },
          {
            "id": 37,
            "name": "Western"
          }
        ]

  return (
    <div className='movies-filter'>
        <Nav />
        <h2>
          Tv shows
        </h2>
        <FilterComponent genres={tvGenres} mediaType='tv' />
    </div>
  )
}
