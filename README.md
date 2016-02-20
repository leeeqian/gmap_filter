# gmap_filter
Google map with filters and marker cluster
requires jquery, makercluster

#example:
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


