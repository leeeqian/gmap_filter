# GmapFilter
Google map with filters and marker cluster
Automatically add filters (currently checkboxes only) based on selected marker properties.

Using: jquery, makercluster, google map js

NOTE: the filter handles properties with comma separated automatically

#Example:
Google Map with google's earthquake data

```javascript
function eqfeed_callback(data) {
  var filters = ['net', 'magType', 'types'];
	GmapFilter(map, data.features, filters, [], function(p){
		var t = new Date(p.properties.time);
		return {
			lat: p.geometry.coordinates[1],
			lng: p.geometry.coordinates[0],
			title: p.properties.title + '\r\nstatus: ' + p.properties.status + '\r\ntime: ' + t.toString(),
			net: p.properties.net,
			magType: p.properties.magType,
			types: p.properties.types
		};
	});
}
```

![Alt Text](https://raw.githubusercontent.com/leeeqian/gmap_filter/master/example.png)

http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
