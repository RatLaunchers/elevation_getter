import LatLon from "geodesy/latlon-ellipsoidal-vincenty.js"
//51.030035, -113.8749132
const p1 = new LatLon(51.030035, -113.874913);
const p2 = p1.destinationPoint(1200, 90);

console.log(p2.toString());
