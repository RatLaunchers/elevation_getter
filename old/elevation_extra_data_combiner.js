import { readFileSync, writeFileSync } from "fs";

let data = JSON.parse(readFileSync("data.json", "utf-8"));
let elevationData = JSON.parse(readFileSync("elevation_parse.json", "utf-8"));

for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[y].length; x++) {
    data[y][x][2] = elevationData[]
  }
}
