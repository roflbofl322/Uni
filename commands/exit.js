const Discord = module.require('discord.js');

module.exports.run = async (client, message, args) => 
{
    con.query(`SELECT users.name, loc FROM users LEFT JOIN setting using(userid) WHERE userid = ?`, [message.author.id], async (err, rows) => {
        if(rows.length < 1) {
            return message.reply("Напишите команду ещё раз.")  
        };

        console.log(rows)
        console.log(err);
        con.query(`UPDATE setting SET loc = 0 WHERE userid = '${message.author.id}'`, function (err, rows) {
            console.log(`Пользователь ${message.author.tag}, обновил локацию: 0.`);
            message.reply("Вы вернулись обратно в город!")
        });
    });
}

module.exports.help = {
    name: "exit"
}