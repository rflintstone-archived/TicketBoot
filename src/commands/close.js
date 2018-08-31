const Command = require(`${process.cwd()}/src/base/Command`);

class Close extends Command {
    constructor(client) {
        super(client, {
            name: 'close',
            aliases: ['closed'],
            description: 'Closes a Denied Ticket!',
            details: 'Run this once you deny a Ticket',
            permlevel: 4,
            usage: '<@user> <ticket number>'
        })
    }

    async run(message, args) {
        var user = message.mentions[0];
        var number = args[1];

        if (!user) return message.channel.createMessage('Please give the Ticket Owner Name!');
        if (!number || isNaN(number)) return message.channel.createMessage('Please give a Valid Ticket Number!');

        var channel = message.channel.guild.channels.find(channel => channel.name === `denied-${number}`);
        if (!channel) return message.channel.createMessage('Can\'t find ticket!\nMaybe it\'s not Denied?');

        channel.delete().then(() => {
            message.channel.createMessage(`Ticket Closed!`);
            this.client.getDMChannel(user.id).then(channel => channel.createMessage(`${message.author.mention}, has closed your Ticket!`));
        });
    };
};

module.exports = Close;
