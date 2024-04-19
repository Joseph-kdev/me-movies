import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useUserAuth } from '../UserAuthContext';
import { addDoc, collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useQueryClient } from "@tanstack/react-query"; 
import './stylesheets/moviecard.css'
import ReactModal from "react-modal";
import { Modal } from "./Modal";


export const Movie = ({ id, title, overview, poster_path, vote_average, release_date, type }) => {
    const imgUrl = 'https://image.tmdb.org/t/p/w500/';
    const { user } = useUserAuth();
    const queryClient = useQueryClient(); // Initialize useQueryClient hook
    const [movieInCollections, setMovieInCollections] = useState({
        watched: false,
        watchlist: false,
        favorites: false
    });
    // Control modal
    const [modal, setModal] = useState(false);
    // Fetch data from Firestore upon login
    useEffect(() => {
        const fetchMovieCollections = async () => {
            try {
                const collections = ['watched', 'watchlist', 'favorites'];
                const results = await Promise.all(
                    collections.map((listType) =>
                        getDocs(query(collection(db, `users/${user.uid}/${listType}`), where("id", "==", id)))
                    )
                );
                const movieInCollections = results.reduce((acc, querySnapshot, index) => {
                    acc[collections[index]] = !querySnapshot.empty;
                    return acc;
                }, {});
                setMovieInCollections(movieInCollections);
            } catch (error) {
                console.log(error);
            }
        };

        if (user) {
            fetchMovieCollections();
        }
    }, [user, id]);

    const toggleMovieCollection = async (listType, action) => {
        const collectionRef = collection(db, `users/${user.uid}/${listType}`);

        try {
            // Build query to check if movie already exists
            const movieQuery = query(collectionRef, where("id", "==", id));
            const querySnapshot = await getDocs(movieQuery);

            if (querySnapshot.empty) {
                // Movie not found, add it
                if (action === 'add') {
                    await addDoc(collectionRef, {
                        id,
                        title,
                        overview,
                        poster_path,
                        vote_average,
                        release_date,
                        type
                    });
                    console.log(`${title} added to ${listType}`);
                    setMovieInCollections(prevState => ({
                        ...prevState,
                        [listType]: true
                    }));
                } else {
                    console.log('Cannot remove non-existent movie');
                }
            } else {
                // Movie found, perform action based on 'add' or 'remove'
                const docRef = querySnapshot.docs[0].ref; // Get reference of the found document
                if (action === 'add') {
                    console.log('Already saved');
                } else if (action === 'remove') {
                    await deleteDoc(docRef);
                    console.log(`${title} has been removed from ${listType}`);
                    setMovieInCollections(prevState => ({
                        ...prevState,
                        [listType]: false
                    }));
                }
            }
            
            // Invalidate the query to refetch data from Firestore
            queryClient.invalidateQueries(`userCollections-${id}`);

        } catch (error) {
            console.log(error);
        }
    };

    const moveToWatched = async () => {
        try {
          // Remove the movie from the watchlist
          const watchlistRef = collection(db, `users/${user.uid}/watchlist`);
          const watchlistQuery = query(watchlistRef, where("id", "==", id));
          const watchlistQuerySnapshot = await getDocs(watchlistQuery);
          const watchlistDocRef = watchlistQuerySnapshot.docs[0].ref;
          await deleteDoc(watchlistDocRef);
      
          // Add the movie to the watched collection
          const watchedRef = collection(db, `users/${user.uid}/watched`);
          await addDoc(watchedRef, {
            id,
            title,
            overview,
            poster_path,
            vote_average,
            release_date,
            type,
          });
      
          // Update the movieInCollections state
          setMovieInCollections({
            watched: true,
            watchlist: false,
            favorites: movieInCollections.favorites,
          });
      
          // Invalidate the query to refetch data from Firestore
          queryClient.invalidateQueries(`userCollections-${id}`);
        } catch (error) {
          console.log(error);
        }
      };
      //clip overview
      // Limit the overview text to 150 characters
const limitedOverview = overview.substring(0, 170) + (overview.length > 170 ? '...' : '');

    return (
        <>        
        <div className='movie'>
            <div className='movie-poster' onClick={() => setModal(true)}>
                <img src={`${imgUrl}${poster_path}`} alt="movie poster" />
                <div className="topRow">
                    <div className="title">
                        <h3>{title}</h3> 
                    </div>
                <div className="heroinIcons">
                    {movieInCollections.favorites ? 
                        ( <svg onClick={() => toggleMovieCollection('favorites',"remove" ) }
                        xmlns="http://www.w3.org/2000/svg" fill="#a3dcbc" strokeWidth={1.5} stroke="#a3dcbc" className="w-6 h-6" width="24px" height="24px">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                      </svg>
                      ) :
                       <svg onClick={() => toggleMovieCollection('favorites',"add") }
                       xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="#a3dcbc" className="w-6 h-6" width="24px" height="24px">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                     </svg>
                     }
                </div>
                </div>
            </div>
        </div>
        <Modal
          openModal={modal}
          closeModal={() => setModal(false)}
        >
            <div className="movie-modal">
                <div className="movie-pic">
                <img src={`${imgUrl}${poster_path}`} alt="movie poster" />
                <div>
                <div className="secondRow">
                <p>
                 <span>Rating:</span>   
                    <div className="heroinIcons">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="gold" className="w-6 h-6" width="24px" height="24px">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                    </div> <span>{vote_average}</span>
                </p>
                <p>
                     <span>Released:</span>
                    <div className="heroinIcons"><svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" width="24px" height="24px">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                    </svg>
                    </div> <span>{release_date}</span>
                </p>
                </div>
                </div>
                </div>
                <div className='movie-modal-details'>
                    <div className="movie-overview">
                        <h3>
                            {title}
                        </h3>
                        <p>
                            {limitedOverview} 
                        <Link to={`/${type}/${id}`} className="more">
                            <a>More</a>
                        </Link>
                        </p>
                    </div>
                    <div className="modal-buttons">
                    {!movieInCollections.watched && (
                                    <div className="otherRow">
                                    {movieInCollections.watchlist && !movieInCollections.watched && (
                                        <div className="thirdRow">
                                        <button onClick={() => moveToWatched()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0a0a0a" className="w-6 h-6" width='24' height='24'>
                                            <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.905 9.97a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V18a.75.75 0 0 0 1.5 0v-4.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z" clipRule="evenodd" />
                                            <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                                        </svg>
                                        <span>Move to Watched</span>
                                        </button>
                                        </div>
                                    )}
                                    <div className="thirdRow">
                                    {movieInCollections.watchlist ? (
                                        <button onClick={() => toggleMovieCollection('watchlist', "remove")} ><svg xmlns="http://www.w3.org/2000/svg" fill="#000000" className="w-6 h-6" width="24px" height="24px">
                                        <path fillRule="evenodd" d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                                      </svg>
                                      <span>Remove from watchlist</span>
                                      </button>
                                    ) : (
                                        <button onClick={() => toggleMovieCollection('watchlist',"add")} disabled={movieInCollections.watched}><svg xmlns="http://www.w3.org/2000/svg" fill="#0a0a0a" className="w-6 h-6" width="24px" height="24px">
                                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                      </svg>
                                      <span>Add to Watchlist</span>
                                      </button>
                                    )}
                                    </div>
                                </div>
                )}
                {!movieInCollections.watchlist && ( 
                                    <div className="thirdRow">
                                    {movieInCollections.watched ? (
                                        <button onClick={() => toggleMovieCollection('watched', "remove")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0a0a0a" className="w-6 h-6" width="24px" height="24px">
                                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                        </svg>
                                        <span>Remove from watched</span>
                                      </button>
                                    ) : (
                                        <button onClick={() => toggleMovieCollection('watched',"add")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#0a0a0a" className="w-6 h-6" width="24px" height="24px">
                                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                                      </svg>
                                      <span>Mark as Watched</span>
                                      </button>
                                    )}
                                </div>
                )}
                    </div>
                </div>
            </div>
        </Modal>
        </>
    );
};
