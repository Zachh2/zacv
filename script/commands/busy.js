module.exports.config = {
    name: 'busy',
    version: '1.6',
    permission: 0,
    credits: 'zach',
    prefix: false,
    premium: false,
    description: 'Enable do not disturb mode.',
    category: 'without prefix',
    usages: 'busy [reason] | busy off',
    cooldowns: 5,
    dependencies: []
};

module.exports.run = async function({ api, event, args, Users }) {
    const { senderID } = event;

    let userData = global.db.allUserData.find(item => item.userID == senderID);
    if (!userData) userData = { data: {} };

    if (args[0] === 'off') {
        delete userData.data.busy;
        return api.sendMessage('✅ | Do not disturb mode has been turned off', event.threadID, event.messageID);
    }

    const reason = args.join(' ') || 'No reason provided';
    userData.data.busy = reason;

    return api.sendMessage(
        `✅ | Do not disturb mode has been turned on${reason ? ` with reason: ${reason}` : ''}`,
        event.threadID,
        event.messageID
    );
};

module.exports.handleEvent = async function({ api, event }) {
    const { mentions } = event;
    if (!mentions || Object.keys(mentions).length === 0) return;
    
    for (const userID of Object.keys(mentions)) {
        const userData = global.db.allUserData.find(item => item.userID == userID);
        const reasonBusy = userData?.data?.busy || false;
        
        if (reasonBusy !== false) {
            return api.sendMessage(
                `User ${mentions[userID].replace('@', '')} is currently busy${reasonBusy ? ` with reason: ${reasonBusy}` : ''}.`,
                event.threadID,
                event.messageID
            );
        }
    }
};
