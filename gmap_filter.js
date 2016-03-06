// Copyright (C) 2016 Axon Development Corporation All rights reserved worldwide.
var GmapFilter = function(map, data, filters, options, markerFn){

	var setting = {
		clusterIconUrl: "http://google-maps-utility-library-v3.googlecode.com/" +
			"svn/trunk/markerclusterer/images/m1.png"
	};
	setting = $.extend(setting, options);

	var allMarkers = [];
	var filtersOb = [];
	var clusterStyle = { height: 53, width: 53, url: setting.clusterIconUrl };
	var cluster = new MarkerClusterer(map, false, { styles: [clusterStyle,
		clusterStyle, clusterStyle, clusterStyle, clusterStyle] });
	$.each(filters, function(i, filter){
		switch(filter.type){
			case "enum":
				filtersOb[i] = new GmapEnumFilter(filter);
				break;
			case "range":
				filtersOb[i] = new GmapRangeFilter(filter);
				break;
			default:
				alert("Un-recognized filter type: " + filter.type);
		}		
	});

	var buildMarker = function(v, markerFn){
		var markerOb = markerFn(v);		
		var lat = markerOb.lat;
		var lng = markerOb.lng;
		var point_latlng = new google.maps.LatLng(lat, lng);
		var markerOptions = { position: point_latlng, map: map,
			title: markerOb.title
		};
		if(setting.iconUrl){
			markerOptions.icon = {
				url: setting.iconUrl,
				scaledSize: new google.maps.Size(20, 20), // scaled size
				origin: new google.maps.Point(0,0), // origin
				anchor: new google.maps.Point(0, 0) // anchor
			};
		}

		$.each(filtersOb, function(i, filter){
			if(markerOb[filter.tag]){
				markerOptions[filter.tag] = filter.makeMarkerOption(markerOb[filter.tag]);
			}
		});
		return new google.maps.Marker(markerOptions);
	};

	var buildFilters = function(){
		$.each(filtersOb, function(i, filter){
			filter.buildFilter(filterMarkers);
			map.controls[google.maps.ControlPosition.TOP_LEFT].
				push(document.getElementById(filter.tag));
		});
	};

	var filterMarkers = function(){
		cluster.clearMarkers();

		$.each(filtersOb, function(i, filter){
			filter.updateSelected();
		});

		var tmpMarkers = [];
		$.each(allMarkers, function(i, marker){
			var satisfied = true;
			$.each(filtersOb, function(i, filter){
				if (!filter.checkSatisfied(marker)){
					satisfied = false;
				}
			});
			if(satisfied === true){
				tmpMarkers.push(marker);
				marker.setMap(map);
			}else{
				marker.setMap(null);
			}
		});

		cluster.addMarkers(tmpMarkers);
	};
	
	$.each(data, function(i, v){
		allMarkers.push(buildMarker(v, markerFn));
	});
	buildFilters();
	cluster.addMarkers(allMarkers);
};