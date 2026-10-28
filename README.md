# Prime Care Services — Next.js + Database Starter

A responsive blue-and-white home-services website for Gurugram, including service pages, customer booking form, unique Booking ID, PostgreSQL database, and a password-protected admin dashboard for manual technician assignment.

## Included
- Responsive homepage, services page and booking page
- AC Repair & Service, Refrigerator Repair, Electrical Services
- Customer booking form with basic validation and a honeypot field
- Unique reference codes such as `PC-20261027-ABCDE`
- PostgreSQL persistence through Prisma
- Admin login using environment-configured credentials and an HTTP-only signed session cookie
- Admin dashboard: search/filter, assign technician manually, add technician phone, status, service charge, payment status, internal notes, and WhatsApp follow-up link
- No payment gateway and no automated technician dispatch

## Requirements
- Node.js 20.9 or newer
- A PostgreSQL database (Neon, Supabase or another PostgreSQL host)

## Local setup
1. Install Node.js.
2. Extract the ZIP and open a terminal in this project folder.
3. Install packages:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` and fill in real values. Set `DATABASE_URL`, a random `SESSION_SECRET` of at least 32 characters, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and your WhatsApp number. Never commit `.env` or share admin credentials.
5. Create database tables:
   ```bash
   npx prisma db push
   ```
6. Start development:
   ```bash
   npm run dev
   ```
7. Open `http://localhost:3000`; admin sign-in is at `/admin/login`.

## Deployment outline (Vercel + managed PostgreSQL)
1. Create a PostgreSQL database with a managed provider such as Neon or Supabase.
2. Push this project to a private Git repository.
3. Import the repository into Vercel.
4. Add all variables from `.env.example` to Vercel Project Settings → Environment Variables. Use a long, random `SESSION_SECRET`; set a strong unique `ADMIN_PASSWORD`; replace example phone numbers.
5. Ensure the database schema is applied before the first production use (`npx prisma db push` from a trusted environment, or set up Prisma migrations for a production workflow). `npm run build` runs `prisma generate`.
6. Deploy, then test customer booking and admin sign-in on the production URL.
7. Configure a custom domain if needed.

## Important production notes
- This is a starter implementation, not a security/compliance audit. Before accepting real customer data, ask a developer to add rate limiting (especially on booking/login routes), production migrations, database backups/retention, monitoring, privacy/terms pages, consent language, and operational testing.
- The current admin login uses one shared account configured by environment variables; there is no multi-user role management or password reset flow.
- The form stores personal information (name, phone, address and issue). Restrict dashboard access and follow applicable privacy and data-protection obligations.
- Customer date/time is a preference only. Submitting does not guarantee a confirmed slot or final price.
- Payments are tracked manually; there is no online payment gateway.
- Update the business name, contact number, WhatsApp number, service area, logo and all copy before launch.
- The hero illustration uses emoji/CSS rather than a licensed technician photograph. Replace with a properly licensed brand image if desired.

## Data model
The `Booking` model is in `prisma/schema.prisma`. Fields include booking code, customer details, service request, preferred schedule, technician assignment, status, payment status, service charge and internal notes.
