const Discord = module.require('discord.js');
const client = new Discord.Client();
var mysql = require('mysql');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
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
    let memberInfo = message.mentions.members.first();
    if(!memberInfo) {
      con.query(`SELECT name, level, xp, money, description FROM users WHERE userid = '${message.author.id}'`, async function (err, rows) {
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

        //Description
        //ctx.font = '50px sans-serif';
        //ctx.fillStyle = '#f17556';
        //ctx.fillText(`${description}`, canvas.width / 2.3, canvas.height / 1.4);
        
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

        ctx.beginPath();
        ctx.arc(420, 230, 140, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
      
        const { body: buffer } = await snekfetch.get(message.author.displayAvatarURL);
        const avatar = await Canvas.loadImage(buffer);
        ctx.drawImage(avatar, 270, 70, 300, 300);
      
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
        message.channel.send(attachment);
      });
    } else {
      con.query(`SELECT name, level, xp, money FROM users WHERE userid = '${memberInfo.id}'`, async function (err, rows) {
        if(rows.length < 1) {
          return message.reply("Пользователь не существует или отсутствует в базе данных.")  
        };
        let nick = rows[0].name;
        let lvl = rows[0].level;
        let xp = rows[0].xp;
        let money = rows[0].money;
        let description = rows[0].description;

        const canvas = Canvas.createCanvas(1920, 1200);
        const ctx = canvas.getContext('2d');
      
        const background = await Canvas.loadImage('./wallpaper.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      
        //ctx.strokeStyle = '#74037b';
        //ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
        //ник
        ctx.font = '70px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${nick}`, canvas.width / 10.2, canvas.height / 2.25);

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

        function wrapTexts(ctx, description, marginLeft, marginTop, maxWidth, lineHeight)
        {
            var words = description.split(" ");
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
        ctx.font = '50px sans-serif';
        ctx.fillStyle = '#f17556';
        wrapTexts(ctx, description, marginLeft, marginTop, maxWidth, lineHeight);

        ctx.beginPath();
        ctx.arc(420, 230, 140, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
      
        const { body: buffer } = await snekfetch.get(memberInfo.user.displayAvatarURL);
        const avatar = await Canvas.loadImage(buffer);
        ctx.drawImage(avatar, 270, 70, 300, 300);
      
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'profile.png');
        message.channel.send(attachment);
      });
    }
}

module.exports.help = {
    name: "info"
}