import { Bot, Context } from "grammy";
import { ethers, JsonRpcProvider } from "ethers";
import { createConnection, Connection } from "mysql2";
import tokenAbi from './abi.json'

const bot = new Bot("6982927940:AAHxd-jtUvEeWrLyWIeOKytcmlEaym_TuZc");

const ankrProvider = new JsonRpcProvider("https://rpc.ankr.com/eth");

let connection: Connection;
async function connectToDatabase(ctx: Context) {
    try {
        connection = await createConnection({
            host: "172.22.48.66",
            user: "root",
            password: "My$QLpa$$w0rd",
            database: "botinfo"
        });
    } catch (error) {
        await ctx.reply("Error connecting to the database", error.message);
    }
}   
let userId=0;

bot.command("start", async (ctx) => {
    await connectToDatabase(ctx);
    await ctx.reply(
        "My name is the CyberSeer, and I will be assisting you with your crypto magik."
    );
    let username:string="";
    const firstName = ctx.from?.first_name;
    const lastName = ctx.from?.last_name;
    if (ctx.from?.username != undefined) {
        username = ctx.from.username;
    }
    if (ctx.from?.id != undefined) {
        userId = ctx.from.id;
    }
    ctx.reply("making a check")
    if (username && userId && firstName && lastName) {
        ctx.reply("sending message");
        const query = "INSERT INTO info (user_Id, username, first_name, last_name, last_seen) VALUES (?, ?, ?, ?, NOW()) on duplicate key update last_seen=NOW();";
        const userIdTokenQuery = "INSERT IGNORE INTO tokens (user_Id) VALUES (?);";
        connection.query(query, [userId, username, firstName, lastName], (error, results, fields) => {
            if (error) {
                ctx.reply("Error inserting user. ");
                return;
            }
            connection.query(userIdTokenQuery, [userId], (tokenError) => {
                if (tokenError) {
                    ctx.reply("Error inserting user to the token table.");
                    return;
                }
                ctx.reply("user inserted successfuly ");
            });
        });
    }
});

bot.command("getblocknumber", async (ctx) => {
    let blockNumber;
    blockNumber = await ankrProvider.getBlockNumber();
    ctx.reply(blockNumber.toString());
});

// bot.command("getId", async (ctx) => {
    
    // });

bot.command("pullinfo", async (ctx) => {
    const tokenAddress = ctx.message!.text!.split(" ")[1];
    if (!tokenAddress) {
        await ctx.reply("Not a valid token address. ");
        return;
    }
    try {
        const tokenDetails = await getTokenDetails(tokenAddress);
        await ctx.reply(formatTokenDetails(tokenDetails), {
            reply_parameters: { message_id: ctx.msg.message_id }
        });
        
    } catch (error) {
        console.error("Error fetching token information", error)
        await ctx.reply("Error fetching token information. Please notify Rythm.")
    }
    const tokenQuery = `DECLARE count int;
    DECLARE origin VARCHAR(42);
    DECLARE dest VARCHAR(42);
    SET count = 4;
    WHILE count >= 1 DO
    SET origin=concat('token',count);
    SET dest=concat('token',count+1);    
    UPDATE botinfo.tokens
    set dest = (SELECT origin FROM botinfo.tokens WHERE user_id=?)
    WHERE user_id=?;
    set count =count-1;
    END WHILE; 
    UPDATE tokens SET token1=? WHERE user_id=?;`;
    connection.query(tokenQuery, [userId, userId, tokenAddress, userId], (error, results, fields) =>{
    if (error) {
        ctx.reply("Error inserting token into the table.");
        return;
    }
    ctx.reply("token inserted")
    });
});


async function getTokenDetails(tokenAddress: string) {
    const contract = new ethers.Contract(tokenAddress, tokenAbi, ankrProvider);
    const tokenName = await contract.name();
    const totalSupply = await contract.totalSupply();
    //   const tokenMaxBuy = await contract._maxTxAmount();
    // Scanners don't use variables to find sell and buy taxes :), they simulate buys and sells and identify balance changes
    // The tax stays in the token contract address, usually, so the tax would be something like: 
    // token balance difference of contract address divided by
    // total tokens bought or sold
    // YOu simulate buys and sells using eth_call, but I recommend for you project to use honeypot.is API or something like that if you don't want
    // to make this more complicated
    return {
        tokenName: tokenName,
        tokenSupply: ethers.formatUnits(totalSupply, 18).toString(),
        // tokenMaxBuy: tokenMaxBuy.toString(),
    }

}
function formatTokenDetails(tokenDetails: any): string {
    return `Token Name: ${tokenDetails.tokenName}
  Total Supply: ${tokenDetails.tokenSupply}
  Max Buy: ${tokenDetails.tokenMaxBuy}
  `
}

bot.start();