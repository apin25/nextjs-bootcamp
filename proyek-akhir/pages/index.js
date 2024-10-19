import { useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const LayoutComponent = dynamic(() => import("@/layout"));
export default function Main({ children }) {
  return (
    <div>
      <LayoutComponent metaTitle="Home">
        <p>Home</p>
      </LayoutComponent>
    </div>
  );
}
