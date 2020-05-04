import { IMessage } from "../../typings";
import { Command } from "../../handlers/Modules";
import BaseCommand from "../../structures/BaseCommand";

@Command({
    name: "ping",
    cooldown: 5,
    alias: ["pong"],
    ownerOnly: false,
    disabled: false
})
export default class PingCommand extends BaseCommand {
    async run(message: IMessage): Promise<void> {
        const startTime = Date.now();
        return message.channel
        .send(":ping_pong: | **Wait for some reason...**")
        .then((msg: any) => {
            const diff = (Date.now() - startTime).toLocaleString();
            const api = this.client.ws.ping.toFixed(0);
            msg.edit(`Latency: ${diff} ms. | API: ${api} ms.`);
        }).catch(console.error);
    }
}