import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'


function Header({clearPlaces, AddPhotos, refreshPlaces }) {

  const dispatch = useDispatch()

  return (

    <div className="header">
		<div className="row mt-lg-2 g-0 align-items-center h-100">
			<div className="col-9">
				<h3 className="m-0">Photo Mapper</h3>
			</div>
			<div className="col">
				<AddPhotos refreshPlaces={refreshPlaces} />
			</div>
			<div className="col">
				<i
					class="fa-solid fa-arrows-rotate"
					onClick={() => {
            dispatch(clearPlaces());
						refreshPlaces()
					}}
          ></i>
			</div>
		</div>
	</div>
  )
}

export default Header;
