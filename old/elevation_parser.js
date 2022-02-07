import { readFileSync, writeFileSync } from "fs";

// converts received elevation data into simpler format
const dataX = 14;
const dataY = 11;
const data = JSON.parse(readFileSync("elevation.json", "utf-8"));
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

writeFileSync(
  "elevation_parse_finalanothertest.json",
  JSON.stringify(finalFinalData),
  (err) => {
    if (err) throw err;
    console.log("file saved");
  }
);
