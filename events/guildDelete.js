const Discord = require('discord.js');
var mysql = require('mysql');

module.exports = (client, guild) => {
    let embed = new Discord.RichEmbed()
        .setTitle("Сервер удалён")
        .setColor(0xff6633)
        .setThumbnail("https://pbs.twimg.com/media/D2hMcPrUgAYY1qD.png:large")
        .addField(guild.name, `Количетсво участников ${guild.memberCount}`);
    uniguild.send(embed);

    con.query(`DELETE FROM guild WHERE guild_id = '${guild.id}'`, function (err, rows) {
        if(err) throw err;
    });
  }

console.log("GuildDelete подключён");