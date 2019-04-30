const Discord = module.require('discord.js');

module.exports.run = async (client, message) => 
{   
    if(config.ownerID.indexOf(message.author.id) == -1) return;
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