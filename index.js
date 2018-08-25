const enmap = require('enmap');
const enmapLevel = require('enmap-level');
const Discord = require('discord.js');

const client = new Discord.Client();
const db = new enmap({ provider: new enmapLevel({ name: 'TicketBoot' }) });
client.config = require('./config');

client.on('ready', () => {
  console.log('Tickets are Ready to be Served!');
});

client.on('message', (message) => {
    if (message.channel.type !== 'text') return;

    if (!db.has(message.guild.id)) {
        db.set(message.guild.id, client.config.ticket);
    };

    if (!db.has(message.author.id)) {
        db.set(message.author.id, client.config.user);
    };

    const settings = db.get(message.guild.id);
    const userSettings = db.get(message.author.id);

    if (!message.content.startsWith(client.config.prefix)) return;
  
    const args = message.content.slice(client.config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ticket') { // Create Tickets
        if (userSettings.tickets === userSettings.maxTickets) return message.reply('You already have a Ticket! Please Close it before making a New One!');
        settings.tickets++;
        userSettings.tickets++;

        db.set(message.guild.id, { tickets: settings.tickets });
        message.channel.send('Creating Your Ticket...').then(msg => msg.edit('Ticket Created!'));

        message.guild.createChannel(`ticket-${settings.tickets}`, 'text', [{
            id: message.guild.id,
            denied: 'READ_MESSAGES'
        },
        {
            id: message.author.id,
            allowed: 'READ_MESSAGES'
        }]).then(() => db.set(message.author.id, { tickets: userSettings.tickets, maxTickets: userSettings.maxTickets }));
    }

    if (command === 'deny') {
        if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('You need the `MANAGE_GUILD` Permissions!');
        var search = `ticket-${args[0]}`
        var channel = message.guild.channels.find(c => c.name === search)

        if (!channel) return message.reply('No Channel was Found!');

        channel.setName(`denied-${args[0]}`);
        message.channel.send(`Denied ticket Number: \`${args[0]}\``);
    }

    if (command === 'maxtickets') {
        if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('You need the `MANAGE_GUILD` Permissions!');
        var user = message.mentions.users.first();
        var number = parseInt(args[1]);

        if (!user) user = message.author;
        if (!number) number = 5;

        db.setProp(user.id, "maxTickets", number);
        message.channel.send(`Changed Max Tickets for ${user} to, \`${number}\``);
    }

    if (command === 'close') {
        if (!message.member.hasPermission('MANAGE_GUILD')) return message.reply('You need the `MANAGE_GUILD` Permissions!');
        var user = message.mentions.users.first();
        if (!message.channel.name.startsWith('denied')) return message.reply('Please do this in A Denied Ticket!');

        if (!user) return message.reply('Please Specify the Ticket Owner!');

        db.setProp(user.id, "tickets", 0);

        message.channel.delete().then(() => user.send(`${message.author.tag} deleted your Ticket!`));
    }

    if (command === 'help') {
        message.channel.send(`
**Commands**:
\`${client.config.prefix}ticket\`: Creates a Tickets
\`${client.config.prefix}deny\`: Denies a Tickets
\`${client.config.prefix}maxtickets\`: Sets the max Amount of Tickets for a User!
\`${client.config.prefix}close\`: Closes a Ticket
        `)
    }
});

client.login(client.config.token);
