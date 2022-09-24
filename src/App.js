import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap'
import Main from './components/Main'
import AddPhotos from './components/AddPhoto';
import PhotoFeed from './components/PhotoFeed';
import {loadPlaces, clearPlaces} from './redux/actions/placeActions'
import useWindowDimensions from './hooks/useWindowDimensions';
import {getData, postData} from './api'


import fs from 'fs'

import {useDispatch, useSelector} from 'react-redux'
import Header from './components/Header';

function App() {
  const dispatch = useDispatch()
  const [mobileNav, setMobileNav] = useState(0)
  const { height, width } = useWindowDimensions();
  const places = useSelector(state => state.places.places)


  const refreshPlaces = () => {
    getData('/data').then((res)=>{
      dispatch(loadPlaces(res))
    }
  )}

  useEffect(()=>{
    refreshPlaces()
  }, [])

  return (
    <div className="App">
      {width > 768 ? <div className='row g-0 appContainer'>
        <div className='col-4 col-lg-3 h-100'>
          <Header clearPlaces={clearPlaces} AddPhotos={AddPhotos} refreshPlaces={refreshPlaces}/>
          <div className='row mt-2 justify-content-center'>
						<div className='col-12'>
              {places == undefined || Object.keys(places).length == 0 ?
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

          <div className='row g-0 mobile-nav my-auto justify-content-center align-items-center'>
					  <div className='col-6'>
              <div className={mobileNav == 0 ? "mobile-nav-link active" : "mobile-nav-link"} onClick={()=>setMobileNav(0)}>
                <p className='m-0'><i class="fa-solid fa-camera"></i></p>
              </div>
            </div>
            <div className='col-6'>
              <div className={mobileNav == 1 ? "mobile-nav-link active" : "mobile-nav-link"} onClick={()=>setMobileNav(1)}>
                <p className='m-0'><i class="fa-solid fa-earth-europe"></i></p>
              </div>
            </div>
          </div>
    


    
          {mobileNav == 0 ? <div>
            <Header clearPlaces={clearPlaces} AddPhotos={AddPhotos} refreshPlaces={refreshPlaces}/>

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
          <div className='row g-0'>
            <div className='col'>
              <Main places = {places}/>
            </div>
          </div>
          }
        </div>
}
      </div>
  );
}

export default App;
