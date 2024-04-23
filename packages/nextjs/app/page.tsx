"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { InputBase } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const [addressLook, setAddressLook] = useState<string>();

  // console.log(connectedAddress)
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Tracboard</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center justify-between rounded-3xl">
              <AdjustmentsHorizontalIcon className="h-8 w-8 fill-secondary" />
              <p>Explore your wallet your way.</p>
              <div className="flex-grow"></div> {/* Spacer */}
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => router.push(`/dashboard/${connectedAddress}`)} className="btn btn-primary">
                  View dashboard
                </button>
              </div>
            </div>

            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center justify-between rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>Enter wallet address to view portfolio.</p>

              <InputBase name="address" placeholder="address" value={addressLook} onChange={setAddressLook} />
              <div className="flex justify-center items-center pt-3 gap-2">
                <button onClick={() => router.push(`/dashboard/${addressLook}`)} className="btn btn-primary">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
