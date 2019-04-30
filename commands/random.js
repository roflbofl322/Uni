const Discord = module.require('discord.js');

module.exports.run = async (client, message, args) => {
    let dice = [ 1, 2, 3, 4, 5, 6 ];
    let a_rand = dice[Math.floor(Math.random() * dice.length)];
    message.reply("Число: " + a_rand)
}

module.exports.help = {
    name: "random"
}