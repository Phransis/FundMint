// src/utils/plug-wallet.js

import { idlFactory } from "../../../declarations/FundMint_backend/FundMint_backend.did.js";

const CANISTER_ID = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

export const initPlugWallet = async () => {
  const plug = window.ic?.plug;
  if (!plug) throw new Error("Plug Wallet not installed");

  const connected = await plug.isConnected();
  if (!connected) {
    await plug.requestConnect({
      whitelist: [CANISTER_ID],
      host: "http://localhost:4943",
    });
  }

  return plug;
};

// --------------------------------------------------
// THE ONLY SAFE WAY TO CREATE A PLUG-AUTHENTICATED ACTOR
// --------------------------------------------------
export const createAuthenticatedActor = async () => {
  const plug = await initPlugWallet();

  // Ensure Plug has an agent
  if (!plug.agent) {
    await plug.createAgent({
      whitelist: [CANISTER_ID],
    });
  }

  // Plug handles identity, certificates, auth — do NOT override anything
  const actor = await plug.createActor({
    canisterId: CANISTER_ID,
    interfaceFactory: idlFactory,
  });

  return actor;
};

// Helpers
export const getPlugPrincipal = async () => {
  const plug = await initPlugWallet();
  return plug.principalId;
};
