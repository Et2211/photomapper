import React, { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux'




function Header({resetPlaces, AddPhotos, refreshPlaces }) {

  const dispatch = useDispatch()

  return (

    <div className="header">
		<div className="row mt-lg-2 g-0 align-items-center h-100">
			<div className="col-9">
				<div className="row align-items-center ms-3">
					<div className="col-3">
						<img src="/logo.png" className="w-100"></img>
					</div>	
					<div className="col">
						<h3 className="m-0">Photo Mapper</h3>
					</div>
				</div>
			</div>
			<div className="col">
				<AddPhotos refreshPlaces={refreshPlaces} />
			</div>
			<div className="col">
				<i
					class="fa-solid fa-arrows-rotate"
					onClick={() => {
            			resetPlaces();
						refreshPlaces()
					}}
          ></i>
			</div>
		</div>
	</div>
  )
}

export default Header;
