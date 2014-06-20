// sight and latlng
var $sight, $box;
// maintaining itinerary list
var itineraryList;
var currentItiIndex = 0;
var currentItiStructure;
// cache itinerary structure
var ItiStructCache = {};

/**********************************************************************
* init map and clear map
**********************************************************************/
function initMap() {
	$('#right').gmap3({
	    /*panel:{
		  options:{
			content: $box, // a jQuery element or a string 
			bottom: true, right: true
		  }
		},*/
		panel:{
		  options:{
			content: $sight, // a jQuery element or a string 
			left: true, center: true, middle: true
		  },
		  tag: "sight"
		},
		map:{
			options:{
				center:{lat:31.236875746595213,lng:121.48608684539795}, 
				zoom:15, 
				mapTypeId: google.maps.MapTypeId.ROADMAP ,
				panControlOptions: {
					position: google.maps.ControlPosition.RIGHT_TOP
				},
				zoomControlOptions: {
					position: google.maps.ControlPosition.RIGHT_TOP
				}
			},
			events:{
				bounds_changed: function(map){
					var bounds = map.getBounds();
					var ne = bounds.getNorthEast();
					var sw = bounds.getSouthWest();
					$("#lat-north .value").html(ne.lat());
					$("#lng-east .value").html(ne.lng());
					$("#lat-south .value").html(sw.lat());
					$("#lng-west .value").html(sw.lng());
					var ce = map.getCenter();
					$("#lat-center .value").html(ce.lat());
					$("#lng-center .value").html(ce.lng());
				},
				click:function(map, event){
					$("#lat-center .value").html(event.latLng.lat());
					$("#lng-center .value").html(event.latLng.lng());
				}
			}
		}
	});
	$sight.hide();
	//getLatlng("01 Renmin Avenue, Huangpu, Shanghai, China");
}

function clearItinerary() {
	$( ".day").unbind( "click" );
	$( ".sight").unbind( "click" );
	$('.day').remove();
	$('.sight').remove();
    $('.dine').remove();
}

function cleanMap() {
	//var map = $("#right").gmap3("get");
	//$('#right').gmap3('destroy');
	$('#right').gmap3({
		clear: {
		  tag: ["sight-marker", "route"]
		}
	});
}
function clearRoute() {
	$('#right').gmap3({
		clear: {
		  tag: ["route"]
		}
	});
}
function clearSight(){
    $('#right').gmap3({
		clear: {
		  tag: ["sight-marker"]
		}
	});
}
function switch_route(){
    if (window.show_route) {
        clearRoute();
    }
}

/**********************************************************************
*  update the UI
**********************************************************************/

function setItiStructure(itiStructure) {
	clearItinerary();
	cleanMap();
	updateItinerary(itiStructure);
	setMarkers(itiStructure, 0);
	showRoute(itiStructure, 0);
	currentItiStructure = itiStructure;
}

function updateItinerary(itiStructure) {
	$('#itinerary-name').text(itiStructure.itinerary.name);

	var stops = itiStructure.stops;
	var startStop = null;

	var s_start = 60;
    var d_start = 60;
	var day_left = 20;
	var sight_left = 100;
    var dine_left = 100;
    var hotel_left = 210;
    
	
	for (var i = 0; i < stops.length; i++) {
		if (stops.length > 1) {
			var dx = "d_"+i;
			$('<button type="button" id=' + dx + '>' + ("第"+(i+1)+"天") + '</button>')
				.css({"position": "absolute","left": day_left, "top": d_start}).addClass("day")
				.appendTo("#left");
			$('#'+dx).click({day: i+1}, function(event){changeRoute(event.data.day);});
			var s_start = d_start + 15;
		}
		var sights = stops[i];
		for (var j = 0; j < sights.length; j++) {
			var stopObj = sights[j];
			var sx = "s_"+i+j;
			$('<button type="button" id=' + sx + '>' + (j+1) + ". " + stopObj.name+(stopObj.duration>0?"("+stopObj.duration+"天)":"") + '</button>')
				.css({"position": "absolute", "left": sight_left, "top": s_start}).addClass("sight")
				.appendTo("#left");
			$('#'+sx).click({obj: stopObj}, function(event){showSightDetail(event.data.obj);});
			s_start += 40;
		}
        
		d_start = s_start;
        $('<button type="button" id="dine_' + dx + '">饭店</button>')
				.css({"position": "absolute","left": dine_left, "top": d_start}).addClass("dine")
				.appendTo("#left");
        $('<button type="button" id="hotel_' + dx + '">酒店</button>')
				.css({"position": "absolute","left": hotel_left, "top": d_start}).addClass("dine")
				.appendTo("#left");
        d_start = d_start + 50;
	}

	$('.day').addClass("btn btn-info");
	$('.sight').addClass("btn btn-success");
    $('.dine').addClass("btn btn-warning");

}

