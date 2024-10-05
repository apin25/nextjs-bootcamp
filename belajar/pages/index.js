import { useEffect } from "react";
import dynamic from "next/dynamic"
import Image from "next/image";

const LayoutComponent =  dynamic(() => import("@/layout"))
export default function Main({ children }) {
  useEffect(() => {
    fetch("/api/hello")
    .then(res => res.json())
    .then((res)=> console.log('response =>',res))
    .catch((err) => console.log('err',err))
  })
  return (
    <div>
    <LayoutComponent metaTitle="Home">
      <p>Home</p>
      <Image src="/next.jpg" width={400} height={400} alt="next img"/>
      <img src="/next.jpg" style={{width:400, height:400}} alt="next image"/>
    </LayoutComponent>
    </div>
  );
}