const Discord = module.require('discord.js');
var mysql = require('mysql');

module.exports.run = async (client, message, args) => {
    con.query(`SELECT hype FROM users WHERE userid = '${message.author.id}'`, function (err, rows) {
        let hype = rows[0].hype;
        switch (hype) {
            case "1":
            message.reply( 'Bravery' );
              break;
            case "2":
            message.reply( 'Brilliance!' );
              break;
            case "3":
            message.reply( 'Balance' );
              break;
            default:
              message.reply( 'Вы не состоите в гильдии' );
        }
        console.log(hype)
    });
}

module.exports.help = {
    name: "hype"
}