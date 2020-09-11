const Discord = require('discord.js');
const bot = new Discord.Client();
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;




bot.on('ready', () => {
    console.log(bot.user.username + ' ' + 'hazır!');
});

// -- Hazır Komutlar -- \\
var slm = ["merhaba", "slm", "selam", "sa"]

bot.on('message', async msg => {

    for (let index = 0; index < slm.length; index++) {
        const element = slm[index];
        if (msg.content === prefix + element) {
            msg.reply('Merhaba!')
                .then(() => console.log(`${msg.author.username} kullanıcısına merhaba`))
                .catch(console.error);
        }

    }
    if (msg.content === prefix + 'atış') {
        let rdOutput = Math.floor((Math.random() * 3) + 1);
        if (rdOutput == 1) {
            msg.channel.send(`Headshot - Tebrikler, ${msg.author}`)
        }
        if (rdOutput == 2) {
            msg.channel.send(`Body, İyi Deneme ${msg.author}`)
        }
        if (rdOutput == 3) {
            msg.channel.send(`Iskaladın... ${msg.author}`)
        }
        //msg.channel.send(`:Sniper:`)

    }
    if (msg.content === prefix + 'covid') {

        let data;

        await fetch("https://covid19.saglik.gov.tr/")
            .then(res => res.text())
            .then(res => {
                const regex = /sondurumjson.+;/g;
                let found = res.match(regex)[1];
                found = found.replace('sondurumjson = ', '').replace(';', '');
                data = JSON.parse(found)[0];
            })
            .catch(err => console.log(err));

        let botembed = new Discord.MessageEmbed()
        botembed.setColor('#32CD32')
        botembed.setTitle(data.tarih + ' tarihli COVID verileri')
        botembed.addFields(
            { name: 'Günlük Test:', value: data.gunluk_test },
            { name: 'Günlük Vaka:', value: data.gunluk_vaka },
            { name: 'Günlük Vefat:', value: data.gunluk_vefat },
            { name: 'Günlük İyileşen:', value: data.gunluk_iyilesen }
        )

        msg.channel.send(botembed)

        let botembed2 = new Discord.MessageEmbed()
        botembed2.setColor('#32CD32')
        botembed2.setTitle('Toplam COVID verileri')
        botembed2.addFields(
            { name: 'Toplam Test:', value: data.toplam_test },
            { name: 'Toplam Vaka:', value: data.toplam_vaka },
            { name: 'Toplam Vefat:', value: data.toplam_vefat },
            { name: 'Toplam İyileşen:', value: data.toplam_iyilesen }
        )

        msg.channel.send(botembed2)

    }
    if (msg.content === prefix + 'ping') {
        msg.reply('Pong!')
    }
    if (msg.content === prefix + 'avatar') {
        let Embed = new Discord.MessageEmbed()
            .setTitle('Avatarın!')
            .setColor('RANDOM')
            .setImage(msg.author.displayAvatarURL)
        msg.channel.send(Embed)
    }
    if (msg.content === prefix + 'botinfo') {

        let botembed = new Discord.MessageEmbed()
        botembed.setColor('#32CD32')
        botembed.setTitle('Bot Özellikleri :)')
        botembed.setDescription('Ad: ' + bot.user.username)
        botembed.addFields(
            { name: 'Versiyon:', value: '`1.2.1`' },
            { name: 'Yapan:', value: 'ProMeteTR' },
        )

        msg.channel.send(botembed)

    }
    if (msg.content === prefix + 'komutlar') {
        let botembed = new Discord.MessageEmbed()
        botembed.setColor('#fcba03')
        botembed.setTitle('Komutlar')
        botembed.setDescription('Prefix: ' + "'" + prefix + "'")
        botembed.addFields(
            { name: 'covid', value: 'Günlük Vakalar' },
            { name: 'botinfo', value: '`Bot Bilgilerini Görüntüler`' }
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