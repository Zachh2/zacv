module.exports.config = {
    name: "resend",
    version: "5.0",
    permission: 2,
    credits: "zach",
    prefix: false,
    premium: false,
    description: "Enable/Disable Anti Unsend mode (works with audio, video, and images).",
    category: "Admins",
    usages: "{pn} on or off\nex: {pn} on",
    cooldowns: 1,
    dependencies: []
};

module.exports.run = async function ({ api, event, args, threadsData, message }) {
    let resend = await threadsData.get(event.threadID, "settings.reSend");

    if (resend === undefined) {
        await threadsData.set(event.threadID, true, "settings.reSend");
    }

    if (!["on", "off"].includes(args[0])) {
        return message.reply("Invalid command. Use 'on' or 'off'.");
    }

    await threadsData.set(event.threadID, args[0] === "on", "settings.reSend");

    if (args[0] === "on") {
        if (!global.reSend.hasOwnProperty(event.threadID)) {
            global.reSend[event.threadID] = [];
        }
        global.reSend[event.threadID] = await api.getThreadHistory(event.threadID, 100, undefined);
    }
    
    return message.reply(args[0] === "on" ? "Anti Unsend mode enabled." : "Anti Unsend mode disabled.");
};

module.exports.onChat = async function ({ api, threadsData, event }) {
    if (event.type !== "message_unsend") {
        let resend = await threadsData.get(event.threadID, "settings.reSend");
        if (!resend) return;

        if (!global.reSend.hasOwnProperty(event.threadID)) {
            global.reSend[event.threadID] = [];
        }
        global.reSend[event.threadID].push(event);

        if (global.reSend[event.threadID].length > 50) {
            global.reSend[event.threadID].shift();
        }
    }
};
