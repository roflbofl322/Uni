const Discord = module.require('discord.js');

module.exports.run = async (client, messageы) => 
{
    con.query(`SELECT users.name, loc FROM users LEFT JOIN setting using(userid) WHERE userid = ?`, [message.author.id], async (err, rows) => {
        if(rows.length < 1) {
            return message.reply("Напишите команду ещё раз.")  
        };
        message.reply("Ваша локация на данный момент: " + location[rows[0].loc]);
        console.log(rows)
        console.log(err);
    });
}

module.exports.help = {
    name: "loc"
}