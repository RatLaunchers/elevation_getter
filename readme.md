# elevation_getter

hack job that takes a bottom left coordinate and spits out 9.07 meter (or any multiple of that) intervals in latitude and longitude

Lat and lon data is then fed into open-elevation api to get elevation data

## how to use

in `latlon_to_elevation.js` there are two variables called `initLat` and `initLon` put the lattitute and longitude of the bottom left corner of the map in

`node latlon_elevation.js` to run the script, `elevation_final.json` will be created (or updated)
