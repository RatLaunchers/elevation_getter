import { request } from "https";
import { readFileSync, writeFileSync } from "fs";

// const options = {
//   hostname: "api.open-elevation.com",
//   port: 443,
//   path: `/api/v1/lookup?locations=${lat},${lon}`,
//   method: "GET",
// };

const options = {
  hostname: "api.open-elevation.com",
  port: 443,
  path: `/api/v1/lookup`,
  method: "POST",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
};

// reads latlon data and converts into proper format for post request
const data = JSON.parse(readFileSync("latlon.json", "utf-8"));
const finalData = { locations: [] };
for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[y].length; x++) {
    finalData.locations.push({
      latitude: data[y][x][0],
      longitude: data[y][x][1],
    });
  }
}
console.log(finalData);

// const req = request(options, (res) => {
//   console.log(`statusCode: ${res.statusCode}`);

//   res.on("data", (d) => {
//     process.stdout.write(d);
//   });
// });

// req.on("error", (error) => {
//   console.error(error);
// });

// req.end();

const req = request(options, (res) => {
  res.setEncoding("utf-8");
  res.on("data", (chunk) => {
    writeFileSync("elevation.json", chunk, (err) => {
      if (err) throw err;
      console.log("file saved");
    });
  });
});

req.write(JSON.stringify(finalData));
req.end();
//1046
