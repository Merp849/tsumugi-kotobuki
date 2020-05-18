import { IMessage, MetaCommand } from "../../typings";
import { Command } from "../../handlers/Modules";
import BaseCommand from "../../structures/BaseCommand";
import BotClient from "../../handlers/Client";

@Command({
    name: "ping",
    cooldown: 5,
    alias: ["pong"],
    ownerOnly: false,
    disabled: false
})
export default class PingCommand extends BaseCommand {
    constructor(public client: BotClient, public meta: MetaCommand) { super(client, meta); }
    async run(message: IMessage): Promise<void> {
        const startTime = Date.now();
        return message.channel
        .send(':ping_pong: | **Wait for some reason...**')
        .then((msg: any) => {
            const diff = (Date.now() - startTime).toLocaleString();
            const api = this.client.ws.ping.toFixed(0);
            msg.edit(`Latency: ${diff} ms. | API: ${api} ms.`);
        }).catch(console.error);
    }
}