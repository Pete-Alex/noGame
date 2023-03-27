const { Schema, model } = require("mongoose");

const buildingSchema = new Schema(
    {
        buildingType: {
            type: Schema.Types.ObjectId,
            ref: 'BuildingType'
        },
        level: Number,
        dateSinceLastCollect: { 
            type: Date, 
            default: Date.now 
        }
    },
);

const Building = model("Building", buildingSchema);
module.exports = Building;