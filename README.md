#Pilot DashBoard project: 

Hello, this is a project which simulates a pilot dashboard. The project includes a backend and frontend.

In the project, by pressing the "+" button, the user is asked to enter 3 inputs: ALT(0 - 3000), HIS(0 - 360) and ADI(-100 - 100). after the user added the desired values, if the values were right according to the statements- the application proceeds to upload the inputs to the API.

when the site reached the API,by pressing the "VISUAL" button, it shows the 3 last values in a visual way :

ALT being the left indicator,going from 0 to 3000 according to the user input,the black bold line and the number next to it represent the value entered by the user

HIS being the middle indicator, represented as a spinning wheel with an  orange arrow in the middle, the wheel rotates according to the user input, the arrow stays static pointing up.

ADI being the right indicator, a circle which has 2 colors, blue and green, the closer the value is to 100, the more blue the indicator will show, and the closer the value is to -100, the more green the indicator will show.

By pressing the "TEXT" button, the last 3 values ​​entered by the user in the form of "text" will be displayed on the screen

The project was written in ReactJS and NodeJS. 

inside "index.js" which located at the backend file, you need to enter your MongoDB userName and password in the variable CONNECTION_STRING.

To start the project write this on the CMD or terminal: 
1. in the backend CMD/terminal: node index.js
2. in the frontend CMD/terminal: npm start
