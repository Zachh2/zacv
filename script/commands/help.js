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
    "moduleInfo": "╭──[ %1 ]────⧕\n│ ⭓ %2\n├── INFO\n│ Description: %3\n│ Usage: %4\n│ Category: %5\n│ Cooldown: %6 sec\n│ Permissions: %7\n├─ Module Code By: %8\n╰──────⭔",
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
  const command = commands.get((args[0] || "").toLowerCase());
  const prefix = global.config.PREFIX;
  const dateTime = moment().tz("Asia/Manila").format("dddd || D/MM/YYYY || HH:mm:ss");

  if (!command) {
    let msg = `📜 Available Commands List:\nUse: "${prefix}help <command name>" for more details\n━━━━━━༺༻━━━━━━\n`;
    
    commands.forEach((cmd, name) => {
      msg += `🔹 ${name}: ${cmd.config.description} (Cooldown: ${cmd.config.cooldowns}s)\n`;
    });
    
    msg += `━━━━━━༺༻━━━━━━\n📅 ${dateTime}\n🤖 Bot by: Zach`;
    
    return api.sendMessage(msg, threadID, messageID);
  }

  return api.sendMessage(
    getText(
      "moduleInfo", command.config.name, command.config.description,
      `${prefix}${command.config.name} ${command.config.usages || ""}`,
      command.config.commandCategory, command.config.cooldowns,
      command.config.hasPermssion === 0 ? getText("user") :
      command.config.hasPermssion === 1 ? getText("adminGroup") : getText("adminBot"),
      command.config.credits
    ),
    threadID, messageID
  );
};
