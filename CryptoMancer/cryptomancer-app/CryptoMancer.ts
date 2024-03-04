import {Bot} from "grammy";

const bot = new Bot("");

//Handling the /start command
bot.command("start", (ctx) => ctx.reply("My name is the CryptoMancer, and I will be assisting you with your crypto magik."))
//listen to messages
bot.on("message", async (ctx) =>    {
    const message = ctx.message; //message object
});
//listen to edited messages
bot.on("edited_message", async (ctx) =>     {
    const editedMsg = ctx.msg.text;
});

console.log("Lama Rammal, Hassan Rammal");
console.log("further testing");
