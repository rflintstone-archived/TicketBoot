const Command = require(`${process.cwd()}/src/base/Command`);

class MaxTickets extends Command {
    constructor(client) {
        super(client, {
            name: 'maxtickets',
            aliases: ['maxticket'],
            description: 'Set the User\'s Max Tickets!!',
            details: 'This edits the specified user\'s Maximum Tickets',
            usage: '<@user> <max tickets>',
            permlevel: 4
        })
    }

    async run(message, args) {
        const userSettings = this.client.db.get(`${message.channel.guild.id}-${message.author.id}`);

        var user = message.mentions[0];
        var number = args[1];

        if (!user) return message.channel.createMessage('Please give a proper User!');
        if (!number || isNaN(number)) return message.channel.createMessage('Please give the New Maximum Amount of Tickets!');

        message.channel.createMessage(`Done! New Max Tickets Given.`).then(() => this.client.db.setProp(`${message.channel.guild.id}-${message.author.id}`, "maxTickets", number));
    };
};

module.exports = MaxTickets;
