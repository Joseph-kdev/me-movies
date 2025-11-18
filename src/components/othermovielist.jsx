import { Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "usehooks-ts";

export default function OtherMovieList({ movieResults }) {
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [open, setOpen] = useState(false);
  const mobileRef = useRef(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useOnClickOutside(mobileRef, () => setOpen(false));

  const handleClick = (movie) => {
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleImageLoad = (movieId) => {
    setLoadedImages((prev) => new Set([...prev, movieId]));
  };

  const handleImageError = (movieId) => {
    setLoadedImages((prev) => new Set([...prev, movieId]));
  };

  const shouldPositionLeft = (index) => {
    const screenWidth = window.innerWidth;
    let cols = 2;
    if (screenWidth >= 768) cols = 5;
    else if (screenWidth >= 640) cols = 4;

    return (index + 1) % cols === 0;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4 justify-items-center px-1">
      {movieResults &&
        movieResults.map((movie, index) => (
          <div key={movie.id} className="relative">
            <motion.div
              className="cursor-pointer"
              onHoverStart={() => setHoveredMovie(movie.id)}
              onHoverEnd={() => setHoveredMovie(null)}
              layout
            >
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                {loadedImages.has(movie.id) && (
                  <motion.div
                    layoutId={`movie-rating-${movie.id}`}
                    className="flex items-center gap-1 absolute top-2 left-2 z-10 bg-black/70 text-white px-2 py-1 rounded-md text-xs"
                  >
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <p className="text-yellow-400">
                      {movie.vote_average.toFixed(1)}
                    </p>
                  </motion.div>
                )}
                <motion.img
                  layoutId={`movie-img-${movie.id}`}
                  className="w-full h-full object-cover rounded-lg"
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : `https://placehold.co/400x600/1a1a1a/FFFFFF.png`
                  }
                  alt={movie.title}
                  onLoad={() => handleImageLoad(movie.id)}
                  onError={() => handleImageError(movie.id)}
                  onClick={() => handleClick(movie)}
                />
              </motion.div>

              <AnimatePresence>
                {hoveredMovie === movie.id && (
                  <motion.div
                    initial={{ opacity: 0, width: "400px" }}
                    animate={{ opacity: 1, width: "400px" }}
                    exit={{ opacity: 0, width: "400px" }}
                    transition={{ duration: 0.3 }}
                    className={`absolute top-0 z-20 rounded-lg bg-accent/90 shadow-2xl hidden lg:block p-3 ${
                      shouldPositionLeft(index) ? "right-0" : "left-0"
                    }`}
                  >
                    <div className="flex gap-4 items-start max-w-[400px] relative">
                      <div className="min-w-[120px] relative">
                        <motion.div
                          layoutId={`movie-rating-${movie.id}`}
                          className="flex items-center gap-1 absolute -top-2 -right-2 z-10 bg-black/70 text-white px-1 py-0.5 rounded-md text-xs"
                        >
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <p className="text-yellow-400">
                            {movie.vote_average.toFixed(1)}
                          </p>
                        </motion.div>
                        <motion.img
                          className="w-full h-50 object-cover rounded-lg"
                          layoutId={`movie-img-${movie.id}`}
                          src={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                              : `https://placehold.co/400x600/1a1a1a/FFFFFF.png`
                          }
                          alt={movie.title}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="space-y-2">
                          <motion.h3
                            layoutId={`movie-title-${movie.id}`}
                            className="font-semibold leading-tight text-background text-sm"
                          >
                            {movie.title}
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0, filter: "blur(4px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(4px)" }}
                            transition={{ delay: 0.1 }}
                            className="text-xs line-clamp-4 leading-relaxed text-secondary"
                          >
                            {movie.overview}
                          </motion.p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-primary">
                              {new Date(movie.release_date).getFullYear()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ delay: 0.2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full cursor-pointer"
                    >
                      <button className="w-full bg-secondary text-text rounded-2xl p-1 mt-1 text-sm">
                        <Link
                          to={`/${
                            movie.type || (movie.name ? "tv" : "movie")
                          }/${movie.id}`}
                        >
                          View Details
                        </Link>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        ))}
      {/* mobile device dialog */}

      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 backdrop-blur flex justify-center items-center z-20"
        >
          <div
            className="relative max-w-sm mx-auto bg-cover bg-center bg-no-repeat max-h-[600px] rounded-md"
            style={{
              backgroundImage: selectedMovie.poster_path
                ? `url(https://image.tmdb.org/t/p/w500${selectedMovie.poster_path})`
                : "url(https://placehold.co/400x600/1a1a1a/FFFFFF.png)",
            }}
            ref={mobileRef}
          >
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary to-black z-10 rounded-md"></div>

            <button
              className="absolute left-2 top-1 text-background z-30"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>

            <motion.div
              layoutId={`movie-rating-${selectedMovie.id}`}
              className="flex items-center gap-1 absolute top-2 right-2 z-10 bg-black/70 text-white rounded-md text-xs px-1 py-0.5"
            >
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <p className="text-yellow-400">
                {selectedMovie.vote_average.toFixed(1)}
              </p>
            </motion.div>

            <div className="relative z-20 min-h-[248px] text-text mt-[300px] p-2">
              <div>
                <h2 className="font-semibold leading-tight text-text">
                  {selectedMovie.title ?? selectedMovie.name}
                </h2>
              </div>
              <motion.p
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ delay: 0.1 }}
                className="line-clamp-6 text-sm leading-relaxed text-text my-2"
              >
                {selectedMovie.overview}
              </motion.p>
              <p className="text-sm text-gray-400">
                {new Date(
                  selectedMovie.release_date ?? selectedMovie.first_air_date
                ).getFullYear()}
              </p>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full cursor-pointer text-background absolute bottom-3 left-0 mt-1 p-1"
              >
                <button className="w-full bg-accent rounded-2xl p-1">
                  <Link
                    to={`/${
                      selectedMovie.type ||
                      (selectedMovie.name ? "tv" : "movie")
                    }/${selectedMovie.id}`}
                  >
                    View Details
                  </Link>
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
