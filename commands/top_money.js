const Discord = require("discord.js");
const client = new Discord.Client();
var mysql = require('mysql');

module.exports.run = async (client, message, args) => {
    con.query(`SELECT userid, money, level FROM users ORDER BY money DESC LIMIT 10`, (err, res) => {
        var embed = new Discord.RichEmbed()
            .setAuthor(`Uni`, message.guild.iconURL)
            .setColor(0xff6633)
            .addField("Таблица лидеров", "По игровой валюте");
            res.forEach((item, i) => {
                if (item.money != 0) embed.addField(`${i}. ${client.users.get(item.userid).tag}`, item.money)
            })
        message.channel.send({embed});
    });
}

module.exports.help = {
    name: "top-money"
}