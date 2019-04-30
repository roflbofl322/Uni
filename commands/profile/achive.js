const Discord = module.require('discord.js');

module.exports.run = async (client, message, args) => 
{
    await message.channel.send('Выберите слот (1-9)')
    const collector = message.channel.createMessageCollector(m => m.author.id == message.author.id, {max:  1, time: 60000})

    collector.on('collect', async msg => {
        if(msg.content >= 1 && msg.content <= 9) {
            let slot = msg.content;
            await message.reply("Введи id значка")
            collector.on('end', async () => {
                await console.log(" 1 сборщик офнулся");
            })
            const collector_2 = message.channel.createMessageCollector(m => m.author.id == message.author.id, {max: 1, time: 60000})

            collector_2.on('collect', async msg => {
                if(msg.content >= 1 && msg.content <= 5) {
                    let badge = msg.content;
                    let slot_result = `slot_`+slot;
                    con.query(`UPDATE badge SET ?? = ? WHERE userid = ?`, [slot_result, badge, msg.author.id], async (err, rows) => {
                        console.log(err)
                        console.log(rows)
                        console.log(`Пользователь ${message.author.tag}, добавил значок: ${badge}, ${slot}.`);
                        message.reply("Вы установили значок!")
                    });
                }
            })
        
            collector_2.on('end', async () => {
                await console.log('Сборщик 1 отключен')
            })
        }
        else {
            return message.reply("Вы ввели не правильное значение")
        }
    })
}

module.exports.help = {
    name: "achive"
}