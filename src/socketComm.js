class SocketComm {

  constructor(dataManagerObj) {
    this.dataManagerObj = dataManagerObj;
    this.socket         = new WebSocket('ws://localhost:8080/');
  }

  CreateConn(){
    this.socket.onopen = function() {
      //console.log('Opened connection ');
    }
    this.socket.onmessage = function(event) {
      console.log(event.data);
    }
  }
}

export default SocketComm;
