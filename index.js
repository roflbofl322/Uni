const Discord = require('discord.js');
const fs = require('fs') // подключаем fs к файлу
const client = new Discord.Client();
client.discord = Discord;
const config = require('./config.json');
const uniguild = new Discord.WebhookClient(config.web_id, config.web_token);
//mysql
var mysql = require('mysql');

var con = mysql.createConnection({
  host: config.myslq_host,
  user: config.myslq_user,
  password: config.myslq_password,
  database: config.myslq_database,
  insecureAuth : true
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO players (name, address) VALUES ('532196405612380171', '1')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

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
    let embed = new Discord.RichEmbed()
      .setTitle("Новый сервер")
      .setColor(0xff6633)
      .setThumbnail("https://pbs.twimg.com/media/D2hMcPrUgAYY1qD.png:large")
      .addField(guild.name, `Количетсво участников ${guild.memberCount}`);
    uniguild.send(embed);  
    });
  

client.on("guildDelete", guild => {
  let embed = new Discord.RichEmbed()
    .setTitle("Сервер удалён")
    .setColor(0xff6633)
    .setThumbnail("https://pbs.twimg.com/media/D2hMcPrUgAYY1qD.png:large")
    .addField(guild.name, `Количетсво участников ${guild.memberCount}`);
  uniguild.send(embed);  
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
