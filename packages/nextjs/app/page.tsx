"use client";

import { useEffect } from "react";
import CreateBallot from "../components/CreateBallot";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Footer } from "~~/components/Footer";
import BallotResult from "~~/components/BallotResult";
import BallotList from "~~/components/BallotList";

const Page: NextPage = () => {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      console.log("Пользователь подключен: ", address);
    }
  }, [isConnected, address]);

  return (
    <div style={{display: "flex", justifyContent: "center", backgroundColor: "white"}}>
      <div>
        {/*className="artboard artboard-horizontal phone-3" >*/}
          <h1 className="text-3xl font-bold text-center text-black mb-8">Децентрализованная система голосования</h1>
          <BallotResult />
          <BallotList />
          <CreateBallot />
      </div>
    </div>
  );
};

export default Page;
