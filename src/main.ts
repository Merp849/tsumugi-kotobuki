import BotClient from "./handlers/Client";

new BotClient({ disableMentions: "everyone", fetchAllMembers: false })
.build();