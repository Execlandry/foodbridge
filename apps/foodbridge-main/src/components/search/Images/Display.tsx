import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchBusinessById } from "../../../redux/business/business.slice";

function Display({ dish }: any) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

  const handleNavigate = () => {
    // on click mark business selected 
     dispatch(fetchBusinessById(dish.business.id));
     navigate(`/fbe/business/${dish.business.id}`)
  }
	return !dish ? null : (
		<div
			key={dish.id}
			className='m-5 h-90 bg-white rounded-[20px] p-8'>
			{/* <Link to={`/business/${dish.dish[0]}`}> */}
			<div
				onClick={handleNavigate}
				className='hidden md:block'>
          <img className='text-sm mb-4 rounded-md' src={dish.thumbnails} />
				<h1 className='text-lg leading-5 font-bold first-letter:capitalize'>
					{dish.name}
				</h1>
				<h6 className='text-sm mb-4'>{dish.description.substr(0,80)}</h6>
        <button className="bg-green-700 text-white p-3 w-full mt-5 text-lg">
              View More
         </button>
        
			</div>

			{/* </Link> */}
		</div>
	);
}

export default Display;
