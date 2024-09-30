"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [isClickedLogin, setIsClickedLogin] = useState(false);
  const [isClickedOrders, setIsClickedOrders] = useState(false);

  useEffect(()=>{
    console.log("HI!")
    axios.post('/api/generate_actionlist/login', {
    // axios.post('/api/generate_actionlist/manager/orders/download', {
      message: "hi"
    })
    .then(response => {
      console.log(response)
    })
  },[isClickedLogin])

  useEffect(()=>{
    console.log("HI!")
    // axios.post('/api/generate_actionlist/login', {
    axios.post('/api/generate_actionlist/manager/orders', {
      message: "hi"
    })
    .then(response => {
      console.log(response)
    })
  },[isClickedOrders])

  const btnHandlerLogin = () => {
    setIsClickedLogin((preState) => !preState);
  }

  const btnHandlerOrders = () => {
    setIsClickedOrders((preState) => !preState);
  }

  return (
    <div>
      <button onClick={btnHandlerLogin}>로그인 호출</button>
      <button onClick={btnHandlerOrders}>주문페이지이동 호출</button>
    </div>
  );
}
