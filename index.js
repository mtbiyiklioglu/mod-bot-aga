const Discord = require('discord.js');
const bot = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;


bot.on('ready' , () => {
    console.log(bot.user.username + ' ' + 'hazır!');
});

// -- Hazır Komutlar -- \\
var slm = ["merhaba" , "slm" , "selam" , "sa"]

bot.on('message' , msg=>{

    for (let index = 0; index < slm.length; index++) {
        const element = slm[index];
        if(msg.content === prefix + element){
            msg.reply('Merhaba!')
            .then(() => console.log(`${msg.author.username} kullanıcısına merhaba`))
            .catch(console.error);
        }
        
    }
    if(msg.content === prefix + 'atış') {
        let rdOutput = Math.floor((Math.random() * 3) + 1);
        if(rdOutput == 1) {
            msg.channel.send(`Headshot - Tebrikler, ${msg.author}`)
        }
        if(rdOutput == 2) {
            msg.channel.send(`Body, İyi Deneme ${msg.author}`)
        }
        if(rdOutput == 3) {
            msg.channel.send(`Iskaladın... ${msg.author}`)
        }
        //msg.channel.send(`:Sniper:`)

    } 
    if(msg.content === prefix + 'ping') {
        msg.reply('Pong!')
    }
    if(msg.content === prefix + 'avatar') {
        let Embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setImage(msg.author.displayAvatarUrl())
        msg.channel.send(Embed)
    }
    if(msg.content === prefix + 'botinfo'){
        
        let botembed = new Discord.MessageEmbed()
        botembed.setColor('#32CD32')
        botembed.setTitle('Bot Özellikleri :)')
        botembed.setDescription('Ad: ' + bot.user.username)
        botembed.addFields(
            {name: 'Versiyon:', value: '`1.2.1`'},
            {name: 'Yapan:', value: 'ProMeteTR'},
        )

        msg.channel.send(botembed)

    }
    if(msg.content === prefix + 'komutlar'){
        let botembed = new Discord.MessageEmbed()
        botembed.setColor('#fcba03')
        botembed.setTitle('Komutlar')
        botembed.setDescription('Prefix: ' + "'" + prefix + "'")
        botembed.addFields(
            {name: 'bb / merhaba / sa / slm:', value: 'Karşılık Verir'},
            {name: 'botinfo:', value: '`Bot Bilgilerini Görüntüler`'},
        )

        msg.channel.send(botembed)
    }
    
});

bot.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
    if (!channel) return;
    channel.send(`Sunucuya Hoşgeldin, ${member}`);
});

bot.login(token);