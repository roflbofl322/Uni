const Discord = module.require('discord.js');
const client = new Discord.Client();

module.exports.run = async (client, message, args) => {
    let embed = new Discord.RichEmbed()
      .setTitle("Пригласить бота на сервер")
      .setDescription("[Click](https://discordapp.com/oauth2/authorize?client_id=559409971083870223&scope=bot&permissions=8)")
      .setColor(0xff6633);
    message.author.send(embed);  
}

module.exports.help = {
    name: "invite"
}