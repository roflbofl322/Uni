const Discord = module.require('discord.js');
const client = new Discord.Client();

module.exports.run = async (client, message, args) => 
{
    const embed = {
        "description": "Информация о боте...",
        "color": 16737843,
        "author": {
            "name": "Bot info"
        },
        "thumbnail": {
            "url": "https://pbs.twimg.com/media/D2hMcPrUgAYY1qD.png:large"
        },
        "fields": [
            {
                "name": "Количество серверов",
                "value": `${client.guilds.size} сервер`
            },
            {
                "name": "Количество пользователей",
                "value": `${client.users.size} пользователь`
            }
        ]
        };
        message.author.send({ embed });   
    }

module.exports.help = {
    name: "bot-info"
}