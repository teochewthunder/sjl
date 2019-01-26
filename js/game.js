var game = 
{
	round: 0,
	winner: null,
	turnAttacker: "bot",
	turnIndex: -1,
	paused: true,
	init: function()
	{
		$(playerDeck.cards).each
		(
			function (index)
			{
				playerDeck.cards[index].turnsToLive = 0;
				playerDeck.cards[index].init();
			}
		);

		$(botDeck.cards).each
		(
			function (index)
			{
				botDeck.cards[index].turnsToLive = 0;
				botDeck.cards[index].init();
			}
		);

		game.round = 0;
		game.winner = null;
		game.turnAttacker = "bot";
		game.turnIndex = -1;
		game.paused = true;

		playerHand.cards = [];
		botHand.cards = [];
		playerHand.compactCards();
		playerHand.renderCards();
		botHand.compactCards();
		botHand.renderCards();

		player.wokePoints = config.major * 3;
		player.likes = config.major * config.major;

		bot.wokePoints = config.major * 3;
		bot.likes = config.major * config.major;

		$("#botWinner").html("");
		$("#playerWinner").html("");

		$("#botStatWokePoints").html(bot.wokePoints);
		$("#botStatLikes").html(bot.likes);
		$("#playerStatWokePoints").html(player.wokePoints);
		$("#playerStatLikes").html(player.likes);
		game.showProcessingMessage("Generating bot hand for first round...", "loading.gif");
		botDeck.playRandomCard();
	},
	declareWinner: function()
	{
		if (this.winner == "bot")
		{
			$("#botWinner").html(" wins!");
		}

		if (this.winner == "player")
		{
			$("#playerWinner").html(" wins!");
		}

		this.round = 0;
	},
	openOverlay: function(content)
	{
		$("#screenOverlay").show();
						
		$("#screenOverlay").animate
		(
			{
				top: "0",
				left: "0",
				width: "100%",
    			height: "100%",
  			}, 
  			100, 
  			function() 
  			{
				$("#screenOverlay_content").append(content);

				$("#screenOverlay").click
				(
					function()
					{
						game.closeOverlay();
					}
				)
  			}
  		);
	},
	closeOverlay: function()
	{
		$("#screenOverlay_content").html("");

		$("#screenOverlay").animate
		(
			{
				top: "50%",
				left: "50%",
				width: "0%",
    			height: "0%",
  			}, 
  			100, 
  			function() 
  			{
				$("#screenOverlay").hide();
  			}
  		);
	},
	getCardSummary: function()
	{
		var table = $("<table width='100%'></table>");
		var tr;
		var td;
		var p;

		$(cardTemplates).each
		(
			function (i)
			{
				tr = $("<tr></tr>");
				td = $("<td width='10%'></td>");
				td.html(cardTemplates[i].render("sm"));
				tr.append(td);
				td = $("<td width='90%' bgcolor='#EEEEEE'></td>");
				p = $("<p></p>");
				var content = "";
				$(cardTemplates[i].details).each
				(
					function (index)
					{
						content += "<b>" + cardTemplates[i].details[index].title + ":</b> ";
						content += cardTemplates[i].details[index].description;
						content += "<br />";
					}
				);
				p.html(content);
				td.append(p);
				tr.append(td);
				table.append(tr);
			}
		);

		return table;
	},
	showProcessingMessage: function(txt, img)
	{
		var message = txt;

		if (img != "")
		{
			message = message + "<img src='img/" + img + "' height='10'>";
		}

		$("#attackInfo").html("<br />" + message);
	},
	hideProcessingMessage: function()
	{
		$("#attackInfo").html("&nbsp;");
	},
	renderAttackSequence: function()
	{
		$("#attackInfo").html("");

		for (var i = 0; i < botHand.maxCards; i++)
		{
			var slot = $("<div></div>");
			slot.addClass("attackInfoSlot");
			slot.attr("id", "attackSlot_" + i) ;

			if (i == game.turnIndex)
			{
				var slotContent = $("<span></span>");
				var symbol = (this.turnAttacker == "bot" ? "\u25bc" : "\u25b2");
				slotContent.html(symbol);
				slot.append(slotContent);
			}

			$("#attackInfo").append(slot);
		}
	},
	startRound: function()
	{
		$(playerDeck.cards).each
		(
			function (index)
			{
				if (playerDeck.cards[index].turnsToLive > 0)
				{
					if (playerDeck.cards[index].id == "snowflake")
					{
						playerDeck.cards[index].onEditDefence(config.minor, "#playerDeck_" + index + " .def_" + playerDeck.cards[index].id);
					}

					playerDeck.cards[index].onEditTurnsToLive(-1);
				}					
			}
		);

		$(playerHand.cards).each
		(
			function (index)
			{
				playerHand.cards[index].roundSpecial(index, "player");
			}
		);

		$(botDeck.cards).each
		(
			function (index)
			{
				if (botDeck.cards[index].turnsToLive > 0)
				{
					if (botDeck.cards[index].id == "snowflake")
					{
						botDeck.cards[index].editDefence(config.medium);
					}

					botDeck.cards[index].onEditTurnsToLive(-1);
				}					
			}
		);

		$(botHand.cards).each
		(
			function (index)
			{
				botHand.cards[index].roundSpecial(index, "bot");
			}
		);

		this.paused = false;
		playerDeck.enableButtons();
		this.round++;

		game.nextTurn();
		game.startTurn();
	},
	startTurn: function()
	{
		if (this.turnIndex >= 0)
		{
			if (this.turnAttacker == "player")
			{
				if (playerHand.cards[this.turnIndex] == null)
				{
					game.nextTurn();

					if (game.turnIndex == -1) 
					{
						game.endRound();
					}
					else
					{
						game.startTurn();
					}
				}
				else
				{
					playerHand.cards[this.turnIndex].roundSpecial();
					playerHand.cards[this.turnIndex].onAttack(this.turnIndex);					
				}
			}
			else
			{
				if (botHand.cards[this.turnIndex] == null)
				{
					game.nextTurn();

					if (game.turnIndex == -1) 
					{
						game.endRound();
					}
					else
					{
						game.startTurn();
					}
				}
				else
				{
					botHand.cards[this.turnIndex].roundSpecial();
					botHand.cards[this.turnIndex].onAttack(this.turnIndex);					
				}
			}
		}
	},
	nextTurn: function()
	{
		if (this.turnAttacker == "bot")
		{
			if (this.turnIndex == -1)
			{
				this.turnIndex ++;
			}
			else
			{
				var isOdd = ((this.turnIndex + 1) % 2 == 0 ? false: true);

				if (isOdd)
				{
					this.turnAttacker = "player";					
				}
				else
				{
					if (this.turnIndex + 1 == botDeck.maxCards)
					{
						this.turnIndex = -1;
					}
					else
					{
						this.turnIndex ++;
					}
				}
			}
		}
		else
		{
			var isOdd = ((this.turnIndex + 1) % 2 == 0 ? false: true);

			if (isOdd)
			{
				this.turnIndex ++;				
			}
			else
			{
				this.turnAttacker = "bot";	
			}
		}
	},
	endRound: function()
	{
		playerHand.compactCards();
		playerHand.renderCards();	

		botHand.compactCards();
		botHand.renderCards();

		$("#rounds").html(this.round + 1);

		game.showProcessingMessage("Generating bot hand for next round...", "loading.gif");
		botDeck.playRandomCard();
	}
}

