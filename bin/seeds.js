const mongoose = require('mongoose');
const BuildingType = require('../models/BuildingType.model');
const Planet = require('../models/Planet.model');
const User = require('../models/User.model');


const builingsType = [
    {
        name: "Metal Mine",
        description: 'Used in the extraction of metal ore, metal mines are of primary importance to all emerging and established empires.',
        ressourceType: "metal",
        costEquation: "costMine",
        productionEquation: "productionMine"
    },
    {
        name: "Solar Plant",
        description: 'Solar power plants absorb energy from solar radiation. All mines need energy to operate.',
        ressourceType: "energy",
        costEquation: "costPowerPlant",
        productionEquation: "productionPowerPlant"
    }
];

const planets = [
    {
        name: "Earth",
        owner: "Pete",
        buildings: [
            {
                name: "Metal Mine",
                level: 5,
            },
            {
                name: "Solar Plant",
                level: 2,
            },
            {
                name: "Metal Mine",
                level: 1,
            },
        ],
        harvestedRessources: {
            metal: 100,
            energy: 1000
        }
    },
    {
        name: "Mars",
        owner: "beubeu",
        buildings: [
            {
                name: "Metal Mine",
                level: 10,
            },
            {
                name: "Solar Plant",
                level: 2,
            },
        ],
        harvestedRessources: {
            metal: 500,
            energy: 5000
        }

    },
    {
        name: "Pluton",
        owner: "Pete",
        buildings: [
            {
                name: "Metal Mine",
                level: 4,
            },
        ],
        harvestedRessources: {
            metal: 10,
            energy: 0
        }
    },
    {
        name: "Saturn",
        owner: "beubeu",
        buildings: [],
        harvestedRessources: {
            metal: 0,
            energy: 0
        }
    }
];

async function seedData() {
    try {
        const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nogame-project';
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`Connected to Mongo! Database name: "${conn.connections[0].name}"`);


        /* DELETE EXISTING DATA */
        const deletedPlanets = await Planet.deleteMany({});
        const deletedBuildingType = await BuildingType.deleteMany({});
        console.log(deletedPlanets, deletedBuildingType);

        /* Seed Building Type */
        const builingsTypeCreated = await BuildingType.insertMany(builingsType);
        console.log(`Number of buildings type created... ${builingsTypeCreated.length} `);


        const planetsWithIds = [];

        for (const planetObj of planets) {
            const ownerName = planetObj.owner;
            const ownerdetails = await User.findOne({ username: ownerName });
            const ownerId = ownerdetails._id;

            const buildingsWithIds = [];
            for (const buildingObj of planetObj.buildings) {
                const buildingName = buildingObj.name;
                const buildingdetails = await BuildingType.findOne({ name: buildingName });
                const buildingId = buildingdetails._id;

                const newBuilding = {
                    buildingTypeId: buildingId,
                    level: buildingObj.level
                }
                buildingsWithIds.push(newBuilding);
            }

            const newPlanet = {
                name: planetObj.name,
                owner: ownerId,
                buildings: buildingsWithIds,
                //buildings: planetObj.buildings,
                harvestedRessources: planetObj.harvestedRessources
            }

            planetsWithIds.push(newPlanet);
        }
        const planetsCreated = await Planet.insertMany(planetsWithIds);
        console.log(`Number of planets created... ${planetsCreated.length} `);

        /* CLOSE DB CONNECTION */
        mongoose.connection.close();
    } catch (e) {
        console.log("error seeding data in DB....", e)
    }
}

seedData();
