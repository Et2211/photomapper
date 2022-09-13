import React, { useEffect, useState } from 'react';

function PhotoFeed({places}) {
    console.log(places)

    return (
        <>
        <div className='photo-feed'>


        {places.map(place => {
            console.log(place)
            return (
                <div className='photo-in-feed'>
                    <div className='row'>
                        <div className='col-6'>
                            <h2 className='m-0'>{place.photoName}</h2>
                        </div>

                        <div className='col-6 align-self-center'>
                            <h5  className='m-0'> Uploaded by {place.username}</h5>
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='col-12'>
                            <img src={place.url} className='float-end h-100 w-100'></img>
                        </div>
                    </div>

                </div>
            )
        })}
        </div>
        </>
    )
}

export default PhotoFeed
