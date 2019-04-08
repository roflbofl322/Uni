const Discord = require('discord.js');
var mysql = require('mysql');

module.exports = (client, member) => {
    con.query(`SELECT * FROM users WHERE userid = '${member.id}'`, function (err, rows) {
        if(err) throw err;
    
        if(rows.length < 1) {
          var sql = (`INSERT INTO users (userid, name) VALUES ('${member.id}', '${member.username}')`);
          con.query(sql, console.log);
          console.log(`Новый аккаунт: ${member.tag}`);
        };
    
        if (err) throw err;
      });
  }

console.log("GuildMember подключён");