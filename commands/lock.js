const Discord = module.require('discord.js');

module.exports.run = async (client, message, args) => {
    if(!args.join(" ")){
      return message.channel.send(":x: " + "| Введите `lock` или `unlock`, для настройки приватности профиля")
    }

    con.query(`SELECT hype FROM users WHERE userid = '${message.author.id}'`, function (err, rows) {
        switch (args.join(" ")) {
            case "unlock":
            con.query(`UPDATE setting SET locks = 0 WHERE userid = '${message.author.id}'`, function (err, rows) {
                console.log(`Пользователь ${message.author.tag}, обновил приватность: ${args.join(" ")}.`);
              message.reply("Теперь ваш профиль могут смотреть другие пользователи!")
            });
              break;
            case "lock":
            con.query(`UPDATE setting SET locks = 1 WHERE userid = '${message.author.id}'`, function (err, rows) {
              console.log(`Пользователь ${message.author.tag}, обновил приватность: ${args.join(" ")}.`);
              message.reply("Теперь профиль отображается только для вас!")
            });
              break;
            default:
              message.reply("Что-то пошло не так, введите значение ещё раз!");
        }
    });
}

module.exports.help = {
    name: "priv"
}