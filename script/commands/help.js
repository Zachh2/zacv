module.exports.config = {
  name: "help",    
  version: "1.0.2", 
  permission: 0,
  credits: "ryuko",
  description: "beginner's guide", 
  prefix: true,
  premium: false,
  category: "guide",
  usages: "[Shows Commands]",
  cooldowns: 5,
  dependencies: '',
};

module.exports.languages = {
  "english": {
      "moduleInfo": "%1\n%2\n\nUsage: %3\nCategory: %4\nCooldown: %5 seconds(s)\nPermission: %6\n\nModule code by %7.",
      "helpList": "THERE ARE %1 COMMANDS AND %2 CATEGORIES",
      "user": "User",
      "adminGroup": "Group admin",
      "adminBot": "Bot admin"
  }
};

const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs");
const request = require("request");

module.exports.run = async function ({ api, event, args, getText, botname, prefix }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const dateTime = moment().tz("Asia/Manila").format("dddd || D/MM/YYYY || HH:mm:ss");
  
  let commandList = Array.from(commands.keys());
  let totalCommands = commandList.length;
  let itemsPerPage = 10;
  let totalPages = Math.ceil(totalCommands / itemsPerPage);
  let page = parseInt(args[0]) || 1;
  if (page < 1 || page > totalPages) page = 1;
  
  let startIndex = (page - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  let paginatedCommands = commandList.slice(startIndex, endIndex);
  
  let msg = `📜 Available Commands List (Page ${page}/${totalPages}):\nUse: "${prefix}help <command name>" for more details\n━━━━━━༺༻━━━━━━\n`;
  
  paginatedCommands.forEach(name => {
      let cmd = commands.get(name);
      msg += `━━━━━━༺༻━━━━━━\n[ ${name} ]\n╰┈➤ Description: ${cmd.config.description}\n╰┈➤ Cooldown: ${cmd.config.cooldowns}s\n\n`;
  });
  
  msg += `━━━━━━༺༻━━━━━━\n📅 ${dateTime}\n`;
  if (page < totalPages) msg += `Type "${prefix}help ${page + 1}" to see more commands.`;
  
  return api.sendMessage(msg, threadID, messageID);
};
