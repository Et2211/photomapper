import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { postData } from '../api';
import Resizer from "react-image-file-resizer";
import isEmpty from 'lodash.isempty';

import apiIsLoaded from '../hooks/useMapBounds';

// consts
import LOS_ANGELES_CENTER from './../const/la_center';
import NewPhotoMarker from './NewPhotoMarker';
import NewPhotoMarkerBlank from './NewPhotoMarkerBlank';

import { useSelector } from 'react-redux'
import GoogleMap from './GoogleMap';



function AddPhotos({ refreshPlaces }) {
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
			}).then(() => {
				setPhotoName('')
				setPhoto('')
				setUsername('')
				setLng('')
				setLat('')

				refreshPlaces()
			})

		} else {
			setError(1)
		}
	}

	const setCoordinates = (e) => {
		setLat(e.lat)
		setLng(e.lng)
	}

	const loadFile = () => {
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
							<div className='row justify-content-center'>
								<div className='col-6 col-md-3 text-start'>
									<label for="fname" className=''>Your name: </label>
									<input type="text" className='form-control' id="fname" name="fname" value={username} onChange={(e) => setUsername(e.target.value)} />
								</div>
								<div className='col-6 col-md-3 text-start'>
									<label for="fname">Photo name: </label>
									<input type="text" className='form-control' id="fname" name="fname" value={photoName} onChange={(e) => setPhotoName(e.target.value)} />
								</div>
							</div>

							<div className='modal-mapContainer my-3'>
								{!isEmpty(places) && (
									<GoogleMap
										defaultCenter={LOS_ANGELES_CENTER}
										defaultZoom={3}
										yesIWantToUseGoogleMapApiInternals
										onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, places)}
										onClick={(e) => setCoordinates(e)}
									>
										{lng != '' && lat != '' &&

											(photo != '' ?
											<NewPhotoMarker
												text={username}
												lat={lat}
												lng={lng}
												photo={photo}
												photoName={photoName}
												username={username}
											/>
											:
											<NewPhotoMarkerBlank
												text={username}
												lat={lat}
												lng={lng}
												photo={photo}
												photoName={photoName}
												username={username}
											/>)
										}

									</GoogleMap>
								)}
							</div>

							<input type='file' className='form-control-file' name='files[]' multiple accept="image/*" id='photoUpload' onChange={() => loadFile()} />
							<label for="photoUpload" class="btn-2">upload</label>


						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button type="button" className="btn btn-primary" onClick={() => savetoAWS()} data-bs-dismiss="modal">Add photo</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddPhotos

