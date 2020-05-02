import BotClient from "./Client";
import { MetaCommand, CommandComponent, ModuleConf, HelpMeta } from "../typings";
import { Collection } from "discord.js";
import { readdir } from "fs";
import { LogWrapper } from "./LogWrapper";
import { resolve } from "path";

export const commands: Collection<string, CommandComponent> = new Collection();
export const aliases: Collection<string, string> = new Collection();
export const helpMeta: Collection<string, HelpMeta> = new Collection();
export const categories: Collection<string, Collection<string, CommandComponent>> = new Collection();
export const log = new LogWrapper("Modules").logger;

export default class Commands {
    constructor(private client: BotClient, readonly path: string) {};
    public build(): void {
        readdir(this.path, (err, categoriess: string[]) => {
            if (err) {
                this.client.log.error("MODULES_LOADER_ERR: ", err);
            }
            categoriess.forEach(category => {
                if (category.endsWith(".schema")) {
                    const index = categoriess.indexOf(category);
                    if (index > -1) {
                        categoriess.splice(index, 1);
                    }
                }
            });
            this.client.log.info(`Found ${categoriess.length} categories.`);
            categoriess.forEach(category => {
                const moduleConf: ModuleConf = require(`${this.path}/${category}/module.json`);
                moduleConf.path = `${this.path}/${category}`;
                moduleConf.cmds = [];
                if (!moduleConf) return undefined;
                helpMeta.set(category, moduleConf);
                const regex = /(?!json)(ts|js)/gi;
                readdir(`${this.path}/${category}`, (err, files: string[]) => {
                    this.client.log.info(`Found ${files.filter(file => regex.exec(file) !== null).length} command(s) from ${category}`);
                    if (err) this.client.log.error("MODULES_LOADER_ERR: ", err);
                    files.forEach(file => {
                        if (!file.endsWith(".js")) return undefined;
                        require(`${this.path}/${category}/${file}`).default;
                        const cmd = commands.get(file.split('Command')[0].toLowerCase());
                        if (!cmd) {
                            const errr = new Error();
                            errr.name = 'ANOMALY_COMMAND_FILENAME';
                            errr.message = `[${file}] command file is not found in ${resolve(__dirname, `../commands/${category}/${file}`)}`;
                            throw errr;
                        }
                        const prop: CommandComponent = new (require(`${this.path}/${category}/${file}`).default)(this.client, { 
                            name: cmd!.meta!.name, 
                            path: `${this.path}/${category}/${file}` 
                        });
                        cmd!.meta!.path = `${this.path}/${category}/${file}`;
                        prop.meta = cmd!.meta;
                        commands.set(prop.meta!.name, prop);
                        moduleConf.cmds.push(prop.meta!.name);
                    });
                    categories.set(category, commands.filter((cmd: CommandComponent | undefined) => (cmd! as any).meta.category === category));
                });
            });
        });
    }
}

export function Command(value: MetaCommand) {
    return function (target: any) {
        const disabledCommands: string[] = [];
        if (value.disabled) disabledCommands.push(value.name);
        if (disabledCommands.length !== 0) log.info(`There are ${disabledCommands.length} command(s) disabled.`);
        value.alias!.forEach(alias => {
            aliases.set(alias, value.name);
        });
        commands.set(value.name, { run: new target(undefined, value), meta: value });
    };
}