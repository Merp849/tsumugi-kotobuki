import { Snowflake, Collection } from "discord.js";
import BotClient from "./Client";
import { IMessage, CommandComponent } from "../typings";

export default class CommandHandler {
    readonly cooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
    constructor(private client: BotClient) { };

    public handle(message: IMessage): any {
        const command: CommandComponent | void = this.client.commands.get(message.cmd) || this.client.commands.get(this.client.aliases.get(message.cmd)!);
        if (!command || command.meta!.disabled) return undefined;
        if (!this.cooldowns.has(command.meta!.name)) this.cooldowns.set(command.meta!.name, new Collection());
        const now = Date.now();
        const timestamps: Collection<Snowflake, number> = this.cooldowns.get(command.meta!.name)!;
        const cooldownAmount = (command.meta!.cooldown || 3) * 1000;
        if (!timestamps.has(message.author.id)) {
            timestamps.set(message.author.id, now);
            if (message.author.isDev) timestamps.delete(message.author.id);
        } else {
            const expirationTime = timestamps.get(message.author.id)! + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                message.channel.send(`**${message.author.username}**, please wait **${timeLeft.toFixed(1)}** cooldown time.`).then((msg: IMessage) => {
                    msg.delete({ timeout: 3500 });
                });
                return undefined;
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        try {
            if (message.channel.type === "dm") return undefined;
            if (command.meta!.ownerOnly && !message.author.isDev) return undefined;
            return command.run(message);
        } catch (e) {
            this.client.log.error("COMMAND_HANDLER_ERR: ", e);
        } finally {
            if (command.meta!.ownerOnly && !message.author.isDev) return undefined;
            if (message.channel.type === "dm") return undefined;
            this.client.log.info(`${message.author.tag} is using ${command.meta!.name} command on ${message.guild ? message.guild.name : "DM Channel"}`);
        }
    }
}