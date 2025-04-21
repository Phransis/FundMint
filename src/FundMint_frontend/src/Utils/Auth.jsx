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

export const uploadImage = async (file) => { 
  const reader = new FileReader();

  reader.onload = async (event) => { 
    const arrayBuffer = event.target.result;
    const blobBytes = [... new Uint8Array(arrayBuffer)];

    try {
      const response = await FundMint_backend.uploadImage(file.name,blobBytes);
      console.log("Image uploaded successfully:", response);
      return response;
      
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
      
    }
  }
}

// export const uploadImage = async (file) => { 
//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset
//   formData.append("cloud_name", "your_cloud_name"); // Replace with your Cloudinary cloud name
//   formData.append("folder", "your_folder_name"); // Optional: specify a folder in your Cloudinary account
//   try {
//     const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
//       method: "POST",
//       body: formData,
//     });
//     const data = await response.json();
//     return data.secure_url; // Return the URL of the uploaded image
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     throw error;
//   }
// }