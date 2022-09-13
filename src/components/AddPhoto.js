import React, { useEffect, useState } from 'react';
import {uploadToS3, putData} from './../AwsFunctions'
import GoogleMapReact from 'google-map-react';

// examples:
import GoogleMap from './GoogleMap';

// consts
import LOS_ANGELES_CENTER from './../const/la_center';


function AddPhotos({refreshPlaces}) {

	const [photoName, setPhotoName] = useState('')
	const [username, setUsername] = useState('')
	const [lng, setLng] = useState('')
	const [lat, setLat] = useState('')
	const [url, setUrl] = useState('')
	const [error, setError] = useState(0)

	const savetoAWS = () => {
		const files = document.getElementById('photoUpload').files[0];
		if (files) {
			uploadToS3(files, files.name, files.type, username, photoName, lat, lng, refreshPlaces)
		} else {
			setError(1)
		}
	}

	const handleApiLoaded = (map, maps) => {
		// use map and maps objects
	};

	const setCoordinates = (e) => {
		setLat(e.lat)
		setLng(e.lng)
	}

	return (

		<>
			<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
			  Add new photo
			</button>

			<div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			  <div className="modal-dialog modal-lg">
			    <div className="modal-content">
			      <div className="modal-header">
			        <h5 className="modal-title" id="exampleModalLabel">Add to the map!</h5>
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


							<GoogleMapReact
    					  bootstrapURLKeys={{
    					    key:'AIzaSyDMvSLjIjkexqyJ1PxJb-AnnsoOY_nLfNM',
    					  }}
								defaultCenter={LOS_ANGELES_CENTER}
								defaultZoom={10}
								yesIWantToUseGoogleMapApiInternals
    					  onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
								onClick ={(e)=>setCoordinates(e)}
    					>
    					  
    					</GoogleMapReact>
							</div>


							<input type='file' name='files[]' id='photoUpload'/>
			      </div>
			      <div className="modal-footer">
			        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			        <button type="button" className="btn btn-primary" onClick={()=>savetoAWS()} data-bs-dismiss="modal">Save changes</button>
			      </div>
			    </div>
			  </div>
			</div>
		</>
	)
}

export default AddPhotos

