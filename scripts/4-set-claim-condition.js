import sdk from "./1-initialize-sdk.js";

const bundleDrop = sdk.getBundleDropModule(
    "0x9E92B1F2B0C7CE7497040ac89eCD2d032E4d01F7"
);

(async () => {
    try {
        const claimConditionFactory = bundleDrop.getClaimConditionsFactory();
        // claim condition config
        claimConditionFactory.newClaimPhase({
            startTime: new Date(),
            maxQuantity: 50_000,
            maxQuantityPerTransaction: 1,
        });

        await bundleDrop.setClaimCondition(0, claimConditionFactory);
        console.log("Sucessfully set claim condition");
    } catch (error) {
        console.error("Failed to set claim condition", error);
    }
})()