var objCard = 
{
	id: "",
	title: "",
	subTitle: "",
	details: [],
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
	  			1000, 
	  			function() 
	  			{	
	  				card.destroy(placeholder);
	  			}
	  		);

	  		card.destroySpecial(index);
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
		else
		{
			game.endRound();
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
			  			1000, 
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
			card.editDefence(pts);

			if (card.newDefence <= 0)
			{
				card.onDestroy(placeholder);
			}

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
			  			1000, 
			  			function() 
			  			{
			  				$(placeholder).html(card.newDefence < 0 ? 0 : card.newDefence);

							if (card.newDefence <= 0)
							{
								card.newDefence = card.baseDefence;
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

		if (this.turnsToLive < 0) this.turnsToLive = 0;
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
					if (damage >= botHand.cards[index].newDefence)
					{
						botHand.cards[index].onEditTurnsToLive(card.wokeRating);

						if (card.wokeRating == botHand.cards[index].wokeRating)
						{
							player.onEditWokePoints(config.medium);
						}

						if (card.wokeRating < botHand.cards[index].wokeRating)
						{
							player.onEditWokePoints(config.major);
						}

						if (card.wokeRating > botHand.cards[index].wokeRating)
						{
							player.onEditWokePoints(config.minor);
						}

						if (card.id == "adhominem")
						{
							bot.onEditWokePoints(-config.minor);
							player.showSpecial("adhominem", 0, index);
						}

						if (card.id == "vsignal")
						{
							card.onEditDefence(config.minor, "#playerHand_" + index + " .def_" + card.id);
							player.showSpecial("vsignal", 1, index);									
						}
					}
					else
					{
						if (card.id == "vsignal")
						{
							if (config.generateRandomNo(1, 100) <= (config.minor * 10))
							{
								player.onEditWokePoints(damage);
								player.showSpecial("vsignal", 0, index);									
							}
						}	
					}

					botHand.showEditDefence(index, -damage);
					botHand.cards[index].onEditDefence(-damage, "#botHand_" + index + " .def_" + botHand.cards[index].id);
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
					if (damage >= playerHand.cards[index].newDefence)
					{
						playerHand.cards[index].onEditTurnsToLive(card.wokeRating);

						if (card.wokeRating == playerHand.cards[index].wokeRating)
						{
							bot.onEditWokePoints(config.medium);
						}

						if (card.wokeRating < playerHand.cards[index].wokeRating)
						{
							bot.onEditWokePoints(config.major);
						}

						if (card.wokeRating > playerHand.cards[index].wokeRating)
						{
							bot.onEditWokePoints(config.minor);
						}

						if (card.id == "adhominem")
						{
							player.onEditWokePoints(-config.minor);
							bot.showSpecial("adhominem", 0, index);
						}

						if (card.id == "vsignal")
						{
							card.onEditDefence(config.minor, "#botHand_" + index + " .def_" + card.id);
							bot.showSpecial("vsignal", 1, index);									
						}
					}
					else
					{
						if (card.id == "vsignal")
						{
							if (config.generateRandomNo(1, 100) <= (config.minor * 10))
							{
								bot.onEditWokePoints(damage);
								bot.showSpecial("vsignal", 0, index);									
							}
						}
					}

					playerHand.showEditDefence(index, -damage);
					playerHand.cards[index].onEditDefence(-damage, "#playerHand_" + index + " .def_" + playerHand.cards[index].id);
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
	destroySpecial: function(index) {},
	attackSpecial: function(index) {},
	playSpecial: function(index, attacker) {},
	roundSpecial: function(index, attacker) {},
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
				"<div class=\"card_statLabel\">&#9876;</div> <div class=\"card_stat att_" + this.id + "\">" + this.baseAttack + "</div>"
				+ "<div class=\"card_statLabel\">&#9960;</div> <div class=\"card_stat def_" + this.id + "\">" + this.newDefence + "</div>"
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
			var content = "";
			var card = this;
			$(card.details).each
			(
				function (index)
				{
					content += "<b>" + card.details[index].title + "</b><br />";
					content += "<small>" + card.details[index].description + "</small>";
					content += "<br /><br />";
				}
			);
			details.html(content);

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
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "&checkmark;If there is a <b>Male</b> or <b>White</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "White";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "White"
			},
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
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

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wwoman";
newCard.title = "White Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "&checkmark;&checkmark;If there is a <b>Female</b> or <b>White</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Defence</b> on play."
	}
];
newCard.race = "White";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "White"
			},
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.medium, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "hman";
newCard.title = "Hispanic Man";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "&checkmark;If there is a <b>Male</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
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

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "hwoman";
newCard.title = "Hispanic Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "&checkmark;If there is a <b>Female</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Defence</b> on play."
	}
];
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.medium, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "bman";
newCard.title = "Black Man";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "&checkmark;If there is a <b>Male</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
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

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "bwoman";
newCard.title = "Black Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "&checkmark;If there is a <b>Female</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Defence</b> on play."
	}
];
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.medium, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "aman";
newCard.title = "Asian Man";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "&checkmark;If there is a <b>Male</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
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

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "awoman";
newCard.title = "Asian Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "&checkmark;If there is a <b>Female</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Defence</b> on play."
	}
];
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.medium, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "naman";
newCard.title = "Native American Man";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "&checkmark;If there is a <b>Male</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
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

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.medium, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "nawoman";
newCard.title = "Native American Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "&checkmark;If there is a <b>Female</b> or <b>Minority</b> card adjacent to this card, add <b>" + config.medium + "</b> to <b>Defence</b> on play."
	}
];
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "race",
				"val": "Minority"
			},
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.medium, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "transgender";
newCard.title = "Transgender";
newCard.subTitle = "Gender is merely a social construct.";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "&checkmark;If there is a <b>Female</b> or <b>LGBT</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Defence</b> on play."
	},
	{
		"title" : "Solidarity Attack",
		"description": "&checkmark;If there is a <b>Male</b> or <b>LGBT</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Attack</b> when attacking."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.minor, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
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

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 1, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 1, index); }

		this.onEditAttack(config.minor, placeholder);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "gay";
