import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Main from './examples/Main'
import {fetchData} from './AwsFunctions';

function App() {

  useEffect(() => {
    const data = fetchData('Photos')
    console.log(data)
  });


  return (
    <div className="App">
      <div className='row g-0 appContainer'>
        <div className='col-4'>   
        </div>
        <div className='col-8'>
        <Main/>
          
        </div>
      </div>
    </div>
  );
}

export default App;
