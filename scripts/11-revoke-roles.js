import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule("0xcb4D31e042D6DaF220653D092D51b0Aa43f554ec");

(async () => {
  try {
    console.log("Current roles:", await tokenModule.getAllRoleMembers());

    console.log(`Revoking all roles from address ${process.env.WALLET_ADDRESS}...`);
    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);

    console.log("Current roles:", await tokenModule.getAllRoleMembers());
    console.log("Successfully revoked all roles from ERC-20 contract");
  } catch (err) {
    console.error("Failed to revoke current privileges from the treasury");
  }
})();

