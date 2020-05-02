import BaseCommand from "../../structures/BaseCommand";
import { Command } from "../../handlers/Modules";
import { IMessage } from "../../typings";
import { MessageEmbed } from "discord.js";

@Command({
    name: "help",
    alias: ["h", "cmd", "cmds", "commands", "command"],
    description: "See my commands list!",
    cooldown: 5,
    usage: "help [command]",
    example: "help ping",
    ownerOnly: false,
    disabled: false
})
export default class HelpCommand extends BaseCommand {
    run(message: IMessage): Promise<IMessage> {
        if (!message.args[0]) {
            const embed = new MessageEmbed()
            .setAuthor(`${this.client.user!.username} Commands List`, this.client.util.getAvatar(this.client.user))
            .setDescription(`Hi! My name is ${this.client.user!.username}! Want to see advanced help command? Great!\nJust type that like: \`${this.client.config.prefix}help [command]\`
            `)
            .setColor("RANDOM")
            .setFooter(`• Message For ${message.author.tag}`, this.client.util.getAvatar(message.author))
            .setTimestamp();
            for (const cat of this.client.helpMeta.array().sort((a, b) => a.name.localeCompare(b.name))) {
                if (cat.hide && message.author.isDev) {
                    embed.addField(cat.name, cat.cmds.map(c => `\`${c}\``).join(', '));
                }
                embed.addField(cat.name, cat.cmds.map(c => `\`${c}\``).join(', '));
            }
            return message.channel.send(embed);
        } else {
            const cmd = this.client.commands.get(message.args[0]) || this.client.commands.get(this.client.aliases.get(message.args[0])!);
            if (!cmd) return message.channel.send(`\`${message.args[0]}\` doesn't exists in my commands list! Perhaps typo?`);
            const usage = cmd.meta!.usage ? `Don't know how to use this command? Easy, just \`${this.client.config.prefix}${cmd.meta!.name} ${cmd.meta!.usage}`: "No usage provided for this command.";
            const example = cmd.meta!.example ? `Still don't know? Okay, here the example: \`${this.client.config.prefix}${cmd.meta!.name} ${cmd.meta!.example}\`` : "No example provided for this command.";
            const description = cmd.meta!.description ? cmd.meta!.description : "No description provided for this command.";
            const alias = cmd.meta!.alias!.length === 0 ? "No alias provided for this command." : `You can use this command with: ${cmd.meta!.alias!.map(a => `\`${a}\``).join(", ")}`
            const cooldown = cmd.meta!.cooldown ? `You just need wait \`${cmd.meta!.cooldown}\` second(s) after using this command!` : `No cooldown provided, You're free!`;
            const embed = new MessageEmbed()
            .setAuthor("📁 Advanced Help Command")
            .setDescription(`
\`[]\` Means Optional
\`<>\` Means Required
${cmd.meta!.ownerOnly && !message.author.isDev ? "\nSorry, but this command is developer only. How can you found this command?" : ""}
\`\`\`${description}\`\`\`
            `)
            .setColor("RANDOM")
            .addField("Aliases", alias)
            .addField("Cooldown", cooldown)
            .addField("Usage", usage)
            .addField("Example", example);
            return message.channel.send(embed);
        }
    }
}