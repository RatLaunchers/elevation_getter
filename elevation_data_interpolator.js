import { readFileSync, writeFileSync } from "fs";

function bilinearInterpolate(values, x1, y1, x2, y2, x, y) {
  let q11 = (((x2 - x) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * values[x1][y1];
  let q21 = (((x - x1) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * values[x2][y1];
  let q12 = (((x2 - x) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * values[x1][y2];
  let q22 = (((x - x1) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * values[x2][y2];
  return q11 + q21 + q12 + q22;
}

// https://gist.github.com/botagar/5d628f06545d5427fe4a694d1a02467e

const data = JSON.parse(readFileSync("elevation_parse.json", "utf-8"));
const dataSpacing = 10;
const resX = 133; // sim unit x
const resY = 100; // sim unit y

let elevationArray = [];
for (let y = 0; y < resY; y++) {
  elevationArray.push([]);
  for (let x = 0; x < resX; x++) {
    let closeX = Math.floor(x / 10);
    let closeY = Math.floor(y / 10);
    if (closeX === 0 && closeY === 0){
      elevationArray[y].push(data[y/10][x/10]);
    } else {
    elevationArray[y].push(bilinearInterpolate(data,));
  }}
}
