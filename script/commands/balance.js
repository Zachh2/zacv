module.exports.config = {
    name: "balance",
    version: "1.1.0",
    permission: 0,
    credits: "Rishad",
    description: "View your balance or the balance of a tagged person",
    prefix: true,
    premium: false,
    category: "economy",
    usages: "balance [@tag]",
    cooldowns: 5,
};

module.exports.run = async function ({ event, api, args, usersData, Currencies }) {
    const { threadID, messageID, senderID, mentions } = event;
    const boldLettersMap = {
        "0": "𝟬", "1": "𝟭", "2": "𝟮", "3": "𝟯", "4": "𝟰",
        "5": "𝟱", "6": "𝟲", "7": "𝟳", "8": "𝟴", "9": "𝟵"
    };

    const boldTag = (text) => {
        return text.split('').map(char => boldLettersMap[char] || char).join('');
    };

    const loadingMessage = "⏳ Loading...";
    const loadingReply = await api.sendMessage(loadingMessage, threadID, messageID);

    setTimeout(async () => {
        let msg = "💵 𝗕𝗮𝗹𝗮𝗻𝗰𝗲\n━━━━━━━━━━━━━━━\n";
        
        if (Object.keys(mentions).length > 0) {
            for (const uid of Object.keys(mentions)) {
                const userMoney = (await Currencies.getData(uid)).money || 0;
                msg += `${boldTag(mentions[uid].replace("@", ""))} has ${boldTag(userMoney + "$")} in the database system.\n`;
            }
        } else {
            const userMoney = (await Currencies.getData(senderID)).money || 0;
            msg += `You have ${boldTag(userMoney + "$")} in the database system.`;
        }

        msg += "\n━━━━━━━━━━━━━━━";
        api.editMessage(msg, loadingReply.messageID);
    }, 2000);
};
