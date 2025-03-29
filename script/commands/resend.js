module.exports.config = {
    name: "resend",
    version: "5.0",
    permission: 2,
    credits: "zach",
    prefix: false,
    premium: false,
    description: "Anti Unsend mode always enabled (works with audio, video, and images).",
    category: "Admins",
    usages: "{pn}",
    cooldowns: 1,
    dependencies: []
};

module.exports.run = async function ({ api, event, threadsData, message }) {
    if (!threadsData || typeof threadsData.set !== "function") {
        return message.reply("Error: threadsData is not available.");
    }
    
    await threadsData.set(event.threadID, true, "settings.reSend");
    
    if (!global.reSend) {
        global.reSend = {};
    }
    if (!global.reSend.hasOwnProperty(event.threadID)) {
        global.reSend[event.threadID] = [];
    }
    global.reSend[event.threadID] = await api.getThreadHistory(event.threadID, 100, undefined);
    
    return message.reply("Anti Unsend mode is always enabled.");
};

module.exports.onChat = async function ({ api, threadsData, event }) {
    if (!threadsData || typeof threadsData.get !== "function") {
        return;
    }
    
    if (event.type !== "message_unsend") {
        let resend = await threadsData.get(event.threadID, "settings.reSend");
        if (!resend) return;

        if (!global.reSend) {
            global.reSend = {};
        }
        if (!global.reSend.hasOwnProperty(event.threadID)) {
            global.reSend[event.threadID] = [];
        }
        global.reSend[event.threadID].push(event);

        if (global.reSend[event.threadID].length > 50) {
            global.reSend[event.threadID].shift();
        }
    }
};
