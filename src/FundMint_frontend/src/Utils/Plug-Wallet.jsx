// src/utils/plug-wallet.js

YOUR_CANISTER_ID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";
export const initPlugWallet = async () => {
  if (!window.ic?.plug) {
    await Plug.connect({
      whitelist: [YOUR_CANISTER_ID], // Your FundMint canister ID
      host: "http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai&",
      onConnectionUpdate: () => {},
    });
  }
  return window.ic?.plug;
};

export const getPlugPrincipal = async () => {
  const plug = await initPlugWallet();
  return plug?.principalId;
};

export const isPlugConnected = async () => {
  return await window.ic?.plug?.isConnected();
};
export const getPlugBalance = async () => {
  const plug = await initPlugWallet();
  return await plug?.requestBalance();
};
export const getPlugPublicKey = async () => {
  const plug = await initPlugWallet();
  return await plug?.requestPublicKey();
};
export const getPlugAccountId = async () => {
  const plug = await initPlugWallet();
  return await plug?.requestAccountId();
};