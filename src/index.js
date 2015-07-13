/*Copyright (C) Tyler Hackett 2015*/

var map;

/**
 *	Initialize FB API
 **/
$(document).ready(function() {
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_US/sdk.js', function(){
	FB.init({
		appId: '{your-app-id}',
		version: 'v2.3' // or v2.0, v2.1, v2.0
	});     
	$('#loginbutton,#feedbutton').removeAttr('disabled');
	FB.getLoginStatus(updateStatusCallback);
	
	FB.login(function(){
		// Note: The call will only work if you accept the permission request
		FB.api('/me/feed', 'post', {message: 'Hello, world!'});
	}, {scope: 'publish_actions'});
	});
});

/**
 *	Convert postal address into longitude & latitude.
 *	A JSON object with "lng" and "lat" will be passed
 *	to callback on success, or false on fail.
 **/
function GetGeocode(address, callback)
{
	$.get('https://maps.googleapis.com/maps/api/geocode/json',{address: address}, function(data)
	{
		if(data.status === "OK")
			callback(data.results[0].geometry.location);
		else
			callback(false);
	}, "json");
}

function InitializeMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 8,
    center: {lat: -34.397, lng: 150.644}
  });
}

/**
 *	Retrieve FB user's address.
 **/
function GetLocation(user)
{
	
}

google.maps.event.addDomListener(window, 'load', InitializeMap);

