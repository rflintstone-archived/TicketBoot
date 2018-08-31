const Command = require(`${process.cwd()}/src/base/Command`);

class Ticket extends Command {
    constructor(client) {
        super(client, {
            name: 'ticket',
            aliases: ['createticket'],
            description: 'Create a ticket!',
            details: 'Makes a Ticket for you, but there are limits, set by the Guild Owner!'
        })
    }

    async run(message, args) {
        const settings = this.client.db.get(message.channel.guild.id);
        const userSettings = this.client.db.get(`${message.channel.guild.id}-${message.author.id}`);

        if (userSettings.tickets >= userSettings.maxTickets) return message.channel.createMessage(`You have reached the Max Tickets! Please close your current ticket, or request an admin to extend your Maximum Tickets`);

        if (!args.join(' ')) {
            return message.channel.createMessage("Please add a Description for your Ticket");
        } else {
            message.channel.createMessage("*Creating your Ticket...*").then(m => m.edit(`Successfuly created your Ticket! I will ping you there so you will know what ticket your are on!`));

            settings.tickets++;
            userSettings.tickets++;

            this.client.db.set(message.channel.guild.id, { tickets: settings.tickets });
            message.channel.guild.createChannel(`ticket-${settings.tickets}`).then(channel => {
                channel.createMessage(`${message.author.mention}, welcome to your Ticket! An Admin will be in Contact with you Shortly...`);
                channel.editPermission(message.channel.guild.id, null, 1024, "role");
                channel.editPermission(message.author.id, 1024, null, "member").then(() => {
                    this.client.db.set(`${message.channel.guild.id}-${message.author.id}`, { tickets: userSettings.tickets, maxTickets: userSettings.maxTickets });
                });
            });
        };
    }
};

module.exports = Ticket;
