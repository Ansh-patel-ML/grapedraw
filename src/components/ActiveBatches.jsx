import React, { useEffect, useContext, useState, useRef } from "react";
import Web3 from "web3";
import { useQuery } from "react-query";
import Stats from "./Stats";
import "./ActiveBatches.css";
import { WalletContext } from "../App";
import useResizeObserver from "../Utils/customHooks/ResizeObserver";
import RenderBatchs from "./RenderBatchs";

const ActiveBatches = () => {
  const { metaMaskAccountInfo, setMetaMaskAccountInfo } =
    useContext(WalletContext);

  const [width, setWidth] = useState();
  const BatchRef = useRef(null);

  const handleResize = (entries) => {
    for (let entry of entries) {
      const { width } = entry.contentRect;
      setWidth(width);
    }
  };

  const { data: ActiveBatches, isLoading } = useQuery(["batch"], async () => {
    const response = await fetch(`http://44.203.188.29/contract`);
    const data = await response.json();
    return data;
  });

  useResizeObserver(BatchRef, handleResize);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setMetaMaskAccountInfo({
        ...metaMaskAccountInfo,
        web3: web3Instance,
      });
    }
  }, []);

  return (
    <div
      className={
        width >= 768 ? "Active--Batches flipPosition" : "Active--Batches"
      }
      ref={BatchRef}
    >
      {width < 768 && <Stats width={width} />}
      {}
      <div
        className={
          width < 768 ? "Active--Batches--Main unFlip" : "Active--Batches--Main"
        }
      >
        <h1>Active Batches</h1>
        {!isLoading &&
          ActiveBatches.items
            .filter((batch) => {
              if (batch.state === "active") {
                return batch;
              }
            })
            .map((batchInfo, index) => {
              return <RenderBatchs batchInfo={batchInfo} key={index} />;
            })}
      </div>
      {width >= 768 && <Stats width={width} />}
    </div>
  );
};

export default ActiveBatches;
