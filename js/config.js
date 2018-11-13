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
	}
};