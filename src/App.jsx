import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import { useUserAuth } from './UserAuthContext'
import { ToastContainer } from 'react-toastify'
import { Landing } from './pages/Landing'
import Home from './pages/Home'
import Login from './pages/Login'
import { UserCollections } from './pages/UserCollections'
import { MovieInfo } from './pages/MovieInfo'
import { Search } from './pages/Search'
import { Movies } from './pages/Movies'
import { TvShows } from './pages/TvShows'



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
