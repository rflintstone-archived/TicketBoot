const Command = require(`${process.cwd()}/src/base/Command`);

class Deny extends Command {
    constructor(client) {
        super(client, {
            name: 'deny',
            aliases: ['denied'],
            description: 'Deny a Ticket!',
            details: 'Denies a ticket, not close it',
            permlevel: 4,
            usage: '<@user> <ticket number>'
        })
    }

    async run(message, args) {
        const userSettings = this.client.db.get(`${message.channel.guild.id}-${message.author.id}`);

        var user = message.mentions[0];
        var number = args[1];

        if (!user) return message.channel.createMessage('Please give the Ticket Owner Name!');
        if (!number || isNaN(number)) return message.channel.createMessage('Please give a valid Ticket Number!');

        var channel = message.channel.guild.channels.find(channel => channel.name === `ticket-${number}`);
        if (!channel) return message.channel.createMessage('Can\'t find ticket!');

        channel.edit({ name: `denied-${number}` }).then(c => {
            userSettings.tickets--;

            message.channel.createMessage(`Ticket Denied!`);
            this.client.getDMChannel(user.id).then(channel => channel.createMessage(`${message.author.mention}, denied your Ticket!`));
            this.client.db.setProp(`${message.channel.guild.id}-${message.author.id}`, "tickets", userSettings.tickets);
        });
    };
};

module.exports = Deny;
