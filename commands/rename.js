const Discord = module.require('discord.js');
var mysql = require('mysql');

module.exports.run = async (client, message, args) => {
    if(!args.join(" ")){
        return message.channel.send(":x: " + "| Введите желаемый ник")
    }
    con.query(`UPDATE users SET name = '${args.join(" ")}'  WHERE userid = '${message.author.id}'`, function (err, rows) {
        console.log(`Пользователь ${message.author.tag}, сменинил свой ник на ${args.join(" ")}.`);
        message.reply("Вы успешно сменили свой ник")
    });
}

module.exports.help = {
    name: "rename"
}