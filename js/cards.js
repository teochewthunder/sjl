var objCard = 
{
	id: "",
	owner: "",
	title: "",
	subTitle: "",
	details: "",
	race: "",
	gender: "",
	sexualOrientation: "",
	baseAttack: 0,
	baseDefence: 0,
	newAttack: 0,
	newDefence: 0,
	wokeRating: 0,
	turnsToLive: 0,
	onDestroy: function(placeholder) 
	{
		var card = this;
		//obtain placeholder
		var cardContents = placeholder.split(" ");
		cardContents = cardContents[0] + " .card";

		if (game.winner == null)
		{
			card.destroySpecial();

			var index;
			var temp = placeholder.split(" ");
			temp = temp[0];
			temp = temp.split("_");
			index = parseInt(temp[1]);

			if (placeholder.indexOf("botHand") == -1)
			{
				playerHand.handGlow("playerHand_" + index, -1);
			}
			else
			{
				botHand.handGlow("botHand_" + index, -1);
			}	

			$(cardContents).animate
			(
				{
	    			opacity: 0,
	  			}, 
	  			500, 
	  			function() 
	  			{	
	  				card.destroy(placeholder);
	  			}
	  		);
		}
	},
	onAttack: function(index) 
	{
		if (game.winner == null)
		{
			this.attackSpecial(index);
			this.attack(index, this.wokeRating);

			game.renderAttackSequence();

			var attacker = game.turnAttacker;

			game.nextTurn();

			$("#attackSlot_" + index + " span").animate
			(
				{
	    			marginTop: (attacker == "player" ? "0" : "50") + "%",
	  			}, 
	  			2000, 
	  			function() 
	  			{	
	  				$("#attackSlot_" + index).html("");

					if (game.turnIndex == -1) 
					{
						game.endRound();
					}
					else
					{
						game.startTurn();
					}
	  			}
	  		);
		}
	},
	onEditAttack: function(pts, placeholder) 
	{
		var card = this;

		if (game.winner == null)
		{
			card.editAttack(pts);
			$(placeholder).html(card.newAttack);	

			$(placeholder).animate
			(
				{
	    			color: config.getContextColor(pts),
	  			}, 
	  			100, 
	  			function() 
	  			{	
					$(placeholder).animate
					(
						{
			    			color: "#FFFFFF",
			  			}, 
			  			500, 
			  			function() 
			  			{
			  				card.editAttack(-pts);
			  				$(placeholder).html(card.newAttack);
			  			}
			  		);
	  			}
	  		);
		}
	},
	onEditDefence: function(pts, placeholder) 
	{
		var card = this; 

		if (game.winner == null)
		{
			$(placeholder).animate
			(
				{
	    			color: config.getContextColor(pts),
	  			}, 
	  			100, 
	  			function() 
	  			{
					$(placeholder).animate
					(
						{
			    			color: "#FFFFFF",
			  			}, 
			  			500, 
			  			function() 
			  			{
			  				$(placeholder).html(card.newDefence + pts < 0 ? 0 : card.newDefence + pts);
			  				card.editDefence(pts);

							if (card.newDefence <= 0)
							{
								card.newDefence = 0;
								card.onDestroy(placeholder);
							}
			  			}
			  		);
	  			}
	  		);
		}
	},
	onEditTurnsToLive: function(pts) 
	{
		if (game.winner == null)
		{
			this.editTurnsToLive(pts);	
			//animate
		}
	},
	editAttack: function(pts) 
	{
		this.newAttack = this.newAttack + pts;	
	},
	editDefence: function(pts) 
	{
		this.newDefence	= this.newDefence + pts;	
	},
	editTurnsToLive: function(pts) 
	{
		this.turnsToLive = this.turnsToLive + pts;
	},
	attack: function(index, wokeRating) 
	{
		var card = this;
		var damage = config.generateRandomNo(1, this.newAttack);

		if (game.turnAttacker == "player")
		{
			if (index < botHand.cards.length)
			{
				if (botHand.cards[index] == null)
				{
					bot.onEditLikes(-damage);
				}
				else
				{
					botHand.showEditDefence(index, -damage);
					botHand.cards[index].onEditDefence(-damage, "#botHand_" + index + " .def_" + botHand.cards[index].id);	

					if (damage >= botHand.cards[index].newDefence)
					{
						botHand.cards[index].onEditTurnsToLive(card.wokeRating);

						if (card.wokeRating == botHand.cards[index].wokeRating)
						{
							player.onEditWokePoints(config.minor); 
						}

						if ((card.wokeRating == config.minor && botHand.cards[index].wokeRating == config.medium) || (card.wokeRating == config.medium && botHand.cards[index].wokeRating == config.major))
						{
							player.onEditWokePoints(config.medium); 
						}

						if (card.wokeRating == config.minor && botHand.cards[index].wokeRating == config.major)
						{
							player.onEditWokePoints(config.major); 
						}
					}
				}
			}
			else
			{
				bot.onEditLikes(-damage);
			}
		}

		if (game.turnAttacker == "bot")
		{
			if (index < playerHand.cards.length)
			{
				if (playerHand.cards[index] == null)
				{
					player.onEditLikes(-damage);
				}
				else
				{
					playerHand.showEditDefence(index, -damage);
					playerHand.cards[index].onEditDefence(-damage, "#playerHand_" + index + " .def_" + playerHand.cards[index].id);

					if (damage >= playerHand.cards[index].newDefence)
					{
						playerHand.cards[index].onEditTurnsToLive(card.wokeRating);

						if (card.wokeRating == playerHand.cards[index].wokeRating)
						{
							bot.onEditWokePoints(config.minor);
						}

						if ((card.wokeRating == config.minor && playerHand.cards[index].wokeRating == config.medium) || (card.wokeRating == config.medium && playerHand.cards[index].wokeRating == config.major))
						{
							bot.onEditWokePoints(config.medium);
						}

						if (card.wokeRating == config.minor && playerHand.cards[index].wokeRating == config.major)
						{
							bot.onEditWokePoints(config.major);
						}
					}
				}
			}
			else
			{
				player.onEditLikes(-damage);
			}
		}	
	},
	destroy: function(placeholder) 
	{
		//derive index from placeholder
		var index;
		var temp = placeholder.split(" ");
		temp = temp[0];
		temp = temp.split("_");
		index = parseInt(temp[1]);

		if (placeholder.indexOf("botHand") == -1)
		{
			playerHand.cards[index] = null;
		}
		else
		{
			botHand.cards[index] = null;
		}		
	},
	destroySpecial: function() {},
	attackSpecial: function(index) {},
	playSpecial: function() {},
	roundSpecial: function() {},
	init: function()
	{
		this.newDefence = this.baseDefence;
		this.newAttack = this.baseAttack;
	},
	show: function(size) 
	{
		var html = this.renderCard(size);
		$("#" + this.placeholderId + "_" + this.placeholderSlot).html(html);
	},
	render: function(size)
	{
		if (size == "xs")
		{
			var container = $("<div></div>");
			container.addClass("card_xs_container");

			var card = $("<div></div>");
			card.addClass("card").addClass("card_xs");
			card.attr("style","background: #999999 url(img/" + this.id + ".jpg) center center no-repeat; background-size: cover;");

			var overlay = $("<div></div>");
			overlay.addClass("card_overlay");
			card.append(overlay);

			var title = $("<div></div>");
			title.addClass("title");
			title.html(this.title);

			var wokeRating = $("<div></div>");
			wokeRating.addClass("wokeRating");
			wokeRating.html(this.wokeRating);

			var ttl = $("<div></div>");
			ttl.addClass("ttl");
			ttl.html(this.turnsToLive);

			var attdef = $("<div></div>");
			attdef.addClass("attdef");
			attdef.html
			(
				"<div class=\"card_statLabel\">&#9876;</div> <div class=\"card_stat\">" + this.baseAttack + "</div>"
				+ "<div class=\"card_statLabel\">&#9960;</div> <div class=\"card_stat\">" + this.newDefence + "</div>"
			);

			overlay.append(wokeRating);
			overlay.append(ttl);

			container.append(card);
			container.append(title);
			container.append(attdef);
			return container;
		}
		else
		{
			var container = $("<div></div>");
			container.addClass("card").addClass("card_" + size);
			container.attr("style","background: #999999 url(img/" + this.id + ".jpg) center center no-repeat; background-size: cover;");

			var overlay = $("<div></div>");
			overlay.addClass("card_overlay");
			container.append(overlay);

			var title = $("<div></div>");
			title.addClass("title");
			title.html(this.title);

			var subTitle = $("<div></div>");
			subTitle.addClass("subTitle");
			subTitle.html(this.subTitle);

			var details = $("<div></div>");
			details.addClass("details");
			details.html(this.details);

			var wokeRating = $("<div></div>");
			wokeRating.addClass("wokeRating");
			wokeRating.html(this.wokeRating);

			var attdef = $("<div></div>");
			attdef.addClass("attdef");
			attdef.html
			(
				"<div class=\"card_statLabel\">&#9876;</div><div class=\"card_stat att_" + this.id + "\">" + this.baseAttack + "</div>"
				+ "<br /><div class=\"card_statLabel\">&#9960;</div> <div class=\"card_stat def_" + this.id + "\">" + this.newDefence + "</div>"
			);

			var otherDetails = $("<div></div>");
			otherDetails.addClass("otherDetails");
			otherDetails.html
			(
				"Race <b>" + this.race + "</b><br />"
				+ "Gender <b>" + this.gender + "</b><br />"
				+ "Sexual Orientation <b>" + this.sexualOrientation + "</b>"
			);

			var gameStats = $("<div></div>");
			gameStats.addClass("gameStats");
			gameStats.append(wokeRating).append(attdef);

			overlay.append(title);
			overlay.append(subTitle);
			overlay.append(otherDetails);
			overlay.append(details);			
			overlay.append(gameStats);

			return container;			
		}
	}
}

