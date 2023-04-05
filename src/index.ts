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
      const delay_minutes = poisson(45);
      const delay_milliseconds = delay_minutes * 60 * 1000;
      console.log("Waiting...");
      await new Promise((resolve) => setTimeout(resolve, delay_milliseconds));
      const date = new Date();
      const day = date.getDay();
      const hour = date.getHours();
      const hour_text = `0${date.getHours()}`.slice(-2);
      const minute_text = `0${date.getMinutes()}`.slice(-2);  
      const time = `${hour_text}:${minute_text}`;
      if (hour < 22 && hour > 6 && day != 0) {
        pavlok.vibrate();
        execSync(`roam-api create '{{[[TODO]]}} #tagtime ${time}'`);
        console.log(`Sent notification after ${delay_minutes} minutes...`);
      } else {
        execSync(`roam-api create '#tagtime ${time} #untracked'`);
        console.log(`Logged untracked time after ${delay_minutes} minutes...`);
      }
    }
  } else {
    throw new Error("Failed to login to Pavlok.");
  }
});
