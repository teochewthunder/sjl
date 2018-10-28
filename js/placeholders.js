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
	stackGlow: function (objName, context)
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

var playerStack = Object.assign({}, objPlaceholder);
playerStack.maxCards = 10;
playerStack.cards = [];

var botDeck = Object.assign({}, objPlaceholder);
botDeck.maxCards = 42;
botDeck.cards = [];

var botStack = Object.assign({}, objPlaceholder);
botStack.maxCards = 10;
botStack.cards = [];

playerStack.render = function()
{
	$("#playerStack").html("");

	for (i = 0; i < this.maxCards; i++)
	{
		var container = $("<div></div>");
		container.attr("id", "playerStack_" + i);
		container.attr("data-index", i);
		container.addClass("stackSlot");

		$("#playerStack").append(container);
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
		button.attr("id", "btnAddToStack_" + i);
		button.attr("data-index", i);
		button.html("\u25b2");
		button.addClass("btnAddToStack");
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
			$("#btnAddToStack_" + index).hide();
			$("#ttl_" + index).hide();

			if (playerStack.findCardById(playerDeck.cards[index].id).length == 0 && playerDeck.cards[index].wokeRating <= player.wokePoints)
			{
				$("#btnAddToStack_" + index).removeAttr("disabled");
			}
			else
			{
				$("#btnAddToStack_" + index).attr("disabled", "disabled");
			}

			if (playerDeck.cards[index].turnsToLive == 0)
			{
				$("#btnAddToStack_" + index).show();
			}
			else
			{
				$("#ttl_" + index).show();
			}
		}
	);		
};

playerStack.renderCards = function()
{
	for (i = 0; i < this.maxCards; i++)
	{
		var cardSlot = $("#playerStack_" + i);
		cardSlot.html("");
	}

	for (i = 0; i < this.maxCards; i++)
	{
		var cardSlot = $("#playerStack_" + i);

		if (i < this.cards.length)
		{
			var card = this.cards[i].render("sm");
			cardSlot.append(card);
		}		
	}

	if (game.round == 0 )
	{
		if (playerStack.cards.length > 0)
		{
			game.showProcessingMessage("Click on any of the cards to unassign and return them to your deck. &#9660;", "");
		}
		else
		{
			game.hideProcessingMessage();
		}
	}
};

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
	playerStack.addCard(card);
	playerStack.renderCards();
	playerDeck.renderCards();

	playerStack.stackGlow("playerStack_" + (playerStack.cards.length - 1), "positive");

	if (game.round > 0)
	{

	}
};

botStack.renderCards = function()
{
	for (i = 0; i < this.maxCards; i++)
	{
		var cardSlot = $("#botStack_" + i);
		cardSlot.html("");
	}

	for (i = 0; i < this.maxCards; i++)
	{
		var cardSlot = $("#botStack_" + i);

		if (i < this.cards.length)
		{
			var card = this.cards[i].render("sm");
			cardSlot.append(card);
		}		
	}	
};

botStack.render = function()
{
	$("#botStack").html("");

	for (i = 0; i < this.maxCards; i++)
	{
		var container = $("<div></div>");
		container.attr("id", "botStack_" + i);
		container.attr("data-index", i);
		container.addClass("stackSlot");

		$("#botStack").append(container);
	}
};

botDeck.playRandomCard = function ()
{
	var stackCardIds = [];

	$(botStack.cards).each
	(
		function (x)
		{
			stackCardIds.push(botStack.cards[x].id);
		}
	);

	var availableToPlay = [];

	$(botDeck.cards).each
	(
		function (x)
		{
			if (botDeck.cards[x].turnsToLive == 0 && botDeck.cards[x].wokeRating <= bot.wokePoints && stackCardIds.indexOf(botDeck.cards[x].id) == -1)
			{
				availableToPlay.push(botDeck.cards[x].id);
			}
		}
	);

	if (availableToPlay.length == 0)
	{
		return false;
	}
	else
	{
		var added = false;

		do
		{
			var i = config.generateRandomNo(0, availableToPlay.length -1);
			var id = availableToPlay[i];

			if (stackCardIds.indexOf(id) == -1)
			{
				botDeck.playCard(botDeck.findCardById(id));
				added = true;
			}

		} while (!added);

		return added;		
	}
};

botDeck.playCard = function (card)
{
	bot.onEditWokePoints(-card.wokeRating);
	botStack.addCard(card);
	botStack.renderCards();

	botStack.stackGlow("botStack_" + (botStack.cards.length - 1), "positive");
};

botDeck.fillStack = function ()
{
	var done = false;

	while (!done)
	{
		if (botStack.cards.length < botStack.maxCards)
		{
			var op = botDeck.playRandomCard();
			done = (op ? false : true);
		} 
		else
		{
			done = true;
		}
	}
};
