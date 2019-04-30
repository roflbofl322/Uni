const Discord = module.require('discord.js');
const talkedAttack = new Set();

module.exports.run = async (client, message, args) => 
{
    con.query(`SELECT users.name, attack, loc FROM users LEFT JOIN setting using(userid) WHERE userid = ?`, [message.author.id], async (err, rows) => {
        if (talkedAttack.has(message.author.id)) {
            message.reply("Атаковать можно раз в 5 секунд");
        } else {    
            if(rows.length < 1) {
                return message.reply("Напишите команду ещё раз.");  
            };
            console.log(rows)
            console.log(err);
            let name = rows[0].name;
            let attack = rows[0].attack;
            let defender;
            if(rows[0].loc != 1) return message.reply("Вы не можете атаковать игрока вне арены, используйте команду u.enter arena");
            if(message.mentions.users.first()) defender = message.mentions.users.first();
            if(message.author.id == defender) return message.reply("Зачем тебе себе атаковать ?!")
            if(!defender) return message.channel.send("Не могу найти данного пользователя.");
            con.query(`SELECT users.name, defence, hp, loc FROM users LEFT JOIN setting using(userid) WHERE userid = ?`, [defender.id], async (err, result) => {
                if(result.length < 1) {
                    return message.reply("Пользователь не найден.")  
                };
                
                if(result[0].loc != 1) return message.reply("Данный пользователь находится вне зоны арены");
                let name_def = result[0].name;
                let hp = result[0].hp;
                let defence = result[0].defence;
                if(defence >= attack)
                {
                    hp--;
                } else {
                    //if hp after attack == 0 ?
                    let a_attack = [ 1, 2, 3, 4, 5, 6 ];
                    let a_rand = a_attack[Math.floor(Math.random() * a_attack.length)];
                    let a_def = [ 1, 2, 3, 4, 5, 6 ];
                    let def_rand = a_def[Math.floor(Math.random() * a_def.length)];
                    hp = hp - (attack*a_rand - defence*def_rand);
                    console.log(hp);
                }
                if(hp > 0)
                {
                    con.query(`UPDATE users SET hp = ? WHERE userid = ?`, [hp, defender.id], async (err) => {
                    })
                    message.channel.send(`Пользователь ${name} атаковал пользователя ${name_def} и у него осталось ${hp} здоровья`)
                }
                else {
                    message.channel.send(`Пользователь: ${message.author.username}, убивает игрока: ${name_def} и получает 1000 uni-coin из его копилки`)
                    con.query(`UPDATE users SET hp = ?, money = money - 1000 WHERE userid = ?`, [100, defender.id], async (err) => {
                    })
                    con.query(`UPDATE users SET money = money + 1000, kill = kill + 1 WHERE userid = ?`, [message.author.id], async (err) => {
                    })

                }
                console.log(err);
            });
        }
        talkedAttack.add(message.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedAttack.delete(message.author.id);
        }, 5000);
    });
}

module.exports.help = {
    name: "attack"
}