class Command {
    constructor(client, {
        name = null,
        aliases = [],
        description = 'No Description Set!',
        details = 'No Details Set!',
        usage = '',
        isNSFW = false,
        isHidden = false,
        permlevel = 0,
        category = 'General'
    }) {
        this.client = client;
        this.help = {
            name,
            aliases,
            description,
            details,
            usage
        };
        this.others = {
            isNSFW,
            isHidden,
            permlevel,
            category
        };
    }
};

module.exports = Command;