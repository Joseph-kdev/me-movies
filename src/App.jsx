import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import { Landing } from './components/Landing'
import { useUserAuth } from './UserAuthContext'
import { MovieInfo } from './components/MovieInfo'
import { UserCollections } from './components/UserCollections'
import { Search } from './components/Search'
import { Movies } from './components/Movies'
import { TvShows } from './components/TvShows'
import { ToastContainer } from 'react-toastify'



function App() {
const { user } = useUserAuth()


  return (
    <>
     <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        />
      <Routes>
        <Route path='/' element={ <Landing /> } />
        <Route path='/home' element={ <Home /> } />
        <Route path='/login' element={ <Login /> } />
        <Route path='/collections' element={ user ? <UserCollections /> : <Navigate to="/login" /> } />
        <Route path='/:type/:id' element={ <MovieInfo /> } />
        <Route path='/search' element={ <Search /> } />
        <Route path='/movies' element={ <Movies /> } />
        <Route path='/tvshows' element={ <TvShows /> } />
      </Routes>
    </>
  )
}

export default App
