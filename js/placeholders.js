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
		var card = this.cards.filter
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
playerDeck.maxCards = 42;
playerDeck.cards = [];

var playerHand = Object.assign({}, objPlaceholder);
playerHand.maxCards = 10;
playerHand.cards = [];

var botDeck = Object.assign({}, objPlaceholder);
botDeck.maxCards = 42;
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
		card.attr("data-index", i);
		card.addClass("deckSlot_card");
		container.append(card);

		var buttons = $("<div></div>");
		buttons.addClass("deckSlot_buttons");

		var span = $("<span></span>");
		span.attr("id", "ttl_" + i);
		span.append(span);

		var button = $("<button></button>");
		button.attr("id", "btnAddToHand_" + i);
		button.attr("data-index", i);
		button.html("\u25b2");
		button.addClass("btnAddToHand");
		button.attr("disabled", "disabled");
		buttons.append(button);

		container.append(buttons);

		if (i >= this.cards.length)
		{
			container.hide();
		}

		$("#playerDeck").append(container);
	}
}

playerDeck.enableButtons = function()
{
	$(playerDeck.cards).each
	(
		function (index)
		{
			$("#btnAddToHand_" + index).hide();
			$("#ttl_" + index).hide();

			if (playerHand.findCardById(playerDeck.cards[index].id).length == 0 && playerDeck.cards[index].wokeRating <= player.wokePoints)
			{
				$("#btnAddToHand_" + index).removeAttr("disabled");
			}
			else
			{
				$("#btnAddToHand_" + index).attr("disabled", "disabled");
			}

			if (playerDeck.cards[index].turnsToLive == 0)
			{
				$("#btnAddToHand_" + index).show();
			}
			else
			{
				$("#ttl_" + index).show();
			}
		}
	);		
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

	if (game.round == 0 )
	{
		if (playerHand.cards.length > 0)
		{
			game.showProcessingMessage("Click on any of the cards to unassign and return them to your deck. &#9660;", "");
		}
		else
		{
			game.hideProcessingMessage();
		}
	}
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

	if (game.round > 0)
	{
		card.playSpecial();		
	}
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
		game.pause = true;
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
		game.pause = false;
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

	if (game.round > 0)
	{
		card.playSpecial();		
	}

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
