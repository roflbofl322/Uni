const Discord = require("discord.js");
const client = new Discord.Client();
var mysql = require('mysql');

module.exports.run = async (bot, message, args) => {
    
    con.query(`SELECT userid, money FROM users ORDER BY money DESC LIMIT 5`, (err, res) => {
        var embed = new Discord.RichEmbed()
          .setAuthor(`Таблица лидеров`, message.guild.iconURL)
          .setColor(0xff6633);
        res.forEach((item, i) => {
            if(!client.users.get(item.userid)) client.fetchUser(item.userid)
            if (item.money != 0) embed.addField(`${i}. ${client.users.get(item.userid)}`, item.money);
            console.log(item.userid);
        })
        message.channel.send({embed});
    });
}

module.exports.help = {
    name: "top"
}