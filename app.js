const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');

const Eris = require('eris');
const fs = require('fs');

const client = new Eris(require('./config.json').token);
client.config = require('./config.json');
client.commands = new Eris.Collection();
client.db = new Enmap({ provider: new EnmapLevel({ name: 'TicketBoot' })});

client.permlevel = (message) => {
    let permlevel = 0;
    if (message.channel.guild.members.has('manageMessage')) permlevel = 1

    if (message.channel.guild.members.has('kickMembers')) permlevel = 2;

    if (message.channel.guild.members.has('banMembers')) permlevel = 3;

    if (message.channel.guild.members.has('administrator')) permlevel = 4;

    if (message.author.id === message.channel.guild.ownerID) permlevel = 5;

    if (client.config.owners.includes(message.author.id)) permlevel = 10;
    return permlevel;
};

const eventFiles = fs.readdirSync('./src/events');
const commandFiles = fs.readdirSync('./src/commands');

for (const commands of commandFiles) {
    const command = new(require(`./src/commands/${commands}`))(client);

    client.commands.set(command.help.name, command);
    console.log(`Successfuly loaded Command: ${command.help.name.split('')[0].toUpperCase() + command.help.name.split('').slice(1).join('')}`); // You can remove .split('')[0].toUpperCase() + command.help.name.split('').slice(1).join('')   it's just for design
};

for (const events of eventFiles) {
    try {
        const eventFn = require(`./src/events/${events}`);
        const event = events.split('.')[0];

        client.on(event, (...args) => eventFn.run(client, ...args));
    } catch(e) {
        console.log(e)
    }
};

client.connect();
