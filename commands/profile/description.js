const Discord = module.require('discord.js');
var mysql = require('mysql');

module.exports.run = async (client, message, args) => 
{
    con.query(`SELECT description FROM users WHERE userid = '${message.author.id}'`, async function (err, rows) {
        if(rows.length < 1) {
          return message.reply("Вы были зарегистрированы в базе данных, напишите команду ещё раз.")  
        };
        if (err) throw err;
        console.log(rows);
    });

    if(!args.join(" ")){
        return message.channel.send(":x: " + "| Введите желаемое описание")
    }

    if(args.join(" ").length >= 160) return message.reply("Максимальное количество символов: 160 (с учётом пробелов)");

    con.query(`UPDATE users SET description = '${args.join(" ")}'  WHERE userid = '${message.author.id}'`, function (err, rows) {
        console.log(`Пользователь ${message.author.tag}, сменинил описание на ${args.join(" ")}.`);
        message.reply("Вы успешно сменили описание")
    });
}

module.exports.help = {
    name: "desc"
}