import { Bot, Context } from "grammy";
import { ethers, JsonRpcProvider } from "ethers";
import { createConnection, Connection } from "mysql2";
import tokenAbi from './abi.json'


const bot = new Bot("6982927940:AAHxd-jtUvEeWrLyWIeOKytcmlEaym_TuZc");

const ankrProvider = new JsonRpcProvider("https://rpc.ankr.com/eth");

// let connection: Connection;
// async function connectToDatabase(ctx: Context) {
//     try {
//         connection = await createConnection({
//             host: "172.22.48.66",
//             user: "root",
//             password: "My$QLpa$$w0rd",
//             database: "botinfo"
//         });q
//     } catch (error) {
//         await ctx.reply("Error connecting to the database", error.message);
//     }
// }   
let userId=0;

bot.command("start", async (ctx) => {

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
            const isHoneypot = await checkHoneypot(tokenAddress);

            await ctx.reply(formatTokenDetails(tokenDetails, isHoneypot), {
                reply_parameters: { message_id: ctx.msg.message_id }
            });
        } catch (error) {
            console.log(error);
            await ctx.reply("Error fetching token information. Please notify Rythm.")
        }
    });

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
        tokenSupply: ethers.formatUnits(totalSupply, 8).toString(),
        // tokenMaxBuy: tokenMaxBuy.toString(),
    }
    
}

async function checkHoneypot(tokenAddress: string){
    try {
        const response = await fetch('https://api.honeypot.is/your-endpoint');
        if (!response.ok){
            throw new Error ("Failed to check for honeypot")
        }
        const data = await response.json();
        return data.honeypotResult?.isHoneypot || false;
    }catch (honeypotError){
        console.error('Error checking the honeypot data', honeypotError)
        return false;
    }
}


function formatNumber(value:bigint): string {
const supplyValue = Number(value);

    if (supplyValue >= 10e9){
        return (supplyValue/10e9).toFixed(2).toString()+ ' b';
    } else if (supplyValue >= 10e6) {
        return (supplyValue / 10e6).toFixed(2) + ' m';
    } else if (supplyValue >= 10e3){
        return (supplyValue / 10e3).toFixed(2)+ ' k';
    }else {
        return supplyValue.toString();   
    }
}

function formatTokenDetails(tokenDetails: any, isHoneypot: boolean): string {
    return `Token Name: ${tokenDetails.tokenName}
  Total Supply: ${formatNumber(tokenDetails.tokenSupply)}
  Max Buy: ${tokenDetails.tokenMaxBuy}
  Honeypot Status: ${isHoneypot ? 'Token looks like a honeypot': 'Token looks safe'}
  `
}

bot.start();