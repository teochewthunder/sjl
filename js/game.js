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
	getHelp()
	{
		var content = "";
		content += "<h1>Players</h1>";
		content += "<p>Each player starts the game with a certain number of <b>Woke Points</b>. <b>Woke Points</b> are used to play cards from the player's deck. They may be deducted via special attacks, or replenished after <b>Triggering</b> an opposing card.</p>";
		content += "<p>Each player starts the game with a certain number of <b>Likes</b>. <b>Likes</b> deducted when cards have no opposing cards to attack, and attack the opposing player instead, or use a spcial attack. Some cards may replenish <b>Likes</b>. The first player to reach zero <b>Likes</b>, loses the game.</p>";
		content += "<p>Each player has a deck of cards, of which up to 10 may be played in hand at any time.</p>";
		content += "<hr />";
		content += "<h1>Cards</h1>";
		content += "<p>At the start of every round, each player may play cards from the deck, in hand. Each card in hand will take turns to attack the opposite card in the opponent's hand every round.</p>";
		content += "<p>Cards have the following attributes:</p>";
		content += "<p><b>Attack</b> - This is the maximum damage a card normally does, less bonuses. A card will deal at least 1 point of damage.</p>";
		content += "<p><b>Defence</b> - This is the maximum amount of damage a card will take before it is <b>Triggered</b>.</p>";
		content += "<p><b>Woke Rating</b> - This is the number of <b>Woke Points</b> needed to play the card. This statistic also determines how many rounds a card must stay in the <b>Safe Space</b> after it is <b>Triggered</b> by this card.</p>";
		content += "<hr />";
		content += "<h1>Safe Space</h1>";
		content += "<p>When a card reaches 0 <b>Defence</b>, it has been <b>Triggered</b>. It must be taken out of play and consigned to the deck, where it is unavailable to play until a certain number of rounds has passed. This is called the <b>Safe Space</b>.</p>";
		content += "<hr />";
		content += "<h1>Gameplay</h1>";
		content += "<p>Click on cards in your deck to play them. Click on the button <span class='greybutton'>Round 1 Begin &#9658;</span> to begin any round.</p>";
		return content;
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

					//Enhanced Safe Space Recovery
					if (playerDeck.cards[index].turnsToLive > 0)
					{
						var raceCardSlot = playerHand.findSlotById("race");

						if (playerDeck.cards[index].race == "Minority" && raceCardSlot != null)
						{
							playerDeck.cards[index].onEditTurnsToLive(-config.minor);
							player.showSpecial("race", 0, raceCardSlot);
						}

						var genderCardSlot = playerHand.findSlotById("gender");

						if (playerDeck.cards[index].gender == "Female" && genderCardSlot != null)
						{
							playerDeck.cards[index].onEditTurnsToLive(-config.minor);
							player.showSpecial("gender", 0, genderCardSlot);
						}

						var lgbtCardSlot = playerHand.findSlotById("lgbt");

						if (playerDeck.cards[index].sexualOrientation == "LGBT" && lgbtCardSlot != null)
						{
							playerDeck.cards[index].onEditTurnsToLive(-config.minor);
							player.showSpecial("lgbt", 0, lgbtCardSlot);
						}	

						var maternityCardSlot = playerHand.findSlotById("materity");

						if (playerDeck.cards[index].sexualOrientation == "Hetero" && playerDeck.cards[index].gender == "Female" && maternityCardSlot != null)
						{
							playerDeck.cards[index].onEditTurnsToLive(-config.minor);
							player.showSpecial("lgbt", 0, maternityCardSlot);
						}	

						var victimCardSlot = playerHand.findSlotById("victim");

						if ((playerDeck.cards[index].sexualOrientation == "LGBT" || playerDeck.cards[index].race == "Minority") && playerDeck.cards[index].gender == "Female" && victimCardSlot != null)
						{
							playerDeck.cards[index].onEditTurnsToLive(-config.minor);
							player.showSpecial("victim", 0, victimCardSlot);
						}	

						var naziCardSlot = playerHand.findSlotById("nazi");

						if ((playerDeck.cards[index].gender == "Male" || playerDeck.cards[index].race == "White") && playerDeck.cards[index].sexualOrientation == "Hetero" && naziCardSlot != null)
						{
							playerDeck.cards[index].onEditTurnsToLive(-config.minor);
							player.showSpecial("nazi", 0, naziCardSlot);
						}					
					}
				}					
			}
		);

		$(playerHand.cards).each
		(
			function (index)
			{
				if (playerHand.cards[index] != null)
				{
					playerHand.cards[index].roundSpecial(index, "player");
				}
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

					//Enhanced Safe Space Recovery
					if (botDeck.cards[index].turnsToLive > 0)
					{
						var raceCardSlot = botHand.findSlotById("race");

						if (botDeck.cards[index].race == "Minority" && raceCardSlot != null)
						{
							botDeck.cards[index].onEditTurnsToLive(-config.minor);
							bot.showSpecial("race", 0, raceCardSlot);
						}

						var genderCardSlot = botHand.findSlotById("gender");

						if (botDeck.cards[index].gender == "Female" && genderCardSlot != null)
						{
							botDeck.cards[index].onEditTurnsToLive(-config.minor);
							bot.showSpecial("gender", 0, genderCardSlot);
						}

						var lgbtCardSlot = botHand.findSlotById("lgbt");

						if (botDeck.cards[index].sexualOrientation == "LGBT" && lgbtCardSlot != null)
						{
							botDeck.cards[index].onEditTurnsToLive(-config.minor);
							bot.showSpecial("lgbt", 0, lgbtCardSlot);
						}

						var maternityCardSlot = botHand.findSlotById("materity");

						if (botDeck.cards[index].sexualOrientation == "Hetero" && botDeck.cards[index].gender == "Female" && maternityCardSlot != null)
						{
							botDeck.cards[index].onEditTurnsToLive(-config.minor);
							bot.showSpecial("maternity", 0, maternityCardSlot);
						}	

						var victimCardSlot = botHand.findSlotById("victim");

						if ((botDeck.cards[index].sexualOrientation == "LGBT" || botDeck.cards[index].race == "Minority") && botDeck.cards[index].gender == "Female" && victimCardSlot != null)
						{
							botDeck.cards[index].onEditTurnsToLive(-config.minor);
							bot.showSpecial("victim", 0, victimCardSlot);
						}

						var naziCardSlot = botHand.findSlotById("nazi");

						if ((botDeck.cards[index].gender == "Male" || botDeck.cards[index].race == "White") && botDeck.cards[index].sexualOrientation == "Hetero" && naziCardSlot != null)
						{
							botDeck.cards[index].onEditTurnsToLive(-config.minor);
							bot.showSpecial("nazi", 0, naziCardSlot);
						}
					}
				}					
			}
		);

		$(botHand.cards).each
		(
			function (index)
			{
				if (botHand.cards[index] != null)
				{
					botHand.cards[index].roundSpecial(index, "bot");
				}
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

	$("#btnHelp").click
	(
		function(e)
		{
			game.openOverlay(game.getHelp);
		}
	)

	//init
	game.init();

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