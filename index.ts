import { Bot } from "grammy";
import { ethers } from "ethers";

const bot = new Bot("6982927940:AAHxd-jtUvEeWrLyWIeOKytcmlEaym_TuZc");

let user: {};

bot.command("start", async (ctx) => {
  await ctx.reply(
    "My name is the CyberSeer, and I will be assisting you with your crypto magik."
  );
}); 

bot.use( async (ctx) => {
  let username;
  let userId;

  if (ctx.from?.username!=undefined){
  username=ctx.from.username;

  if (ctx.from?.id!=undefined){
  userId = ctx.from.id;
  }
   user = {
    username: username,
    userId: userId
  };
}
});

// bot.command("getId", async (ctx) => {
//   await ctx.reply(user.userId.toString());
// });

bot.command("pullinfo", async (ctx) => {
  const tokenAddress  = ctx.message
});

bot.start();
  