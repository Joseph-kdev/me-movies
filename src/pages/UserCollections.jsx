import { useUserAuth } from '../UserAuthContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase-config'
import { useQuery } from '@tanstack/react-query'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css';
import { MovieList } from '../components/movieList'
import { Nav } from '../components/Nav'
import './stylesheets/collections.css'
import { MoonLoader } from 'react-spinners'


export const UserCollections = () => {
  //get user details
  const { user } = useUserAuth()
  // const [firstName, ...rest] = user.displayName.split(" ")
  // const displayName = firstName ? firstName : 'Your'

  //get user favorites from firestore with react query
  const userLists = async(listType) => {
    const collectionRef = collection(db, `users/${user.uid}/${listType}`)
    const querySnapshot = await getDocs(collectionRef)

    const retrievedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return retrievedData
  }

  const {data: favorites, isLoading, isError} = useQuery({
    queryKey:['favorites', ],
    queryFn: () => userLists('favorites')
  })
  const {data: watched} = useQuery({
    queryKey:['watched', ],
    queryFn: () => userLists('watched')
  })
  const {data: watchlist} = useQuery({
    queryKey:['watchlist', ],
    queryFn: () => userLists('watchlist')
  })

  if (isLoading) {
    return <div className='loading'>
    <MoonLoader size={70} color="#efe4ef" speedMultiplier={2}/>
  </div>
  }

  if (isError) {
    return <div className="no-data"><img src="/images/server-down.svg" alt="" /><h3>An Error occurred. Server inaccessible</h3></div>
  }

  return (
    <>
    <Nav />
    <h2 className='collection-heading'>Your Collection</h2>
      <Tabs className='tab'>
        <TabList className='tab-heading'>
          <Tab>Favorites</Tab>
          <Tab>Watchlist</Tab>
          <Tab>Watched</Tab>
        </TabList>

        <TabPanel>
          {favorites && favorites.length > 0 ? (
            <div className='collection-section'>
              <MovieList movies={favorites} />
            </div>
          ) : (
           <div className='no-data'>
            <img src="/images/void.svg" alt="" />
            <h3>Oops!! <br />Looks like you haven't added anything yet!</h3>
           </div>
          )}
        </TabPanel>
        <TabPanel>
          {watchlist && watchlist.length > 0 ? (
            <div className='collection-section'>
              <MovieList movies={watchlist} />
            </div>
          ) : (
            <div className='no-data'>
            <img src="/images/void.svg" alt="" />
            <h3>Oops!! <br />Looks like you haven't added anything yet!</h3>
           </div>
          )}
        </TabPanel>
        <TabPanel>
          {watched && watched.length > 0 ? (
            <div className='collection-section'>
              <MovieList movies={watched} />
            </div>
          ) : (
            <div className='no-data'>
            <img src="/images/void.svg" alt="" />
            <h3>Oops!! <br />Looks like you haven't added anything yet!</h3>
           </div>
          )}
        </TabPanel>
      </Tabs>
    </>
  )
}
