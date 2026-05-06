Responses to initial questions:

1. One of my priorities which I should have spelt out is that this whole project needs to be as low cost as possible. Can you please summarise the pros and cons of using Vercel (assume Pro tier would be the right fit?) vs DigitalOcean? If friction / engineering time / complexity / maintenance effort can be significantly reduced by using Vercel at this tier, and it will meet our usage needs, I am very happy to consider it.
2. I am happy to use PostgreSQL (assume with Prisma layer?) if that is the most appropriate tech. I don't _want_ to move away from MongoDB as such, am just conscious that it may not be the ideal fit for the project if we are able to start again from a blank canvas so it makes sense to review it at this stage.
3. Undecided - as simply / cheaply as possible. Ideally hosting the same place as the rest of the project. What are the options / constraints here?
4. Next.js API routes, unless there is a clear reason to create a separate service. I want to avoid unnecessary complexity.
5. I am open to alternatives. I suggested Turborepo as I have some familiarity with it, and don't want to be taking on more new learning curves than necessary. If there is a clear benefit for considering an alternative though I am happy to look at it.
6. I think the PayPal server SDK, for business reasons (it's my understanding that transaction fees are lower, is that still correct?). If the developer experience is vastly different or there are clear gains to moving to Stripe however I can have the conversation with the business to see if they're open to it.
7. I mention Strapi as I have (limited) experience with it. If there are better _free_ options that will deliver our requirements, I am very happy to consider them. I have (even more) limited experience with Sanity, and like it, but my hazy understanding was that the free tier was not sufficient. Can you give more detail on this option please?
8. The zoo map is self contained and more of a stretch goal / final task than the critical early priorities discussed above. Let's kick this into touch for now as it is not really going to depend on the earlier engineering decisions.
9. Simple / basic auth and a single permission level is sufficient. In practice this admin site will only need to be accessed by two staff terminals on-site, one at the front desk and one in the back office. Individual staff members will not even necessarily need personal accounts, a shared 'front of house staff' account will probably suffice. Simplicity of implementation without compromising basic security should be the priority here.
10. This is an area in which I have less experience. I could use a rundown of the candidates and their pros and cons please. Simplicity and robustness - ideally as close to set-and-forget as we can manage - will be key.
11. The current provider is Mailgun, and unless there is a clear reason to change I am happy to stick with them.

Concerns / gaps

1. I think we will need 3 environments - a prod deployment, a staging deployment (with basic auth), and local dev. Local dev and staging can share CMS / back end if that makes most sense.
2. Clean cut over when ready - will manually migrate the few bits that might be necessary
3. Not a concern - SEO should be rethought from scratch and will be a priority.
4. The current site uses basic Google analytics. This is not a huge priority but we should include at least equivalent core analytics. Business logging is more of a priority.
5. None of those other features, at least initially. Booking management is the key functionality of the admin site.
6. This is probably the most complex part of the product - it will include all of the things you have just mentioned and more. It will need to be scoped in detail when we come to fully build it. For now I am just concerned about getting the initial hookup / handshake in place.

Your proposed documentation system looks good, thanks!

---

Responses to follow-up questions

Great, thanks for the detailed follow-up.

I am happy to go with the hybrid hosting approach.

I am happy to go with PostgreSQL / Prisma, and Supabase free.

I am happy to self-host Strapi on DO.

Let's stick with Turborepo.

Let's stick with PayPal.

Let's stick with Strapi.

Let's go with GitHub actions.

Re your questions:

1. GitHub
2. Yes we'll ultimately continue to use the current domain - www.wildlifeoasis.co.uk for prod, and uat.wildlifeoasis.co.uk for UAT.
3. NextAuth please
4. I think I was misleading there. I think it's best to have separate prod, UAT and dev instances of everything.
5. Sounds great!
