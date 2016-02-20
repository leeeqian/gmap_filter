// Copyright (C) 2016 Axon Development Corporation All rights reserved worldwide.
var GmapFilter = function(map, data, filters, options, markerFn){

	var setting = {
		clusterIconUrl: "http://google-maps-utility-library-v3.googlecode.com/" +
			"svn/trunk/markerclusterer/images/m1.png"
	};
	setting = $.extend(setting, options);

	var allMarkers = [];
	var filterList = [];
	var clusterStyle = { height: 53, width: 53, url: setting.clusterIconUrl };
	var cluster = new MarkerClusterer(map, false, { styles: [clusterStyle,
		clusterStyle, clusterStyle, clusterStyle, clusterStyle] });
	$.each(filters, function(i, filter){ filterList[filter] = []; });

	var unique = function(arr) {
		var a = arr.concat();
		for(var i=0; i<a.length; ++i) {
			for(var j=i+1; j<a.length; ++j) {
				if(a[i] === a[j])
					a.splice(j--, 1);
			}
		}
		return a;
	};

	var hasIntersect = function(a, b) {
		for(var i = 0; i < a.length; i++)
			for(var k = 0; k < b.length; k++)
				if(a[i] == b[k])
					return true;
		return false;
	};

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

		$.each(filters, function(i, filter){
			if(markerOb[filter]){
				markerOptions[filter] = markerOb[filter].split(',');
				filterList[filter] =
					filterList[filter].concat(markerOptions[filter]);
			}
		});
		return new google.maps.Marker(markerOptions);
	};

	var buildFilters = function(){
		$.each(filters, function(i, filter){
			filterList[filter] = unique(filterList[filter]).sort();

			$('body').append('<div id="' + filter + '" class="tags">' +
				'<div>Filter on ' + filter + ': </div>'+
				'<div class="filter-list"></div>' +
				'</div>');
			$('#' + filter).append('<a href="#" class="toggle" style="float:right;">hide/expand</a>');
			$('#' + filter + ' .toggle').on('click', function(e){
				$('#' + filter + ' .filter-list').toggle('slow');
			});
			$.each(filterList[filter], function(i, tag){
				$('#' + filter + ' .filter-list').append(
					'<label class="tag">' +
					'<input type="checkbox" style="margin-right:3px" ' +
					'value="' + tag + '"/>' + tag + '</label>');
			});
			$('#' + filter + ' input[type="checkbox"]').on('click', filterMarkers);
			map.controls[google.maps.ControlPosition.TOP_LEFT].
				push(document.getElementById(filter));
		});
	};

	var filterMarkers = function(){
		cluster.clearMarkers();

		var selectedTags = [];
		$.each(filters, function(i, filter){
			selectedTags[filter] = [];
			$.each($('#' + filter + ' input:checked'), function(i, label){
				selectedTags[filter].push($(label).val());
			});
		});

		var tmpMarkers = [];
		$.each(allMarkers, function(i, marker){
			var satisfied = true;
			$.each(filters, function(i, filter){
				var tags = selectedTags[filter];
				if(tags.length !== 0 && !(marker[filter] &&
					hasIntersect(marker[filter], tags))){
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