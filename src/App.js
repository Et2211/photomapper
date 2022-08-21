import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Main from './examples/Main'
import {fetchData} from './AwsFunctions';
import {loadPlaces} from './redux/actions/placeActions'

import {useDispatch} from 'react-redux'

function App() {
  const [places, setPlaces] = useState([])
  const dispatch = useDispatch()

  const refreshPlaces = (data) => {
    dispatch(loadPlaces(data))
  }

  useEffect(()=>{
    fetchData('Photos', refreshPlaces )
  })



  return (
    <div className="App">
      <div className='row g-0 appContainer'>
        <div className='col-4'>   
        </div>
        <div className='col-8'>
        <Main places={places.items}/>
          
        </div>
      </div>
    </div>
  );
}

export default App;
