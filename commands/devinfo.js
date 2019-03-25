const Discord = module.require('discord.js');
const client = new Discord.Client();
const config = require('../config.json');

module.exports.run = async (client, message, args) => 
{   
    if(message.author.id !== config.ownerID) return;
    const embed = {
        "description": "Информация для разработчиков...",
        "color": 16737843,
        "author": {
            "name": "Developer info"
        },
        "thumbnail": {
            "url": "https://pbs.twimg.com/media/D2hMcPrUgAYY1qD.png:large"
        },
        "fields": [
            {
                "name": "Ping",
                "value": `${Date.now() - message.createdTimestamp} ms`
            }
        ]
        };
        message.author.send({ embed });   
    }

module.exports.help = {
    name: "dev-info"
}