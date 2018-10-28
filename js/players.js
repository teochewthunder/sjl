var objPlayer = 
{
	wokePoints: config.major * 3,
	likes: config.major * config.major,
	editWokePoints: function(pts)
	{

		this.wokePoints = this.wokePoints + pts;

		if (this.wokePoints < 0)
		{
			this.wokePoints = 0;
		}
	},
	editLikes: function(pts)
	{
		this.likes = this.likes + pts;

		if (this.likes < 0)
		{
			this.likes = 0;
		}
	},	
	onEditWokePoints: function(pts) {},
	onEditLikes: function(pts) {},
}

var player = Object.assign({}, objPlayer);

player.onEditWokePoints = function (pts)
{
	player.editWokePoints(pts);
	playerDeck.enableButtons();	

	$("#playerStatWokePoints").animate
	(
		{
			color: config.getContextColor(pts <= 0 ? "negative" : "positive"),
		}, 
		100, 
		function() 
		{
			$("#playerStatWokePoints").animate
			(
				{
	    			color: "#FFFFFF",
	  			}, 
	  			100, 
	  			function() 
	  			{
	  				$("#playerStatWokePoints").html(player.wokePoints);
	  			}
	  		);
		}
	);	
};

player.onEditLikes = function (pts)
{
	player.editLikes(pts);

	if (player.likes == 0)
	{
		game.winner = bot;
	}

	$("#playerStatLikes").animate
	(
		{
			color: config.getContextColor(pts <= 0 ? "negative" : "positive"),
		}, 
		100, 
		function() 
		{
			$("#playerStatLikes").animate
			(
				{
	    			color: "#FFFFFF",
	  			}, 
	  			100, 
	  			function() 
	  			{ 				
	  				$("#playerStatLikes").html(player.likes);
	  			}
	  		);
		}
	);	
}


var bot = Object.assign({}, objPlayer);
bot.onEditWokePoints = function (pts)
{
	bot.editWokePoints(pts);

	$("#botStatWokePoints").animate
	(
		{
			color: config.getContextColor(pts <= 0 ? "negative" : "positive"),
		}, 
		100, 
		function() 
		{
			$("#botStatWokePoints").animate
			(
				{
	    			color: "#FFFFFF",
	  			}, 
	  			100, 
	  			function() 
	  			{	  				
	  				$("#botStatWokePoints").html(bot.wokePoints);
	  			}
	  		);
		}
	);	
}

bot.onEditLikes = function (pts)
{
	bot.editLikes(pts);

	if (bot.likes == 0)
	{
		game.winner = player;
	}

	$("#botStatLikes").animate
	(
		{
			color: config.getContextColor(pts <= 0 ? "negative" : "positive"),
		}, 
		100, 
		function() 
		{
			$("#botStatLikes").animate
			(
				{
	    			color: "#FFFFFF",
	  			}, 
	  			100, 
	  			function() 
	  			{
	  				$("#botStatLikes").html(bot.likes);
	  			}
	  		);
		}
	);
}