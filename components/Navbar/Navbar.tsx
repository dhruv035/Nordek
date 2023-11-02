import React from "react";
import Image from "next/image";
import { YourApp } from "../../components/ConnectButton";

const options = {
    "Trade":"index",
    "Earn":"earn",
    "Support":"support",
    "About":"about",

}
export const Navbar = () => {
  return (
    <div className="flex flex-row w-[100vw] h-[69px] bg-bgNav">
      
      <Image
      className="mt-[18px] ml-[22px] mb-[8px]"
        alt={"Failed To Load"}
        width={178}
        height={43}
        src={"/logo.svg"}
      ></Image>
      <div className="flex flex-row justify-center items-center w-full"> 
      {
        Object.keys(options).map((object,index)=>{
            return(
                <div key={index} className="mr-[50px] text-[16px] text-textBlue">
                    {object}
                </div>
            )
        })
      }</div>
      <div className="self-center mr-[120px]">
        <YourApp/>
      </div>
    </div>
  );
};
