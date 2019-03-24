const Discord = module.require('discord.js');
const client = new Discord.Client();

module.exports.run = async (client, message, args) => 
{
  let memberInfo = message.mentions.members.first();
  if(!memberInfo) {
    var userinf = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setThumbnail(message.author.avatarURL)
        .setDescription("Информация о вашем игроке")
        .setColor(0xFF0000)
        .addField("Nickname:", `${message.author.username}#${message.author.discriminator}`)
        .addField("Дата создания аккаунта:", message.author.createdAt)
        message.channel.send(userinf);

  } else {
    var userinfoo = new Discord.RichEmbed()
        .setAuthor(memberInfo.displayName)
        .setThumbnail(memberInfo.user.avatarURL)
        .setDescription("Информация о игроке")
        .setColor(0xFF0000)
        .addField("Nickname:", `${memberInfo.user.username}#${memberInfo.user.discriminator}`)
        .addField("Дата создания аккаунта:", memberInfo.user.createdAt)
        message.channel.send(userinfoo);
  }
}

module.exports.help = {
    name: "info"
}