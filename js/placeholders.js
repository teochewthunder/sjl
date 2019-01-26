var objPlaceholder = 
{
	cards: [],
	maxCards: 0,
	addCard: function(card) 
	{
		if (this.cards.length < this.maxCards) 
		{
			this.cards.push(card);			
		}
	},
	removeCard: function(cardId) 
	{
		var i = null;

		$(this.cards).each
		(
			function (index, x)
			{
				if (x.id == cardId)
				{
					i = index;
				}
			}
		);	

		if (i != null)
		{
			this.cards[i] = null;
		}
	},
	findCardBySlot: function(slot)
	{
		if (slot < 0 || slot > (this.cards.length-1))
		{
			return null;
		}
		else
		{
			return this.cards[slot];
		}
	},
	findCardById: function(id)
	{
		var card;
		card = this.cards.filter
		(
			function(x) 
			{
				return x != null; 
			}	
		)

		card = card.filter
		(
			function(x) 
			{
				return x.id == id; 
			}	
		)

		if (card.length == 0)
		{
			return card;
		}
		else
		{
			return card[0];			
		}

	},
	compactCards: function()
	{
		this.cards = this.cards.filter
		(
			function(x) 
			{ 
				return x != null; 
			}
		);
	},
	renderCards: function() {},
	render: function() {},
	playCard: function() {},
	handGlow: function (objName, context)
	{
		$("#" + objName).animate
		(
			{
    			outlineColor: config.getContextColor(context),
  			}, 
  			500, 
  			function() 
  			{
				$("#" + objName).animate
				(
					{
		    			outlineColor: "#000000",
		  			}, 
		  			500, 
		  			function() 
		  			{

		  			}
		  		);
  			}
  		);
	}
};

var playerDeck = Object.assign({}, objPlaceholder);
playerDeck.maxCards = 50;
playerDeck.cards = [];

var playerHand = Object.assign({}, objPlaceholder);
playerHand.maxCards = 10;
playerHand.cards = [];

var botDeck = Object.assign({}, objPlaceholder);
botDeck.maxCards = 50;
botDeck.cards = [];

var botHand = Object.assign({}, objPlaceholder);
botHand.maxCards = 10;
botHand.cards = [];

playerHand.render = function()
{
	$("#playerHand").html("");

	for (i = 0; i < this.maxCards; i++)
	{
		var container = $("<div></div>");
		container.attr("id", "playerHand_" + i);
		container.attr("data-index", i);
		container.addClass("handSlot");

		$("#playerHand").append(container);
	}
}

playerDeck.render = function()
{
	$("#playerDeck").html("");

	for (i = 0; i < this.maxCards; i++)
	{
		var container = $("<div></div>");
		container.attr("id", "playerDeck_" + i);
		container.addClass("deckSlot");

		var card = $("<div></div>");
		card.attr("id", "playerDeck_card" + i);
		//card.attr("data-index", i);
		card.addClass("deckSlot_card");
		container.append(card);

		var info = $("<div></div>");
		info.addClass("btnInfo");
		info.attr("data-index", i);
		info.html("i")
		container.append(info);

		if (i >= this.cards.length)
		{
			container.hide();
		}

		$("#playerDeck").append(container);
	}
}

playerDeck.enableButtons = function()
{
	var enabled = false;

	$(playerDeck.cards).each
	(
		function (index)
		{	
			$("#playerDeck_card" + index + " .ttl").hide();
			$("#playerDeck_card" + index + " .wokeRating").html(playerDeck.cards[index].wokeRating).show();

			if (playerHand.cards.length == playerHand.maxCards)
			{
				enabled = false;
			}
			else
			{
				if (playerHand.findCardById(playerDeck.cards[index].id).length == 0)
				{
					enabled = true;

					if (playerDeck.cards[index].wokeRating <= player.wokePoints)
					{
						enabled = true;
					}
					else
					{
						enabled = false;	
					}
				}
				else
				{
					$("#playerDeck_card" + index + " .wokeRating").html("&#9876;");
					enabled = false;
				}				
			}

			if (playerDeck.cards[index].turnsToLive > 0)
			{
				$("#playerDeck_card" + index + " .ttl").html(playerDeck.cards[index].turnsToLive).show();
				$("#playerDeck_card" + index + " .wokeRating").hide();
				enabled = false;
			}

			$("#playerDeck_card" + index).off("click");

			if (enabled)
			{
				$("#playerDeck_card" + index).removeClass("cannotAddToHand");

				if (game.paused)
				{
			        $("#playerDeck_card" + index).on
			        (
			        	"click", 
			        	function()
				        {
							if (index < playerDeck.cards.length)
							{
								playerDeck.playCard(playerDeck.cards[index]);			
							}

							$("#playerDeck_card" + index).off("click");	
				        }
			        );					
				}
				else
				{
					$("#playerDeck_card" + index).off("click");	
				}
			}
			else
			{
				$("#playerDeck_card" + index).addClass("cannotAddToHand");
				$("#playerDeck_card" + index).off("click");	
			}
		}
	);	

	if (game.paused)
	{
		$("#btnRound").removeClass("greybuttonDisabled").addClass("greybutton");

		if (game.winner == null)
		{
			$("#indicator").html(" Begin &#9658;");	
		}
		else
		{
			$("#indicator").html(" Replay &#9658;");	
		}
	}
	else
	{
		$("#btnRound").removeClass("greybutton").addClass("greybuttonDisabled");
		$("#indicator").html("<img src='img/loading.gif' height='10'>");
	}
};

