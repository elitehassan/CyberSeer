import { Bot } from "grammy";

const bot = new Bot("6982927940:AAHxd-jtUvEeWrLyWIeOKytcmlEaym_TuZc");
let user: { 
  username: string;
  userId: number;
  }

bot.command("start", async (ctx) => {
  await ctx.reply(
    "My name is the CyberSeer, and I will be assisting you with your crypto magik."
  );
}); 


bot.on("message", async (ctx) => {
  await ctx.reply("hi");
});

bot.use( async (ctx) => {
  if (ctx.from?.username!=undefined){
  user.username=ctx.from?.username;
  }
  if (ctx.from?.id!=undefined){
    user.userId=ctx.from.id;
  }
});

bot.start();
  