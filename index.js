const Discord = require('discord.js');
const bot = new Discord.Client();
const Canvas = require('canvas')
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const config = require('./config.json')

dotenv.config();

const token = process.env.TOKEN;
const prefix = process.env.PREFIX;




bot.on('ready', () => {
    console.log(bot.user.username + ' ' + 'hazır!');
    bot.user.setActivity('Covid Vakaları', {type: 'WATCHING'})
    .then(presence => console.log(`Aktivite ayarlandı:  ${presence.activities[0].name}`))
    .catch(console.error);
});

// -- Hazır Komutlar -- \\
var slm = ["merhaba", "slm", "selam", "sa"]

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	let fontSize = 50;

	do {
		ctx.font = `${fontSize -= 10}px sans-serif`;
		
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

bot.on('message', async msg => {

    if(msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLocaleLowerCase();
    if (msg.content.includes('https://') || msg.content.includes('http://')) {
        const channel = msg.member.guild.channels.cache.find(ch => ch.name === 'link-yasak');
        if (channel) {
            channel.send(`${msg.author} Link Gönderdi \`#Uyarı\``)
            msg.delete()
            msg.channel.send('Link Yasak! ❌')
        }
    }

    if(!msg.content.startsWith(prefix)) return;

    for (let index = 0; index < slm.length; index++) {
        const element = slm[index];
        if (command === element) {
            msg.reply('Merhaba!')
                .then(() => console.log(`${msg.author.username} kullanıcısına merhaba`))
                .catch(console.error);
        }

    }
    if (command === config.yprefix + 'link-yasak') {
        if(msg.member.hasPermission('ADMINISTRATOR')) {
            const channel = msg.member.guild.channels.cache.find(ch => ch.name === 'link-yasak');
            if (!channel) {
                msg.member.guild.channels.create('link-yasak', { reason: 'Link Ayarı' })
                .then(msg.channel.send('✅ İşlem Başarıyla Tamamlandı'))
                .catch(console.error);
            }
            let svname = msg.member.guild.name
            channel.send(`Sunucu Adı: ${svname} \n Sunucu Link Ayarı: ${channel}`);
        } else {
            msg.reply('Bu komutları görüntüleyecek yetkiniz yok! `#hata Yetersiz Yetki`')
        }
    }
    if (command === config.yprefix + 'link-serbest') {
        if(msg.member.hasPermission('ADMINISTRATOR')) {
            const channel = msg.member.guild.channels.cache.find(ch => ch.name === 'link-yasak');
            if (channel) {
                channel.delete()
                msg.channel.send('✅ Link Engelleme Sistemi Kaldırıldı')
            } 
        } else {
            msg.reply('Bu komutları görüntüleyecek yetkiniz yok! `#hata Yetersiz Yetki`')
        }

    }
    if (command === config.yprefix + 'temizle') {
        if(msg.member.hasPermission('ADMINISTRATOR')) {
            msg.channel.messages.fetch().then((results) => {
                msg.channel.send('Kanal Temizlendi')
                msg.channel.bulkDelete(results)
            })
        } else {
            msg.reply('Bu komutları görüntüleyecek yetkiniz yok! `#hata Yetersiz Yetki`')
        }
    }
    if (command === config.yprefix + 'kaldır') {
        if(msg.member.hasPermission('ADMINISTRATOR')) {
            let rol = msg.guild.roles.cache.find(r => r.name === "Muted");

            if (!rol) {
                return msg.channel.send('Muted diye bir rol ekleyin ve kanala bağlanma iznini kaldırın')
            }

            let member = msg.mentions.members.first();
    
            member.roles.remove(rol)
            msg.channel.send(`Üye'nin Susturması Kaldırıldı, ${member.user.tag}`)
        } else {
            msg.reply('Bu komutları görüntüleyecek yetkiniz yok! `#hata Yetersiz Yetki`')
        }
    }
    if (command === config.yprefix + 'sustur') {
        if(msg.member.hasPermission('ADMINISTRATOR')) {
            let rol = msg.guild.roles.cache.find(r => r.name === "Muted");

            if (!rol) {
                rol = await msg.guild.roles.create({
                    data: {
                        name: 'Muted',
                        color: 'RED'
                    }
                }).catch(err => console.log(err))
                for(const channel of msg.guild.channels.cache) {
                    channel[1].updateOverwrite(rol, {
                        SEND_MESSAGES: false,
                        CONNECT: false,
                    }).catch(err => console.log(err))
                }
            }

            let member = msg.mentions.members.first();
    
            member.roles.add(rol)
            msg.channel.send(`Üye Susturuldu, ${member.user.tag}`)
        } else {
            msg.reply('Bu komutları görüntüleyecek yetkiniz yok! `#hata Yetersiz Yetki`')
        }
    }
    if (command === config.yprefix + 'komutlar') {
        if(msg.member.hasPermission('ADMINISTRATOR')) {
            let botembed = new Discord.MessageEmbed()
            botembed.setColor('RANDOM')
            botembed.setTitle('Yönetici Komutları')
            botembed.setDescription(`Yönetici Komutları İçin Başa \`${config.yprefix}\` yazın`)
            botembed.addFields(
                { name: 'at', value: 'Adı Verilen Kullanıcıyı Atar' },
                { name: 'link-engel', value: 'Linkleri Engeller' },
                { name: 'link-serbest', value: 'Link Engeli Kaldırır' },
                { name: 'sustur', value: 'Kullanıcıyı Susturur' },
                { name: 'kaldır', value: 'Kullanıcının Susturmasını Kaldırır' },
                { name: 'temizle', value: 'Kanaldaki Tüm Mesajları Temizler' }
            )

            msg.channel.send(botembed)
        } else {
            msg.reply('Bu komutları görüntüleyecek yetkiniz yok! `#hata Yetersiz Yetki`')
        }
    }
    if (command === config.yprefix + 'at') {
        if (msg.member.hasPermission('ADMINISTRATOR')) {
            const userKick = msg.mentions.users.first()

            if(userKick) {
                let member = msg.guild.member(userKick)

                if(member) {
                    member.kick('Kurallara Uymadığınız İçin Atıldınız!').then(() => {
                        msg.reply(`Kullanıcı Atıldı: ${userKick.tag}!`)
                    }).catch(err => {
                        msg.reply('Kullanıcı Atılırken Bir Problem Oluştu')
                        console.log(err)
                    })
                } else {
                    msg.reply('Sunucuda Böyle Bir User Yok `#hata 404` ')
                }
            } else {
                msg.reply('Atılacak Kullanıcının Adını Girin! `#hata yanlış sözdizimi!` ')
            }
        } else {
            msg.reply('Bu komutları görüntüleyecek yetkiniz yok! `#hata Yetersiz Yetki`')
        }
        
    }



    // -------------- STANDART KOMUTLAR ---------------- //


    if (command === 'web') {
        msg.channel.send(`Mod Bot Web > https://dashboard-modbot.herokuapp.com/ \n ${config.credits}`)
    }

    if(command ===  'avatar') {

		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');

		const background = await Canvas.loadImage('./canvas.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);

		// Assign the decided font to the canvas
		ctx.font = applyText(canvas, msg.member.displayName);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(msg.member.displayName, canvas.width / 2.5, canvas.height / 1.8);

		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();

		const avatar = await Canvas.loadImage(msg.member.user.displayAvatarURL({ format: 'jpg' }));
		ctx.drawImage(avatar, 25, 25, 200, 200);

		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'sscanvas.png');

		msg.channel.send(attachment);
   }

    if (command === 'server') {
        let botembed = new Discord.MessageEmbed()
        botembed.setColor('RANDOM')
        botembed.addFields(
            { name: 'Sunucu Adı:', value: `${msg.guild.name}` },
            { name: 'Üye Sayısı:', value: `${msg.guild.memberCount}` }
        )
        botembed.setFooter('Mod Bot','https://cdn.discordapp.com/attachments/751094465271169104/757598502586155028/Mod_Bot.png')
        botembed.setTimestamp()
        msg.channel.send(botembed)
    }

    if (command === 'yavaşmod') {
        run()
        run: async(args) => {
            if(!args[0]) return msg.channel.send('Yavaş Mod İçin Zaman Girin')
            if(isNaN(args[0])) return msg.channel.send('Bu Bir Sayı Değil')
            msg.channel.setRateLimitPerUser(args[0])
        }
    }
    if (command === 'atış') {
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
    if (command === 'covid') {

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
        .setFooter(config.credits, 'https://mete.pro/favicon/apple-icon-57x57.png');

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
        .setFooter(config.credits, 'https://mete.pro/favicon/apple-icon-57x57.png');

        msg.channel.send(botembed2)

    }
    if (command === 'duyuru') {
        const response = args.join(' ')
        msg.delete()
        msg.channel.send(response)
    }
    if (command === 'ping') {
        msg.channel.send(`Ping: ${msg.client.ws.ping}ms`)
    }
    if (command === 'botinfo') {

        let botembed = new Discord.MessageEmbed()
        botembed.setColor('#32CD32')
        botembed.setTitle('Bot Özellikleri :)')
        botembed.setDescription('Ad: ' + bot.user.username)
        botembed.addFields(
            { name: 'Versiyon:', value: `${config.dynversion}` },
            { name: 'Yapan:', value: `${config.credits}` },
        )

        msg.channel.send(botembed)

    }
    if (command === 'komutlar') {
        let botembed = new Discord.MessageEmbed()
        botembed.setColor('#fcba03')
        botembed.setTitle('Komutlar')
        botembed.setDescription('Prefix: ' + "'" + prefix + "'")
        botembed.addFields(
            { name: 'avatar', value: 'Profil İsmini Ve Fotoğrafını Atar' },
            { name: 'covid', value: 'Günlük Vakalar' },
            { name: 'atış', value: 'Atış Yapar Ve Rastgele Bir Sonuç Alır' },
            { name: 'botinfo', value: '`Bot Bilgilerini Görüntüler`' }
        )

        msg.channel.send(botembed)
    }

});

bot.on('guildMemberAdd', async member => {

        const channel = member.guild.systemChannel
		if (!channel) return;
	
		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');
	
		const background = await Canvas.loadImage('./canvas.png');
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	
		ctx.strokeStyle = '#74037b';
		ctx.strokeRect(0, 0, canvas.width, canvas.height);
	
		// Slightly smaller text placed above the member's display name
		ctx.font = '28px sans-serif';
		ctx.fillStyle = '#ffffff';
		ctx.fillText('Sunucuya Hoşgeldin,', canvas.width / 2.5, canvas.height / 3.5);
	
		// Add an exclamation point here and below
		ctx.font = applyText(canvas, `${member.displayName}!`);
		ctx.fillStyle = '#ffffff';
		ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);
	
		ctx.beginPath();
		ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.clip();
	
		const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
		ctx.drawImage(avatar, 25, 25, 200, 200);
	
		const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'sscanvas.jpg');
	
		channel.send(`Sunucuya Hoşgeldin, ${member}!`, attachment);
});

bot.login(token);