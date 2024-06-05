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
    // await connectToDatabase(ctx);
    await ctx.reply(
        "My name is the CyberSeer, and I will be assisting you with your crypto magik."
    );
    // let username:string="";
    // const firstName = ctx.from?.first_name;
    // const lastName = ctx.from?.last_name;
    // if (ctx.from?.username != undefined) {
    //     username = ctx.from.username;
    // }
    // if (ctx.from?.id != undefined) {
    //     userId = ctx.from.id;
    // }
    // ctx.reply("making a check")
    // if (username && userId && firstName && lastName) {
    //     ctx.reply("sending message");
    //     const query = "INSERT INTO info (user_Id, username, first_name, last_name, last_seen) VALUES (?, ?, ?, ?, NOW()) on duplicate key update last_seen=NOW();";
    //     const userIdTokenQuery = "INSERT IGNORE INTO tokens (user_Id) VALUES (?);";
    //     connection.query(query, [userId, username, firstName, lastName], (error, results, fields) => {
    //         if (error) {
    //             ctx.reply("Error inserting user. ");
    //             return;
    //         }
    //         connection.query(userIdTokenQuery, [userId], (tokenError) => {
    //             if (tokenError) {
    //                 ctx.reply("Error inserting user to the token table.");
    //                 return;
    //             }
    //             ctx.reply("user inserted successfuly ");
    //         });
    //     });
    // }
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
            const tokenQuery = 'botinfo.UpdateTokens'
        } catch (error) {
            console.error("Error fetching token information", error)
            await ctx.reply("Error fetching token information. Please notify Rythm.")
        }
    });
    
    // async function runProcedure() {
    //     try {
    //       const [rows, fields] = await connection.query('botinfo.UpdateTokens(?, ?);', [userId, tokenAddress]);
    //       console.log(rows); 
    //     } catch (error) {
    //       console.error('Error executing the stored procedure:', error);
    //     }
    //   }


async function getTokenDetails(tokenAddress: string) {
    const contract = new ethers.Contract(tokenAddress, tokenAbi, ankrProvider);
    const tokenName = await contract.name();
    const totalSupply = await contract.totalSupply();
    // Scanners don't use variables to find sell and buy taxes :), they simulate buys and sells and identify balance changes
    // The tax stays in the token contract address, usually, so the tax would be something like: 
    // token balance difference of contract address divided by
    // total tokens bought or sold
    // YOu simulate buys and sells using eth_call, but I recommend for you project to use honeypot.is API or something like that if you don't want
    // to make this more complicated
    return {
        tokenName: tokenName,
        tokenSupply: totalSupply,
        // tokenMaxBuy: tokenMaxBuy.toString(),
    }
    
}

function formatNumber(value:bigint): string {

const supplyValue = Number(value.toString());

    if (supplyValue >= 1e9){
        return (supplyValue/1e9).toFixed(2) + ' b'
    } else if (supplyValue >= 1e6) {
        return (supplyValue / 1e6).toFixed(2) + ' m';
    } else if (supplyValue >= 1e3){
        return (supplyValue / 1e3).toFixed(2)+ ' k';
    }else {
        return supplyValue.toString();   
    }
}

function formatTokenDetails(tokenDetails: any): string {
    return `Token Name: ${tokenDetails.tokenName}
  Total Supply: ${formatNumber(tokenDetails.tokenSupply)}
  Max Buy: ${tokenDetails.tokenMaxBuy}
  `
}

bot.start();