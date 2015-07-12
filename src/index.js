/*Copyright (C) Tyler Hackett 2015*/

/**
 *	Retrieve FB user's address.
 **/
function GetLocation(user)
{

}

/**
 *	Convert postal address into longitude & latitude.
 *  A JSON object with "lng" and "lat" will be passed
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