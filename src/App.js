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
      <div className='row g-0 appContainer d-none d-md-flex'>
        <div className='col-3 col-lg-3 h-100'>
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
        <div className='col'>
          <Main places = {places}/>
        </div>
      </div>
      <div className='row g-0 appContainer d-flex d-md-none'>

        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation"data-bs-target="#home-tab-pane" type="button" aria-controls="home-tab-pane" aria-selected="true">
            <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Photo Feed</button>
          </li>
          <li class="nav-item" role="presentation" data-bs-target="#profile-tab-pane" type="button" aria-controls="profile-tab-pane" aria-selected="false">
            <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">World Map</button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
            <div className='header'>

              <div className='row my-2'>
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

          <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">
            <Main places = {places}/>

          </div>
        </div>



      </div>

    </div>
  );
}

export default App;
