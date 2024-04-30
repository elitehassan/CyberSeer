import { Bot, Context } from "grammy";
import { ethers, JsonRpcProvider } from "ethers";
import { createConnection, Connection } from "mysql2";

const bot = new Bot("6982927940:AAHxd-jtUvEeWrLyWIeOKytcmlEaym_TuZc");

const ankrProvider = new JsonRpcProvider("https://rpc.ankr.com/eth");

const contractABI = 
[
  {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "spender",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Approval",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "_maxTxAmount",
              "type": "uint256"
          }
      ],
      "name": "MaxTxAmountUpdated",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "previousOwner",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "newOwner",
              "type": "address"
          }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
  },
  {
      "anonymous": false,
      "inputs": [
          {
              "indexed": true,
              "internalType": "address",
              "name": "from",
              "type": "address"
          },
          {
              "indexed": true,
              "internalType": "address",
              "name": "to",
              "type": "address"
          },
          {
              "indexed": false,
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
          }
      ],
      "name": "Transfer",
      "type": "event"
  },
  {
      "inputs": [],
      "name": "_maxTaxSwap",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "_maxTxAmount",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "_maxWalletSize",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "_taxSwapThreshold",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address[]",
              "name": "bots_",
              "type": "address[]"
          }
      ],
      "name": "addBots",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "owner",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "spender",
              "type": "address"
          }
      ],
      "name": "allowance",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "spender",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "approve",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "account",
              "type": "address"
          }
      ],
      "name": "balanceOf",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "decimals",
      "outputs": [
          {
              "internalType": "uint8",
              "name": "",
              "type": "uint8"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address[]",
              "name": "notbot",
              "type": "address[]"
          }
      ],
      "name": "delBots",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "a",
              "type": "address"
          }
      ],
      "name": "isBot",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "name",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "openTrading",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "owner",
      "outputs": [
          {
              "internalType": "address",
              "name": "",
              "type": "address"
          }
      ],
      "stateMutability": "view",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "removeLimits",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "symbol",
      "outputs": [
          {
              "internalType": "string",
              "name": "",
              "type": "string"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
          {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
          }
      ],
      "stateMutability": "pure",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "transfer",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "inputs": [
          {
              "internalType": "address",
              "name": "sender",
              "type": "address"
          },
          {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
          },
          {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
          }
      ],
      "name": "transferFrom",
      "outputs": [
          {
              "internalType": "bool",
              "name": "",
              "type": "bool"
          }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
      "stateMutability": "payable",
      "type": "receive"
  }
]

// let connection: Connection;
// async function connectToDatabase(ctx: Context){
//   try {
//     connection = await createConnection({
//      host: "172.22.48.66",
//      user: "root",
//      password: "My$QLpa$$w0rd",
//      database: "botinfo"
//    });
//   }catch (error){
//     await ctx.reply("Error connecting to the database", error.message);
//   }
// }

bot.command("start", async (ctx) => {
  // await connectToDatabase(ctx);
  await ctx.reply(
    "My name is the CyberSeer, and I will be assisting you with your crypto magik."
    );
  });
  
  bot.command("getblocknumber", async (ctx) => {
    let blockNumber;
    blockNumber = await ankrProvider.getBlockNumber();
    ctx.reply(blockNumber.toString());
  });

// bot.use(async (ctx) => {
//   let username;
//   let userId;
//   const firstName = ctx.from?.first_name;
//   const lastName = ctx.from?.last_name;

//   if (ctx.from?.username != undefined) {
//     username = ctx.from.username;
//   }
//   if (ctx.from?.id != undefined) {
//     userId = ctx.from.id;
//   }
//     ctx.reply ("making a check")
//     if (username && userId && firstName && lastName){
//       ctx.reply ("sending message");
//       const query = "INSERT INTO info (user_Id, username, first_name, last_name, last_seen) VALUES (?, ?, ?, ?, NOW()) on duplicate key update last_seen=NOW()";
//       connection.query(query, [userId, username, firstName, lastName], (error, results, fields) => {
//         if (error) {
//           ctx.reply ("Error inserting user. "); 
//           return; 
//         }
//         ctx.reply ("user inserted successfuly ");
//        });
//     };
// });

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
  await ctx.reply(formatTokenDetails(tokenDetails));
}catch (error){
  console.error("Error fetching token information", error)
  await ctx.reply ("Error fetching token information. Please notify Rythm.")
}
});

async function getTokenDetails(tokenAddress: string) {
  const contract = new ethers.Contract(tokenAddress, contractABI, ankrProvider);
  const tokenName = await contract.name();
  const tokenMaxBuy = await contract._maxTxAmount();
  const tokenMaxSell = await contract._maxTxSwap();
  const totalSupply = await contract.totalSupply();

  return{
    tokenName: tokenName,
    tokenMaxBuy: tokenMaxBuy.toString(),
    tokenMaxSell: tokenMaxSell.toString(),
    tokenSupply: totalSupply.toString(),
  }

}

function formatTokenDetails(tokenDetails: any ): string {
  return 'Token Name: ${tokenDetails.tokenName}'
}

bot.start();
