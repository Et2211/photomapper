import React, { Component } from 'react';
import isEmpty from 'lodash.isempty';
import { format } from 'date-fns'

// components:
import Marker from './Marker';

// examples:
import GoogleMap from './GoogleMap';

// consts
import LOS_ANGELES_CENTER from '../const/la_center';

import apiIsLoaded from '../hooks/useMapBounds';


class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
    };
  }

  render() {
    const { places } = this.props;
    return (
      <div className='mapContainer'>
        {!isEmpty(places) && (
          <GoogleMap
            defaultZoom={10}
            defaultCenter={LOS_ANGELES_CENTER}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, places)}

          >
            
           
            {places.map((place, i) => {
              return (
                <Marker
                key={place.id}
                text={place.name}
                lat={place.lat}
                lng={place.lng}
                photo={place.url}
                photoName={place.photoName}
                username={place.username}
                date={format(place.date, 'dd/MM/yyyy')}
                i={i}
                />
              
                )})}
              </GoogleMap>
        )}
      </div>
    );
  }
}

export default Main;
