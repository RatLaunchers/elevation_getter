const lat = 51.03;
const lon = -113.874913;
//const lon = -113.8578;

import { request } from "http";
const options = {
  hostname: "geogratis.gc.ca",
  port: 443,
  path: `/services/elevation/cdem/altitude?lat=${lat}&lon=${lon}`,
  method: "GET",
};

const req = request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);

  res.on("data", (d) => {
    process.stdout.write(d);
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.end();
