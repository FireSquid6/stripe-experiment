import { Elysia } from "elysia";
import { Stripe } from "stripe";

interface Kit {
  stripe: Stripe,
  secret: string,
}

const kit: Kit = {
  stripe: new Stripe(process.env.STRIPE_API_KEY!),
  secret: process.env.STRIPE_WEBHOOK_SECRET!,
}

const app = new Elysia()
  .state("kit", kit)
  .get("/", () => {
    console.log("hello, world!");
  })
  .post("/webhook", (ctx) => {
    console.log(ctx.body);
  })


app.listen(3000, () => {
  console.log("App started in port 3000");
});
