import { Elysia, t } from "elysia";
import { Stripe } from "stripe";

interface Kit {
  stripe: Stripe,
  secret: string,
}

const kit: Kit = {
  stripe: new Stripe(process.env.STRIPE_API_KEY!),
  secret: process.env.STRIPE_WEBHOOK_SECRET!,
}


// TODO
// just make a general "handle stripe event" function that takes in the stripe
// event and does all of the transaction stuff with it and returns an error
// if necessary

const app = new Elysia()
  .state("kit", kit)
  .onParse((ctx) => {
    return ctx.request.text();
  })
  .get("/", () => {
    console.log("hello, world!");
  })
  .post("/webhook", async (ctx) => {
    const buffer = Buffer.from(ctx.body);
    const signature = ctx.headers["stripe-signature"];
    const { stripe, secret } = ctx.store.kit;

    if (signature === undefined) {
      console.log("Error: no signature");
      return ctx.error(500);
    }

    try {
      const event = await stripe.webhooks.constructEventAsync(buffer, signature, secret);
      console.log("YAYAYAYYAY!!!!");
      console.log(event);
    } catch (e) {
      console.log("FUCK!!!!")
      console.log(e);
    }
    
  }, {
    body: t.String(),
  })


app.listen(3000, () => {
  console.log("App started in port 3000");
});
