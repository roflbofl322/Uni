const Discord = module.require('discord.js');

module.exports.run = async (client, message, args) => 
{
    con.query(`SELECT users.name, loc FROM users LEFT JOIN setting using(userid) WHERE userid = ?`, [message.author.id], async (err, rows) => {
        if(rows.length < 1) {
            return message.reply("Напишите команду ещё раз.")  
        };

        console.log(rows)
        console.log(err);
        switch (args.join(" ")) {
            case "arena":
            con.query(`UPDATE setting SET loc = 1 WHERE userid = '${message.author.id}'`, function (err, rows) {
                console.log(`Пользователь ${message.author.tag}, обновил приватность: ${args.join(" ")}.`);
              message.reply("Вы попали на древнюю арену гладиаторов!")
            });
              break;
            case "exit":
            con.query(`UPDATE setting SET loc = 0 WHERE userid = '${message.author.id}'`, function (err, rows) {
              console.log(`Пользователь ${message.author.tag}, обновил локацию: ${args.join(" ")}.`);
              message.reply("Вы приехали в город!")
            });
              break;
            default:
              message.reply("Что-то пошло не так, введите локацию ещё раз!");
        }
    });
}

module.exports.help = {
    name: "enter"
}