playerHand.renderCards = function()
{
	for (i = 0; i < this.maxCards; i++)
	{
		var cardSlot = $("#playerHand_" + i);
		cardSlot.html("");
	}

	for (i = 0; i < this.maxCards; i++)
	{
		var cardSlot = $("#playerHand_" + i);

		if (i < this.cards.length)
		{
			var card = this.cards[i].render("sm");
			cardSlot.append(card);
		}		
	}

	game.hideProcessingMessage();
};

playerHand.showEditDefence = function(index, pts)
{
	var slot = $("#playerHand_" + index + " .card");
	var overlay = $("<div></div>");
	overlay.addClass("handOverlay");
	overlay.html(Math.abs(pts));
	slot.append(overlay);

	overlay.animate
	(
		{
			color: config.getContextColor(pts),
			height: "120%"
		}, 
		500, 
		function() 
		{
			overlay.hide();
		}
	);
}

playerDeck.renderCards = function()
{
	for (i = 0; i < this.maxCards; i++)
	{
		var cardSlot = $("#playerDeck_card" + i);

		if (i >= playerDeck.cards.length)
		{
			cardSlot.hide();
		}
		else
		{
			cardSlot.show();
			var card = playerDeck.cards[i].render("xs");
			cardSlot.html("").append(card);
		}		
	}

	playerDeck.enableButtons();
};

playerDeck.playCard = function (card)
{
	//render
	player.onEditWokePoints(-card.wokeRating);
	playerHand.addCard(card);
	playerHand.renderCards();
	playerDeck.renderCards();

	playerHand.handGlow("playerHand_" + (playerHand.cards.length - 1), 1);

	card.playSpecial(playerHand.cards.length - 1, "player");		
};

botHand.renderCards = function()
{
	for (i = 0; i < this.maxCards; i++)
	{
		var cardSlot = $("#botHand_" + i);
		cardSlot.html("");
	}

	for (i = 0; i < this.maxCards; i++)
	{
		var cardSlot = $("#botHand_" + i);

		if (i < this.cards.length)
		{
			var card = this.cards[i].render("sm");
			cardSlot.append(card);
		}		
	}	
};

botHand.render = function()
{
	$("#botHand").html("");

	for (i = 0; i < this.maxCards; i++)
	{
		var container = $("<div></div>");
		container.attr("id", "botHand_" + i);
		container.attr("data-index", i);
		container.addClass("handSlot");

		$("#botHand").append(container);
	}
};

botHand.showEditDefence = function(index, pts)
{
	var slot = $("#botHand_" + index + " .card");
	var overlay = $("<div></div>");
	overlay.addClass("handOverlay");
	overlay.html(Math.abs(pts));
	slot.append(overlay);

	overlay.animate
	(
		{
			color: config.getContextColor(pts),
			height: "80%"
		}, 
		500, 
		function() 
		{
			overlay.hide();
		}
	);
}

botDeck.playRandomCard = function ()
{
	if (botHand.cards.length < botHand.maxCards)
	{
		var handCardIds = [];

		$(botHand.cards).each
		(
			function (x)
			{
				handCardIds.push(botHand.cards[x].id);
			}
		);

		var availableToPlay = this.getAvailableCards(handCardIds);

		if (availableToPlay.length > 0)
		{
			game.paused = false;
			var added = false;

			var i = config.generateRandomNo(0, availableToPlay.length -1);
			var id = availableToPlay[i];

			if (handCardIds.indexOf(id) == -1)
			{
				botDeck.playCard(botDeck.findCardById(id));
			}	
		}
		else
		{
			game.paused = true;
			game.hideProcessingMessage();
			playerDeck.renderCards();
		}
	}
	else
	{
		game.paused = true;
		game.hideProcessingMessage();
		playerDeck.renderCards();		
	}
};

botDeck.playCard = function (card)
{
	bot.onEditWokePoints(-card.wokeRating);
	botHand.addCard(card);
	botHand.renderCards();

	botHand.handGlow("botHand_" + (botHand.cards.length - 1), 1);

	card.playSpecial(botHand.cards.length - 1, "bot");		

	setTimeout
	(
		function()
		{
			botDeck.playRandomCard();
		},
		1000
	)	
};

botDeck.getAvailableCards = function (cardIds)
{
	var availableToPlay = [];

	$(botDeck.cards).each
	(
		function (x)
		{
			if (botDeck.cards[x].turnsToLive == 0 && botDeck.cards[x].wokeRating <= bot.wokePoints && cardIds.indexOf(botDeck.cards[x].id) == -1)
			{
				availableToPlay.push(botDeck.cards[x].id);
			}
		}
	);	

	return availableToPlay;
}
