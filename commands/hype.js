const Discord = module.require('discord.js');
var mysql = require('mysql');

module.exports.run = async (client, message, args) => {
    if(!args.join(" ")){
      return message.channel.send(":x: " + "| Введите название гильдии в которую вы хотите вступить")
    }

    con.query(`SELECT hype FROM users WHERE userid = '${message.author.id}'`, function (err, rows) {
        switch (args.join(" ")) {
            case "Bravery":
            con.query(`UPDATE users SET hype = 1 WHERE userid = '${message.author.id}'`, function (err, rows) {
              console.log(`Пользователь ${message.author.tag}, установил hype статус: ${args.join(" ")}.`);
              message.reply("Вы успешно вступили в Bravery")
            });
              break;
            case "Brilliance":
            con.query(`UPDATE users SET hype = 2 WHERE userid = '${message.author.id}'`, function (err, rows) {
              console.log(`Пользователь ${message.author.tag}, установил hype статус: ${args.join(" ")}.`);
              message.reply("Вы успешно вступили в Brilliance")
            });
              break;
            case "Balance":
            con.query(`UPDATE users SET hype = 3 WHERE userid = '${message.author.id}'`, function (err, rows) {
              console.log(`Пользователь ${message.author.tag}, установил hype статус: ${args.join(" ")}.`);
              message.reply("Вы успешно вступили в Balance")
            });
              break;
            default:
              message.reply("Такой гильдии не существует");
        }
    });
}

module.exports.help = {
    name: "hype"
}