module.exports.config = {
  name: "help",    
  version: "1.0.0", 
  permission: 0,
  credits: "zach",
  description: "get box id", 
  prefix: true,
  premium: false,
  category: "without prefix",
  usages: "groupid",
  cooldowns: 5, 
  dependencies: '',
};

module.exports.languages = {
  "en": {
      "moduleInfo": "\u256d──[ %1 ]────⧕\n│ ⭓ %2\n├── INFO\n│ Description: %3\n│ Usage: %4\n│ Category: %5\n│ Cooldown: %6 sec\n│ Permissions: %7\n├─ Module Code By: %8\n╰──────⭔",
      "helpList": '[ There are %1 commands on this bot. Use: "%2help nameCommand" to learn how to use! ]',
      "user": "User",
      "adminGroup": "Admin group",
      "adminBot": "Admin bot"
  }
};

const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs");
const request = require("request");

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const prefix = global.config.PREFIX;
  const dateTime = moment().tz("Asia/Manila").format("dddd || D/MM/YYYY || HH:mm:ss");
  
  let commandList = Array.from(commands.keys());
  let totalCommands = commandList.length;
  let itemsPerPage = 15;
  let totalPages = Math.ceil(totalCommands / itemsPerPage);
  let page = parseInt(args[0]) || 1;
  if (page < 1 || page > totalPages) page = 1;
  
  let startIndex = (page - 1) * itemsPerPage;
  let endIndex = startIndex + itemsPerPage;
  let paginatedCommands = commandList.slice(startIndex, endIndex);
  
  let msg = `📜 Available Commands List (Page ${page}/${totalPages}):\nUse: "${global.config.PREFIX}help <command name>" for more details\n━━━━━━༺༻━━━━━━\n`;
  
  paginatedCommands.forEach(name => {
      let cmd = commands.get(name);
      msg += `━━━━━━༺༻━━━━━━\n[ ${name} ]\n╰┈➤ 𝘋𝘦𝘴𝘤𝘳𝘪𝘱𝘵𝘪𝘰𝘯: ${cmd.config.description}\n╰┈➤ 𝘞𝘢𝘪𝘵𝘪𝘯𝘨 𝘛𝘐𝘔𝘌: ${cmd.config.cooldowns}s\n\n`;
  });
  
  msg += `━━━━━━༺༻━━━━━━\n📅 ${dateTime}\n`;
  if (page < totalPages) msg += `Type "${global.config.PREFIX}help ${page + 1}" to see more commands.`;
  
  return api.sendMessage(msg, threadID, messageID);
};
