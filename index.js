const Discord = require('discord.js');
const fs = require('fs') // подключаем fs к файлу
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const client = new Discord.Client();
client.discord = Discord;
const config = require('./config.json');
const uniguild = new Discord.WebhookClient(config.web_id, config.web_token);
//mysql
var mysql = require('mysql');

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

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

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
  if(message.channel.type === "dm") return;

  // sql reg
  con.query(`SELECT * FROM users WHERE userid = '${message.author.id}'`, function (err, rows) {
      if(err) throw err;

      var sql;
      if(rows.length < 1) {
        var sql = (`INSERT INTO users (userid, name) VALUES ('${message.author.id}', '${message.author.username}')`);
        con.query(sql, console.log);
        console.log(`Новый аккаунт: ${message.author.tag}`);
        return message.author.send("Вы получили доступ к игре, поздравляем `^-^`");
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

    con.query(`SELECT name, level, xp, money FROM users WHERE userid = '${message.author.id}'`, async function (err, rows) {
    let nick = rows[0].name;
    let lvl = rows[0].level;
    let xp = rows[0].xp;
    let money = rows[0].money;

      if(message.content === "test") {
        //con.query(`SELECT name, level FROM users WHERE userid = '${message.author.id}'`, function (err, rows) {
            //nick = rows[0].name;
            //lvl = rows[0].level;
            //if(err) throw err;
          //});
          const canvas = Canvas.createCanvas(1920, 1200);
          const ctx = canvas.getContext('2d');
        
          const background = await Canvas.loadImage('./wallpaper.png');
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
          //ctx.strokeStyle = '#74037b';
          //ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
          //ник
          ctx.font = applyText(canvas, `${message.author.username}`);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${nick}`, canvas.width / 10.0, canvas.height / 2.25);

          //level
          ctx.font = '220px sans-serif';
          ctx.fillStyle = '#f17556';
          ctx.fillText(`${lvl}`, canvas.width / 2.1, canvas.height / 2.2);

          //xp
          ctx.font = '70px sans-serif';
          ctx.fillStyle = '#f17556';
          ctx.fillText(`${xp}`, canvas.width / 1.475, canvas.height / 2.63);

          //money
          ctx.font = '70px sans-serif';
          ctx.fillStyle = '#f17556';
          ctx.fillText(`${money}`, canvas.width / 1.35, canvas.height / 2.2);

          //BOSS
          ctx.font = '70px sans-serif';
          ctx.fillStyle = '#f17556';
          ctx.fillText('0', canvas.width / 1.4, canvas.height / 1.87);

          ctx.beginPath();
          ctx.arc(420, 230, 140, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
        
          const { body: buffer } = await snekfetch.get(message.author.displayAvatarURL);
          const avatar = await Canvas.loadImage(buffer);
          ctx.drawImage(avatar, 270, 70, 300, 300);
        
          const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
          message.channel.send(attachment);
      }
    });

    let prefix = config.prefix
    if(!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(' ') // разделение пробелами
    let command = messageArray[0] // команда после префикса
    let args = messageArray.slice(1) // аргументы после команды

    let command_file = client.commands.get(command.slice(prefix.length)) // получение команды из коллекции
    if (command_file) command_file.run(client, message, args)
})

client.on("guildMemberAdd", (member) => {
  con.query(`SELECT * FROM users WHERE userid = '${member.id}'`, function (err, rows) {
    if(err) throw err;

    if(rows.length < 1) {
      var sql = (`INSERT INTO users (userid, name) VALUES ('${member.id}', '${member.username}')`);
      con.query(sql, console.log);
      console.log(`Новый аккаунт: ${member.tag}`);
    };

    if (err) throw err;
  });
});

client.on("guildCreate", guild => {
    let embed = new Discord.RichEmbed()
      .setTitle("Новый сервер")
      .setColor(0xff6633)
      .setThumbnail("https://pbs.twimg.com/media/D2hMcPrUgAYY1qD.png:large")
      .addField(guild.name, `Количетсво участников ${guild.memberCount}`);
    uniguild.send(embed);  

    con.query(`SELECT * FROM guild WHERE guild_id = '${guild.id}'`, function (err, rows) {
      if(err) throw err;

      var sql;
      if(rows.length < 1) {
        var sql = (`INSERT INTO guild (guild_id, guild_name) VALUES ('${guild.id}', '${guild.name}')`);
        con.query(sql, console.log);
        console.log(`Новый сервер: ${guild.name}`);
      };

      if (err) throw err;
    });

    });
  

client.on("guildDelete", guild => {
  let embed = new Discord.RichEmbed()
    .setTitle("Сервер удалён")
    .setColor(0xff6633)
    .setThumbnail("https://pbs.twimg.com/media/D2hMcPrUgAYY1qD.png:large")
    .addField(guild.name, `Количетсво участников ${guild.memberCount}`);
  uniguild.send(embed);

  con.query(`DELETE FROM guild WHERE guild_id = '${guild.id}'`, function (err, rows) {
    if(err) throw err;
  }); 
});

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