newCard.title = "Gay";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "&checkmark;If there is a <b>Male</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Attack</b> when attacking."
	},
	{
		"title" : "LGBT Unity",
		"description": "&checkmark;There is a <b>" + config.minor + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>LGBT</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
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

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.minor, placeholder);
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.minor * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "sexualOrientation",
					"val": "LGBT"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}		
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "lesbian";
newCard.title = "Lesbian";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "&checkmark;If there is a <b>Female</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Defence</b> on play."
	},
	{
		"title" : "LGBT Unity",
		"description": "&checkmark;There is a <b>" + config.minor + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>LGBT</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.minor, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.minor * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "sexualOrientation",
					"val": "LGBT"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}			
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "biman";
newCard.title = "Bisexual Man";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Attack",
		"description": "&checkmark;If there is a <b>Male</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Attack</b> when attacking."
	},
	{
		"title" : "LGBT Unity",
		"description": "&checkmark;There is a <b>" + config.minor + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>LGBT</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.attackSpecial = function(index)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		game.turnAttacker, 
		[
			{
				"stat": "gender",
				"val": "Male"
			}
		]
	);

	if (activated > 0)
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

		if (game.turnAttacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (game.turnAttacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditAttack(config.minor, placeholder);
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.minor * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "sexualOrientation",
					"val": "LGBT"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}			
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "biwoman";
newCard.title = "Bisexual Woman";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Solidarity Defense",
		"description": "&checkmark;If there is a <b>Female</b> card adjacent to this card, add <b>" + config.minor + "</b> to <b>Attack</b> when attacking."
	},
	{
		"title" : "LGBT Unity",
		"description": "&checkmark;There is a <b>" + config.minor + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>LGBT</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.minor;
newCard.playSpecial = function(index, attacker)
{
	var activated = config.cardConditionsAdjacent
	(
		index, 
		attacker, 
		[
			{
				"stat": "gender",
				"val": "Female"
			}
		]
	);

	if (activated > 0)
	{
		if (attacker == "bot") { bot.showSpecial(this.id, 0, index); } 
		if (attacker == "player") { player.showSpecial(this.id, 0, index); }

		this.onEditDefence(config.minor, "#" + attacker + "Hand_" + index + " .def_" + this.id);
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.minor * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "sexualOrientation",
					"val": "LGBT"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}			
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "adhominem";
newCard.title = "Ad Hominem";
newCard.subTitle = "Cheap shots are the best shots.";
newCard.details = 
[
	{
		"title" : "Massive Burn", //in main class
		"description": "&checkmark;Upon successfully <b>Triggering</b> any card, your opponent loses <b>" + config.minor + "</b> <b>Woke Points</b>.",
	},
	{
		"title" : "Having the Last Word",
		"description": "&checkmark;When this card is <b>Triggered</b>, your opponent loses <b>" + config.medium + "</b> <b>Likes</b>.",
	},
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.destroySpecial = function(index)
{
	if (game.turnAttacker == "bot") 
	{
		player.showSpecial(this.id, 1, index); 
		bot.onEditLikes(-config.medium);
	}

	if (game.turnAttacker == "player") 
	{ 
		bot.showSpecial(this.id, 1, index); 
		player.onEditLikes(-config.medium);
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "snowflake";
newCard.title = "Snowflake";
newCard.subTitle = "I'm offended!";
newCard.details = 
[
	{
		"title" : "Safe Space Healing", //in game class
		"description": "&checkmark;For every round this card spends in the <b>Safe Space</b>, gain <b>" + config.minor + "</b> <b>Defence</b>.",
	},
	{
		"title" : "Oppression Olympics",
		"description": "&checkmark;If there is a <b>Victim Card</b> in hand, gain a <b>x" + config.minor + "</b> bonus to <b>Attack</b>.",
	},
	{
		"title" : "Martyr Complex",
		"description": "&checkmark;When this card is <b>Triggered</b>, there is a <b>" + config.minor + "0%</b> to add the attacking card's <b>Woke Rating</b> to <b>Woke Points</b>.",
	},
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (botHand.findCardById("victim").length != [])
		{
			this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
			bot.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player")
	{
		if (playerHand.findCardById("victim").length != [])
		{
			this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
			player.showSpecial(this.id, 1, index);
		}
	}
};
newCard.destroySpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (config.generateRandomNo(1, 100) <= (config.minor * 10))
		{
			player.onEditWokePoints(botHand.cards[index].wokeRating);
			player.showSpecial(this.id, 2, index);									
		}
	}

	if (game.turnAttacker == "player")
	{
		if (config.generateRandomNo(1, 100) <= (config.minor * 10))
		{
			bot.onEditWokePoints(playerHand.cards[index].wokeRating);
			bot.showSpecial(this.id, 2, index);									
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "vsignal";
newCard.title = "Virtue Signalling";
newCard.subTitle = "It's great to be woke!";
newCard.details =
[
	{
		"title" : "Humblebrag", //in main class
		"description": "&checkmark;There is a <b>" + config.minor + "0%</b> chance to gain <b>Woke Points</b> for every point of damage done, when attacking.",
	},
	{
		"title" : "Self-praise", //in main class
		"description": "&checkmark;Upon successfully <b>Triggering</b> any card, gain <b>" + config.minor + "</b> <b>Defence</b>.",
	},
	{
		"title" : "Holier Than Thou", 
		"description": "Every round, there is a <b>" + config.minor + "0%</b> chance for your opponent to lose <b>Likes</b> for every <b>Woke Point</b> more you have than your opponent.",
	},
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.roundSpecial = function(index, attacker)
{
	var diff = 0;
	
	if (config.generateRandomNo(1, 100) <= (config.minor * 10))
	{
		if (attacker == "bot") 
		{
			diff = bot.wokePoints - player.wokePoints;
			if (diff > 0)
			{
				player.onEditLikes(-diff * config.minor);
				bot.showSpecial(this.id, 2, index);
			}
		}

		if (attacker == "player") 
		{
			diff = player.wokePoints - bot.wokePoints;
			if (diff > 0)
			{
				bot.onEditLikes(-diff * config.minor);
				player.showSpecial(this.id, 2, index);
			}
		}		
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "homophobe";
newCard.title = "Homophobe";
newCard.subTitle = "";
newCard.details =
[
	{
		"title" : "Homophobia", 
		"description": "&checkmark;Gain a <b>x" + config.minor + "</b> bonus to <b>Attack</b> if target is a <b>LGBT</b> card.",
	},
	{
		"title" : "Hetero Unity",
		"description": "&checkmark;There is a <b>" + config.medium + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>Hetero</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (playerHand.cards[index] != null)
		{
			if (playerHand.cards[index].sexualOrientation == "LGBT")
			{
				this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
				bot.showSpecial(this.id, 0, index);
			}
		}
	}

	if (game.turnAttacker == "player")
	{
		if (botHand.cards[index] != null)
		{
			if (botHand.cards[index].sexualOrientation == "LGBT")
			{
				this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
				player.showSpecial(this.id, 0, index);
			}
		}
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "sexualOrientation",
					"val": "Hetero"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "xenophobe";
newCard.title = "Xenophobe";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Xenophobia", 
		"description": "&checkmark;Attack with a <b>x" + config.minor + "</b> bonus to <b>Attack</b> if target is a <b>Minority</b> card.",
	},
	{
		"title" : "White Unity",
		"description": "&checkmark;There is a <b>" + config.medium + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>White</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (playerHand.cards[index] != null)
		{
			if (playerHand.cards[index].race == "Minority")
			{
				this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
				bot.showSpecial(this.id, 0, index);
			}
		}
	}

	if (game.turnAttacker == "player")
	{
		if (botHand.cards[index] != null)
		{
			if (botHand.cards[index].race == "Minority")
			{
				this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
				player.showSpecial(this.id, 0, index);
			}
		}
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "race",
					"val": "White"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "misogynist";
newCard.title = "Misogynist";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Misogyny", 
		"description": "&checkmark;Attack with a <b>x" + config.minor + "</b> bonus to <b>Attack</b> if target is a <b>Female</b> card.",
	},
	{
		"title" : "Gender Unity",
		"description": "&checkmark;There is a <b>" + config.medium + "0%</b> chance to gain <b>Defence</b> equal to the number of <b>Male</b> cards in hand every round."
	}
];
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (playerHand.cards[index] != null)
		{
			if (playerHand.cards[index].gender == "Female")
			{
				this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
				bot.showSpecial(this.id, 0, index);
			}
		}
	}

	if (game.turnAttacker == "player")
	{
		if (botHand.cards[index] != null)
		{
			if (botHand.cards[index].gender == "Female")
			{
				this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
				player.showSpecial(this.id, 0, index);
			}
		}
	}
};
newCard.roundSpecial = function(index, attacker)
{
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		var activated = config.cardConditionsInHand
		(
			index, 
			attacker, 
			[
				{
					"stat": "gender",
					"val": "Male"
				}
			]
		);

		if (activated > 0)
		{
			if (attacker == "bot") { bot.showSpecial(this.id, 1, index); } 
			if (attacker == "player") { player.showSpecial(this.id, 1, index); }

			this.onEditDefence(activated, "#" + attacker + "Hand_" + index + " .def_" + this.id);
		}
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "tbmedia";
newCard.title = "Trial By Media";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Jumping the Gun", 
		"description": "&checkmark;On play, there is a <b>" + config.medium + "0%</b> chance for your opponent to lose <b>Likes</b> equal to the number of your <b>Woke Points</b>.",
	},
	{
		"title" : "Doxxing",
		"description": "&checkmark;Your opponent loses <b>" + config.minor + "</b> <b>Likes</b> with every attack by this card."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot") 
		{
			player.onEditLikes(-bot.wokePoints);
			bot.showSpecial(this.id, 0, index);
		}

		if (attacker == "player") 
		{
			bot.onEditLikes(-player.wokePoints);
			player.showSpecial(this.id, 0, index);
		}		
	}
};
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot") 
	{
		player.onEditLikes(config.minor);
		bot.showSpecial(this.id, 1, index);
	}

	if (game.turnAttacker == "player") 
	{
		bot.onEditLikes(config.minor);
		player.showSpecial(this.id, 1, index);
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "antivaxxers";
newCard.title = "Anti-vaxxers";
newCard.subTitle = "";
newCard.details = 
[
	{
		"title" : "Mother Knows Best", 
		"description": "&checkmark;If there is a <b>Maternity Card</b> in hand, gain a <b>x" + config.minor + "</b> bonus to <b>Attack</b>.",
	},
	{
		"title" : "Mutually Assured Destruction",
		"description": "&checkmark;Upon being <b>Triggered</b>, deal <b>" + config.medium + "</b> damage to opposing card."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.attackSpecial = function(index)
{
	if (game.turnAttacker == "bot")
	{
		if (botHand.findCardById("maternity").length != [])
		{
			this.onEditAttack(this.baseAttack, "#botHand_" + index + " .att_" + this.id);
			bot.showSpecial(this.id, 0, index);
		}
	}

	if (game.turnAttacker == "player")
	{
		if (playerHand.findCardById("maternity").length != [])
		{
			this.onEditAttack(this.baseAttack, "#playerHand_" + index + " .att_" + this.id);
			player.showSpecial(this.id, 0, index);
		}
	}
};
newCard.destroySpecial = function(index)
{
	if (game.turnAttacker == "bot") 
	{
		if (botHand.cards[index] != null)
		{//TODO: cater for turnstoLive botHand.cards[index].onEditTurnsToLive(card.wokeRating);
			botHand.cards[index].onEditDefence(-config.medium, "#botHand_" + index + " .def_" + botHand.cards[index].id);
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		if (playerHand.cards[index] != null)
		{
			playerHand.cards[index].onEditDefence(-config.medium, "#playerHand_" + index + " .def_" + playerHand.cards[index].id);
			bot.showSpecial(this.id, 1, index);
		}
	}	
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "imisogyny";
newCard.title = "Internalized Misogyny";
newCard.subTitle = "";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);


newCard = Object.assign({}, objCard);
newCard.id = "gaslighting";
newCard.title = "Gaslighting";
newCard.subTitle = "I'm sorry that's how you feel.";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "ptrophy";
newCard.title = "Participation Trophy";
newCard.subTitle = "Everyone gets a prize!";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "cultapp";
newCard.title = "Cultural Appropriation";
newCard.subTitle = "";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "strawman";
newCard.title = "Straw Man";
newCard.subTitle = "If you can't convince them, confuse them.";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "kbwar";
newCard.title = "Keyboard Warrior";
newCard.subTitle = "";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wknight";
newCard.title = "White Knight";
newCard.subTitle = "";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "feminazi";
newCard.title = "Feminazi";
newCard.subTitle = "Down with the Patriarchy!";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wsupremacy";
newCard.title = "White Supremacy";
newCard.subTitle = "Blood and soil.";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wwashing";
newCard.title = "Whitewashing";
newCard.subTitle = "";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "maggression";
newCard.title = "Micro-aggression";
newCard.subTitle = "";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "mansplaining";
newCard.title = "Mansplaining";
newCard.subTitle = "What you women don't realize is...";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wguilt";
newCard.title = "White Guilt";
newCard.subTitle = "On behalf of my privilege, I apologize.";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "pcbrigade";
newCard.title = "PC Brigade";
newCard.subTitle = "";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "tonepolice";
newCard.title = "Tone Police";
newCard.subTitle = "";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "antifa";
newCard.title = "ANTIFA";
newCard.subTitle = "Everytime you punch a Nazi, an angel gets its wings.";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "extremist";
newCard.title = "Extremist";
newCard.subTitle = "There are no neutrals. Pick a side!";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "moderate";
newCard.title = "Moderate";
newCard.subTitle = "There are two sides to a coin.";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "leftwinger";
newCard.title = "Left-winger";
newCard.subTitle = "From each according to his ability, to each according to his needs.";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "rightwinger";
newCard.title = "Right-winger";
newCard.subTitle = "All wealth is the product of labor.";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "troll";
newCard.title = "Troll";
newCard.subTitle = "Get a reaction; <i>any</i> reaction";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "race";
newCard.title = "Race Card";
newCard.subTitle = "Black lives matter!";
newCard.details = 
[
	{
		"title" : "Enhanced Recovery", //in game
		"description": "&checkmark;Every round, all <b>Minority</b> cards in the <b>Safe Space</b> recover an additional <b>" + config.minor + "</b> rounds faster."
	},
	{
		"title" : "Sacrificial Solidarity", 
		"description": "&checkmark;Upon being <b>Triggered</b>, all <b>Minority</b> cards gain <b>" + config.medium + "</b> to Defence."
	},
	{
		"title" : "Xenophobe Destruction",
		"description": "&checkmark;On play, if played opposite a <b>Xenophobe</b> card, that card has a <b>" + config.medium + "0%</b> chance of being <b>Triggered</b>."
	}
];
newCard.race = "Minority";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function(index)
{
	var activated = 0;

	if (game.turnAttacker == "bot") 
	{
		$(playerHand.cards).each
		(
			function (playerIndex)
			{
				if (playerHand.cards[playerIndex] != null)
				{
					if (playerHand.cards[playerIndex].race == "Minority")
					{
						playerHand.cards[playerIndex].onEditDefence(config.medium, "#playerHand_" + playerIndex + " .def_" + playerHand.cards[playerIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		$(botHand.cards).each
		(
			function (botIndex)
			{
				if (botHand.cards[botIndex] != null)
				{
					if (botHand.cards[botIndex].race == "Minority")
					{
						botHand.cards[botIndex].onEditDefence(config.medium, "#botHand_" + botIndex + " .def_" + botHand.cards[botIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			bot.showSpecial(this.id, 1, index);
		}
	}
};
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				if (playerHand.cards[index].id == "xenophobe")
				{
					playerHand.cards[index].editDefence(-playerHand.cards[index].newDefence);
					playerHand.cards[index].onDestroy("#playerHand_" + index + " .def_" + playerHand.cards[index].id);
					bot.showSpecial(this.id, 2, index);
				}
			}
		}

		if (attacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				if (botHand.cards[index].id == "xenophobe")
				{
					botHand.cards[index].editDefence(-botHand.cards[index].newDefence);
					botHand.cards[index].onDestroy("#botHand_" + index + " .def_" + botHand.cards[index].id);	
					player.showSpecial(this.id, 2, index);
				}				
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "gender";
newCard.title = "Gender Card";
newCard.subTitle = "Down with the Patriarchy!";
newCard.details = 
[
	{
		"title" : "Enhanced Recovery", //in game
		"description": "Every round, all <b>Female</b> cards in the <b>Safe Space</b> recover an additional <b>" + config.minor + "</b> rounds faster."
	},
	{
		"title" : "Sacrificial Solidarity", 
		"description": "Upon being <b>Triggered</b>, all <b>Female</b> cards gain <b>" + config.medium + "</b> to Defence."
	},
	{
		"title" : "Misogynist Destruction",
		"description": "On play, if played opposite a <b>Misogynist</b> card, that card has a <b>" + config.medium + "0%</b> chance of being <b>Triggered</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function(index)
{
	var activated = 0;

	if (game.turnAttacker == "bot") 
	{
		$(playerHand.cards).each
		(
			function (playerIndex)
			{
				if (playerHand.cards[playerIndex] != null)
				{
					if (playerHand.cards[playerIndex].gender == "Female")
					{
						playerHand.cards[playerIndex].onEditDefence(config.medium, "#playerHand_" + playerIndex + " .def_" + playerHand.cards[playerIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		$(botHand.cards).each
		(
			function (botIndex)
			{
				if (botHand.cards[botIndex] != null)
				{
					if (botHand.cards[botIndex].gender == "Female")
					{
						botHand.cards[botIndex].onEditDefence(config.medium, "#botHand_" + botIndex + " .def_" + botHand.cards[botIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			bot.showSpecial(this.id, 1, index);
		}
	}
};
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				if (playerHand.cards[index].id == "misogynist")
				{
					playerHand.cards[index].editDefence(-playerHand.cards[index].newDefence);
					playerHand.cards[index].onDestroy("#playerHand_" + index + " .def_" + playerHand.cards[index].id);
					bot.showSpecial(this.id, 2, index);
				}				
			}
		}

		if (attacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				if (botHand.cards[index].id == "misogynist")
				{
					botHand.cards[index].editDefence(-botHand.cards[index].newDefence);
					botHand.cards[index].onDestroy("#botHand_" + index + " .def_" + botHand.cards[index].id);	
					player.showSpecial(this.id, 2, index);
				}				
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "maternity";
newCard.title = "Maternity Card";
newCard.subTitle = "I'm a mother, I can do no wrong.";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "lgbt";
newCard.title = "LGBT Card";
newCard.subTitle = "Straight people oppress us!";
newCard.details = 
[
	{
		"title" : "Enhanced Recovery", //in game
		"description": "Every round, all <b>LGBT</b> cards in the <b>Safe Space</b> recover an additional <b>" + config.minor + "</b> rounds faster."
	},
	{
		"title" : "Sacrificial Solidarity", 
		"description": "Upon being <b>Triggered</b>, all <b>LGBT</b> cards gain <b>" + config.medium + "</b> to Defence."
	},
	{
		"title" : "Homophobe Destruction",
		"description": "On play, if played opposite a <b>Homophobe</b> card, that card has a <b>" + config.medium + "0%</b> chance of being <b>Triggered</b>."
	}
];
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.destroySpecial = function(index)
{
	var activated = 0;

	if (game.turnAttacker == "bot") 
	{
		$(playerHand.cards).each
		(
			function (playerIndex)
			{
				if (playerHand.cards[playerIndex] != null)
				{
					if (playerHand.cards[playerIndex].sexualOrientation == "LGBT")
					{
						playerHand.cards[playerIndex].onEditDefence(config.medium, "#playerHand_" + playerIndex + " .def_" + playerHand.cards[playerIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			player.showSpecial(this.id, 1, index);
		}
	}

	if (game.turnAttacker == "player") 
	{
		$(botHand.cards).each
		(
			function (botIndex)
			{
				if (botHand.cards[botIndex] != null)
				{
					if (botHand.cards[botIndex].sexualOrientation == "LGBT")
					{
						botHand.cards[botIndex].onEditDefence(config.medium, "#botHand_" + botIndex + " .def_" + botHand.cards[botIndex].id);
						activated ++;
					}
				}
			}
		);

		if (activated > 0)
		{
			bot.showSpecial(this.id, 1, index);
		}
	}
};
newCard.playSpecial = function(index, attacker)
{	
	if (config.generateRandomNo(1, 100) <= (config.medium * 10))
	{
		if (attacker == "bot")
		{
			if (playerHand.cards[index] != null)
			{
				if (playerHand.cards[index].id == "homophobe")
				{
					playerHand.cards[index].editDefence(-playerHand.cards[index].newDefence);
					playerHand.cards[index].onDestroy("#playerHand_" + index + " .def_" + playerHand.cards[index].id);
					bot.showSpecial(this.id, 2, index);
				}				
			}
		}

		if (attacker == "player")
		{
			if (botHand.cards[index] != null)
			{
				if (botHand.cards[index].id == "homophobe")
				{
					botHand.cards[index].editDefence(-botHand.cards[index].newDefence);
					botHand.cards[index].onDestroy("#botHand_" + index + " .def_" + botHand.cards[index].id);	
					player.showSpecial(this.id, 2, index);
				}				
			}
		}
	}
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "victim";
newCard.title = "Victim Card";
newCard.subTitle = "It's not my fault!";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "nazi";
newCard.title = "Nazi Card";
newCard.subTitle = "If you don't agree with me, you're a Nazi!";
newCard.details = [];
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
newCard.attackSpecial = function(index)
{
	//this.attackCard();
};
cardTemplates.push(newCard);




