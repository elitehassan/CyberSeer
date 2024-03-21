import { Bot } from "grammy";

const bot = new Bot("6086262525:AAGnOMFfx8SEM5E8IP2jJb5gWW3JJr63ZZA");
let user: { 
  username: string;
  userId: number;
  }

bot.command("start", async (ctx) => {
  await ctx.reply(
    "My name is the CryptoMancer, and I will be assisting you with your crypto magik."
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
  