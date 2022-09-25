import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { postData } from '../api';
import Resizer from "react-image-file-resizer";
import isEmpty from 'lodash.isempty';

import apiIsLoaded from '../hooks/useMapBounds';

// consts
import LOS_ANGELES_CENTER from './../const/la_center';
import NewPhotoMarker from './NewPhotoMarker';

import {useSelector} from 'react-redux'
import GoogleMap from './GoogleMap';



function AddPhotos({refreshPlaces}) {
	const places = useSelector(state => state.places.places)

	const resizeFile = (file) =>
  	new Promise((resolve) => {
    	Resizer.imageFileResizer(
      	file,
      	500,
      	500,
      	"JPEG",
      	100,
      	0,
      	(uri) => {
      	  resolve(uri);
      	},
      	"base64"
    	);
  	}
	);

	const [photoName, setPhotoName] = useState('')
	const [photo, setPhoto] = useState('')
	const [username, setUsername] = useState('')
	const [lng, setLng] = useState('')
	const [lat, setLat] = useState('')
	const [error, setError] = useState(0)


	const savetoAWS = async () => {
		const files = document.getElementById('photoUpload').files[0];
		setPhoto(files)
		if (files) {
			const image = await resizeFile(files);
	
			postData('/add-photo', {
				photoData: image,
				fileName: files.name,
				fileType: files.type, 
				username: username, 
				photoName: photoName, 
				lat: lat, 
				lng: lng
			}).then(()=>refreshPlaces())
			




		} else {
			setError(1)
			console.log('error')
		}
	}

	const setCoordinates = (e) => {
		setLat(e.lat)
		setLng(e.lng)
	}

	const loadFile = () => {
		console.log('loadingh')
		const files = document.getElementById('photoUpload').files[0];
		setPhoto(URL.createObjectURL(files))
	}

	return (

		<>
			<div>
				<i className="fa-solid fa-plus add-photo-toggle" data-bs-toggle="modal" data-bs-target="#addPhotoModal"></i>
			</div>


			<div className="modal fade" id="addPhotoModal" tabIndex="-1" aria-labelledby="addPhotoModalLabel" aria-hidden="true">
			  <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-lg-down">
			    <div className="modal-content">
			      <div className="modal-header">
			        <h5 className="modal-title" id="addPhotoModalLabel">Add to the map!</h5>
			        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			      </div>
			      <div className="modal-body">
						<div className='row justify-content-end'>
								<div className='col-6'>
									<label for="fname" className='me-3'>Your name: </label>
								</div>
								<div className='col-6'>
  								<input type="text" id="fname" name="fname" value={username} onChange={(e)=>setUsername(e.target.value)}/>
								</div>
							</div>
							<div className='row justify-content-end'>
								<div className='col-6'>
									<label for="fname" className='me-3'>Photo name: </label>
								</div>
								<div className='col-6'>
  								<input type="text" id="fname" name="fname" value={photoName} onChange={(e)=>setPhotoName(e.target.value)}/>
								</div>
							</div>
							<div className='row'>
								<div className='col-6'>
									<label for="fname" className='me-3'>lng: </label>
								</div>
								<div className='col-6'>
  								<input type="number" id="lng" name="fname" value={lng} onChange={(e)=>setLng(e.target.value)}/>
								</div>
							</div>
							<div className='row'>
								<div className='col-6'>
									<label for="fname" className='me-3'>lat: </label>
								</div>
								<div className='col-6'>
  								<input type="number" id="lat" name="fname" value={lat} onChange={(e)=>setLat(e.target.value)}/>
								</div>
							</div>


							<div className='modal-mapContainer'>
							{console.log('RENDERING')}
							{!isEmpty(places) && (
							<GoogleMap
								defaultCenter={LOS_ANGELES_CENTER}
								defaultZoom={3}
								yesIWantToUseGoogleMapApiInternals
								onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, places)}
								onClick ={(e)=>setCoordinates(e)}
								>
            					{lng != '' && 
									<NewPhotoMarker 
                					text={username}
                					lat={lat}
                					lng={lng}
                					photo={photo}
                					photoName={photoName}
                					username={username}
                					/>
								}
    
    						</GoogleMap>
							)}
							</div>


						<input type='file' name='files[]' multiple accept="image/*" id='photoUpload' onChange={()=>loadFile()}/>
			      </div>
			      <div className="modal-footer">
			        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			        <button type="button" className="btn btn-primary" onClick={()=>savetoAWS()} data-bs-dismiss="modal">Add photo</button>
			      </div>
			    </div>
			  </div>
			</div>
		</>
	)
}

export default AddPhotos

