# noGame

Was built by [Aleandre Benat](https://github.com/ABenat1988) and [Peter Sekan](https://github.com/PDXIII) during the [Ironhack](https://www.ironhack.com/) Web Dev RMT Bootcamp Feb. 2023 as a learning project.
It is a simple adaption of the famous [OGame](https://gameforge.com/en-GB/play/ogame). One of the most popular browser games ever.

here a link to try it: [https://nogame.adaptable.app/](https://nogame.adaptable.app/)

## Disclaimer

**Don’t clone this repo, unless you know what your doing!** You might have noticed that our repo contains a **node_modules** directory. This is caused due issues during the deployment process and the lack of time that asked for a quick solution. We might fix this later but know promises.

## Installation guide

1. Make sure you have [Mongo DB](https://www.mongodb.com/) and [Mongo Compass](https://www.mongodb.com/products/compass) installed
1. Fork and clone this project to your local machine
1. `cd noGame`
1. Because our repository contains all ready all npm modules, no need to run `npm i`
1. Create a `.env` file in your applications root directory
1. Run `node .bin/seeds.js` to populate your data base
1. For development, make sure you have [Nodemon](https://www.npmjs.com/package/nodemon) installed and run `npm run dev`
1. Just for playing the game just run `npm start`

### .env File

```
PORT=3000
SESS_SECRET = "<YOUR SESSION SECRET>"
MONGODB_URI = "mongodb://127.0.0.1:27017/nogame-project"
```

## How to play?

1. Visit [NoGame](https://nogame.adaptable.app/)
2. Create an account
3. Log in
4. Create your first planet
5. Add a building
6. Harvest resources
7. Level up your buildings

Sorry, no high-score board for now!

## Tools

This application was buit with:

- [Express JS](https://expressjs.com/)
- [Handlebars JS](https://handlebarsjs.com/)
- [Mongo DB](https://www.mongodb.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Feather Icons](https://feathericons.com/)
- [Themestrap](https://themestr.app/)

If you want to build an Express JS app, try [Ironlauncher](https://github.com/ironhack-edu/ironlauncher)! It provides a very nice boilerplate for your project with authentification, and other goodies!

It was deployed on:

- [Mongo Atlas](https://www.mongodb.com/atlas)
- [Adabtable](https://adaptable.io/)

## Learning Achievements

### Alexandre:

> Game logic, secure routes and synchrosity of the stats between front and back end.

### Pete:

> Don’t use custom CSS, only Bootstrap. Learn about using Mongo DB and Handlebars.
