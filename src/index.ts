import { config } from "dotenv";
config();
const pavlok = require("pavlok");

const { CLIENT_ID, CLIENT_SECRET } = process.env;

const vibrate = () =>
  new Promise<void>((resolve, reject) =>
    pavlok.vibrate({
      callback: (result: boolean, message: string) => {
        if (result) {
          resolve();
        } else {
          reject(message);
        }
      },
    })
  );

pavlok.init(CLIENT_ID, CLIENT_SECRET);
pavlok.login(async (result: any, code: any) => {
  if (result) {
    console.log("Logged successfully to Pavlok with code " + code, result);
    while (true) {
      const delay_milliseconds = 4 * 1000;
      console.log("Waiting...");
      await new Promise((resolve) => setTimeout(resolve, delay_milliseconds));
      try {
        await vibrate();
      } catch (error) {
        console.error(error)
      }
    }
  } else {
    throw new Error("Failed to login to Pavlok.");
  }
});
