const Discord = require('discord.js');
const fs = require('fs') // подключаем fs к файлу
const snekfetch = require('snekfetch');
const client = new Discord.Client();
client.discord = Discord;
config = require('./config.json');
uniguild = new Discord.WebhookClient(config.web_id, config.web_token);
location = ["Город", "Арена", "точка пиздец"];

//mysql
mysql = require('mysql');

con = mysql.createConnection({
  host: config.myslq_host,
  user: config.myslq_user,
  password: config.myslq_password,
  database: config.myslq_database,
  charset : 'utf8mb4',
  insecureAuth : true
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
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

// 123
client.commands = new Discord.Collection() // создаём коллекцию для команд

fs.readdir('./commands', (err, files) => { // чтение файлов в папке commands
  if (err) console.log(err)

  files.forEach((element,iterator) => 
  {
      //check if element is a folder ? 
      //YES: -> open it and assign all js files to 'jsfiles' variable
      //NO:  -> assign js file to 'jsfiles' variable
      if(!element.includes("."))
      {
          fs.readdir(`./commands/${element}`,(err,sub_files)=>{
              sub_files.forEach((elem,iterator)=>{
                  let props = require(`./commands/${element}/${elem}`);
                  client.commands.set(props.help.name, props);
              })
          }) 
      }
      else
      {
              let props = require(`./commands/${element}`);
           client.commands.set(props.help.name, props);
      }   
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
  if(message.channel.type === "dm") return message.reply("Извините, но я не отвечаю на личные сообщения `^-^`");
  // sql reg
  con.query(`SELECT * FROM users WHERE userid = '${message.author.id}'`, function (err, rows) {
      if(err) throw err;

      var sql;
      if(rows.length < 1) {
        var sql = (`INSERT INTO users (userid, name) VALUES ('${message.author.id}', '${message.author.username}')`);
        con.query(sql, console.log);
        var setting = (`INSERT INTO setting (userid, name) VALUES ('${message.author.id}', '${message.author.username}')`);
        con.query(setting, console.log);
        var badge = (`INSERT INTO badge (userid, name) VALUES ('${message.author.id}', '${message.author.username}')`);
        con.query(badge, console.log);
        console.log(`Новый аккаунт: ${message.author.tag}`);
        return;
      };

      // sql give xp
      con.query(`UPDATE users SET xp = xp + 10 WHERE userid = '${message.author.id}'`, function (err, rows) {
        if(err) throw err;
      });
    
      // sql if_xp
      con.query(`SELECT name, level, xp FROM users WHERE userid = '${message.author.id}'`, function (err, rows) {
        let xp = rows[0].xp;
        let lvl = rows[0].level;
        if(xp >= 1000+100*lvl) {
          con.query(`UPDATE users SET level = level + 1  WHERE userid = '${message.author.id}'`, function (err, rows) {
            message.reply("Вы получили новый уровень");
          });
          con.query(`UPDATE users SET xp = 0 WHERE userid = '${message.author.id}'`, function (err, rows) {
            console.log(`${message.author.username}, получил новый уровень и обнулил xp`);
          });
        }
      });

      if (err) throw err;
    });

    let prefix = config.prefix
    if(!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(' ') // разделение пробелами
    let command = messageArray[0] // команда после префикса
    let args = messageArray.slice(1) // аргументы после команды

    let command_file = client.commands.get(command.slice(prefix.length)) // получение команды из коллекции
    if (command_file) command_file.run(client, message, args)
})

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));