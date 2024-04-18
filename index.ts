import { Bot } from "grammy";
import { ethers } from "ethers";
import { createConnection, Connection } from "mysql";


const bot = new Bot("6982927940:AAHxd-jtUvEeWrLyWIeOKytcmlEaym_TuZc");

let connection: Connection;
async function connectToDatabase(){
  connection = await createConnection({
    host: "172.22.48.66",
    user: "root",
    password: "My$QLpa$$w0rd",
    database: "botinfo"
  });
}

let user: {};

bot.command("start", async (ctx) => {
  await ctx.reply(
    "My name is the CyberSeer, and I will be assisting you with your crypto magik."
  );
}); 

bot.use( async (ctx) => {
  let username;
  let userId;
  const firstName = ctx.from?.first_name;
  const lastName = ctx.from?.last_name;

  if (ctx.from?.username!=undefined){
  username=ctx.from.username;

  if (ctx.from?.id!=undefined){
  userId = ctx.from.id;
  }
  if (username && userId && firstName && lastName){
    const query = "INSERT INTO info (userId, username, first_name, last_name, last_seen) VALUES (?, ?, ?, ?, NOW())";
    connection.query(query, [userId, username, firstName, lastName], (error, results, fields) => {
      if (error) {
        console.error("Error inserting user: ", error); 
        return; 
      }
      console.log("user inserted successfuly ");
     });
   }
  };
});

// bot.command("getId", async (ctx) => {
//   await ctx.reply(user.userId.toString());
// });

bot.command("pullinfo", async (ctx) => {
  const tokenAddress  = ctx.message
});

bot.start();
  