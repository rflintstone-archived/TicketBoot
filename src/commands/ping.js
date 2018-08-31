const Command = require(`${process.cwd()}/src/base/Command`);

class Ping extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            aliases: ['pong'],
            description: 'Pong!',
            details: 'Gives you the API Latency of Discord!',
        })
    }

    async run(message) {
        message.channel.createMessage(`Pong! Took \`${message.channel.guild.shard.latency}ms\``);
    }
};

module.exports = Ping;
