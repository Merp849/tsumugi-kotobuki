import { Structures } from "discord.js";
import BotClient from "../handlers/Client";
import { IGuild } from "../typings";

Structures.extend("Guild", DJSGuild => {
    return class Guild extends DJSGuild implements IGuild {
        readonly me!: IGuild["me"];
        readonly owner!: IGuild["owner"];
        public member!: IGuild["member"];
        public members!: IGuild["members"];
        readonly voice!: IGuild["voice"];
        public voiceStates!: IGuild["voiceStates"];
        public setOwner!: IGuild["setOwner"];
        public client!: BotClient;
        public config!: IGuild["config"];
        constructor(client: BotClient, data: object) {
            super(client, data);
            this.config = { prefix: client.config.prefix };
        }
    };
});