import { MovieList } from "./movieList";
import { Nav } from './Nav'
import { useQuery } from "@tanstack/react-query";
import { Carousel } from "./Carousel";
import { getTop, getTrending } from "../services/movies";
import './stylesheets/home.css'
import { MoonLoader } from "react-spinners";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, toast } from "react-toastify";
import { Footer } from "./Footer";

const Home = () => {
    const {data: trendin , isLoading, isError} = useQuery({
        queryKey:["trending"],
        queryFn: () => getTrending(),
        initialData: [],
    })
    const {data: topMovies} = useQuery({
        queryKey:["top_Movies"],
        queryFn: () => getTop('movie'),
        initialData: [],
    })
    const {data: topTv} = useQuery({
        queryKey:["top_tv"],
        queryFn: () => getTop('tv'),
        initialData: [],
    })


    if(isError) {
        return <div className="no-data"><img src="/images/server-down.svg" alt="" /></div>
    }

    // if(trendin) {
    //     toast.success('Logged in Successfully. Click the tiny movie posters for more options', {
    //         position: "top-center",
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: false,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "dark",
    //         transition: Bounce,
    //         });
    // }

    return ( 
        <>
            < Nav />
            <Carousel />
            <div>
            <h1 className="trending-heading">Trending</h1>
            <hr />
            {isLoading ? (
                <div className='loading'>
                  <MoonLoader size={70} color="#efe4ef" speedMultiplier={2}/>
                </div>
            ) : (
                <div className="trending-section">
                    < MovieList movies={trendin}/>
                </div>
            )}
            </div>

            <div className="top-rated">
            <h1 className="top-heading">Top rated Movies</h1>
            <hr />
            {isLoading ? (
                <div className='loading'>
                  <MoonLoader size={70} color="#efe4ef" speedMultiplier={2}/>
                </div>
            ) : (
                <div className="top-section">
                    < MovieList movies={topMovies}/>
                </div>
            )}
            <button className="movie-button">
                <Link to="/movies" className="more-button">
                    More
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                    </svg>
                </Link>
            </button>
            </div>

            <div className="top-rated-tv">
            <h1 className="top-heading">Top rated Shows</h1>
            <hr />
            {isLoading ? (
                <div className='loading'>
                  <MoonLoader size={70} color="#efe4ef" speedMultiplier={2}/>
                </div>
            ) : (
                <div className="top-section">
                    < MovieList movies={topTv}/>
                </div>
            )}
            <button className="movie-button">
                <Link to="/tvshows" className="more-button">
                    More
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
                    </svg>
                </Link>
            </button>
            </div>
            <Footer />
        </>
     );
}
 
export default Home;