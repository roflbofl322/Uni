const Discord = require('discord.js');

module.exports = (client, member) => {
    con.query(`SELECT * FROM users WHERE userid = '${member.id}'`, function (err, rows) {
        if(err) throw err;
    
        if(rows.length < 1) {
          var sql = (`INSERT INTO users (userid, name) VALUES ('${member.id}', '${member.user.username}')`);
          con.query(sql, console.log);
          var setting = (`INSERT INTO setting (userid, name) VALUES ('${member.id}', '${member.user.username}')`);
          con.query(setting, console.log);
          console.log(`Новый аккаунт: ${member.user.tag} (member.add)`);
        };
    
        if (err) throw err;
      });
  }

console.log("GuildMember подключён");