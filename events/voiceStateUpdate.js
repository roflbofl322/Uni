const Discord = require('discord.js');

module.exports = (client, oldMember, newMember) => {
    if(oldMember.voiceChannel === undefined && newMember.voiceChannel !== undefined){
        console.log("--enter--")
        console.log(newMember.user.username);      
    }
    else if(newMember.voiceChannel === undefined){
        console.log("exit")
        console.log(newMember.user.username)

   }
}

console.log("voice update подключён");