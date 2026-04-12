"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInitialCart } from "@/app/redux/cartslice";

export default function CartLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const data = localStorage.getItem("cart");
    if (data) {
      dispatch(setInitialCart(JSON.parse(data)));
    }
  }, [dispatch]);

  return null;
}