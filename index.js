const Discord = require('discord.js');
const fs = require('fs') // подключаем fs к файлу
const client = new Discord.Client();
client.discord = Discord;
const config = require('./config.json');


client.login(config.token)
client.on('ready', () => {
  client.user.setPresence({
    game: { 
        name: 'u.help',
        type: 'WATCHING'
    },
    status: 'online'
  })
  console.log(`Бот работает под ником: ${client.user.tag}!`);
});

client.commands = new Discord.Collection() // создаём коллекцию для команд

fs.readdir('./commands', (err, files) => { // чтение файлов в папке commands
    if (err) console.log(err)

    let jsfile = files.filter(f => f.split('.').pop() === 'js') // файлы не имеющие расширение .js игнорируются
    if (jsfile.length <= 0) return console.log('Команды не найдены!') // если нет ни одного файла с расширением .js

    console.log(`Loaded ${jsfile.length} commands`)
    jsfile.forEach((f, i) => { // добавляем каждый файл в коллекцию команд
        let props = require(`./commands/${f}`)
        client.commands.set(props.help.name, props)
    })
})

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.on('message', async message => {
    if(message.author.bot) return;
    let prefix = config.prefix
    if(!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(' ') // разделение пробелами
    let command = messageArray[0] // команда после префикса
    let args = messageArray.slice(1) // аргументы после команды

    let command_file = client.commands.get(command.slice(prefix.length)) // получение команды из коллекции
    if (command_file) command_file.run(client, message, args)
})

client.on("guildMemberAdd", (member) => {
});

client.on("guildCreate", guild => {
  guild.leave();
});
  

client.on("guildDelete", guild => {
  console.log("Меня пытались пригласить")
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
