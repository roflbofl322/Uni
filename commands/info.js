const Discord = module.require('discord.js');
const client = new Discord.Client();
var mysql = require('mysql');

module.exports.run = async (client, message, args) => 
{
  con.query(`SELECT name FROM users WHERE userid = '${message.author.id}'`, function (err, rows) {
    if (err) throw err;
    console.log(rows[0]);
    let memberInfo = message.mentions.members.first();
    if(!memberInfo) {
      var userinf = new Discord.RichEmbed()
          .setAuthor(message.author.username)
          .setThumbnail(message.author.avatarURL)
          .setDescription("Информация о вашем игроке")
          .setColor(0xff6633)
          .addField("Игровой ник:", `${rows[0]}`)
          .addField("Дата создания вашего аккаунта:", message.author.createdAt)
          message.channel.send(userinf);

    } else {
      var userinfoo = new Discord.RichEmbed()
          .setAuthor(memberInfo.displayName)
          .setThumbnail(memberInfo.user.avatarURL)
          .setDescription("Информация о игроке")
          .setColor(0xff6633)
          .addField("Ник игрока:", `${memberInfo.user.username}#${memberInfo.user.discriminator}`)
          .addField("Дата создания аккаунта:", memberInfo.user.createdAt)
          message.channel.send(userinfoo);
    }
  });
}

module.exports.help = {
    name: "info"
}