"use client";

import { useEffect, useState } from "react";
import Moralis from "moralis";
import { useAccount } from "wagmi";

const Dashboard = ({ params }) => {
  const addressHook = params?.address;
  const { address: connectedAddress, chain, chainId } = useAccount();
  const chainID = chainId;
  const chainName = chain?.name;
  const [balances, setBalances] = useState(null);
  const [currentTab, setCurrentTab] = useState("tokens"); // Add this line
  const [balancesNFT, setBalancesNFT] = useState(null); // Add this line
  
  useEffect(() => {
    if (!window.MoralisStarted) {
      Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY }); // Initialize Moralis here
      window.MoralisStarted = true;
    }
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!connectedAddress) return; // Don't fetch balances if connectedAddress is not available
      const ChainId = `0x${chainID}`; // Move this line here
      try {
        // const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
          chain: ChainId,
          address: addressHook,
        });
        const responseNFT = await Moralis.EvmApi.nft.getWalletNFTs({
          chain: ChainId,
          format: "decimal",
          mediaItems: true,
          address: addressHook,
        });

        setBalances(response.result);
        setBalancesNFT(responseNFT.result);
        // console.log("The response is:", response.result);
      } catch (e) {
        console.error(e);
      }
    };
    fetchBalances();
  }, [chainID, connectedAddress, addressHook]); // Add connectedAddress to the dependency array

  console.log(balances);
  console.log(balancesNFT);
  console.log(addressHook);

  return (
    <>
      <div className="text-center bg-secondary p-10">
        <h1 className="text-4xl text-center my-0">Moralis Powered Dashboard</h1>
        <p className="text-neutral">Wallet Displayed: {addressHook}</p>
        <p className="text-neutral">
          Chain ID: {chainID} {chainName}
        </p>

        {/* Buttons to switch between from Viewing tokens and NFTs */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
          onClick={() => setCurrentTab("tokens")}
        >
          View Tokens
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
          onClick={() => setCurrentTab("nfts")}
        >
          View NFTs
        </button>

        {balances && currentTab === "tokens" && (
          <div className="flex justify-center px-4 md:px-0">
            <div className="overflow-x-auto w-full shadow-2xl">
              <table className="table text-xl bg-base-100 w-full md:table-md table-sm">
                <thead>
                  <tr className="rounded-xl text-sm text-base-content">
                    <th className="bg-primary p-2 border border-gray-300">Token</th>
                    <th className="bg-primary p-2 border border-gray-300">Name</th>
                    <th className="bg-primary p-2 border border-gray-300">Price</th>
                    <th className="bg-primary p-2 border border-gray-300">% Change</th>
                    <th className="bg-primary p-2 border border-gray-300">Balance</th>
                    <th className="bg-primary p-2 border border-gray-300">% Portfolio</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(balances) &&
                    balances.map((balance, index) => (
                      <tr key={index} className="hover:bg-green-200 hover:text-black text-sm">
                        <td className="w-1/3 p-2 border border-gray-300">
                          <div className="flex items-center">
                            <img src={balance.logo} width="15%" className="mr-2" />
                            <span>{balance.symbol}</span>
                          </div>
                        </td>
                        <td className="w-1/3 p-2 border border-gray-300">{balance.name}</td>
                        <td className="w-1/3 p-2 border border-gray-300">{parseFloat(balance.usdPrice).toFixed(2)}</td>
                        <td className="w-1/3 p-2 border border-gray-300">
                          {parseFloat(balance.usdPrice24hrPercentChange).toFixed(2)}
                        </td>
                        <td className="w-1/3 p-2 border border-gray-300">
                          {parseFloat(balance.balanceFormatted).toFixed(2)}
                        </td>
                        <td className="w-1/3 p-2 border border-gray-300">
                          {parseFloat(balance.portfolioPercentage).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {Array.isArray(balancesNFT) && currentTab === "nfts" && (
          <div className="flex justify-center px-4 md:px-0">
            <div className="overflow-x-auto w-full shadow-2xl">
              {balancesNFT.map((balance, index) => {
                return (
                  <div
                    key={index}
                    className="bg-base-100 w-full m-1 md:w-md hover:bg-green-200 hover:text-black text-sm p-4 mb-4"
                  >
                    <div className="text-xl text-base-content bg-primary p-2 border border-gray-300">NFT</div>
                    <div className="flex items-center justify-center">
                      <img src={balance._data.metadata.image} style={{ maxWidth: "100%" }} className="my-2" />
                    </div>
                    <div className="text-xl text-base-content bg-primary p-2 border border-gray-300">Name</div>
                    <div className="w-full p-2 border border-gray-300">{balance._data.metadata.name}</div>
                    <div className="text-xl text-base-content bg-primary p-2 border border-gray-300">Description</div>
                    <div className="w-full p-2 border border-gray-300">{balance._data.metadata.description}</div>
                    <div className="text-xl text-base-content bg-primary p-2 border border-gray-300">Contract Type</div>
                    <div className="w-full p-2 border border-gray-300">{balance._data.contractType}</div>
                    <div className="text-xl text-base-content bg-primary p-2 border border-gray-300">Token ID</div>
                    <div className="w-full p-2 border border-gray-300 overflow-auto">{balance._data.tokenId}</div>
                    <div className="text-xl text-base-content bg-primary p-2 border border-gray-300 ">
                      Token Address
                    </div>
                    <div className="w-full p-2 border border-gray-300 overflow-auto">
                      {balance._data.tokenAddress._value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
