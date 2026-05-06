# LWO web platform rebuild - initial brief

## Background

I am going to build a new codebase to deliver a website solution for the Lakeland Wildlife Oasis (LWO) - a small zoo in Cumbria, UK. I previously manually built their current production web offering but it is no longer fit for purpose in a number of ways. Generally speaking, this old product consists of:

- A public facing website, built in Nuxt.js / Vue.js
- A booking system within this to allow anonymous users to purchase tickets (giving a specific date & in some cases time of their planned visit) for add-on experiences with limited availability, such as 'meet the meerkats'
- A limited shop for products not linked to a visit, such as animal adoption packs
- A back-end API to handle these ticket bookings and purchases, built in nodejs / Express.js
- PayPal checkout implementation (entirely in the front end)
- A private 'admin' area within the website allowing authenticated zoo staff to view and manage a calendar of all bookings and match visitors at the door up with their previously purchased add-ons
- Integration to a third party email handler to send confirmation emails for all of these
- MongoDB databases for visitor bookings, product details, availability etc
- Non-prod versions of all of the above to allow testing of changes before deployment
- An interactive zoo map with a complex layered svg graphic showing the layout of the site and allowing users to see more information about some of the animals living there
- A rudimentary CMS-lite allowing zoo staff to create simple and inflexibly laid out news articles and content posts, of which the most recent are displayed on the home page (also dedicated pages to see them going back further into history)
- Various other miscellaneous static content - 'about us', 'education info', cafe menus etc
- Contact details, mailto links, embed of the zoo's facebook feed
- Hosting of most of the above on a DigitalOcean droplet (databases are hosted by MongoDB cloud)

I was the sole developer of all of this, and am the sole maintainer, in free time around my full-time day job - this is not sustainable.

The idea is to entirely rebuild the above with a more modern tech stack and resolve a number of pain points:

- use Typescript throughout
- use Next.js / React.js for FE code, as I have way more experience of these than Vue and use them constantly on other projects
- use modern, futureproof and appropriate database technology
- use a free CMS solution such as Strapi
- be well documented throughout
- the 'admin site' should be an entirely separate site rather than being a gated section of the public-facing app
- have automated CI / deployment processes, redeploying automatically when new content is published in the CMS for eg
- have significant unit / integration test coverage, especially in the areas of payment handling and CMS integration
- have some e2e test coverage (ultimately - this is lower priority)
- User-facing content across the site should be manageable to a significant degree by zoo staff using a CMS, rather than the vast majority of copy and layout being baked into site code and only updatable by me.
- Bookable experiences / products should also be manageable in this CMS by zoo staff
- Payment processing should be more reliable and handled on the back end - the current FE-only paypal button integration is very flaky.
- Useful logging should be built into the new site from the start - this is largely absent from the current site

The end goal here is to create a web platform that can to a greater extent be handed over to the zoo staff themselves, with less reliance on me to make trivial updates. I also need to have problems quickly and directly flagged to me, and to be able to diagnose and fix them quicker when they arise. Unlike the current site, which is entirely manually built and maintained, this new version will heavily leverage AI agents from the outset.

## The approach

I would first like to define a project architecture that can deliver the goals above. I think a monorepo (potentially turborepo?) with applications within it for the public site, admin site, api, strapi cms, shared types etc is probably the way to go - but would like to discuss this to get it right before committing.

Once the architecture approach is agreed, I would like to get a very, very simple placeholder of each application set up and concentrate on getting them talking to each other before giving any thought to their actual content. I would then like to get the CI scaffold in place. The next priority should be the payment integration, then the first real feature should be getting the bookable product CMS management / purchasing in public site / availability management in admin site all hooked up. Essentially I want to focus on infrastructure first before getting into any of the 'easy bit', ie the content itself.

I would like to be challenged throughout and will be happy to take alternative approaches if you feel that what I suggest at any point is setting us up for problems further down the line. Ask questions!!
