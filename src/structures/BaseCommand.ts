/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommandComponent, IMessage, MetaCommand } from "../typings";
import BotClient from "../handlers/Client";
import { MessageEmbed } from "discord.js";

export default class BaseCommand implements CommandComponent {
    constructor(public client: BotClient, public meta: MetaCommand) { }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public run(message: IMessage): any {}
    public invalid(msg: IMessage, reason: string): Promise<IMessage> {
        const usage = this.meta.usage ? `${this.meta.usage.replace(new RegExp("{prefix}", "g"), `**${msg.guild ? msg.guild.config.prefix : msg.client.config.prefix}**`)}` : "No usage provided.";
        const example = this.meta.example ? `${this.meta.example.replace(new RegExp("{prefix}", "g"), `**${msg.guild ? msg.guild.config.prefix : msg.client.config.prefix}**`)}` : "No example provided.";
        const embed = new MessageEmbed()
            .setAuthor(`It's not how you use ${this.meta.name}`, `${this.client.config.staticServer}/images/596234507531845634.png`)
            .setColor("#FF0000")
            .setThumbnail(this.client.user!.displayAvatarURL())
            .addFields({
                name: "<:info:596219360209797161> Reason:",
                value: `**${reason}**`
            }, {
                name: "<:true:596220121429573653> Correct Usage :",
                value: usage
            }, {
                name: "📃 Example :",
                value: example
            })
            .setTimestamp()
            .setFooter(`Get more info about this command using ${msg.guild ? msg.guild.config.prefix : msg.client.config.prefix}help ${this.meta.name}`, `${this.client.config.staticServer}/images/390511462361202688.png`);

        return msg.channel.send(embed);
    }
}