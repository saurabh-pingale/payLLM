import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import idl from './idl.json'
import { Program, BN, web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { SOL_WALLET_KEYPAIR } from "./constants";
import { RecordIDL } from "../common/idl";

const secretKey = Uint8Array.from(
    []
);

interface RecordMessageOnchain{
    ai_query: string,
    ai_model: string,
    credits: number,
    amount: number,
    receiver: string,
    user_query: string
}

export const record_message_onchain = async ({ai_query, ai_model, credits, amount, receiver, user_query}:RecordMessageOnchain) => {
    const connection = new Connection(clusterApiUrl('devnet'), anchor.AnchorProvider.defaultOptions());
    const feePayer = Keypair.fromSecretKey(secretKey);
    const provider = new anchor.AnchorProvider(connection, {
        publicKey: feePayer.publicKey,
        signTransaction: async (tx: any) => {
          tx.partialSign(feePayer);
          return tx;
        },
        signAllTransactions: async (txs:any) => {
          txs.forEach((tx: any) => tx.partialSign(feePayer));
          return txs;
        },
      } as any, {
        preflightCommitment: "processed",
      });
    anchor.setProvider(provider);
    const idl_string = JSON.stringify(idl);
    const idl_object = JSON.parse(idl_string);
    const program = new Program<RecordIDL>(idl_object, provider);    
    const formPublicKey = web3.Keypair.generate();
    const tx = await program.methods.recordData(
        ai_query,
        ai_model,
        new BN(credits),
        new BN(amount * web3.LAMPORTS_PER_SOL),
        receiver,
        user_query
    )
    .accounts({
        record: formPublicKey.publicKey,
        owner: feePayer.publicKey,
    })
    .signers([formPublicKey, feePayer])
    .rpc();

    //TODO - Show on the chat
    console.log('---transactionSignature--', tx)
}