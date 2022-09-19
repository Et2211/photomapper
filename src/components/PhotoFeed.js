import React, { useEffect, useState } from "react";
import { format } from 'date-fns'


function PhotoFeed({ places }) {
	console.log(places)
	return (
		<>
			<div className="photo-feed">
				{places.map((place) => {
					console.log(place)
					console.log(format(place.date, 'dd/MM/yyyy'))

					return (
						<div className="photo-in-feed">
							<div className="row justify-content-center">
								<div className="col-6">
									<h2 className="text-start">{place.photoName}</h2>
								</div>
							</div>
							<div className="row align-items-center">
								<div className="col-8">
									<h5 className=""> Uploaded by {place.username}</h5>
								</div>
								<div className="col-4">
									<h6>{format(place.date, 'dd/MM/yyyy')}</h6>
								</div>
							</div>

							<div className="row mt-3">
								<div className="col-12">
									<img src={place.url} className="float-end h-100 w-100"></img>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default PhotoFeed;
