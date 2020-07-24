const WebSocket = require("ws");

const numClients = 1;
const tradersFraction = 0.1;

function establishConnections(remainingClients) {
  if (!remainingClients) {
    return;
  }

  const ws = new WebSocket("ws://localhost:9999");
  ws.on("open", function open() {
    ws.send(JSON.stringify({
      map: 'city_weather',
      filter: '',
      action: 'Subscribe',
      env: ''
    }))
    establishConnections(remainingClients - 1);
  });

  ws.on("message", function incoming(data) {
    let json = JSON.parse(data);
    console.log(json);
  });

  ws.on("close", () => {
    console.log("We did not expect any client to disconnect, exiting!");
    process.exit();
  });
}

establishConnections(numClients);
