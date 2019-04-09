const Discord = module.require('discord.js');
const client = new Discord.Client();

module.exports.run = async (client, message, args) => 
{
    const embed = {
        "description": "Список команд и их описание...",
        "color": 16737843,
        "author": {
            "name": "UniHelp"
        },
        "thumbnail": {
            "url": "https://pbs.twimg.com/media/D2hMcPrUgAYY1qD.png:large"
        },
        "fields": [
            {
                "name": "u.info (@user)",
                "value": "Получить информацию о вашем аккаунте или аккаунте пользователя"
            },
            {
                "name": "u.rename (ник)",
                "value": "Сменить ник"
            },
            {
                "name": "u.desc (Описание)",
                "value": "Добавить описание в профиль"       
            },
            {
                "name": "u.daily",
                "value": "Получить ежедневную награду"       
            },
            {
                "name": "u.top-(level, money)",
                "value": "Топ 10 пользователей"       
            }
        ]
        };
        message.author.send({ embed });   
    }

module.exports.help = {
    name: "help"
}