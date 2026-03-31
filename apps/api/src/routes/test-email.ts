import { email } from "@coco-kit/email";
import { Hono } from "hono";

export const testEmailRouter = new Hono();

testEmailRouter.get("/", async (c) => {
  await email.sendVerifyEmail("work.shivam@proton.me", {
    name: "Shivam",
    url: "https://coco-kit.com/verify?token=test",
  });
  return c.text("sent");
});