/************************************************************************
* route
************************************************************************/
function changeRoute(day) {
	itiStructure = currentItiStructure;
	clearRoute();
	showRoute(itiStructure, day);
}

// show itinerary's route, show all if day = 0
function showRoute(itiStructure, day) {
	hideSightDetail();
	var stopsArr = [];
	var stops = itiStructure.stops;
    clearSight();
    setMarkers(itiStructure,day);
	if (day == 0) {
		for (var i in stops) {
			for (var p in stops[i])
				stopsArr.push(stops[i][p]);
		}
	} else { 
		for (var p in stops[day-1])
			stopsArr.push(stops[day-1][p]);
	}
	_showRoute(stopsArr);
}

function _showRoute(stopsArr) {
	if (stopsArr.length < 2) return;

	var startStop = stopsArr.shift();
	var endStop = stopsArr.pop();
	var waypoints = [];
	for (var i in stopsArr) {
		waypoints.push({location: stopsArr[i].place.address, stopover: true});
	}

	$('#right').gmap3({
		getroute:{
			options:{
				origin: [startStop.place.latitude, startStop.place.longitude],
				destination: [endStop.place.latitude, endStop.place.longitude],
				waypoints: waypoints,
				travelMode: google.maps.DirectionsTravelMode.WALKING
			},
			callback: function(results){
				if (!results) return;
				$(this).gmap3({
					directionsrenderer:{
						options:{
							directions:results,
							suppressMarkers: true,
							polylineOptions: {
									strokeColor: "#2249a3",
									strokeOpacity: 0.8 ,
									strokeWeight: 5
							}
						},
						tag: "route"
					}
				});
			}
		}
	});
}

/******************************************************************
* marker
******************************************************************/
function setMarkers(itiStructure,day) {
	var stops = itiStructure.stops;
    if (day == 0) {
        for (var i in stops) {
            var sights = stops[i];
            for (var j in sights) {
                var stopObj = sights[j];
                showMarker(stopObj);
            }
        }
	} else {
		for (var p in stops[day-1]) {
            var stopObj = stops[day-1][p];
            showMarker(stopObj);
        }
	}
}

function showMarker(stopObj) {
	$('#right').gmap3({
		defaults:{ 
			classes:{
				Marker:MarkerWithLabel
			}
		},
		marker:{
			latLng: [stopObj.place.latitude, stopObj.place.longitude],
			options:{
				labelAnchor: new google.maps.Point(50, 60),
				labelClass: "labels",
				labelStyle: {opacity: 0.9},
				labelContent: stopObj.place.name+(stopObj.duration>0?"("+stopObj.duration+"天)":""),
			},
			data: stopObj,
			events:{
				mouseover: function(marker, event, context){
					var map = $(this).gmap3("get"),
						infowindow = $(this).gmap3({get:{name:"infowindow"}});
					if (infowindow){
						infowindow.open(map, marker);
						infowindow.setContent(context.data);
					} else {
						$(this).gmap3({
							infowindow:{
							anchor:marker, 
							options:{content: context.data.place.address}
							}
						});
					}
				},
				mouseout: function(){
					$(this).gmap3({
						clear: {
							name: ["infowindow"]
						}});
				},
				click: function(marker, event, context) {
					showSightDetail(context.data);
				}
			},
			tag: "sight-marker"
		}
	});
}

/*****************************************************************
* sight
*****************************************************************/
function showSightDetail(stopObj) {
	if (stopObj.place.ptype < 4) { // has sub_itinerary
		getItinerarysByPlace(stopObj.place.name);
		return;
	}
	
	if (stopObj.place.ptype == 7 || stopObj.place.ptype == 8) {
		alert("这是旅馆或者餐馆。");
		return;
	}
	
	/*hideSightDetail();
	$('#right').gmap3({
		panel:{
			options:{
				content: $sight, // a jQuery element or a string 
				center: true, middle: true
			},
			tag: "sight"
		}
	});*/
	$sight.css({"left": "-560px", "width": "560px", "top": "0px", "overflow-y": "auto"});
	$sight.css("height", $('#right').css("height"));
	$sight.show('fast');
	$sight.animate({left: '+0px'});
	$("#sight-info #name").html(stopObj.place.name);
	$("#sight-info #name-en").html(stopObj.place.name_en);
	$("#sight-info #pic img").attr("src", stopObj.place.pics);
	$("#sight-info #telephone").html(stopObj.place.telephone);
	$("#sight-info #address").html(stopObj.place.address);
	$("#sight-info #opentime").html(stopObj.place.opentime);
	$("#sight-info #expense").html(stopObj.place.expense);
	$("#sight-info #description").html(stopObj.place.name);
}

