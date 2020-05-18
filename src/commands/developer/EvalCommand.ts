import { Command } from "../../handlers/Modules";
import BaseCommand from "../../structures/BaseCommand";
import { IMessage, MetaCommand } from "../../typings";
import { MessageEmbed } from "discord.js";
import BotClient from "../../handlers/Client";

@Command({
    name: "eval",
    alias: [],
    ownerOnly: true
})
export default class EvalCommand extends BaseCommand {
    constructor(public client: BotClient, public meta: MetaCommand) { super(client, meta); }
    async run(message: IMessage): Promise<IMessage | void> {
        if (!message.author.isDev) return;
        const msg = message; 
        const bot = this.client;
        const client = this.client;

        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setAuthor("Evaluation");
        if (message.args.join(" ").length > 2048) {
            embed.addField("Input", "```ini\n[ The input is too long to place in here! ] \n\`\`\`");
        } else {
            embed.addField("Input", "```js\n" + message.args.join(" ") + "```"); // eslint-disable-line prefer-template
        }

        try {
            let code = message.args.slice(0).join(" ");
            if (!code) return;
            let evaled;
            if (code.includes("--silent") && code.includes("--async")) {
                code = code.replace("--async", "").replace("--silent", "");
                await eval(`(async function() {
                            ${code}
                        })()`);
                return;
            } else if (code.includes("--async")) {
                code = code.replace("--async", "");
                evaled = await eval(`(async function() {
                            ${code}
                            })()`);
            } else if (code.includes("--silent")) {
                code = code.replace("--silent", "");
                await eval(code);
                return;
            } else {
                evaled = await eval(code);
            }

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled, {
                  depth: 0
                });

            const output = this.clean(evaled);
            if (output.length > 1024) {
                const hastebin = await this.client.util.hastebin(output);
                embed.addField("Output", hastebin);
            } else {
                embed.addField("Output", "```js\n" + output + "```"); // eslint-disable-line prefer-template
            }
            return message.channel.send(embed);
        } catch (e) {
            const error = this.clean(e);
            if (error.length > 1024) {
            const hastebin = await this.client.util.hastebin(error);
            embed.addField("Error", hastebin);
        } else {
            embed.addField("Error", "```js\n" + error + "```"); // eslint-disable-line prefer-template
        }
        return message.channel.send(embed);
        }
    } 

    private clean(text: string): string {
        if (typeof text === "string") {
            return text
                .replace(new RegExp(process.env.TOKEN!, "g"), "[REDACTED]")
                .replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        } else return text;
    }
}