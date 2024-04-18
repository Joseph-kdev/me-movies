import React from 'react'
import { useUserAuth } from '../UserAuthContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase-config'
import { useQuery } from '@tanstack/react-query'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css';
import { MovieList } from './movieList'
import { Nav } from './Nav'
import './stylesheets/collections.css'


export const UserCollections = () => {
  //get user details
  const { user } = useUserAuth()

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
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>You messed up somewhere</div>
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
             <MovieList movies={favorites} />
          ) : (
            <h1>
              You haven't added anything yet!
            </h1>
          )}
        </TabPanel>
        <TabPanel>
          {watchlist && watchlist.length > 0 ? (
              <MovieList movies={watchlist} />
          ) : (
            <h1>
              You haven't added anything yet!
            </h1>
          )}
        </TabPanel>
        <TabPanel>
          {watched && watched.length > 0 ? (
              <MovieList movies={watched} />
          ) : (
            <h1>
              You haven't added anything yet!
            </h1>
          )}
        </TabPanel>
      </Tabs>
    </>
  )
}
