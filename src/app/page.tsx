"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  // const [isClickedLogin, setIsClickedLogin] = useState(false);
  // const [isClickedOrders, setIsClickedOrders] = useState(false);

  // useEffect(()=>{
  //   console.log("HI!")
  //   axios.post('/api/generate_actionlist/login', {
  //   // axios.post('/api/generate_actionlist/manager/orders/download', {
  //     message: "hi"
  //   })
  //   .then(response => {
  //     console.log(response)
  //   })
  // },[isClickedLogin])

  // useEffect(()=>{
  //   console.log("HI!")
  //   // axios.post('/api/generate_actionlist/login', {
  //   axios.post('/api/generate_actionlist/manager/orders', {
  //     message: "hi"
  //   })
  //   .then(response => {
  //     console.log(response)
  //   })
  // },[isClickedOrders])

  // const btnHandlerLogin = () => {
  //   setIsClickedLogin((preState) => !preState);
  // }

  // const btnHandlerOrders = () => {
  //   setIsClickedOrders((preState) => !preState);
  // }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: 300 }}>
      {/* <button onClick={btnHandlerLogin}>로그인 호출</button>
      <button onClick={btnHandlerOrders}>주문페이지이동 호출</button> */}
      <h1>WELCOME</h1>
      <h2>Now, you can use this server!</h2>
    </div>
  );
}