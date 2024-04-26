import { Bot, Context } from "grammy";
import { ethers } from "ethers";
import { createConnection, Connection } from "mysql2";

const bot = new Bot("6982927940:AAHxd-jtUvEeWrLyWIeOKytcmlEaym_TuZc");

// const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth");

let connection: Connection;
async function connectToDatabase(ctx: Context){
  try {
    connection = await createConnection({
     host: "172.22.48.66",
     user: "root",
     password: "My$QLpa$$w0rd",
     database: "botinfo"
   });
  }catch (error){
    await ctx.reply("Error connecting to the database", error.message);
  }
}

bot.command("start", async (ctx) => {
  await connectToDatabase(ctx);
  await ctx.reply(
    "My name is the CyberSeer, and I will be assisting you with your crypto magik."
  );
});


bot.use(async (ctx) => {
  let username;
  let userId;
  const firstName = ctx.from?.first_name;
  const lastName = ctx.from?.last_name;

  if (ctx.from?.username != undefined) {
    username = ctx.from.username;
  }
  if (ctx.from?.id != undefined) {
    userId = ctx.from.id;
  }
    ctx.reply ("making a check")
    if (username && userId && firstName && lastName){
      ctx.reply ("sending message");
      const query = "INSERT INTO info (user_Id, username, first_name, last_name, last_seen) VALUES (?, ?, ?, ?, NOW())";
      connection.query(query, [userId, username, firstName, lastName], (error, results, fields) => {
        if (error) {
          console.error ("Error inserting user: ", error); 
          return; 
        }
        ctx.reply ("user inserted successfuly ");
       });
    };
});

bot.command("getId", async (ctx) => {

});

// bot.command("getblocknumber", async (ctx) => {
//   await provider.getBlockNumber();
// });

bot.command("pullinfo", async (ctx) => {
  const tokenAddress = ctx.message
});

bot.start();
