const Command = require(`${process.cwd()}/src/base/Command`);

class Help extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            aliases: ['h'],
            description: 'Help Command!',
            details: 'This is what we need',
        })
    }

    async run(message, args, level) {
        if (!args[0]) {
            const filtered = this.client.commands.filter(cmd => cmd.others.permlevel <= level);

            this.client.createMessage(message.channel.id, {
                    embed: {
                        author: {
                            name: this.client.user.username,
                            icon_url: this.client.user.avatarURL
                        },
                        color: 0xfaff7b,
                        description: `Here's a list of all the Commands available for your Permission Level:\n${filtered.map(cmd => `\n**${this.client.config.prefix}${cmd.help.name}**: ${cmd.help.description}`).join('\n')}`
                    },
                    footer: {
                        text: 'Full Help Command'
                    }
                });
        } else {
            const command = this.client.commands.get(args[0]);

            if (!command) return;

            var aliases = command.help.aliases.join(', ')

            if (aliases.help.length === 0) {
                aliases = 'No Aliases Set'
            }
            if (command.help.details.length === 0) {
                command.help.details = 'No extra Description Set'
            }

            this.client.createMessage(message.channel.id, {
                embed: {
                    author: {
                        name: this.client.user.username,
                        icon_url: this.client.user.avatarURL
                    },
                    color: 0xfaff7b,
                    fields: [
                        {
                            name: 'Command Name',
                            value: command.help.name,
                            inline: true
                        },
                        {
                            name: 'Command Aliases',
                            value: aliases,
                            inline: true
                        },
                        {
                            name: 'Command Usage',
                            value: `${this.client.config.prefix}${args[0]} ${command.help.usage}`,
                            inline: true
                        },
                        {
                            name: 'Command Extra Description',
                            value: command.help.details
                        }
                    ],
                    footer: {
                        text: `${args[0].toUpperCase()} Command: Full Information`
                    }
                }
            });
        }
    }
};

module.exports = Help;
