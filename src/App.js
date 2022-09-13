import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap'
import Main from './examples/Main'
import AddPhotos from './components/AddPhoto';
import PhotoFeed from './components/PhotoFeed';
import {fetchData} from './AwsFunctions';
import {loadPlaces} from './redux/actions/placeActions'


import fs from 'fs'

import {useDispatch, useSelector} from 'react-redux'

function App() {
  const dispatch = useDispatch()
  const places = useSelector(state => state.places.places.Items)


  const refreshPlaces = (data) => {
    dispatch(loadPlaces(data))
  }

  useEffect(()=>{
    fetchData('Photos', refreshPlaces)

  }, [])

  return (
    <div className="App">
      <div className='row g-0 appContainer'>
        <div className='col-3 h-100'>
          <div className='header'>

            <div className='row mt-2'>
					  	<div className='col-6'>
                <h2 className='m-0'>Photo Mapper</h2>
              </div>
					  	<div className='col-6'>
                <AddPhotos refreshPlaces={refreshPlaces}/>
              </div>
            </div>
          </div>
          <div className='row mt-2 justify-content-center'>
						<div className='col-12'>
            
              {places == undefined ?
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div> 
              : 
                <PhotoFeed places = {places}/>
              }
            </div>
          </div>
        </div>
        <div className='col-9'>
          <Main places = {places}/>
        </div>
      </div>
    </div>
  );
}

export default App;
