module.exports.config = {
    name: 'busy',
    version: '1.6',
    permission: 0,
    credits: 'zach',
    prefix: true,
    premium: false,
    description: 'Enable do not disturb mode.',
    category: 'without prefix',
    usages: 'busy [reason] | busy off',
    cooldowns: 5,
    dependencies: []
};

module.exports.run = async function({ api, event, args, Users, usersData }) {
    const { senderID } = event;

    // Ensure usersData exists and is accessible
    if (!usersData || typeof usersData.get !== 'function' || typeof usersData.set !== 'function') {
        return api.sendMessage('⚠️ | Error: usersData is not available.', event.threadID, event.messageID);
    }

    // Fetch user data
    let userData = await usersData.get(senderID);
    if (!userData) userData = { data: {} }; // Initialize if undefined

    if (args[0] === 'off') {
        delete userData.data.busy; // Remove busy status
        await usersData.set(senderID, userData, 'data'); // Save changes
        return api.sendMessage('✅ | Do not disturb mode has been turned off', event.threadID, event.messageID);
    }

    const reason = args.join(' ') || 'No reason provided';
    userData.data.busy = reason; // Set busy reason
    await usersData.set(senderID, userData, 'data'); // Save changes

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
