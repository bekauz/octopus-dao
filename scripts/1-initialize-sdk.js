import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from "ethers";

// import and configure our .env file that we use to securely store our environment variables
import dotenv from "dotenv";
dotenv.config();

// validate .env configs
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
  console.error("Private key not found.")
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
  console.error("Alchemy API URL not found.")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
  console.error("Wallet Address not found.")
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    // our wallet private key, reads from .env
    process.env.PRIVATE_KEY,
    // RPC URL, handled by Alchemy API from our .env file
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
  ),
);

(async () => {
  try {
    const apps = await sdk.getApps();
    console.log("Your app address is:", apps[0].address);
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})()

// export the initialized thirdweb SDK for reuse in other scripts
export default sdk;