var cardTemplates = [];
var newCard;

newCard = Object.assign({}, objCard);
newCard.id = "wman";
newCard.title = "White Man";
newCard.subTitle = "";
newCard.details = "If there is a <b>Male</b> or <b>White</b> card beside this card in hand, add " + config.medium + " to <b>Base Attack</b> when attacking.";
newCard.race = "White";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activate = false;

	if (game.turnAttacker == "bot")
	{
		if (index > 0)
		{
			if (botHand.cards[index - 1] != null)
			{
				if (botHand.cards[index - 1].race == "White" || botHand.cards[index - 1].gender == "Male")
				{
					activate = true;
				}				
			}
		}

		if (index < botHand.cards.length - 1)
		{
			if (botHand.cards[index - 1] != null)
			{
				if (botHand.cards[index + 1].race == "White" || botHand.cards[index + 1].gender == "Male")
				{
					activate = true;
				}				
			}
		}
	}

	if (game.turnAttacker == "player")
	{
		if (index > 0)
		{
			if (playerHand.cards[index - 1] != null)
			{
				if (playerHand.cards[index - 1].race == "White" || playerHand.cards[index - 1].gender == "Male")
				{
					activate = true;
				}				
			}
		}

		if (index < playerHand.cards.length - 1)
		{
			if (playerHand.cards[index + 1] != null)
			{
				if (playerHand.cards[index + 1].race == "White" || playerHand.cards[index + 1].gender == "Male")
				{
					activate = true;
				}				
			}
		}		
	}

	if (activate)
	{
		var placeholder;

		if (game.turnAttacker == "bot")
		{
			placeholder = "#botHand_" + index + " .att_" + this.id;
		}

		if (game.turnAttacker == "player")
		{
			placeholder = "#playerHand_" + index + " .att_" + this.id;
		}

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wwoman";
newCard.title = "White Woman";
newCard.subTitle = "";
newCard.details = "If there is another <b>Female</b> or <b>White</b> card beside this card in hand, add " + config.medium + " to <b>Defence</b>.";
newCard.race = "White";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "hman";
newCard.title = "Hispanic Man";
newCard.subTitle = "";
newCard.details = "If there is a <b>Male</b> or <b>Minority</b> card beside this card in hand, add " + config.medium + " to <b>Base Attack</b> when attacking.";
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "hwoman";
newCard.title = "Hispanic Woman";
newCard.subTitle = "";
newCard.details = "Each round, if there is another <b>Female</b> or <b>Minority</b> card beside this card in hand, add " + config.medium + " to <b>Defence</b>.";
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "bman";
newCard.title = "Black Man";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = "If there is a <b>Male</b> or <b>Minority</b> card beside this card in hand, add " + config.medium + " to <b>Base Attack</b> when attacking.";
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "bwoman";
newCard.title = "Black Woman";
newCard.subTitle = "";
newCard.details = "Each round, if there is another <b>Female</b> or <b>Minority</b> card beside this card in hand, add " + config.medium + " to <b>Defence</b>.";
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "aman";
newCard.title = "Asian Man";
newCard.subTitle = "";
newCard.details = "If there is a <b>Male</b> or <b>Minority</b> card beside this card in hand, add " + config.medium + " to <b>Base Attack</b> when attacking.";
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "awoman";
newCard.title = "Asian Woman";
newCard.subTitle = "";
newCard.details = "Each round, if there is another <b>Female</b> or <b>Minority</b> card beside this card in hand, add " + config.medium + " to <b>Defence</b>.";
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "naman";
newCard.title = "Native American Man";
newCard.subTitle = "";
newCard.details = "If there is a <b>Male</b> or <b>Minority</b> card beside this card in hand, add " + config.medium + " to <b>Base Attack</b> when attacking.";
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "nawoman";
newCard.title = "Native American Woman";
newCard.subTitle = "";
newCard.details = "Each round, if there is another <b>Female</b> or <b>Minority</b> card beside this card in hand, add " + config.medium + " to <b>Defence</b>.";
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "transgender";
newCard.title = "Transgender";
newCard.subTitle = "";
newCard.details = "Each round, if there is another <b>Female</b> card beside this card in hand, add " + config.medium + " to <b>Defence</b>.<br />If there is a <b>Male</b> card beside this card in hand, add " + config.minor + " to <b>Base Attack</b> when attacking.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "gay";
newCard.title = "Gay";
newCard.subTitle = "";
newCard.details = "If there is another <b>Male</b> card in hand, add " + config.medium + " to <b>Base Attack</b> when attacking.";
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "lesbian";
newCard.title = "Lesbian";
newCard.subTitle = "";
newCard.details = "Each round, if there is another <b>Female</b> card in hand, add " + config.medium + " to <b>Defence</b>";
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "biman";
newCard.title = "Bisexual Man";
newCard.subTitle = "I love other men.";
newCard.details = "If there is another <b>Male</b> card in hand, add " + config.minor + " to <b>Base Attack</b> when attacking.<br />Each round, gain " + config.minor + " Defence if there is another <b>Female</b> card in your hand.";
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "biwoman";
newCard.title = "Bisexual Woman";
newCard.subTitle = "I love other women.";
newCard.details = "If there is another Male card in hand, add " + config.minor + " to Base Attack when attacking.<br />Each round, gain " + config.minor + " Defence if there is another <b>Female</b> card in your hand.";
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "adhominem";
newCard.title = "Ad Hominem";
newCard.subTitle = "Cheap shots are the best shots.";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "snowflake";
newCard.title = "Snowflake";
newCard.subTitle = "";
newCard.details = "If there is a Victim Card in your hand, add " + config.major + " to Base Attack.<br/><br />For every round the card is in the Safe Space, add " + config.minor + " Defence.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "vsignal";
newCard.title = "Virtue Signalling";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "homophobe";
newCard.title = "Homophobe";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "xenophobe";
newCard.title = "Xenophobe";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "misogynist";
newCard.title = "Misogynist";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "tbmedia";
newCard.title = "Trial By Media";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "antivaxxers";
newCard.title = "Anti-vaxxers";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "imisogyny";
newCard.title = "Internalized Misogyny";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);


