"use client";

import { useState } from "react";
import { RxExit } from "react-icons/rx";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const [isShowConnect, setIsShowConnect] = useState(false);
  const [isShowDisconnect, setIsShowDisconnect] = useState(false);
  const { disconnect } = useDisconnect();

  const handleToggleWallet = () => {
    if (!isConnected) setIsShowConnect(true);
    else setIsShowDisconnect(true);
  };

  const handleConnect = (params: { connector: Connector }) => {
    connect(params);
    setIsShowConnect(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsShowDisconnect(false);
  };

  return (
    <>
      <button
        className="px-8 py-4 cursor-pointer border border-white hover:bg-white hover:text-black duration-300"
        onClick={handleToggleWallet}
      >
        {isConnected ? "Disconnect" : "Connect"} Wallet
      </button>
      {isShowConnect && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-xl relative shadow-lg text-gray-500">
            <div className="flex items-center justify-between mb-6 relative">
              <div className="flex-1" />
              <h2 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">
                Connect Wallet
              </h2>
              <button
                onClick={() => setIsShowConnect(false)}
                className="text-gray-500 hover:text-gray-700 flex-1 flex justify-end cursor-pointer"
              >
                <RxExit />
              </button>
            </div>
            <div className="space-y-4 flex justify-center">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => handleConnect({ connector })}
                  className="h-12 text-lg cursor-pointer text-white border hover:border-black hover:text-black hover:bg-white duration-300 w-full bg-black"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {isShowDisconnect && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md relative shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-500">
              Confirm Disconnect
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to disconnect your wallet?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsShowDisconnect(false)}
                className="py-2 text-gray-600 px-4 cursor-pointer border border-gray-500 hover:opacity-85 duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnect}
                className="text-lg cursor-pointer text-white hover:opacity-85 duration-300 w-full bg-red-700"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
