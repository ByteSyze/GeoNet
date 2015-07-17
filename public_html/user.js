/*Copyright (C) Tyler Hackett 2015*/

var user;
var users = [];

var friendDepth = 1; //How many friends of friends can be loaded.
var depth = 0;
	  
function User(id, name)
{
	console.log(name);
	console.log(id);
	
	this.id			= id;
	this.name		= name;
	this.friends	= [];
	this.net		= [];
	
	usr = this;
	
	FB.api('/'+this.id+'?fields=location', function(response)
	{			
		FB.api('/'+response.location.id+'?fields=location',function(response)
		{
			var longitude 	= response.location.longitude;
			var latitude 	= response.location.latitude;
		
			usr.location 	= new google.maps.LatLng(latitude, longitude);
			usr.icon		= new google.maps.Circle(usr.getIconOptions());
		});
	});
	
	users.push(this);
	this.loadFriends();
	this.generateNet();
}

User.prototype.getName = function()
{
	return this.name;
}

User.prototype.loadFriends = function()
{
	if(depth < friendDepth)
	{
		usr = this;
		
		FB.api('/'+this.id+'/friends',function(response)
		{
			response.data.forEach(function(userData)
			{
				var friend = null;
				
				for(var i = 0; i < users.length; i++)
				{
					if(users[i].id === userData.id)
					{
						friend = users[i];
						break;
					}
				}
				if(friend)
					usr.addFriend(friend);
				else
					usr.addFriend(new User(userData.id, userData.name));
			});
		});
		
		depth++;
	}
}

User.prototype.generateNet = function()
{
	this.friends.forEach(function(user)
	{
		var n = null //Net to add to this user.
		
		user.net.forEach(function(net)
		{
			//Check user for existing net between them.
			if(net.contains(this))
				n = net;
		});
		
		if(n)
			this.net.push(n);
		else
			this.net.push(new Net(this, user));
	});
}

User.prototype.getFriends = function()
{
	return this.friends;
}

User.prototype.setFriends = function(friends)
{
	this.friends = friends;
}

User.prototype.addFriend = function(friend)
{
	var alreadyExists = false;
	
	for(var i = 0; i < this.friends.length; i++)
	{
		if(this.friends[i] === friend)
		{
			alreadyExists = true;
			break;
		}
	}
	
	if(!alreadyExists)
		this.friends.push(friend);
}

User.prototype.removeFriend = function(friend)
{
	var index = this.friends.indexOf(friend);
	
	if(index > -1)
		this.friends.splice(index, 1);
}

User.prototype.getIconOptions = function()
{
	var iconOptions;
	
	if(this == user) //If this is the instance of the current user
	{
		iconOptions = {
			strokeColor: '#992E2E',
			strokeOpacity: 1,
			strokeWeight: 5,
			fillColor: '#FF4D4D',
			fillOpacity: 1,
			map: map,
			center: this.location,
			radius: 50000
		};
	}
	else
	{
		iconOptions = {
			strokeColor: '#5370EC',
			strokeOpacity: 1,
			strokeWeight: 5,
			fillColor: '#99B8FF',
			fillOpacity: 1,
			map: map,
			center: this.location,
			radius: 50000
		};
	}
	return iconOptions;
}

///////////////////////////////

/**
 *	Create a net from one User to another. Automatically generates 
 *	a graphical net between the two Users and displays it on the map.
 **/
function Net(from, to)
{
	this.from = from;
	this.to = to;
}

Net.prototype.contains = function(user)
{
	return (this.a === user || this.b === user);
}
