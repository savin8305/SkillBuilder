<h2 align="center">
  Welcome to Skill Builder  !
  <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="28">
</h2>
<p align="center">
<a><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&width=435&lines=%E2%9D%A4%EF%B8%8F+Developed+skillbuilder;%E2%9D%A4%EF%B8%8F+using+mern+stack;%E2%9D%A4%EF%B8%8F+For+frontend+chakra+ui+" alt="Typing SVG" /></a></p>

## Used tech stack





![JSX](https://img.shields.io/badge/Javascript-F0DB4F?style=for-the-badge&labelColor=black&logo=javascript&logoColor=F0DB4F)
![React](https://img.shields.io/badge/-React-61DBFB?style=for-the-badge&labelColor=black&logo=react&logoColor=61DBFB)
![Nodejs](https://img.shields.io/badge/Nodejs-3C873A?style=for-the-badge&labelColor=black&logo=node.js&logoColor=3C873A)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Strapi](https://img.shields.io/badge/strapi-2E7EEA?style=for-the-badge&logo=strapi&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![React Query](https://img.shields.io/badge/-React_Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![VSCode](https://img.shields.io/badge/Visual_Studio-0078d7?style=for-the-badge&logo=visual%20studio&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

<br/>

<br/>

<br/>

![home](https://github.com/savin8305/SkillBuilder/assets/118232727/b23bb8b4-c56a-4b94-9e38-cfe784e2b832)
![Screenshot (14216)](https://github.com/savin8305/SkillBuilder/assets/118232727/f7683431-0559-4397-b024-4365848f548f)
![Screenshot (14213)](https://github.com/savin8305/SkillBuilder/assets/118232727/1a86ec02-071e-4b02-baae-7b984971afd1)
![Screenshot (14212)](https://github.com/savin8305/SkillBuilder/assets/118232727/e399dc21-7918-4eb2-a089-107430f32035)



![Screenshot (14217)](https://github.com/savin8305/SkillBuilder/assets/118232727/47c3ccd7-757a-4eec-a746-4446835ee9ec)
![Screenshot (14214)](https://github.com/savin8305/SkillBuilder/assets/118232727/74dbbb2a-da38-4ddb-ad88-e0e9292b758e)


## File structure
#### `client` - Holds the client application
- #### `public` - This holds all of our static files
- #### `src`
    - #### `assets` - This folder holds assets such as images, docs, and fonts
    - #### `components` - This folder holds all of the different components that will make up our views
    - #### `views` - These represent a unique page on the website i.e. Home or About. These are still normal react components.
    - #### `App.js` - This is what renders all of our browser routes and different views
    - #### `index.js` - This is what renders the react app by rendering App.js, should not change
- #### `package.json` - Defines npm behaviors and packages for the client
#### `server` - Holds the server application
- #### `config` - This holds our configuration files, like mongoDB uri
- #### `controllers` - These hold all of the callback functions that each route will call
- #### `models` - This holds all of our data models
- #### `routes` - This holds all of our HTTP to URL path associations for each unique url
- #### `tests` - This holds all of our server tests that we have defined
- #### `server.js` - Defines npm behaviors and packages for the client
#### `package.json` - Defines npm behaviors like the scripts defined in the next section of the README
#### `.gitignore` - Tells git which files to ignore
#### `README` - This file!


## Available Scripts

In the project directory, you can run:

### `npm run-script dev`

Runs both the client app and the server app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view the client in the browser.

### `npm run-script client`

Runs just the client app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view the client in the browser.


### `npm run-script server`

Runs just the server in development mode.<br>


### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

If deploying to heroku this does not need to be run since it is handled by the heroku-postbuild script<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


