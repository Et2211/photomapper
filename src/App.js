import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap'
import Main from './examples/Main'
import AddPhotos from './components/AddPhoto';
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
        <div className='col-4'>   
          <AddPhotos refreshPlaces={refreshPlaces}/>
        </div>
        <div className='col-8'>
          <Main places = {places}/>
        </div>
      </div>
    </div>
  );
}

export default App;
