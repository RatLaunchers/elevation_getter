import LatLon from "geodesy/latlon-ellipsoidal-vincenty.js";
import { request } from "https";
import { writeFileSync } from "fs";

// Get latlon coordinates

// the bottom left corner of the map
// map2: 50.913693, -114.165181
const initLat = 50.913693;
const initLon = -114.165181;
const initPoint = new LatLon(initLat, initLon);

const unit = 9.07; // in meters
const resolution = 10; // resolution of latlon array in units, one unit is 9.07 meters
const resX = 133; // sim unit x
const resY = 100; // sim unit y

const scaleResX = Math.floor(resX / resolution);
const scaleResY = Math.floor(resY / resolution);

// meant to allow scaling for any resolution size, but this is a hack job right now so it doesn't
// let finalX = resX - scaleResX * resolution !== 0 ? resX : 0;
// let finalY = resY - scaleResY * resolution !== 0 ? resY : 0;

let latLonArray = [];
// for (let y = 0; y < resY; y++) {
//   // non scale version
//   let pointy = initPoint.destinationPoint(unit * y, 0);
//   latLonArray.push([]);
//   for (let x = 0; x < resX; x++) {
//     let pointx = pointy.destinationPoint(unit * x, 90);
//     latLonArray[y].push([pointx.lat, pointx.lon]);
//   }
// }

for (let y = 0; y < scaleResY; y++) {
  // scale version
  let pointy = initPoint.destinationPoint(unit * y * resolution, 0);
  latLonArray.push([]);
  for (let x = 0; x < scaleResX; x++) {
    let pointx = pointy.destinationPoint(unit * x * resolution, 90);
    latLonArray[y].push([pointx.lat, pointx.lon]);
  }
  let pointx = pointy.destinationPoint(unit * resX, 90);
  latLonArray[y].push([pointx.lat, pointx.lon]);
}
let pointy = initPoint.destinationPoint(unit * resY, 0);
latLonArray.push([]);
for (let x = 0; x < scaleResX; x++) {
  let pointx = pointy.destinationPoint(unit * x * resolution, 90);
  latLonArray[scaleResY].push([pointx.lat, pointx.lon]);
}
let pointx = pointy.destinationPoint(unit * resX, 90);
latLonArray[scaleResY].push([pointx.lat, pointx.lon]);

latLonArray.reverse();

// Get elevation data at those coordinates

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
let data = latLonArray;
let finalData = { locations: [] };
for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[y].length; x++) {
    finalData.locations.push({
      latitude: data[y][x][0],
      longitude: data[y][x][1],
    });
  }
}

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

// const req = request(options, (res) => {
//   res.setEncoding("utf-8");
//   res.on("data", (chunk) => {
//     let receivedData = chunk;
//   });
// });

// req.write(JSON.stringify(finalData));
// req.end();
//1046

function doRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      res.setEncoding("utf8");
      let responseBody = "";

      res.on("data", (chunk) => {
        responseBody = chunk;
      });

      res.on("end", () => {
        resolve(JSON.parse(responseBody));
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

// Interpolation

// converts received elevation data into simpler format
const dataX = 14;
const dataY = 11;
data = await doRequest(options, JSON.stringify(finalData));
let hundredVoid = [];
for (let i = 0; i < 133; i++) {
  hundredVoid.push("void");
}

// Uber jank only works on the 133x100 grid type
// Fills in sections to interpolate with "void"

/*
Alright each data point along the x axis is followed by 9 voids as that is the proper spacing unless it is the last point which is followed by none
the last point needs to have 12 void between it and the last one as the grid is unevenly divided by 10
Each x row is followed by 9 voids unless it is the last point which is followed by none
the last x row only has 8 voids between it and the previous as the grid needs start and end values to interpolate
*/

//data formatting, adding voids
finalData = [];
for (let y = 0; y < dataY; y++) {
  finalData.push([]);
  for (let x = 0; x < dataX; x++) {
    const currentY = y === 10 ? y * 10 - 1 : y * 10;
    if (x !== 13) {
      finalData[currentY].push(
        data.results[y * dataY + x].elevation,
        "void",
        "void",
        "void",
        "void",
        "void",
        "void",
        "void",
        "void",
        "void"
      );
    } else if (x === 13) {
      finalData[currentY].push(
        "void",
        "void",
        data.results[y * dataY + x].elevation
      );
    }
  }
  if (y !== 10 && y !== 9) {
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
  } else if (y === 9) {
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
    finalData.push(JSON.parse(JSON.stringify(hundredVoid)));
  }
}

//interpolate voids
let finalFinalData = JSON.parse(JSON.stringify(finalData));

// function bilinearInterpolate(values, x1, y1, x2, y2, x, y) {
//   let q11 = (((x2 - x) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * values[x1][y1];
//   let q21 = (((x - x1) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * values[x2][y1];
//   let q12 = (((x2 - x) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * values[x1][y2];
//   let q22 = (((x - x1) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * values[x2][y2];
//   return q11 + q21 + q12 + q22;
// }
function linearInterpolate(dep1, dep2, x1, x2, x) {
  return dep1 + (x - x1) * ((dep2 - dep1) / (x2 - x1));
}

function bilinearInterpolate(values, x1, y1, x2, y2, x, y) {
  let q11 = (((y2 - y) * (x2 - x)) / ((y2 - y1) * (x2 - x1))) * values[y1][x1];
  let q21 = (((y - y1) * (x2 - x)) / ((y2 - y1) * (x2 - x1))) * values[y2][x1];
  let q12 = (((y2 - y) * (x - x1)) / ((y2 - y1) * (x2 - x1))) * values[y1][x2];
  let q22 = (((y - y1) * (x - x1)) / ((y2 - y1) * (x2 - x1))) * values[y2][x2];
  return q11 + q21 + q12 + q22;
}

function interpolate(values, x1, y1, x2, y2, x, y) {
  if (x1 === x2) {
    // If on an axis use linear interpolation
    return linearInterpolate(values[y2][x2], values[y1][x1], y2, y1, y);
  }
  if (y1 === y2) {
    // If on an axis use linear interpolation
    // return (
    //   values[y1][x1] + (x - x1)((values[y2][x2] - values[y1][x1]) / (x1 - x2))
    // );
    return linearInterpolate(values[y2][x2], values[y1][x1], x2, x1, x);
  }
  return bilinearInterpolate(values, x1, y1, x2, y2, x, y);
}

for (let y = 0; y < finalData.length; y++) {
  for (let x = 0; x < finalData[y].length; x++) {
    if (finalData[y][x] === "void") {
      let x1, y1, x2, y2;

      let counter = y;
      while (finalData[counter][0] === "void") {
        counter++;
      }
      y1 = counter;

      counter = y;
      while (finalData[counter][0] === "void") {
        counter--;
      }
      y2 = counter;

      counter = x;
      while (finalData[y1][counter] === "void") {
        counter++;
      }
      x1 = counter;

      counter = x;
      while (finalData[y1][counter] === "void") {
        counter--;
      }
      x2 = counter;

      finalFinalData[y][x] = Math.round(
        interpolate(finalData, x1, y1, x2, y2, x, y)
      );
    } else {
      finalFinalData[y][x] = finalData[y][x];
    }
  }
}

writeFileSync("elevation_final.json", JSON.stringify(finalFinalData), (err) => {
  if (err) throw err;
});
