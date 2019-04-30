const Discord = module.require('discord.js');
var mysql = require('mysql');
const talkedRecently = new Set();

module.exports.run = async (client, message, args) => {
    if (talkedRecently.has(message.author.id)) {
        message.reply("Данную команду можно прописывать раз в день");
    } else {
        con.query(`UPDATE users SET money = money + 100  WHERE userid = '${message.author.id}'`, function (err, rows) {
            console.log(`Пользователь ${message.author.tag}, получил ежедневную награду.`);
            message.reply("Поздравляем, вы получили ежедневную награду");
        });
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      // Removes the user from the set after a minute
      talkedRecently.delete(message.author.id);
    }, 86400000);
}
}

module.exports.help = {
    name: "daily"
}