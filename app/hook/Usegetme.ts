"use client";

import axios from "axios";
import { use, useEffect } from "react";

import { setUser } from "../redux/userslice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";

function useGetMe() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("/api/me");
         console.log("User data fetched:", res.data);
        dispatch(setUser(res.data.user));   //data ko global state me store kar dega

      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  },[dispatch]);
}

export default useGetMe;