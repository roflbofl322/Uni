const Discord = require('discord.js');
var mysql = require('mysql');

module.exports = (client, guild) => {
    let embed = new Discord.RichEmbed()
      .setTitle("Новый сервер")
      .setColor(0xff6633)
      .setThumbnail("https://pbs.twimg.com/media/D2hMcPrUgAYY1qD.png:large")
      .addField(guild.name, `Количетсво участников ${guild.memberCount}`);
    uniguild.send(embed);  

    con.query(`SELECT * FROM guild WHERE guild_id = '${guild.id}'`, function (err, rows) {
      if(err) throw err;

      var sql;
      if(rows.length < 1) {
        var sql = (`INSERT INTO guild (guild_id, guild_name) VALUES ('${guild.id}', '${guild.name}')`);
        con.query(sql, console.log);
        console.log(`Новый сервер: ${guild.name}`);
      };

      if (err) throw err;
    });
  }

console.log("GuildCreate подключён");
