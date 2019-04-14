const Discord = module.require('discord.js');
var mysql = require('mysql');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');

const talkedRecently = new Set();
const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

module.exports.run = async (client, message, args) => 
{
    if (talkedRecently.has(message.author.id)) {
        message.reply("Профиль можно посмотреть раз в 1 минуту");
    } else {
      let memberInfo = message.author;
      if(message.mentions.users.first()) memberInfo = message.mentions.users.first();
      con.query(`SELECT name, level, xp, money, description, hype FROM users WHERE userid = '${memberInfo.id}'`, async function (err, rows) {
        if(rows.length < 1) {
          return message.reply("Вы были зарегистрированы в базе данных, напишите команду ещё раз.")  
        };
        if (err) throw err;
        console.log(rows);

        let nick = rows[0].name;
        let lvl = rows[0].level;
        let xp = rows[0].xp;
        let money = rows[0].money;
        let description = rows[0].description;

        const canvas = Canvas.createCanvas(1920, 1200);
        const ctx = canvas.getContext('2d');
      
        const background = await Canvas.loadImage('./wallpaper.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      
        //hype
        let hype = rows[0].hype;
        let balance = await Canvas.loadImage('./profile/balance.png');
        let bravery = await Canvas.loadImage('./profile/bravery.png');
        let briliance = await Canvas.loadImage('./profile/briliance.png');
        switch (hype) {
            case "1":
                ctx.drawImage(bravery, 860, 80, 170, 170);
                ctx.font = '150px sans-serif';
                ctx.fillStyle = '#9C84EF';
                ctx.fillText("Bravery", 1100, 200);
              break;
            case "2":
                ctx.drawImage(briliance, 860, 80, 170, 170);
                ctx.font = '150px sans-serif';
                ctx.fillStyle = '#F47B67';
                ctx.fillText("Briliance", 1100, 210);
              break;
            case "3":
                ctx.drawImage(balance, 860, 80, 170, 170);
                ctx.font = '150px sans-serif';
                ctx.fillStyle = '#45DDC0';
                ctx.fillText("Balance", 1100, 210);
              break;
        }

        //ник
        ctx.font = '70px Arial';
        ctx.fillStyle = '#ffffff';
        if(nick.length > 13) {
          let nick_l = nick.substr(0, 13) + "...";
          ctx.fillText(`${nick_l}`, canvas.width / 10.0, canvas.height / 2.25);
        }
        else {
          ctx.fillText(`${nick}`, canvas.width / 10.0, canvas.height / 2.25); 
        }

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
        
        function wrapText(ctx, text, marginLeft, marginTop, maxWidth, lineHeight)
        {
            var words = text.split(" ");
            var countWords = words.length;
            var line = "";
            for (var n = 0; n < countWords; n++) {
                var testLine = line + words[n] + " ";
                var testWidth = ctx.measureText(testLine).width;
                if (testWidth > maxWidth) {
                  ctx.fillText(line, marginLeft, marginTop);
                    line = words[n] + " ";
                    marginTop += lineHeight;
                }
                else {
                    line = testLine;
                }
            }
            ctx.fillText(line, marginLeft, marginTop);
        }
        var maxWidth = 900; //размер поле, где выводится текст
        var lineHeight = 60;
        /*если мы знаем высоту текста, то мы можем
          предположить, что высота строки должна быть именно такой*/
        var marginLeft = canvas.width / 2.3;
        var marginTop = canvas.height / 1.4;
        var text = description;
        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#f17556';
        wrapText(ctx, text, marginLeft, marginTop, maxWidth, lineHeight);

        ctx.save();
        ctx.beginPath();
        ctx.arc(420, 230, 140, 0, Math.PI * 2, true);
        ctx.closePath(); 
        ctx.clip();
      
        const { body: buffer } = await snekfetch.get(memberInfo.displayAvatarURL);
        const avatar = await Canvas.loadImage(buffer);
        ctx.drawImage(avatar, 270, 70, 300, 300);

        ctx.restore();
        ctx.beginPath();
        ctx.arc(495, 356, 35, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.strokeStyle = "white";
        let stat = memberInfo.presence.status;
        switch (stat) {
          case "online":
            ctx.fillStyle = "#00AA4C";
            break;
          case "dnd":
            ctx.fillStyle = "#9C0000";
            break;
          case "idle":
            ctx.fillStyle = "#F7C035";
            break;
          default:
            ctx.fillStyle = "#484d48";
        }
        ctx.fill();
        ctx.stroke();

        const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
        message.channel.send(attachment);
    });
    talkedRecently.add(message.author.id);
    setTimeout(() => {
      // Removes the user from the set after a minute
      talkedRecently.delete(message.author.id);
    }, 60000);
}
}

module.exports.help = {
    name: "info"
}