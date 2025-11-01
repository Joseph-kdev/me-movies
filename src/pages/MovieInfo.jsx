import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import "./stylesheets/MovieInfo.css";
import { Nav } from "../components/Nav";
import { ClimbingBoxLoader } from "react-spinners";
import { useEffect, useRef, useState } from "react";
import { Calendar, Clock, Star } from "lucide-react";
import { motion } from "motion/react";
import { useUserAuth } from "../UserAuthContext";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
import { Flip, toast } from "react-toastify";

export const MovieInfo = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const { id, type } = useParams();
  const baseUrl = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&append_to_response=videos,credits`;
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const { user } = useUserAuth();
  const queryClient = useQueryClient();
  const [movieInCollections, setMovieInCollections] = useState({
    watched: false,
    watchlist: false,
    favorites: false,
  });

  // Update the fetchMovieCollections function
  useEffect(() => {
    const fetchMovieCollections = async () => {
      if (!user) {
        setMovieInCollections({
          watched: false,
          watchlist: false,
          favorites: false,
        });
        return;
      }

      try {
        const collections = ["watched", "watchlist", "favorites"];
        const results = await Promise.all(
          collections.map((listType) =>
            getDocs(
              query(
                collection(db, `users/${user.uid}/${listType}`),
                where("id", "==", id),
                where("type", "==", type) // Add type check
              )
            )
          )
        );

        const movieInCollections = results.reduce(
          (acc, querySnapshot, index) => {
            acc[collections[index]] = !querySnapshot.empty;
            return acc;
          },
          {
            watched: false,
            watchlist: false,
            favorites: false,
          }
        );
        setMovieInCollections(movieInCollections);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchMovieCollections();
    }
  }, [user, id, type]); // Add type to dependencies
  const toggleMovieCollection = async (listType, action) => {
    if (!user) {
      toast.error(
        <div>
          Please login/sign-up <Link to="/login">here</Link> to access this
          feature :)
        </div>,
        {
          position: "top-center",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Flip,
        }
      );
      return; // stop if not logged in
    }

    if (!movie) {
      toast.error("Movie data not loaded yet.");
      return;
    }

    try {
      const collectionRef = collection(db, `users/${user.uid}/${listType}`);
      const movieQuery = query(
        collectionRef,
        where("id", "==", id),
        where("type", "==", type) // Add type check
      );

      // Build query to check if movie already exists
      const querySnapshot = await getDocs(movieQuery);

      if (querySnapshot.empty) {
        // Movie not found, add it
        if (action === "add") {
          await addDoc(collectionRef, {
            id,
            title: movie.title || movie.name,
            overview: movie.overview,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date || movie.first_air_date,
            type,
          });
          toast.success(`${movie.title || movie.name} added to ${listType}`, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Flip,
          });
          setMovieInCollections((prevState) => ({
            ...prevState,
            [listType]: true,
          }));
        } else {
          console.log("Cannot remove non-existent movie");
        }
      } else {
        // Movie found, perform action based on 'add' or 'remove'
        const docRef = querySnapshot.docs[0].ref; // Get reference of the found document
        if (action === "add") {
          console.log("Already saved");
        } else if (action === "remove") {
          await deleteDoc(docRef);
          toast.warning(
            `${movie.title || movie.name} has been removed from ${listType}`,
            {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Flip,
            }
          );
          setMovieInCollections((prevState) => ({
            ...prevState,
            [listType]: false,
          }));
        }
      }

      // Invalidate the query to refetch data from Firestore
      queryClient.invalidateQueries([`userCollections-${id}`]);
    } catch (error) {
      console.log(error);
    }
  };

  const moveToWatched = async () => {
    try {
      // Remove the movie from the watchlist
      if (!user) {
        toast.error("Please login to modify collections.");
        return;
      }

      if (!movie) {
        toast.error("Movie data not loaded yet.");
        return;
      }

      const watchlistRef = collection(db, `users/${user.uid}/watchlist`);
      const watchlistQuery = query(
        watchlistRef,
        where("id", "==", id),
        where("type", "==", type) // Add type check
      );
      const watchlistQuerySnapshot = await getDocs(watchlistQuery);

      if (!watchlistQuerySnapshot.empty) {
        const watchlistDocRef = watchlistQuerySnapshot.docs[0].ref;
        await deleteDoc(watchlistDocRef);
      }

      // Add the movie to the watched collection
      const watchedRef = collection(db, `users/${user.uid}/watched`);
      await addDoc(watchedRef, {
        id,
        title: movie.title || movie.name,
        overview: movie.overview,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date || movie.first_air_date,
        type,
      });
      toast.success(`${movie.title || movie.name} moved to watched`, {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Flip,
      });

      // Update the movieInCollections state
      setMovieInCollections((prev) => ({
        ...prev,
        watched: true,
        watchlist: false,
      }));

      // Invalidate the query to refetch data from Firestore
      queryClient.invalidateQueries([`userCollections-${id}`]);
    } catch (error) {
      console.log(error);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "";
    return `${minutes}m`;
  };

  const formatYear = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).getFullYear();
  };

  //use movie id to return movie details from TMDB
  const getMovieInfo = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
  };

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movie"],
    queryFn: getMovieInfo,
  });

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = contentRef.current.scrollWidth;
        const maxDrag = Math.max(0, contentWidth - containerWidth);
        setDragConstraints({ left: -maxDrag, right: 0 });
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [movie, isLoading]);

  let officialTrailer;

  if (movie) {
    officialTrailer = movie.videos.results.find(
      (trailer) => trailer.type === "Trailer"
    )
      ? movie.videos.results.find((trailer) => trailer.type === "Trailer")
      : movie.videos.results[0];
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto pb-4">
      <Nav />
      <div className="mt-[100px]">
        {/* <button
          onClick={() => navigate(-1)}
          className="my-6 h-10 w-10 ml-4 bg-secondary rounded-full"
        >
          <ArrowLeft className="h-5 w-5 text-text" />
        </button> */}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <ClimbingBoxLoader size={28} color="#efe4ef" />
          </div>
        ) : isError ? (
          <p>Error fetching movie details</p>
        ) : (
          <div className="px-4 mx-auto">
            <div className="flex gap-4 w-full flex-col items-center md:flex-row md:items-start p-4 md:shadow-2xl shadow-accent md:gap-6 md:p-4 rounded-lg bg-primary text-text">
              <div className="shrink-0 relative">
                <img
                  src={
                    movie?.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
                      : `https://placehold.co/600x400/1a1a1a/FFFFFF.png`
                  }
                  alt={movie?.title}
                  className="w-48 h-72 object-cover rounded-lg"
                />
                <div className="absolute top-1">
                  <button>
                    {movieInCollections.favorites ? (
                      <div
                        onClick={() =>
                          toggleMovieCollection("favorites", "remove")
                        }
                        className="flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="red"
                          strokeWidth={1.5}
                          stroke="red"
                          className="w-6 h-6"
                          width="28px"
                          height="28px"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          toggleMovieCollection("favorites", "add")
                        }
                        className="flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          strokeWidth={1.5}
                          stroke="red"
                          className="w-6 h-6"
                          width="28px"
                          height="28px"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {/* Watchlist/Watched section */}
                  {!movieInCollections.watched ? (
                    <div className="otherRow">
                      {movieInCollections.watchlist && (
                        <div className="thirdRow">
                          <button
                            onClick={() => moveToWatched()}
                            className="w-48 p-1 rounded-2xl"
                          >
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="#303e26"
                                className="w-6 h-6"
                                width="24"
                                height="24"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875Zm6.905 9.97a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V18a.75.75 0 0 0 1.5 0v-4.19l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
                                  clipRule="evenodd"
                                />
                                <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                              </svg>
                              <span className="text-xs">Move to Watched</span>
                            </div>
                          </button>
                        </div>
                      )}
                      {!movieInCollections.watched && (
                        <div className="thirdRow">
                          <button className="w-48 p-1 rounded-2xl">
                            {movieInCollections.watchlist ? (
                              <div
                                onClick={() =>
                                  toggleMovieCollection("watchlist", "remove")
                                }
                                className="flex items-center gap-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="#303e26"
                                  className="w-6 h-6"
                                  width="24px"
                                  height="24px"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-xs">
                                  Remove from watchlist
                                </span>
                              </div>
                            ) : (
                              <div
                                onClick={() =>
                                  toggleMovieCollection("watchlist", "add")
                                }
                                className="flex items-center gap-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="#0a0a0a"
                                  className="w-6 h-6"
                                  width="24px"
                                  height="24px"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm">
                                  Add to Watchlist
                                </span>
                              </div>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="thirdRow">
                      <button
                        className="w-48 p-1 rounded-2xl"
                      >
                        <div
                          onClick={() =>
                            toggleMovieCollection("watched", "remove")
                          }
                          className="flex items-center gap-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="#303e26"
                            className="w-6 h-6"
                            width="24px"
                            height="24px"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-xs">Remove from watched</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-4">
                  {movie.title ? movie.title : movie.name}
                </h1>

                <div className="flex flex-wrap gap-2 mb-4">
                  {movie?.genres.slice(0, 3).map((genre) => (
                    <div
                      className="wavy-fade px-2 py-1 rounded-2xl text-xs bg-secondary"
                      key={genre.id}
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>

                <p className="text-[#e8ffde] leading-relaxed mb-6">
                  {movie?.overview}
                </p>

                <div className="flex items-center gap-6 text-sm text-[#a7b6a1]">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{movie?.vote_average}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {type == "movie" ? (
                      <span>{formatRuntime(movie.runtime)}</span>
                    ) : (
                      <span>{movie.number_of_seasons} sns</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {movie.release_date
                        ? formatYear(movie.release_date)
                        : formatYear(movie.first_air_date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="mb-6 md:mb-8 mt-4 no-scrollbar overflow-hidden"
              ref={containerRef}
            >
              <h2 className="text-lg md:text-xl font-bold text-text mb-4 md:mb-6">
                Cast
              </h2>
              <motion.div
                ref={contentRef}
                drag="x"
                dragConstraints={dragConstraints}
                dragElastic={0.1}
                dragMomentum={true}
                whileDrag={{ cursor: "grabbing" }}
                className="flex gap-3 md:gap-4 w-fit pb-2 cursor-grab"
              >
                {movie?.credits.cast.map((actor, index) => (
                  <div
                    key={actor.id}
                    className="shrink-0 text-center wavy-fade"
                    style={{ "--genreIndex": index + 1 }}
                  >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-muted mb-2 overflow-hidden">
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                            : `https://placehold.co/600x400/1a1a1a/FFFFFF.png`
                        }
                        alt={actor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-[#ffbef7] max-w-[70px] md:max-w-20 truncate">
                      {actor.name}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-4 md:mb-6 text-text">
                Trailer
              </h2>
              <div className="aspect-video flex items-center justify-center bg-muted">
                {movie?.videos.results.length != 0 ? (
                  <iframe
                    width="400"
                    height="315"
                    src={`https://www.youtube.com/embed/${officialTrailer?.key}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full md:shadow-2xl shadow-primary"
                  />
                ) : (
                  <div>
                    <h3>No trailer available</h3>
                  </div>
                )}
              </div>
            </div>
            {/* {id && <SimilarMovies movieId={id} />} */}
          </div>
        )}
      </div>
    </div>
  );
};
