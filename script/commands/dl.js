module.exports.config = {
	name: "download",
	credits: "zzazch",
	version: '1.0.0',
	description: "Download media from a provided URL",
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

module.exports.run = async function({ api, event, args }) {
	const url = args.join(" ");
	if (!url) {
		return api.sendMessage("Please provide a valid URL.", event.threadID, event.messageID);
	}

	try {
		const response = await axios.get(`http://87.106.100.187:6312/download/all?url=${encodeURIComponent(url)}`);
		const data = response.data;

		if (!data.status || !data.medias || data.medias.length === 0) {
			return api.sendMessage("Failed to retrieve media.", event.threadID, event.messageID);
		}

		// Sort by quality (HD first, then SD, etc.)
		const sortedMedia = data.medias.sort((a, b) => {
			if (a.quality === "HD" && b.quality !== "HD") return -1;
			if (a.quality !== "HD" && b.quality === "HD") return 1;
			return b.size - a.size; // Prefer larger files
		});

		const bestMedia = sortedMedia[0]; // Pick the best available media

		api.sendMessage({
			body: `Media Downloaded: ${bestMedia.formattedSize}\nQuality: ${bestMedia.quality}`,
			attachment: await global.utils.getStreamFromURL(bestMedia.url)
		}, event.threadID, event.messageID);
	} catch (error) {
		return api.sendMessage("An error occurred while fetching the media.", event.threadID, event.messageID);
	}
};
