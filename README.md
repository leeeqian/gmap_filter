# GmapFilter
Google map with filters and marker cluster
Automatically add filters (currently enum, range) based on selected marker properties.

Using: jquery, makercluster, google map js

the filter can handles properties with comma separated string, and range type


#Example:
Google Map with google's earthquake data

```javascript
// Defines the callback function referenced in the jsonp file.
function eqfeed_callback(data) {
	var filters = [{type: 'enum', tag: 'net'}, 
		{type: 'enum', tag: 'magType'}, 
		{type: 'enum', tag: 'types'},
		{type: 'range', tag: 'mag'}];
	GmapFilter(map, data.features, filters, [], function(p){
		var t = new Date(p.properties.time);
		return {
			lat: p.geometry.coordinates[1],
			lng: p.geometry.coordinates[0],
			title: p.properties.title + 
				'\r\nstatus: ' + p.properties.status + 
				'\r\ntime: ' + t.toString() + 
				'\r\nmagnitude: ' + p.properties.mag,
			net: p.properties.net,
			magType: p.properties.magType,
			types: p.properties.types,
			mag: p.properties.mag
		};
	});
}
```

![Alt Text](https://raw.githubusercontent.com/leeeqian/gmap_filter/master/example.png)

http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
