import { readFileSync, writeFileSync } from "fs";

// converts received elevation data into simpler format
const dataX = 14;
const dataY = 11;
const data = JSON.parse(readFileSync("elevation.json", "utf-8"));
let hundredVoid = [];
for (let i = 0; i < 100; i++) {
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

let finalData = [];
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

writeFileSync("elevation_parse3.json", JSON.stringify(finalData), (err) => {
  if (err) throw err;
  console.log("file saved");
});
