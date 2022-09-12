import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Main from './examples/Main'
import {fetchData} from './AwsFunctions';
import {loadPlaces} from './redux/actions/placeActions'
import {uploadToS3} from './AwsFunctions'

import fs from 'fs'

import {useDispatch, useSelector} from 'react-redux'

function App() {
  const dispatch = useDispatch()
  const places = useSelector(state => state.places.places.Items)


  const refreshPlaces = (data) => {
    dispatch(loadPlaces(data))
  }

  useEffect(()=>{
    fetchData('Photos', refreshPlaces )

    window.addEventListener('load', function() {
      document.querySelector('input[type="file"]').addEventListener('change', function() {
          if (this.files && this.files[0]) {
              const img = URL.createObjectURL(this.files[0]); // set src to blob url
              console.log(this.files[0])
              console.log(this.files[0].name)
              console.log(img)


              uploadToS3(this.files[0], this.files[0].name, this.files[0].type)
              
          }
      });
    });
  }, [])

  return (
    <div className="App">
      <div className='row g-0 appContainer'>
        <div className='col-4'>   
          <input type='file' />
        </div>
        <div className='col-8'>
          <Main places = {places}/>
        </div>
      </div>
    </div>
  );
}

export default App;
