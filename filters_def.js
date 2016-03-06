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
		'<div>Filter on ' + this.tag + ': </div>'+
		'<div class="filter-list"></div>' +
		'</div>');
	$('#' + this.tag).append('<a href="#" class="toggle" style="float:right;">hide/expand</a>');
	$('#' + this.tag + ' .toggle').on('click', function(e){
		$('#' + this.tag + ' .filter-list').toggle('slow');
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