$(document).ready(function() {
	$("#screenOverlay").hide();
	game.showProcessingMessage("Processing...", "loading.gif");
	
	//assign cards
	playerDeck.cards = [];
	botDeck.cards = [];

	$("#bot_container .special_wrapper").html("");
	$("#player_container .special_wrapper").html("");

	$(cardTemplates).each
	(
		function (index)
		{
			cardTemplates[index].init();
			playerDeck.addCard(Object.assign({}, cardTemplates[index]));
			botDeck.addCard(Object.assign({}, cardTemplates[index]));

			//render hidden special text
			var containerBot = $("<div></div>");
			containerBot.attr("id", "botSpecial_" + cardTemplates[index].id);

			var containerPlayer = $("<div></div>");
			containerPlayer.attr("id", "playerSpecial_" + cardTemplates[index].id);

			$(cardTemplates[index].details).each
			(
				function (i)
				{
					var divBot;
					divBot = $("<div></div>");
					divBot.addClass("specialText").addClass("special_" + i);
					divBot.attr("style", "color: rgba(255, 255, 255, 0)");

					var divPlayer;
					divPlayer = $("<div></div>");
					divPlayer.addClass("specialText").addClass("special_" + i);
					divPlayer.attr("style", "color: rgba(255, 255, 255, 0)");

					divBot.html("<b>" + cardTemplates[index].details[i].title + ": </b>" + cardTemplates[index].details[i].description);
					divPlayer.html("<b>" + cardTemplates[index].details[i].title + ": </b>" + cardTemplates[index].details[i].description);

					containerBot.append(divBot);
					containerPlayer.append(divPlayer);
				}
			);

			$("#bot_container .special_wrapper").append(containerBot.hide());
			$("#player_container .special_wrapper").append(containerPlayer.hide());
		}
	);

	//render placeholders
	playerDeck.render();

	//render hands
	playerHand.render();
	botHand.render();

	//button handlers
	$(".btnInfo").click
	(
		function(e)
		{
			var i = e.currentTarget.dataset.index;

			if (i < playerDeck.cards.length)
			{
				if (playerDeck.cards[i] != null)
				{
					game.openOverlay(playerDeck.cards[i].render("lg"));						
				}
			}
		}
	)

	$("#btnCardSummary").click
	(
		function(e)
		{
			game.openOverlay(game.getCardSummary());
		}
	)

	//init
	game.init();
	/*
	$("#botStatWokePoints").html(bot.wokePoints);
	$("#botStatLikes").html(bot.likes);
	$("#playerStatWokePoints").html(player.wokePoints);
	$("#playerStatLikes").html(player.likes);
	game.showProcessingMessage("Generating bot hand for first round...", "loading.gif");
	botDeck.playRandomCard();
	*/

	//start
	$("#btnRound").on
	(
		"click",
		function(e)
		{
			if (game.winner != null)
			{
				game.init();
			}
			else
			{
				if (game.paused)
				{
					game.startRound();				
				}				
			}
		}
	);
});