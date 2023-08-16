import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloWorld } from "../../target/types/hello_world";
import * as fs from 'fs';
import dotenv from 'dotenv';
import * as toml from "toml";

dotenv.config();

async function main() {

  // 读取 anchor.toml 文件
  const fileContent = fs.readFileSync('../Anchor.toml', 'utf-8');

  // 解析 TOML 文件
  const config = toml.parse(fileContent);
  // console.log(config);

  // 从配置中获取 wallet_path
  const walletPath = config.provider.wallet;
  // console.log(walletPath);

  // 设置环境变量
  process.env.ANCHOR_WALLET = walletPath;

  const provider = anchor.AnchorProvider.local();

  anchor.setProvider(provider);

  const program = anchor.workspace.HelloWorld as Program<HelloWorld>;
  console.log("programId: ", program.programId.toBase58());

  let [helloWorld] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("hello-world")],
    program.programId
  );
  console.log("helloWorld PDA: ", helloWorld.toBase58());

  const authority = provider.wallet.publicKey;

  console.log("authority: ", authority.toBase58());

  // const tx = await program.methods.initialize("Hello World!").accounts({
  //   helloWorld,
  //   authority,
  //   systemProgram: anchor.web3.SystemProgram.programId,
  // }).rpc();

  // console.log("tx signature: ", tx);
  // console.log(
  // `Transaction https://solana.fm/tx/${tx}?cluster=custom`
  // )
  // Fetch the state struct from the network.
  const accountState = await program.account.helloWorld.fetch(helloWorld);
  console.log("account state: ", accountState);


  // Add your test here.
  const tx2 = await program.methods.update("Davirain Love Solana!").accounts({
    helloWorld,
  }).rpc();

  console.log("tx signature: ", tx2);


  // Fetch the state struct from the network.
  const accountState2 = await program.account.helloWorld.fetch(helloWorld);
  console.log("account state: ", accountState2);
}

main()
  .then(() => {
    console.log("Finished successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
