const { Schema, model } = require("mongoose");

const buildingTypeSchema = new Schema(
    {
        name: String,
        image: String,
        description: String,
        ressourceType: {
            type: String,
            enum: ["metal", "energy"]
        }
        //equation to be created
    },
);

const BuildingType = model("BuildingType", buildingTypeSchema);
module.exports = BuildingType;