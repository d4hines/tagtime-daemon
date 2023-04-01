import { execSync } from "child_process";
import { config } from "dotenv";
config();
const pavlok = require("pavlok");

const poisson = (average: number): number => {
  const L = Math.exp(-average);
  let k = 0;
  let p = 1;

  do {
    k++;
    p *= Math.random();
  } while (p > L);

  return k - 1;
};

const { CLIENT_ID, CLIENT_SECRET } = process.env;

pavlok.init(CLIENT_ID, CLIENT_SECRET);
pavlok.login(async (result: any, code: any) => {
  if (result) {
    console.log("Logged successfully to Pavlok with code " + code);
    while (true) {
      const delay_seconds = poisson(45*60);
      const date = new Date();
      const day = date.getDay();
      const hour = date.getHours();
      const minute = date.getMinutes();
      if(hour < 22 && hour > 7 && day != 0) {
        console.log(`Sending notification after ${delay_seconds} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay_seconds * 1000));
        pavlok.vibrate();
        execSync(`roam-api create '#tagtime ${hour}:${minute}' #untagged`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
      }
    }
  } else {
    throw new Error("Failed to login to Pavlok.");
  }
});
