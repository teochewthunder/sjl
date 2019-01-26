var config = 
{
	major: 10,
	medium: 5,
	minor: 2,
	generateRandomNo: function(min, max)
	{
		return Math.floor((Math.random() * (max - min + 1)) + min);
	},
	getContextColor: function(val)
	{
		if (val > 0) return "#44FF44";
		if (val < 0) return "#FF0000";

		return "#000000";
	},
	getContextRgbaColor: function(val, a)
	{
		if (val > 0) return "rgba(100,255,100," + a + ")";
		if (val < 0) return "rgba(255,0,0," + a + ")";

		return "rgba(0,0,0,0)";
	},
	cardConditionsMet: function(card, conditions)
	{
		var met = false;

		for (var i = 0; i < conditions.length; i++)
		{
			if (card[conditions[i].stat] == conditions[i].val) 
			{
				met = true;
			}
		}

		return met;
	},
	cardConditionsAdjacent: function(index, attacker, conditions)
	{
		var met = 0;

		if (attacker == "bot")
		{
			if (index > 0)
			{
				if (botHand.cards[index - 1] != null)
				{
					if (config.cardConditionsMet(botHand.cards[index - 1], conditions)) met++;
				}
			}

			if (index < botHand.cards.length - 1)
			{
				if (botHand.cards[index - 1] != null)
				{
					if (config.cardConditionsMet(botHand.cards[index + 1], conditions)) met++;						
				}
			}
		}

		if (attacker == "player")
		{
			if (index > 0)
			{
				if (playerHand.cards[index - 1] != null)
				{
					if (config.cardConditionsMet(playerHand.cards[index - 1], conditions)) met++;				
				}
			}

			if (index < playerHand.cards.length - 1)
			{
				if (playerHand.cards[index + 1] != null)
				{
					if (config.cardConditionsMet(playerHand.cards[index + 1], conditions)) met++;				
				}
			}		
		}

		return met;
	},
	cardConditionsInHand: function(index, attacker, conditions)
	{
		var met = 0;

		if (attacker == "bot")
		{
			$(botHand.cards).each
			(
				function(i)
				{
					if (botHand.cards[i] != null && i != index)
					{
						if (config.cardConditionsMet(botHand.cards[i], conditions)) met++;				
					}
				}
			)
		}

		if (attacker == "player")
		{
			$(playerHand.cards).each
			(
				function(i)
				{
					if (playerHand.cards[i] != null && i != index)
					{
						if (config.cardConditionsMet(playerHand.cards[i], conditions)) met++;				
					}
				}
			)
		}

		return met;
	},
};