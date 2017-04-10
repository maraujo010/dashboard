## Dashboard App
A Dashboard Demo App for data visualization using ReactJs, OpenLayers, D3js. This demo includes a Nodejs websockets server that binds random data to all connected clients.

### System Description
A Websocket server is sending data through one channel using this format
```
{  
   "company_id":123,
   "driver_id":456,
   "timestamp":"yyyy-MM-dd'T'HH:mm:ss",
   "latitude":52.234234,
   "longitude":13.23324,
   "accuracy":12.0,
   "speed":123.45
}
```
This dataset refers to a driver/company currently active. The websockets server permanently sending information from all drivers and all companies. 

The frontend app is a React.js dashboard with 3 pluggable/extendable plugins:

1- A map that shows all the drivers that have sent their position in the last 24 hours. 

2- A chart that displays the drivers activity (number of times they were active) by time period.

3- A slider to change the selected period (from 10 days to 6 hours).


### Technical notes
- This demo app was built in a Node.js (Ubuntu OS) environment. 
- The base project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app)
- The websockets server is generating random data. 

#### Tools/frameworks
- The map plugin is done with OpenLayers and Open Street Maps.
- That chart is done using D3.js
- HTML5 localStorage is used to persist data since last 10 days



### Install

In order to install all required Node.js packages for this project (assuming Node.js and npm are already installed):
```
npm install
```

### Run 

Starting the websockets server (go to /server folder):
```
node WebsocketsServer.js

```
Starting the webserver and the frontend app:
```
npm start
```
#### Screenshot
![App screenshot](/screenshot.png?raw=true "app screenshot")
