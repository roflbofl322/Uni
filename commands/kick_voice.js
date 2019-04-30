const configSyntaxis = "[описание]";
const configPerms = null;

module.exports.run = async (client, message, args) => {
    const uni_guild = client.guilds.get(message.guild.id);
    //console.log(uni_guild);
    const my_channel = uni_guild.channels.get(message.member.voiceChannel.id);
    //console.log(my_channel);
    const permissions = my_channel.memberPermissions(message.author);
    if (permissions.hasPermissions("MANAGE_CHANNELS") === false) return message.reply("Недостаточно прав")

    const member = message.mentions.members.first();
    if (!member) return message.reply('Вы должны указать пользователя (пример: `@name`).');
    if (!member.voiceChannel) return message.reply('Данный пользователь не находится в голосовом канале.');
    //if (message.author.id == member.id) return message.reply("Вы не можете кикнуть себя")
    my_channel.overwritePermissions(member, { CONNECT: false });
    if (member.voiceChannel.id !== message.member.voiceChannel.id) return message.reply("Пользователь находится в другом голосовом канале");
    console.log(member.voiceChannel.id + ", " + message.member.voiceChannel.id)
    const temp_channel = await message.guild.createChannel(member.id, 'voice', [
    { id: message.guild.id,
        deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'], },
    { id: member.id,
        deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] }
    ]);
    await member.setVoiceChannel(temp_channel);

    await temp_channel.delete();

    message.react('👍');
}

module.exports.config = {

  cmd: "кик",
  aliases: [],
  description: "",
  syntaxis: configSyntaxis,
  examples: [],
  perms: configPerms
};