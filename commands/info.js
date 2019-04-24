const Discord = module.require('discord.js');
const Canvas = require('canvas');
const snekfetch = require('snekfetch');
const { Attachment } = require('discord.js');

const talkedRecently = new Set();
const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');
	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

module.exports.run = async (client, message, args ) => 
{
    if (talkedRecently.has(message.author.id)) {
        message.reply("Профиль можно посмотреть раз в 1 минуту");
    } else {
      let memberInfo = message.author;
      if(message.mentions.users.first()) memberInfo = message.mentions.users.first();
      con.query(`SELECT users.name, level, xp, money, description, background, locks FROM users LEFT JOIN setting using(userid) WHERE userid = ?`, [memberInfo.id], async (err, rows) => {
        console.log(err);
        if(rows.length < 1) {
          return message.reply("Вы были зарегистрированы в базе данных, напишите команду ещё раз.")  
        };
        if (err) throw err;
        console.log(rows);

        let nick = rows[0].name;
        let lvl = rows[0].level;
        let xp = rows[0].xp;
        let lock = rows[0].locks;
        let money = rows[0].money;
        let description = rows[0].description;
        let progress = (xp / (1000+100*lvl))*100;

        const canvas = Canvas.createCanvas(1920, 1200);
        const ctx = canvas.getContext('2d');

        if(lock == 1) {
          if(message.author.id != memberInfo.id) {
            const attachment = new Attachment('./profile/lock.png');
            message.channel.send(attachment);
            return;
          }
        }
        
        let background = rows[0].background;
        if(background > 0)
        {
          const bg1_profile = await Canvas.loadImage(`./profile/bg/${background}.png`);
          ctx.drawImage(bg1_profile, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 0.9;
        }


        // 1 прямоугольник
        ctx.save();

        ctx.beginPath();
        ctx.rect(150, 20, 600, 1160);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.clip();

        ctx.beginPath();
        ctx.rect(150, 1100, progress*6, 90);
        ctx.closePath();
        ctx.fillStyle = '#f17556';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(150, 453, 700, 110);
        ctx.closePath();
        ctx.fillStyle = '#f17556';
        ctx.fill();

        ctx.restore();

        ctx.beginPath();
        ctx.rect(780, 20, 930, 300);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(780, 350, 930, 370);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.beginPath();
        ctx.rect(780, 750, 930, 430);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();
        
        //значки
        /*
        con.query(`SELECT slot_1, slot_2, slot_3, slot_4, slot_5, slot_6, slot_7, slot_8, slot_9 FROM badge WHERE userid = ?`, [memberInfo.id], async (err, rows) => {
          let slot_1 = rows[0].slot_1;
          let slot_2 = rows[0].slot_2;
          let slot_3 = rows[0].slot_3;
          let slot_4 = rows[0].slot_4;
          let slot_5 = rows[0].slot_5;
          let slot_6 = rows[0].slot_6;
          let slot_7 = rows[0].slot_7;
          let slot_8 = rows[0].slot_8;
          let slot_9 = rows[0].slot_9;
          console.log(err);
          let badge = await Canvas.loadImage('./profile/badge/lvl/1.png');
          // 1 ряд значков
          ctx.drawImage(badge, 185, 580, 165, 165);
          ctx.drawImage(badge, 380, 580, 165, 165);
          ctx.drawImage(badge, 575, 580, 165, 165);

          ctx.drawImage(badge, 185, 753, 165, 165);
          ctx.drawImage(badge, 380, 753, 165, 165);
          ctx.drawImage(badge, 575, 753, 165, 165);

          ctx.drawImage(badge, 185, 925, 165, 165);
          ctx.drawImage(badge, 380, 925, 165, 165);
          ctx.drawImage(badge, 575, 925, 165, 165);
        });
        */

        //ник
        ctx.font = '70px Arial';
        ctx.fillStyle = '#fff';
        if(nick.length > 13) {
          let nick_l = nick.substr(0, 13) + "...";
          ctx.fillText(`${nick_l}`, canvas.width / 10.0, canvas.height / 2.25);
        }
        else {
          ctx.fillText(`${nick}`, canvas.width / 10.0, canvas.height / 2.25); 
        }

        //level
        ctx.font = '200px sans-serif';
        ctx.fillStyle = '#f17556';
        ctx.fillText(`${lvl}`, canvas.width / 2.1, canvas.height / 2.2);
        ctx.font = '120px sans-serif';
        ctx.fillStyle = '#f17556';
        ctx.fillText("LEVEL", 800, 680);


        //xp
        ctx.font = '70px sans-serif';
        ctx.fillStyle = '#f17556';
        ctx.fillText(`XP:${xp} / ${1000+100*lvl}`, 1200, 455);

        //money
        ctx.font = '70px sans-serif';
        ctx.fillStyle = '#f17556';
        ctx.fillText(`Money: ${money}`, 1200, canvas.height / 2.2);

        //BOSS
        ctx.font = '70px sans-serif';
        ctx.fillStyle = '#f17556';
        ctx.fillText("Power: 0", 1200, canvas.height / 1.87);
        
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
        ctx.arc(460, 230, 140, 0, Math.PI * 2, true);
        ctx.closePath(); 
        ctx.clip();
      
        const { body: buffer } = await snekfetch.get(memberInfo.displayAvatarURL);
        const avatar = await Canvas.loadImage(buffer);
        ctx.drawImage(avatar, 320, 90, 280, 280);

        ctx.restore();
        ctx.beginPath();
        ctx.arc(550, 330, 35, 0, Math.PI*2, false);
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
        ctx.lineWidth = 10; //толщина 5px
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