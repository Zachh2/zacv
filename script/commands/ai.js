module.exports.config = {
	name: "ai",
	credits: "ryuko",
	version: '1.0.0',
	description: "talk with AI using the provided API",
	prefix: false,
	premium: true,
	permission: 0,
	category: "without prefix",
	cooldowns: 0,
	dependencies: {
		"axios": ""
	}
};

const axios = require("axios");

module.exports.handleEvent = async function({ api, event, botname }) {
	try {
		const ask = event.body?.toLowerCase() || '';
		if (ask.includes(botname.toLowerCase())) {
			const escapedBotname = botname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const processedAsk = ask
				.replace(new RegExp(escapedBotname, 'gi'), '')
				.replace(/\s+/g, ' ')
				.trim()
				.replace(/\s+([,.?!])/g, '$1');

			try {
				const res = await axios.get(`http://87.106.100.187:6312/api/copilot?prompt=${encodeURIComponent(processedAsk)}`);
				const reply = res.data.result;
				return api.sendMessage(reply, event.threadID, event.messageID);
			} catch (error) {
				return api.sendMessage("Failed to get a response from the API.", event.threadID, event.messageID);
			}
		}
	} catch (error) {}
};

module.exports.run = async function({ api, event, args }) {
	const ask = args.join(' ');
	if (!ask) {
		return api.sendMessage("Please provide a message.", event.threadID, event.messageID);
	}
	try {
		const res = await axios.get(`http://87.106.100.187:6312/api/copilot?prompt=${encodeURIComponent(ask)}`);
		const reply = res.data.result;
		return api.sendMessage(reply, event.threadID, event.messageID);
	} catch (error) {
		return api.sendMessage("Failed to get a response from the API.", event.threadID, event.messageID);
	}
};
