# elevation_getter

hack job that takes a bottom left coordinate and spits out 9.07 meter (or any multiple of that) intervals in latitude and longitude

Lat and lon data is then fed into open-elevation api to get elevation data

## how to use (only God knows)

### 1

Use latlon_calc.js to create latlon.json a json with the latlon of the desired points along the defined rectangle

note: the point defined is the bottom left point of the rectangle

### 2

Use elevation_request.js to pull elevation numbers from open-elevation

### 3

Use elevation_parser.js to convert api data into format for interpolation (why not just make part of interpolation?)

dataX and dataY are the width and height of the array

### 4

Use elevation_data_interpolator to interpolate