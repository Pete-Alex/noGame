const { Schema, model } = require("mongoose");

const PlanetSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Planet name is required"],
            unique: true,
            trim: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "a Planet needs an Owner"]
        },
        buildings: [
            {
                buildingTypeId : {
                    type: Schema.Types.ObjectId,
                    ref: 'BuildingType'
                },
                level: Number,
                dateSinceLastCollect: {
                    type: Date,
                    default: Date.now
                }
            },
        ],
        harvestedRessources: {
            metal: {
                type: Number,
                required: true,
                min: 0
            },
            energy: {
                type: Number,
                required: true,
                min: 0
            }
        }
    },
    {
      // this second object adds extra properties: `createdAt` and `updatedAt`
      timestamps: true,
    }
);

const Planet = model("Planet", PlanetSchema);
module.exports = Planet;