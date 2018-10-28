var config = 
{
	major: 10,
	medium: 5,
	minor: 2,
	generateRandomNo: function(min, max)
	{
		return Math.floor((Math.random() * (max - min + 1)) + min);
	},
	getContextColor: function(context)
	{
		if (context == "positive") return "#44FF44";
		if (context == "negative") return "#FF0000";

		return "#000000";
	}
};