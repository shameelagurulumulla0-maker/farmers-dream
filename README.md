# Farmers Dream (FD)

A farmer-centred, wholesale-only Sri Lankan marketplace connecting farmers with buyers, transport providers, fertilizer suppliers, equipment sellers, agricultural land sellers and exporters.

## Run the prototype

Download `Farmers-Dream.html` and open it in a browser. This standalone file contains the application, styles and translations. Alternatively, serve `dist/` with any static HTTP server. No dependencies or build step are needed. Google Fonts is optional; fallback fonts work offline.

To regenerate the standalone file from source:

```sh
python3 scripts/package_preview.py
```

## Included

- Responsive mobile and desktop browser layouts.
- English, Sinhala and Tamil interface selection with a saved preference.
- Local registration, demo sign-in and role-based opportunity views for seven roles.
- Dedicated category pages with registered-member directories, search and district filtering.
- Transport profiles with vehicle photos, rate basis, routes, availability and actual local transport bid details.
- Separate fertilizer product, promotional-offer and farmer-request groups.
- Listings with up to five photos, price, description, quality, quantity, unit, contact number, location and wholesale terms.
- Saved opportunities, local enquiry drafts and provider profile editing with contact-number visibility opt-in.
- Separate open buyer-bid and transport-quote panels on farmers' produce offers.

## Prototype boundaries

This is a local prototype, not a production marketplace. An Apple Silicon macOS desktop wrapper is included; mobile and Windows packages are not yet built. Profiles, listings, images, bids and drafts are stored in the browser on one device. Sign-in is a demo profile selector, not secure authentication. No phone verification, shared database, message delivery, payment, winner selection or cross-device synchronization is connected. Clearing browser storage removes the saved data. Images are resized before saving, but browser storage remains limited. Use sample contact details when testing.

The interface and sample content are translated; user-entered names and listings remain as entered. Native-speaker review of Sinhala/Tamil and visual browser validation remain pending. Behavior checks used a simulated DOM/canvas and do not establish full browser compatibility.

## Project files

- `dist/`: editable application source.
- `Farmers-Dream.html`: portable standalone app generated from the source.
- `docs/PHASE-1.md`: requirements, implementation notes and validation limits.
- `docs/PROJECT-SETUP.md`: preserved original setup and phase-by-phase diagram plan.
- `scripts/package_preview.py`: reproducible standalone packaging.

## Deployment hold

Cloudflare is the intended backend/web platform. No deployment, preview URL, custom domain, push-triggered build, deployment workflow or deployment credentials are authorized until the owner separately approves deployment. This source upload does not authorize deployment. No deployment automation is included.

Production work still requires authenticated API access, verified accounts, server-side ownership checks, shared persistence, image uploads, moderation, audit history and suitable native-app packaging/distribution decisions.

License selection remains pending.

## macOS desktop

A native macOS wrapper is available in `desktop/macos/`. Run `bash desktop/macos/build.sh` to bundle the latest shared interface as Farmers Dream.app. See `desktop/macos/README.md` for build instructions and local data boundaries. The desktop app is a local WKWebView wrapper, not a live backend or App Store release.

## Farm Produce directory and reviews

Registered farmers appear on numbered pages, six per page, with all 25 districts available as filters. Sort by newest, price (low/high) or customer star rating. Directory price comparisons use a selected unit and the farmer's lowest matching produce offer. Each member profile has customer reviews. The local review demonstration requires a registered customer to record a received purchase/service, the provider to confirm completion, and then permits one review for that transaction. Production verification still requires the backend and real transaction evidence.

Run the focused behavior checks with `node tests/community.test.mjs` when Node.js is available. These checks simulate the DOM and do not replace browser testing. The desktop bundle must be rebuilt from updated source to include later changes; source pushes do not automatically update an already built app.
