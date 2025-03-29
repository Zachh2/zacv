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

module.exports.run = async function ({ api, event, threads, message }) {
    if (!threads || typeof threads.set !== "function") {
        return message.reply("Error: threads is not available.");
    }
    
    await threads.set(event.threadID, true, "settings.reSend");
    
    if (!global.reSend) {
        global.reSend = {};
    }
    if (!global.reSend.hasOwnProperty(event.threadID)) {
        global.reSend[event.threadID] = [];
    }
    global.reSend[event.threadID] = await api.getThreadHistory(event.threadID, 100, undefined);
    
    return message.reply("Anti Unsend mode is always enabled.");
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

module.exports.handleReply = async function ({ api, event, message, threads }) {
    return message.reply("This is a reply handler.");
};
