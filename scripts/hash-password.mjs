import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
const password = await rl.question("Admin password: ");
rl.close();

if (!password || password.length < 10) {
  console.error("Use a password of at least 10 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log(hash);
