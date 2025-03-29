module.exports.config = {
    name: "resend",
    version: "1.0.1",
    permission: 0,
    credits: "zach",
    description: "Anti Unsend mode always enabled (works with audio, video, and images).",
    category: "system",
    prefix: false,
    premium: false,
    usages: "resend admin only",
    cooldowns: 1
};

module.exports.languages = {
    "english": {
        "enabled": "Anti Unsend mode is always enabled.",
        "errorThreads": "Error: threads is not available."
    }
};

module.exports.run = async function ({ api, event, threads, message, getText }) {
    if (!threads || typeof threads.set !== "function") {
        return message.reply(getText("errorThreads"));
    }
    
    await threads.set(event.threadID, true, "settings.reSend");
    
    if (!global.reSend) {
        global.reSend = {};
    }
    if (!global.reSend.hasOwnProperty(event.threadID)) {
        global.reSend[event.threadID] = [];
    }
    global.reSend[event.threadID] = await api.getThreadHistory(event.threadID, 100, undefined);
    
    return message.reply(getText("enabled"));
};

module.exports.onChat = async function ({ api, threads, event }) {
    if (!threads || typeof threads.get !== "function") {
        return;
    }
    
    if (event.type !== "message_unsend") {
        let resend = await threads.get(event.threadID, "settings.reSend");
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
