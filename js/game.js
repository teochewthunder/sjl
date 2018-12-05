var game = 
{
	round: 0,
	winner: null,
	turnAttacker: "bot",
	turnIndex: -1,
	paused: true,
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
				p.html(cardTemplates[i].details);
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
					playerDeck.cards[index].onEditTurnsToLive(-1);
				}
			}
		);

		$(botDeck.cards).each
		(
			function (index)
			{
				if (botDeck.cards[index].turnsToLive > 0)
				{
					botDeck.cards[index].onEditTurnsToLive(-1);
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
				if (botHand.cards.length == 0)
				{
					this.turnAttacker = "player";
				}
				else
				{
					if (this.turnIndex == botHand.cards.length - 1)
					{
						if (botHand.cards.length > playerHand.cards.length)
						{
							this.turnIndex = -1;
							this.turnAttacker = "bot";
						}
						else
						{
							this.turnAttacker = "player";
						}
					}
					else
					{
						this.turnAttacker = "player";
					}					
				}
			}
		}
		else
		{
			if (playerHand.cards.length == 0)
			{
				this.turnAttacker = "bot";
				this.turnIndex ++;
			}
			else
			{
				if (this.turnIndex >= playerHand.cards.length - 1)
				{
					if (playerHand.cards.length >= botHand.cards.length)
					{
						this.turnIndex = -1;
						this.turnAttacker = "bot";
					}
					else
					{
						this.turnAttacker = "bot";
						this.turnIndex ++;
					}
				}
				else
				{
					this.turnAttacker = "bot";
					this.turnIndex++;
				}				
			}
		}

		console.log(this.turnAttacker,this.turnIndex)
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

	$(cardTemplates).each
	(
		function (index)
		{
			cardTemplates[index].init();
			cardTemplates[index].owner = "player";
			playerDeck.addCard(Object.assign({}, cardTemplates[index]));
			cardTemplates[index].owner = "bot";
			botDeck.addCard(Object.assign({}, cardTemplates[index]));
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
/*
	$("#playerHand .handSlot").click
	(
		function(e)
		{
			if (game.round == 0)
			{
				var i = e.currentTarget.dataset.index;

				if (i < playerHand.cards.length)
				{
					if (playerHand.cards[i] != null)
					{
						player.onEditWokePoints(playerHand.cards[i].wokeRating);	
						playerHand.cards[i] = null;
						playerHand.compactCards();
						playerHand.renderCards();
						playerDeck.renderCards();			
					}
				}				
			}
		}
	)
*/
	$("#btnCardSummary").click
	(
		function(e)
		{
			game.openOverlay(game.getCardSummary());
		}
	)

	//init
	$("#botStatWokePoints").html(bot.wokePoints);
	$("#botStatLikes").html(bot.likes);
	$("#playerStatWokePoints").html(player.wokePoints);
	$("#playerStatLikes").html(player.likes);
	game.showProcessingMessage("Generating bot hand for first round...", "loading.gif");
	botDeck.playRandomCard();

	//start
	$("#btnRound").on
	(
		"click",
		function(e)
		{
			if (game.paused)
			{
				game.startRound();				
			}
		}
	);
});