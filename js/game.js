var game = 
{
	round: 0,
	winner: null,
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
}

$(document).ready(function() {
	$("#screenOverlay").hide();
	game.showProcessingMessage("Processing...", "loading.gif");
	
	//assign cards
	playerDeck.cards = [];
	botDeck.cards = [];

	$(cardTemplates).each
	(
		function (x)
		{
			cardTemplates[x].init();
			playerDeck.addCard(Object.assign({}, cardTemplates[x]));
			botDeck.addCard(Object.assign({}, cardTemplates[x]));
		}
	);

	//render placeholders
	playerDeck.render();

	//render decks
	playerDeck.renderCards();

	//render stacks
	playerStack.render();
	botStack.render();

	//button handlers
	$(".btnAddToStack").click
	(
		function(e)
		{
			var i = e.currentTarget.dataset.index;

			if (i < playerDeck.cards.length)
			{
				playerDeck.playCard(playerDeck.cards[i]);

				//$("#playerDeck_" + i).hide();				
			}
		}
	)

	$("#playerDeck .deckSlot_card").click
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

	$("#playerStack .stackSlot").click
	(
		function(e)
		{
			if (game.round == 0)
			{
				var i = e.currentTarget.dataset.index;

				if (i < playerStack.cards.length)
				{
					if (playerStack.cards[i] != null)
					{
						player.onEditWokePoints(playerStack.cards[i].wokeRating);	
						playerStack.removeCard(playerStack.cards[i].id);
						playerStack.compactCards();
						playerStack.renderCards();			
					}
				}				
			}
		}
	)

	//interface
	$("#btnHelp").click
	(
		function(e)
		{
			game.openOverlay(game.getCardSummary());
		}
	)

	//typical round code
	$("#botStatWokePoints").html(bot.wokePoints);
	$("#botStatLikes").html(bot.likes);
	$("#playerStatWokePoints").html(player.wokePoints);
	$("#playerStatLikes").html(player.likes);
	botDeck.fillStack();
	game.hideProcessingMessage();
});