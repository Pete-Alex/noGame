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
                type: Schema.Types.ObjectId,
                ref: "Building",
            },
        ],
        harvestedRessources : {
            metal: {
                type: Number,
                required: true,
                min : 0
            },
            energy: {
                type: Number,
                required: true,
                min : 0
            }
        }
    },
);

const Planet = model("Planet", PlanetSchema);
module.exports = Planet;