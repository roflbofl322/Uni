const Discord = module.require('discord.js');
const client = new Discord.Client();
const config = require('../config.json');

module.exports.run = async (client, message, args) => 
{   
    var check;
    if(config.ownerID.indexOf(message.author.id) == -1)
    {
        check = "Не является разработчиком"
    }
    else
    {
        check = "Является разработчиком"
    }
    const embed = {
        "color": 16737843,
        "author": {
            "name": "Информация о пользователе"
        },
        "thumbnail": {
            "url": "https://pbs.twimg.com/media/D2hMcPrUgAYY1qD.png:large"
        },
        "fields": [
            {
                "name": `${message.author.username}`,
                "value": `${check}`
            }
        ]
        };
        message.channel.send({ embed });   
    }

module.exports.help = {
    name: "verify"
}