newCard = Object.assign({}, objCard);
newCard.id = "gaslighting";
newCard.title = "Gaslighting";
newCard.subTitle = "I'm sorry that's how you feel.";
newCard.details = "When attacking, for every one of your opponent's Woke Points, add " + config.minor + " to Base Attack.<br /><br />On destruction, subtract " + config.minor + " Woke Points.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "ptrophy";
newCard.title = "Participation Trophy";
newCard.subTitle = "Everyone gets a prize!";
newCard.details = "Every round, all cards in the hand add " + config.minor + " to Defence..<br /><br />On destruction, add " + config.minor + " Likes.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "cultapp";
newCard.title = "Cultural Appropriation";
newCard.subTitle = "";
newCard.details = "On play, for every Woke Point your opponent has, add " + config.minor + " to Defence..<br /><br />Upon being Triggered, add " + config.minor + " Defence for all cards.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "strawman";
newCard.title = "Straw Man";
newCard.subTitle = "If you can't convince them, confuse them.";
newCard.details = "When attacking, inflict " + config.minor + " damage to the adjacent cards.<br /><br />Every successful attack on it inflicts " + config.minor + " damage to opponent's Likes.<br /><br />On play, all cards receive " + config.minor + " Defence.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "kbwar";
newCard.title = "Keyboard Warrior";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wknight";
newCard.title = "White Knight";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "feminazi";
newCard.title = "Feminazi";
newCard.subTitle = "Down with the Patriarchy!";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wsupremacy";
newCard.title = "White Supremacy";
newCard.subTitle = "Blood and soil.";
newCard.details = "";
newCard.race = "White";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wwashing";
newCard.title = "Whitewashing";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "White";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "maggression";
newCard.title = "Micro-aggression";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "mansplaining";
newCard.title = "Mansplaining";
newCard.subTitle = "What you women don't realize is...";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wguilt";
newCard.title = "White Guilt";
newCard.subTitle = "On behalf of my privilege, I apologize.";
newCard.details = "";
newCard.race = "White";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "pcbrigade";
newCard.title = "PC Brigade";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "tonepolice";
newCard.title = "Tone Police";
newCard.subTitle = "";
newCard.details = "Each round, all opposing cards attack at -" + config.medium + " penalty.<br /><br /><br /><br />";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "antifa";
newCard.title = "ANTIFA";
newCard.subTitle = "Everytime you punch a Nazi, an angel gets its wings.";
newCard.details = "On play, instantly Trigger <i>Xenophobe</i> card.<br /><br /><br /><br />";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "extremist";
newCard.title = "Extremist";
newCard.subTitle = "There are no neutrals. Pick a side!";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "moderate";
newCard.title = "Moderate";
newCard.subTitle = "There are two sides to a coin.";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "leftwinger";
newCard.title = "Left-winger";
newCard.subTitle = "From each according to his ability, to each according to his needs.";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "rightwinger";
newCard.title = "Right-winger";
newCard.subTitle = "All wealth is the product of labor.";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "troll";
newCard.title = "Troll";
newCard.subTitle = "Get a reaction; <i>any</i> reaction";
newCard.details = "Each round, inflict " + config.minor + " damage to the all cards.<br /><br />On play, instantly Trigger <i>Snowflake</i> card.<br /><br />If there is a <i>Keyboard Warrior</i> card in your hand, add " + config.medium + " to Base Attack.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "race";
newCard.title = "Race Card";
newCard.subTitle = "Black lives matter!";
newCard.details = "Each round, all Minority cards attack with x" + config.minor + " Base Attack if attacking a White card.<br /><br />Upon being Triggered, all Minority cards gain " + config.major + " Defence.";
newCard.race = "Minority";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "gender";
newCard.title = "Gender Card";
newCard.subTitle = "Down with the Patriarchy!";
newCard.details = "Each round, all Female cards attack with x" + config.minor + " Base Attack if attacking a Male card.<br /><br />Upon being Triggered, all Female cards gain " + config.major + " Defence.";
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "maternity";
newCard.title = "Maternity Card";
newCard.subTitle = "I'm a mother, I can do no wrong.";
newCard.details = "Each round, all Female cards gain " + config.major + " Defence.<br /><br />Upon being Triggered, gain " + config.medium + " Woke Points";
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "lgbt";
newCard.title = "LGBT Card";
newCard.subTitle = "Straight people oppress us!";
newCard.details = "Each round, all LGBT cards gain " + config.major + " Defence.<br /><br />Upon being Triggered, gain " + config.medium + " Woke Points";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "victim";
newCard.title = "Victim Card";
newCard.subTitle = "It's not my fault!";
newCard.details = "Each round, all Male, Female, Minority, White and LGBT cards gain " + config.major + " Defence.<br /><br />Each round, all opposing cards attack with a -" + config.minor + " penalty.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "nazi";
newCard.title = "Nazi Card";
newCard.subTitle = "If you don't agree with me, you're a Nazi!";
newCard.details = "When attacking, add the opposing card's base attack to your own.<br /><br />Upon being Triggered, instantly destroy a random opposing card.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function()
{
	//this.destroyCard();
};
newCard.attackSpecial = function()
{
	//this.attackCard();
};
cardTemplates.push(newCard);




