module.exports.config = {
    name: 'busy',
    version: '1.6',
    permission: 0,
    credits: 'NTKhang',
    prefix: false,
    premium: false,
    description: 'Enable do not disturb mode.',
    category: 'without prefix',
    usages: 'busy [reason] | busy off',
    cooldowns: 5,
    dependencies: []
};

module.exports.run = async function({ api, event, args, Users, usersData }) {
    const { senderID } = event;

    if (args[0] === 'off') {
        const { data } = await usersData.get(senderID);
        delete data.busy;
        await usersData.set(senderID, data, 'data');
        return api.sendMessage('✅ | Do not disturb mode has been turned off', event.threadID, event.messageID);
    }

    const reason = args.join(' ') || '';
    await usersData.set(senderID, reason, 'data.busy');
    return api.sendMessage(
        reason ? `✅ | Do not disturb mode has been turned on with reason: ${reason}` : '✅ | Do not disturb mode has been turned on',
        event.threadID,
        event.messageID
    );
};

module.exports.handleEvent = async function({ api, event, args, Users }) {
    const { mentions } = event;
    if (!mentions || Object.keys(mentions).length === 0) return;
    
    for (const userID of Object.keys(mentions)) {
        const reasonBusy = global.db.allUserData.find(item => item.userID == userID)?.data.busy || false;
        if (reasonBusy !== false) {
            return api.sendMessage(
                reasonBusy ? `User ${mentions[userID].replace('@', '')} is currently busy with reason: ${reasonBusy}` :
                `User ${mentions[userID].replace('@', '')} is currently busy`,
                event.threadID,
                event.messageID
            );
        }
    }
};
