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
import useWindowDimensions from './hooks/useWindowDimensions';


import fs from 'fs'

import {useDispatch, useSelector} from 'react-redux'

function App() {
  const dispatch = useDispatch()
  const [mobileNav, setMobileNav] = useState(0)
  const { height, width } = useWindowDimensions();
  const places = useSelector(state => state.places.places.Items)


  const refreshPlaces = (data) => {
    dispatch(loadPlaces(data))
  }

  useEffect(()=>{
    fetchData('Photos', refreshPlaces)
    console.log(width)
  }, [])

  return (
    <div className="App">
      {width > 768 ? <div className='row g-0 appContainer'>
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

      :

      <div className='row g-0 appContainer'>


        <div>
          <div className='row'>
					  <div className='col-6 align-self-center'>
              <div className={mobileNav == 0 ? "mobile-nav-link active" : "mobile-nav-link"} onClick={()=>setMobileNav(0)}>
                <a>Photo Feed</a>
              </div>
            </div>
            <div className='col-6 align-self-center'>
              <div className={mobileNav == 1 ? "mobile-nav-link active" : "mobile-nav-link"} onClick={()=>setMobileNav(1)}>
                <a>World map</a>
              </div>
            </div>
          </div>
        </div>


    
          {mobileNav == 0 ? <div>
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
          :
          <div>
            <Main places = {places}/>
          </div>
          }
        </div>
}
      </div>
  );
}

export default App;
