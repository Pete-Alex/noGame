const { Schema, model } = require("mongoose");

const BuildingTypeSchema = new Schema(
    {
        name: String,
        image: String,
        description: String,
        ressourceType: {
            type: String,
            enum: ["metal", "energy"]
        },
        costEquation: String,
        productionEquation: String
    },
);

const BuildingType = model("BuildingType", BuildingTypeSchema);
module.exports = BuildingType;