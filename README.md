## Dashboard App
A Dashboard Demo App for data visualization using ReactJs, OpenLayers, D3js. This demo includes a Nodejs websockets server that binds random data to all connected clients.

### System Description
A Websocket server is sending data through one channel using this format

{  
   “company_id":123,
   “driver_id":456,
   "timestamp":"yyyy-MM-dd'T'HH:mm:ss",
   "latitude":52.234234,
   "longitude":13.23324,
   "accuracy":12.0,
   "speed":123.45
}

This dataset refers to a driver/company currently active. The webservers is sending information from all drivers and all companies. 


### Technical notes
- This demo app was built in a Node.js (Ubuntu OS) environment. The following instructions are similar to other operating systems.
- The base project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app)




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
