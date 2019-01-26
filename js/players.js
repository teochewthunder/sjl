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
	showSpecial: function(cardId, specialIndex, cardIndex) {},
}

var player = Object.assign({}, objPlayer);

player.onEditWokePoints = function (pts)
{
	player.editWokePoints(pts);
	playerDeck.enableButtons();	

	$("#playerStatWokePoints").animate
	(
		{
			color: config.getContextColor(pts),
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
		game.winner = "bot";
	}

	$("#playerStatLikes").animate
	(
		{
			color: config.getContextColor(pts),
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

	  				if (game.winner != null)
					{
						game.declareWinner();
					}
	  			}
	  		);
		}
	);	
}

player.showSpecial = function (cardId, specialIndex, cardIndex)
{
	$("#playerSpecial_" + cardId).show();
	playerHand.handGlow("playerHand_" + cardIndex, 1);

	$("#playerSpecial_" + cardId + " .special_" + specialIndex).animate
	(
		{
			color: "rgba(255, 255, 255, 1)",
		}, 
		50, 
		function() 
		{
			$("#playerSpecial_" + cardId + " .special_" + specialIndex).animate
			(
				{
					color: "rgba(255, 255, 255, 0)",
				}, 
				2000, 
				function() 
				{
					$("#playerSpecial_" + cardId).hide();
					$("#playerSpecial_" + cardId + " .special_" + specialIndex).attr("style", "color: rgba(255, 255, 255, 0)");
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
			color: config.getContextColor(pts),
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
		game.winner = "player";
	}

	$("#botStatLikes").animate
	(
		{
			color: config.getContextColor(pts),
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

	  				if (game.winner != null)
					{
						game.declareWinner();
					}
	  			}
	  		);
		}
	);
}

bot.showSpecial = function (cardId, specialIndex, cardIndex)
{
	$("#botSpecial_" + cardId).show();
	botHand.handGlow("botHand_" + cardIndex, 1);

	$("#botSpecial_" + cardId + " .special_" + specialIndex).animate
	(
		{
			color: "rgba(255, 255, 255, 1)",
		}, 
		50, 
		function() 
		{
			$("#botSpecial_" + cardId + " .special_" + specialIndex).animate
			(
				{
					color: "rgba(255, 255, 255, 0)",
				}, 
				2000, 
				function() 
				{
					$("#botSpecial_" + cardId).hide();
					$("#botSpecial_" + cardId + " .special_" + specialIndex).attr("style", "color: rgba(255, 255, 255, 0)");
				}
			);
		}
	);
}