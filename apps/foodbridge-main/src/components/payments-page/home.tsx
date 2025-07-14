import React, { useEffect, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Navigate, useNavigate } from "react-router-dom";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filterAvailable, setFilterAvailabele] = useState<string[]>([]);

  useEffect(() => {}, [dispatch]);

  return <div className="bg-gray-50 min-h-screen">payments</div>;
}

export default Home;
