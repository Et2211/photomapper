import React, { useEffect, useState } from "react";
import { format } from 'date-fns'
import TimeAgo from 'javascript-time-ago'
import _ from 'lodash'

// English.
import en from 'javascript-time-ago/locale/en'

function PhotoFeed({ places, showOnMap }) {
	TimeAgo.addDefaultLocale(en)
	const timeAgo = new TimeAgo('en-US')
	return (
		<>
			<div className="photo-feed">
				{_.orderBy(places, 'date', 'desc').map((place) => {

					return (
						<div className="photo-in-feed pt-3 text-start">
							<div className="row ps-3">
								<div className="col-6">
									<h2 className="text-start">{place.photoName}</h2>
								</div>
							</div>
							<div className="row align-items-center ps-3">
								<div className="col-12">
									<h5 className=""> Uploaded by {place.username}</h5>
								</div>
								<div className="col-6">
									<h6>{timeAgo.format(Date.now() - (Date.now() - place.date))}</h6>
								</div>
								<div className="col-6">
									<h6 onClick={()=>showOnMap(place)}><span className="show-on-map">Show on map</span></h6>
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
