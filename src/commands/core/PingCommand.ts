import { IMessage } from "../../typings";
import { Command } from "../../handlers/Modules";
import BaseCommand from "../../structures/BaseCommand";

@Command({
    name: "ping",
    description: "Pong",
    usage: "No usage provided",
    cooldown: 5,
    example: "No example provided",
    alias: ["pong"],
    ownerOnly: false,
    disabled: false
})
export default class PingCommand extends BaseCommand {
    async run(message: IMessage): Promise<IMessage> {
        return message.channel.send("Pong!");
    }
}