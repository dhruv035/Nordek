import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { usePrevious } from "../hooks/usePrevious";
import Image from "next/image";
import { useRef } from "react";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  createFilterOptions,
  TextField,
  Input,
  Typography,
  Box,
  Modal,
} from "@mui/material";
import { tokenToTicker, nameToSymbol } from "../utils/data";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  boxShadow: 0,
  p: 0,
};

type Options = { [key: string]: string };

const Home: NextPage = () => {
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [inputValue, setInputValue] = useState<string | undefined>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<string[]>(
    Object.keys(nameToSymbol)
  );
  const tokenRef = useRef(selectedToken);
  const filterOptions = createFilterOptions({
    matchFrom: "start",
  });
  let socket: WebSocket;
  useEffect(() => {
    if (!inputValue && inputValue === "")
      setFilteredData(Object.keys(nameToSymbol));
    else if (inputValue) {
      const filter = Object.keys(nameToSymbol).filter((name) =>
        name.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setFilteredData(filter);
    }
  }, [inputValue]);

  useEffect(() => {
    if (!selectedToken) return;
    wssSetup();
    return () => {
      socket.close();
    };
  }, [selectedToken]);

  const wssSetup = () => {
    socket = new WebSocket("wss://stream.binance.com:9443/ws");
    if (tokenRef.current !== selectedToken) {
      console.log("Previous was", tokenRef.current, selectedToken);
      socket.onopen = function () {
        if (tokenRef.current)
          socket.send(
            JSON.stringify({
              method: "UNSUBSCRIBE",
              params: [
                nameToSymbol[tokenRef.current].toLowerCase() + "usdt@ticker_1h",
              ],
              id: 1,
            })
          );
        if (selectedToken)
          socket.send(
            JSON.stringify({
              method: "SUBSCRIBE",
              params: [
                nameToSymbol[selectedToken].toLowerCase() + "usdt@ticker_1h",
              ],
              id: 1,
            })
          );
      };
      socket.onmessage = function (event) {
        console.log("DATA", event);
        const data = JSON.parse(event.data);
        console.log("JSON", data);
        if (data?.w) setPrice(data.w);
      };
    }
  };
  return (
    <div className="bg-background min-h-[100vh]">
      <Head>
        <title>Demo UI App </title>
        <meta content="Made by Dhruv Gupta" name="test task" />
        <link href="/favicon.ico" rel="icon" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" />
      </Head>

      <main>
        <Navbar />

        <div className="flex flex-col mt-[179px] justify-center items-center">
          <img
            style={{
              height: "70px",
              width: "70px",
              objectFit: "cover",
            }}
            className="rounded-[50%] p-[10px] bg-innerBg"
            src={
              selectedToken
                ? "/tokens/" + nameToSymbol[selectedToken] + ".svg"
                : "/tokens/eth.svg"
            }
            alt="No Image"
          ></img>
          <Image
            width={470}
            height={567}
            className="mt-[-45px]"
            alt={"No Image"}
            src={"/container.svg"}
          />
          <div className="flex justify-center w-[470px] h-[567px] mt-[-567px] pt-[79px]">
            <div className="flex flex-col w-5/6 text-white  font-poppins">
              <div className="flex flex-row ">
                <p className="text-[14px] self-center min-w-[96px] w-max">
                  Current Value
                </p>
                <div className="flex flex-row-reverse w-full">
                  <p className="text-[24px] self-center text-textPurple ml-1">
                    {price ? Number(price) * 80 : "0.00"}
                  </p>
                  <img height={20} width={14} src={"/rupay.svg"}></img>
                </div>
              </div>
              <div
                onClick={() => setOpenModal(true)}
                className="flex items-center h-[60px] bg-innerBg rounded-[10px]"
              >
                {selectedToken ? (
                  <div className="flex flex-row ml-[25px]">
                    {selectedToken && (
                      <img
                        className="mr-[5px]"
                        src={
                          "/tokens/" +
                          nameToSymbol[selectedToken].toLowerCase() +
                          ".svg"
                        }
                      />
                    )}
                    <p className="self-center ml-[5px]">
                      {nameToSymbol[selectedToken]}
                    </p>
                  </div>
                ) : (
                  <div className="ml-20">Select Token</div>
                )}
              </div>
              <p className="text-[14px] self-start mt-[24px] w-max">
                Amount you want to invest
              </p>
              <input
                type="number"
                className="text-white bg-bgNav bg-transparent border-borderPurple border-2 rounded-[5px] h-[60px] pl-[76px] w-full"
                placeholder="0.00"
                onChange={(e) => {
                  setInputValue(e.currentTarget.value);
                }}
                value={inputValue ? inputValue : ""}
              />
              <p className="text-[14px] self-start mt-[24px] w-max">
                Estimate Number of ETH You will Get
              </p>
              <input
                disabled
                className="text-white bg-innerBg border-borderPurple border-2 rounded-[5px] h-[60px] pl-[76px] focus:border-borderPurple w-full"
                value={
                  inputValue && price ? Number(inputValue) / price / 80 : "0.00"
                }
              />
              <button
                className="bg-buttonGradient w-[140px] h-[40px] w-full rounded-[30px] mt-[40px]"
                type="button"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={modalStyle}
            className="flex flex-col items-center bg-innerBg rounded-[20px] h-[461px] overflow-hidden"
          >
            <div className="flex flex-row-reverse w-full">
              <img
                onClick={() => setOpenModal(false)}
                className="h-[24px] w-[24px] mr-[12px] mt-[12px]"
                src="/closeButton.svg"
              ></img>
            </div>
            <div className="w-[80%] mt-[20px] ov">
              <div className="flex w-full border-borderPurple">
                <input
                  className="text-white bg-innerBg border-borderPurple border-2 rounded-[30px] h-[40px] pl-[76px] focus:border-borderPurple w-full"
                  placeholder="Search Chains"
                  onChange={(e) => {
                    setInputValue(e.currentTarget.value);
                  }}
                  value={inputValue ? inputValue : ""}
                />
              </div>

              <div className="flex flex-col mt-[20px] max-h-[300px] w-full overflow-y-scroll">
                {filteredData &&
                  filteredData?.length !== null &&
                  filteredData.map((name, index) => {
                    return (
                      <div
                      key={index}
                      
                        onClick={() => {
                          setSelectedToken(name);
                          setOpenModal(false);
                        }}
                        className="flex flex-row hover:cursor-pointer mt-[6px] py-[6px] px-[4px] items-center text-white"
                        style={{
                          backgroundColor:
                            selectedToken === name ? "#1B192D" : "inherit",
                        }}
                      >
                        <img
                          className="h-[24px] w-[24px] mr-[14px]"
                          src={
                            "/tokens/" +
                            nameToSymbol[name].toLowerCase() +
                            ".svg"
                          }
                        ></img>
                        <p className="min-w-[140px]">{name}</p>
                        {selectedToken === name && (
                          <div className="flex flex-row-reverse w-full">
                            <img
                              className="h-[12px] w-[17px]"
                              src="/check.svg"
                            ></img>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </Box>
        </Modal>
      </main>
    </div>
  );
};

export default Home;
