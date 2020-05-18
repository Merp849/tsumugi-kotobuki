import { MessageOptions, PermissionString, Snowflake, Collection, GuildMemberResolvable, ClientEvents, UserResolvable, BanOptions, FetchMemberOptions, FetchMembersOptions, Guild, GuildManager, GuildMemberManager, VoiceState, GuildMember, VoiceStateManager, Message, User, UserManager, ChannelResolvable, TextChannel, DMChannel, NewsChannel, MessageAdditions, APIMessage, SplitOptions, StringResolvable } from "discord.js";
import BotClient from "../handlers/Client";

export interface MetaCommand {
    name: string;
    description?: string;
    alias?: string[];
    cooldown?: number;
    usage?: string;
    example?: string;
    ownerOnly?: boolean;
    disabled?: boolean;
    path?: string;
    category?: string;
}

export interface CommandComponent {
    meta?: MetaCommand;
    run(event: IMessage): Promise<IMessage | void>;
}

export interface ModuleConf {
    name: string;
    hide: boolean;
    path: string;
    cmds: string[];
}

export interface HelpMeta {
    name: string;
    hide: boolean;
    path: string;
    cmds: string[];
}

export interface EventProp {
    name: keyof ClientEvents;
    execute(...args: ClientEvents[EventProp["name"]]): any;
}

export interface IGuild extends Guild {
    me: IGuildMember;
    owner: IGuildMember;
    members: IGuildMemberManager;
    voice: IVoiceState | null;
    voiceStates: IVoiceStateManager;
    setOwner(owner: GuildMemberResolvable, reason? : string): Promise<IGuild>;
    config: {
        prefix?: string;
        allowDefaultPrefix?: boolean;
    };
}

export interface IGuildManager extends GuildManager {
    cache: Collection<Snowflake, IGuild>;
}

export interface IGuildMemberManager extends GuildMemberManager {
    cache: Collection<Snowflake, IGuildMember>;
    guild: IGuild;
    ban(user: UserResolvable, options? : BanOptions): Promise<IGuildMember | IUser | Snowflake>;
    fetch(options: UserResolvable | FetchMemberOptions | (FetchMembersOptions & { user: UserResolvable })): Promise<IGuildMember>;
    fetch(options? : FetchMembersOptions): Promise<Collection<Snowflake, IGuildMember>>;
    resolve(member: GuildMemberResolvable): IGuildMember;
    unban(user: UserResolvable, reason? : string): Promise<IUser>;
}

export interface IGuildMember extends GuildMember {
    user: IUser;
    isDev: boolean;
    guild: IGuild;
    voice: IVoiceState;
}

export interface IVoiceState extends VoiceState {
    guild: IGuild;
    member: IGuildMember | null;
    setDeaf(deaf: boolean, reason? : string): Promise<IGuildMember>;
    setMute(mute: boolean, reason? : string): Promise<IGuildMember>;
    kick(reason? : string): Promise <IGuildMember>;
    setChannel(channel: ChannelResolvable | null, reason? : string): Promise<IGuildMember>;
}

export interface IVoiceStateManager extends VoiceStateManager {
    guild: IGuild;
    cache: Collection<Snowflake, IVoiceState>;
}

export interface IMessage extends Message {
    guild: IGuild | null;
    channel: ITextChannel | IDMChannel | INewsChannel;
    author: IUser;
    member: IGuildMember | null;
    client: BotClient;
    args: string[];
    cmd: string;
    flag: string[];
}

export interface ITextChannel extends TextChannel {
    guild: IGuild;
    client: BotClient;
    send(options: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions | APIMessage): Promise<IMessage>;
    send(options: (MessageOptions & { split: true | SplitOptions; content: StringResolvable }) | APIMessage): Promise<IMessage[]>;
    send(content: StringResolvable, options?: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions): Promise<IMessage>;
    send(content: StringResolvable, options?: MessageOptions & { split: true | SplitOptions }): Promise<IMessage[]>;
}

export interface IDMChannel extends DMChannel {
    client: BotClient;
    send(options: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions | APIMessage): Promise<IMessage>;
    send(options: (MessageOptions & { split: true | SplitOptions; content: StringResolvable }) | APIMessage): Promise<IMessage[]>;
    send(content: StringResolvable, options?: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions): Promise<IMessage>;
    send(content: StringResolvable, options?: MessageOptions & { split: true | SplitOptions }): Promise<IMessage[]>;
}

export interface INewsChannel extends NewsChannel {
    client: BotClient;
    guild: IGuild;
    send(options: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions | APIMessage): Promise<IMessage>;
    send(options: (MessageOptions & { split: true | SplitOptions; content: StringResolvable }) | APIMessage): Promise<IMessage[]>;
    send(content: StringResolvable, options?: MessageOptions | (MessageOptions & { split?: false }) | MessageAdditions): Promise<IMessage>;
    send(content: StringResolvable, options?: MessageOptions & { split: true | SplitOptions }): Promise<IMessage[]>;
}

export interface IUser extends User {
    isDev: boolean;
}

export interface IUserManager extends UserManager {
    cache: Collection <Snowflake, IUser>;
    client: BotClient;
    fetch(id: Snowflake, cache? : boolean): Promise<IUser>;
    resolve(user: UserResolvable): IUser;
    resolveID(user: UserResolvable): Snowflake;
}
