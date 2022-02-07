import LatLon from "geodesy/latlon-ellipsoidal-vincenty.js";
import { writeFile } from "fs";

// the bottom left corner of the map
const initLat = 51.030035;
const initLon = -113.8749132;
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

writeFile("latlon.json", JSON.stringify(latLonArray), (err) => {
  if (err) throw err;
  console.log("file saved");
});
