import { writeFileSync, readFileSync } from "fs";

let data = JSON.parse(readFileSync("data.json", "utf-8"));
let elevation = JSON.parse(readFileSync("elevation_final.json", "utf-8"));

for (let y = 0; y < data.length; y++) {
  for (let x = 0; x < data[y].length; x++) {
    data[y][x][2] = elevation[y][x];
  }
}

writeFileSync("data_stitched.json", JSON.stringify(data), (err) => {
  if (err) throw err;
});
