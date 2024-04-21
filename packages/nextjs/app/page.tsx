"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState, useEffect } from 'react';
import Moralis from 'moralis';
import * as chains from "viem/chains";
import { useRouter } from 'next/navigation'
import { InputBase } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const [balances, setBalances] = useState(null);
  const [addressLook, setAddressLook] = useState<string>();

  useEffect(() => {
    const fetchBalances = async () => {
      if (!connectedAddress) return; // Don't fetch balances if connectedAddress is not available

      const chainId = `0x${chains.mainnet.id}`; // Move this line here

      try {
        await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });
        const response = await Moralis.EvmApi.token.getWalletTokenBalances({
          "chain": chainId,
          "address": connectedAddress
        });
        setBalances(response.raw);
      } catch (e) {
        console.error(e);
      }
    };
    fetchBalances();
  }, [connectedAddress]); // Add connectedAddress to the dependency array

  console.log(balances);
  console.log(connectedAddress)
  console.log(chains.mainnet.id)
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
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
             <AdjustmentsHorizontalIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your wallet your way.
              </p>
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => router.push(`/dashboard/${connectedAddress}`)} className="btn btn-primary">View dashboard</button>
              </div>
            </div>

            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Enter wallet address to view.
              </p>
      
              <InputBase name="address" placeholder="address" value={addressLook} onChange={setAddressLook} />
              <div className="flex justify-center items-center gap-2 p-4">
                <button onClick={() => router.push(`/dashboard/${addressLook}`)} className="btn btn-primary">Search</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
