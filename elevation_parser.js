import { readFileSync, writeFileSync } from "fs";

const dataX = 14;
const dataY = 10;
const data = JSON.parse(readFileSync("elevation.json", "utf-8"));

let finalData = [];
for (let y = 0; y < dataY; y++) {
  finalData.push([]);
  for (let x = 0; x < dataX; x++) {
    finalData[y].push(data.results[y * dataY + x].elevation);
  }
}

writeFileSync("elevation_parse.json", JSON.stringify(finalData), (err) => {
  if (err) throw err;
  console.log("file saved");
});
