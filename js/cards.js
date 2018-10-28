var objCard = 
{
	id: "",
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
	onDestroy: function() {},
	onAttack: function() {},
	onPlay: function() {},
	editAttack: function(val) 
	{
		//code here
	},
	editDefence: function(val) 
	{
		//code here
	},
	editTurnsToLive: function(val) 
	{
		//code here
	},
	attack: function(cb) 
	{
		//code here
	},
	destroy: function(cb) 
	{
		//code here
	},
	play: function(cb) 
	{
		if (game.round > 0)
		{

		}
	},
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
			container.addClass("card").addClass("card_xs");
			container.attr("style","background: #999999 url(img/" + this.id + ".jpg) center center no-repeat; background-size: cover;");

			var overlay = $("<div></div>");
			overlay.addClass("card_overlay");
			container.append(overlay);
			
			var title = $("<div></div>");
			title.addClass("title");
			title.html(this.title);

			var wokeRating = $("<div></div>");
			wokeRating.addClass("wokeRating");
			wokeRating.html(this.wokeRating);

			var attdef = $("<div></div>");
			attdef.addClass("attdef");
			attdef.html
			(
				"<div class=\"card_statLabel\">&#9876;</div> <div class=\"card_stat\">" + this.baseAttack + "</div>"
				+ "<div class=\"card_statLabel\">&#9960;</div> <div class=\"card_stat\">" + this.newDefence + "</div>"
			);

			overlay.append(title);
			overlay.append(wokeRating);
			overlay.append(attdef);

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
				"<div class=\"card_statLabel\">&#9876;</div> <div class=\"card_stat att_" + this.id + "\">" + this.baseAttack + "</div>"
				+ "<div class=\"card_statLabel\">&#9960;</div> <div class=\"card_stat def_" + this.id + "\">" + this.newDefence + "</div>"
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
newCard.subTitle = "The target of all cards";
newCard.details = "";
newCard.race = "White";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wwoman";
newCard.title = "White Woman";
newCard.subTitle = "I am woman, hear me roar.";
newCard.details = "";
newCard.race = "White";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "hman";
newCard.title = "Hispanic Man";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = "";
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "hwoman";
newCard.title = "Hispanic Woman";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = "";
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "bman";
newCard.title = "Black Man";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = "";
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "bwoman";
newCard.title = "Black Woman";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = "";
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "aman";
newCard.title = "Asian Man";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = "";
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "awoman";
newCard.title = "Asian Woman";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = "";
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "naman";
newCard.title = "Native American Man";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = "";
newCard.race = "Minority";
newCard.gender = "Male";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "nawoman";
newCard.title = "Native American Woman";
newCard.subTitle = "Black, Hispanic, Asian, etc";
newCard.details = "";
newCard.race = "Minority";
newCard.gender = "Female";
newCard.sexualOrientation = "Hetero";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "transgender";
newCard.title = "Transgender";
newCard.subTitle = "Each round, gain " + config.minor + " Defence for every Male and Female card in your deck.";
newCard.details = "xxxxxxxxxxxxxxxxx";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "gay";
newCard.title = "Gay";
newCard.subTitle = "I love other men.";
newCard.details = "Each round, gain " + config.medium + " Defence for every Male card in your deck.";
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "lesbian";
newCard.title = "Lesbian";
newCard.subTitle = "I love other women.";
newCard.details = "Each round, gain " + config.medium + " Defence for every Female card in your deck.";
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "biman";
newCard.title = "Bisexual Man";
newCard.subTitle = "I love other men.";
newCard.details = "Each round, gain " + config.medium + " Defence for every Male card in your deck.";
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "biwoman";
newCard.title = "Bisexual Woman";
newCard.subTitle = "I love other women.";
newCard.details = "Each round, gain " + config.medium + " Defence for every Female card in your deck.";
newCard.race = "Neutral";
newCard.gender = "Female";
newCard.sexualOrientation = "LGBT";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.minor;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "adhominem";
newCard.title = "Ad Hominem";
newCard.subTitle = "Cheap shots are the best shots.";
newCard.details = "Attack a random opponent's card after attacking the opposing card.<br /><br />Upon being Triggered, subtract " + config.minor + " Woke Points from oppoent.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "snowflake";
newCard.title = "Snowflake";
newCard.subTitle = "";
newCard.details = "If there is a Victim Card in your attack stack, add " + config.major + " to Base Attack.<br/><br />For every round the card is in the Safe Space, add " + config.minor + " Defence.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseDefence = config.minor;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseDefence = config.minor;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseDefence = config.minor;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseDefence = config.minor;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "flatearth";
newCard.title = "Flat Earth Theory";
newCard.subTitle = "";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.medium;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);


newCard = Object.assign({}, objCard);
newCard.id = "gaslighter";
newCard.title = "Gaslighter";
newCard.subTitle = "I'm sorry that's how you feel.";
newCard.details = "When attacking, for every one of your opponent's Woke Points, add " + config.minor + " to Base Attack.<br /><br />On destruction, subtract " + config.minor + " Woke Points.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "ptrophy";
newCard.title = "Participation Trophy";
newCard.subTitle = "Everyone gets a prize!";
newCard.details = "Every round, all cards in the Attack Stack add " + config.minor + " to Defence.<br /><br />On destruction, add " + config.minor + " Likes.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "cultapp";
newCard.title = "Cultural Appropriation";
newCard.subTitle = "";
newCard.details = "On play, for every Woke Point your opponent has, add " + config.minor + " to Defence.<br /><br />Upon being Triggered, add " + config.minor + " Defence for all cards.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.minor;
newCard.baseDefence = config.minor;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "wsupremacist";
newCard.title = "White Supremacist";
newCard.subTitle = "Blood and soil.";
newCard.details = "";
newCard.race = "White";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "mansplainer";
newCard.title = "Mansplainer";
newCard.subTitle = "What you women don't realize is...";
newCard.details = "";
newCard.race = "Neutral";
newCard.gender = "Male";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "antifa";
newCard.title = "ANTIFA";
newCard.subTitle = "Everytime you punch a Nazi, an angel gets its wings.";
newCard.details = "On play, instantly Trigger <i>White Supremacist</i> card.<br /><br /><br /><br />";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);

newCard = Object.assign({}, objCard);
newCard.id = "troll";
newCard.title = "Troll";
newCard.subTitle = "Get a reaction; <i>any</i> reaction";
newCard.details = "Each round, inflict " + config.minor + " damage to the all cards.<br /><br />On play, instantly Trigger <i>Snowflake</i> card.<br /><br />If there is a <i>Keyboard Warrior</i> card in your Attack Stack, add " + config.medium + " to Base Attack.";
newCard.race = "Neutral";
newCard.gender = "Neutral";
newCard.sexualOrientation = "Neutral";
newCard.baseAttack = config.major;
newCard.baseDefence = config.major;
newCard.wokeRating = config.medium;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.minor;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.major;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.minor;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.major;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.minor;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.major;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.minor;
newCard.baseDefence = config.medium;
newCard.wokeRating = config.major;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseAttack = config.minor;
newCard.baseDefence = config.major;
newCard.wokeRating = config.major;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
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
newCard.baseDefence = config.minor;
newCard.wokeRating = config.major;
newCard.onDestroy = function()
{
	this.destroyCard();
};
newCard.onAttack = function()
{
	this.attackCard();
};
cardTemplates.push(newCard);




