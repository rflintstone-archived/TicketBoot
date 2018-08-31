module.exports.run = (client, message) => {
    if (message.channel.type !== 0 || message.author.bot) return;

    if (!client.db.has(message.channel.guild.id)) {
        client.db.set(message.channel.guild.id, client.config.ticket);
    };

    if (!client.db.has(`${message.channel.guild.id}-${message.author.id}`)) {
        client.db.set(`${message.channel.guild.id}-${message.author.id}`, client.config.user);
    };

    const args = message.content.slice(client.config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const level = client.permlevel(message);

    const cmd = client.commands.get(command) || client.commands.find(c => c.help.aliases && c.help.aliases.includes(command));

    if (cmd) {
        if (level < cmd.others.permlevel) message.channel.createMessage('You don\'t have enough permissions to run this Command!');
        message.author.permlevel = level;

        cmd.run(message, args, level);
    } else {
        return;
    };
};
