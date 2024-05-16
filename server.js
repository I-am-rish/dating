const app = require("./api/app");
const http = require("http");

//SERVER
// const server = http.createServer(app);

app.listen(8100, () => {
  console.log("Server is running")
});
// server.on("listening", () => {
//   console.log(
//     `Server is running on address ${server.address().address} and port ${
//       server.address().port
//     }`
//   );
// });

// server.on("error", (err) => {
//   console.log("Server connection error: ", err.message);
// });
