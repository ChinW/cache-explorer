import * as WebSocket from "ws";

let transactionsPerSecond = 0;

let shares = {
  NFLX: 280.48,
  TSLA: 244.74,
  AMZN: 1720.26,
  GOOG: 1208.67,
  NVDA: 183.01,
};

const wss = new WebSocket.Server({
  port: 8888,
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message: any) {
    let json = JSON.parse(message);
    switch (json.action) {
      case "sub": {
        ws.send(
          JSON.stringify({
            channel: "shares/" + json.share + "/value",
          })
        );
        break;
      }
      case "buy": {
        transactionsPerSecond++;

        shares[json.share] *= 1.001;

        ws.send(
          JSON.stringify({
            channel: "shares/" + json.share + "/value",
            [json.share]: shares[json.share],
          })
        );
        break;
      }
      case "sell": {
        transactionsPerSecond++;
        shares[json.share] *= 0.999;
        ws.send(
          JSON.stringify({
            channel: "shares/" + json.share + "/value",
            [json.share]: shares[json.share],
          })
        );
        break;
      }
    }
  });
});

const performanceMonitor = () => {
  let last = Date.now();
  setInterval(() => {
    transactionsPerSecond /= (Date.now() - last) * 0.001;
    console.log("Transactions per second: " + transactionsPerSecond + ", here are the curret shares:");
    console.log(shares);
    console.log("");
    transactionsPerSecond = 0;
    last = Date.now();
  }, 1000);
};
