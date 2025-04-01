import { Principal } from "@dfinity/principal";

// Save principal to session storage
export const savePrincipal = (principal) => {
    sessionStorage.setItem("principal", principal.toString());
    console.log("Principal saved to storage:", principal.toString());
};

// Get principal from session storage
export const getPrincipal = () => {
  const principalString = sessionStorage.getItem("principal");
  console.log("Principal from storage:", principalString);
  
  return principalString ? Principal.fromText(principalString) : null;
};

// Clear principal from storage
export const clearPrincipal = () => {
  sessionStorage.removeItem("principal");
};
