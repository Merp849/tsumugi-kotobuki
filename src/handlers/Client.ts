import { Client, ClientOptions, Collection } from "discord.js";
import config from "../config.json";
import { LogWrapper } from "./LogWrapper";
import Commands, { commands, aliases, helpMeta } from "./Modules";
import * as request from "superagent";
import { resolve } from "path";
import EventLoader from "./Events";
import CommandHandler from "./Commands";
import Util from "./Util";

// Extending DiscordJS structures
import "../structures/User";
import "../structures/Guild";
import "../structures/GuildMember";
import "../structures/Message";

export default class BotClient extends Client {
    readonly config = config;
    readonly commandsHandler = new CommandHandler(this);
    readonly util: Util = new Util(this);
    constructor(opt?: ClientOptions) { super(opt); }
    public commands = commands;
    public aliases = aliases;
    public helpMeta = helpMeta;
    public request = request;
    public log = new LogWrapper(config.name).logger;

    public build(): void {
        new Commands(this, resolve(__dirname, "..", "commands")).build();
        new EventLoader(this, resolve(__dirname, "..", "events")).build();
        this.login(process.env.TOKEN).catch(e => this.log.error(e));
    }
}