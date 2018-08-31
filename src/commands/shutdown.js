const Command = require(`${process.cwd()}/src/base/Command`);

class Shutdown extends Command {
    constructor(client) {
        super(client, {
            name: 'shutdown',
            aliases: ['poweroff'],
            description: 'Shuts down the bot',
            permlevel: 10
        })
    }

    async run(message) {
        try {
            await client.createMessage(message.channel.id, 'Going off... :wave:');
            await client.disconnect();
            await process.exit();
        } catch (err) {
            console.log(err);
        }
    }
};

module.exports = Shutdown;