function hideSightDetail() {
	$sight.animate({left: "-560px"});
	$sight.hide('fast');
}

function resetSightDetail() {
	cleanSightDetail();
	$('#right').gmap3({
		panel:{
		  options:{
			content: $sight, // a jQuery element or a string 
			left: true, center: true
		  },
		  tag: "sight"
		}
	});	
}

function cleanSightDetail() {
	$('#right').gmap3({
		clear: {
		  tag: ["sight"]
		}
	});
}

/*********************************************************************
* next prev route
*********************************************************************/
function hasNextIti() {
	return currentItiIndex < itineraryList.length-1;
}
function hasPrevIti() {
	return currentItiIndex > 0;
}
function getNextIti() {
	if (currentItiIndex < itineraryList.length-1)
		currentItiIndex++;
	else
		currentItiIndex = 0;
	return itineraryList[currentItiIndex];
}
function getPrevIti() {
	if (currentItiIndex > 0)
		currentItiIndex--;
	else
		currentItiIndex = itineraryList.length-1;
	return itineraryList[currentItiIndex];
}
function getCurrIti() {
	return itineraryList[currentItiIndex];
}
function showPrevItinerary() {
	var iti = getPrevIti();
	getItineraryStructure(iti);
}
function showNextItinerary() {
	var iti = getNextIti();
	getItineraryStructure(iti);
}

function getLatlng(address) {
	$("#right").gmap3({
		getlatlng:{
			address:  address,
			callback: function(results){
			  if ( !results ) return;
			  alert(results[0].geometry.location);				  
			}
		}
	});			
}

/**************************************************************
* on body load
**************************************************************/
function resizeMap() {
	var height = $(window).height();
	var width = $(window).width();
	$('#left').css("height", ""+(height-30));
	$('#right').css("height", ""+(height-44));
	//$sight.css("top", ""+$('#right').css("top"));
	//$sight.css("height", ""+(height-50));
	resetSightDetail();
	//alert(height);
	if (width < 1000) {
		$('#left').css("width", "300px");
		$('#right').css("width", "700px");
	} else {
		$('#left').css("width", "370px");
		$('#right').css("width", width-370);
	}
}
$(function(){

	$box = $("#location");
	$box.detach();

	$sight = $("#sight-info");
	$sight.detach();

	initMap();

	$('#prev').click(function() {showPrevItinerary();});
	$('#next').click(function() {showNextItinerary();});
	$('#sight-info #close').click(function() {hideSightDetail();});
	
	$(window).resize(function(){resizeMap();});
	resizeMap();
	
	getItinerarysByPlace("中国");
	//getLatlng("Suzhou, China");
});

/********************************************************************
* ajax request
********************************************************************/
function getItineraryStructure(iti) {
	iti_no = iti.ino
	if (ItiStructCache[iti_no]) {
		setItiStructure(ItiStructCache[iti_no]);
		return;
	} else {
		$.post("/getItineraryStructure", {ino: iti_no}).done(function (data){
			var itiStructure = JSON.parse(data);
			setItiStructure(itiStructure);
			ItiStructCache[iti_no] = itiStructure;
		});
	}
}

function getItinerarysByPlace(name) {
    $.post("/getItinerarysByPlace", {place: name}).done(function (data){
		var list = JSON.parse(data);
		// show new itinerary
		if (list.length > 0) {
			itineraryList = list;
			currentItiIndex = 0;
			getItineraryStructure(itineraryList[0]);
		}
	});
}

/*********************************************************************
* change place
*********************************************************************/
function changePlace() {
	var place = $('#place').val();
	getItinerarysByPlace(place);
}

function goUp() {
	var no = itineraryList[currentItiIndex].parent_ino;
	
    $.post("/getItinerarysByIno", {ino: no}).done(function (data){
		var list = JSON.parse(data);
		// show new itinerary
		if (list.length > 0) {
			itineraryList = list;
			currentItiIndex = 0;
			getItineraryStructure(itineraryList[0]);
		} else {
			alert("已经是最高级了。");
		}
	});
}