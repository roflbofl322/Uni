const Discord = module.require('discord.js');
const client = new Discord.Client();
var mysql = require('mysql');

module.exports.run = async (client, message, args) => 
{
    let memberInfo = message.mentions.members.first();
    if(!memberInfo) {
      con.query(`SELECT name, level FROM users WHERE userid = '${message.author.id}'`, function (err, rows) {
        if (err) throw err;
        console.log(rows);
        let nick = rows[0].name;
        let lvl = rows[0].level;
        var userinf = new Discord.RichEmbed()
            .setAuthor(message.author.username)
            .setThumbnail(message.author.avatarURL)
            .setDescription("Информация о вашем игроке")
            .setColor(0xff6633)
            .addField("Игровой ник:", nick)
            .addField("Уровень:", lvl)
            .addField("Дата создания вашего аккаунта:", message.author.createdAt)
        message.channel.send(userinf);
      });
    } else {
      con.query(`SELECT name, level FROM users WHERE userid = '${memberInfo.id}'`, function (err, rows) {
      if(rows.length < 1) {
        return message.reply("Пользователь не существует или отсутствует в базе данных.")  
      };
      let nick = rows[0].name;
      let lvl = rows[0].level;
      var userinfoo = new Discord.RichEmbed()
          .setAuthor(memberInfo.displayName)
          .setThumbnail(memberInfo.user.avatarURL)
          .setDescription("Информация о игроке")
          .setColor(0xff6633)
          .addField("Ник:", nick)
          .addField("Уровень:", lvl)
          .addField("Дата создания аккаунта:", memberInfo.user.createdAt)
          message.channel.send(userinfoo);
      });
    }
}

module.exports.help = {
    name: "info"
}