/*Copyright (C) Tyler Hackett 2015*/

var map;

$('[data-goto]').click(function()
{
	var gt = $(this).attr('data-goto');
	
	var pageHeight;
	
	$('.active').animate({'height':'0px'}, 500, function()
	{
		$(this).removeClass('active');
		$(this).css('height','');
		
		$page = $('[data-page="'+gt+'"]');
		$page.addClass('active');
		pageHeight = $page.height();
		$page.removeClass('active');
		
		$page.animate({'height':pageHeight+'px'}, 500, function(){ $page.addClass('active'); $page.css('height',''); });
	});
	
});

/**
 *	Initialize FB API
 **/
$(document).ready(function() {
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_US/sdk.js', function(){
	FB.init({
		appId: '1610996765822675',
		xfbml: true,
		version: 'v2.4' // or v2.0, v2.1, v2.0
	});     
	$('#loginbutton,#feedbutton').removeAttr('disabled');
	FB.getLoginStatus(statusChangeCallback);
	
	FB.login(function(){
		// Note: The call will only work if you accept the permission request
		FB.api('/me/feed', 'post', {message: 'Hello, world!'});
	}, {scope: 'publish_actions'});
	});
});
// This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'You must login to use GeoNet.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'You must login to use GeoNet.';
    }
  }
  
  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
}

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
}

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
	maxZoom: 3,
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
