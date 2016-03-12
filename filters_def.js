function GmapEnumFilter(filter){
	this.tag = filter.tag;
	this.filterList = [];
	this.selectedTags = [];
};

GmapEnumFilter.prototype.makeMarkerOption = function(value){
	var valueArray = value.split(',');
	this.filterList = this.filterList.concat(valueArray);
	return valueArray;
};

GmapEnumFilter.prototype.buildFilter = function(callFunc){
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
	var filterTag = this.tag;
	this.filterList = unique(this.filterList).sort();
	$('body').append('<div id="' + this.tag + '" class="tags">' +
		'<div>Filter on <b>' + this.tag + '</b>: </div>'+
		'<div class="filter-list"></div>' +
		'</div>');
	$('#' + this.tag).append('<a href="#" class="toggle" style="float:right;">hide/expand</a>');
	$('#' + this.tag + ' .toggle').on('click', function(e){
		$('#' + filterTag + ' .filter-list').toggle('slow');
	});
	$.each(this.filterList, function(i, tagValue){
		$('#' + filterTag + ' .filter-list').append(
			'<label class="tag">' +
			'<input type="checkbox" style="margin-right:3px" ' +
			'value="' + tagValue + '"/>' + tagValue + '</label>');
	});
	$('#' + this.tag + ' input[type="checkbox"]').on('click', callFunc);
};

GmapEnumFilter.prototype.updateSelected = function(){
	var selectedTags = [];
	$.each($('#' + this.tag + ' input:checked'), function(i, label){
		selectedTags.push($(label).val());
	});
	this.selectedTags = selectedTags;
};

GmapEnumFilter.prototype.checkSatisfied = function(marker){
	var hasIntersect = function(a, b) {
		for(var i = 0; i < a.length; i++)
			for(var k = 0; k < b.length; k++)
				if(a[i] == b[k])
					return true;
		return false;
	};
	if(this.selectedTags.length !== 0 && !(marker[this.tag] &&
		hasIntersect(marker[this.tag], this.selectedTags))){
		return false;
	}
	return true;
}

function GmapRangeFilter(filter){
	this.tag = filter.tag;
	this.max = this.min = this.upper = this.lower = false;
};

GmapRangeFilter.prototype.makeMarkerOption = function(value){
	if(this.max === false || value > this.max)
		this.max = this.upper = value;
	if(this.min === false || value < this.min)
		this.min = this.lower = value;
	return value;
};

GmapRangeFilter.prototype.buildFilter = function(callFunc){
	var filterTag = this.tag;
	$('body').append(
		'<div id="' + this.tag + '" class="tags">' +
			'<div>Filter on <b>' + this.tag + '</b>: </div>'+
			'<div id="filter-range" style="margin: 15px auto 5px;height:150px;"></div>' +
			'<div type="text" id="value" style="color:#f6931f;text-align:center;"></div>' +
		'</div>');
	$('#' + this.tag).append('<a href="#" class="toggle" style="float:right;">hide/expand</a>');
	$('#' + this.tag + ' .toggle').on('click', function(e){
		$('#' + filterTag + ' #filter-range').toggle('slow');
	});
	$('#' + this.tag + ' #filter-range').slider({
		orientation: "vertical",
		range: true,
		min: this.min,
		max: this.max,
		step: 0.1,
		values: [ this.lower, this.upper ],
		slide: function(event, ui){
			$("#value").html( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
		},
		change: function(event, ui){
			callFunc();
		}
	});
};

GmapRangeFilter.prototype.updateSelected = function(){
	this.lower = $('#' + this.tag + ' #filter-range').slider('values', 0);
	this.upper = $('#' + this.tag + ' #filter-range').slider('values', 1);
};

GmapRangeFilter.prototype.checkSatisfied = function(marker){
	if(!(marker[this.tag] && $.isNumeric(marker[this.tag]) && 
		marker[this.tag] >= this.lower &&
		marker[this.tag] <= this.upper)){
		return false;
	}
	return true;
}
