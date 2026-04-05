

# EVERLUSH CUSTOMS 🌸 — Implementation Plan

## Overview
A fully functional handmade gifts ordering system built with React + Supabase, featuring customer ordering, order tracking, admin panel, WhatsApp integration, and UPI payments.

## Database Schema (Supabase/PostgreSQL)

**Tables:**
- `customers` — phone (text, PK), name (text)
- `orders` — id (serial), phone (text FK), total (numeric), created_at, delivery_date, delivery_time, status (default "Pending"), cancel_request (default "No")
- `order_items` — id (serial), order_id (FK), product (text), option (text), quantity (int), price (numeric), subtotal (numeric)
- `admin_users` — id (uuid FK to auth.users), created_at

RLS policies on all tables. Admin access verified via `admin_users` table.

## Pages & Routes

1. **`/` — Customer Order Page** (main page)
   - Header: "EVERLUSH CUSTOMS 🌸" with subtitle
   - Form: Name, Phone, dynamic product rows (add/remove)
   - Product dropdowns with conditional option dropdowns (sizes/layers)
   - Quantity input per product
   - Validation: disable "Place Order" until valid
   - On submit: insert customer + order + items, show success with Order ID & total
   - WhatsApp button (opens `wa.me` link with order details — placeholder number for now)
   - UPI payment button (placeholder UPI ID for now)

2. **`/my-orders` — My Orders Page**
   - Phone number input to look up orders
   - Display order list with ID, items, total, status, cancel request status, date
   - "Request Cancel" button (only on Pending orders with no existing request)

3. **`/admin` — Admin Login Page**
   - Email/password login via Supabase Auth
   - Only users in `admin_users` table can access

4. **`/admin/orders` — Admin Orders Dashboard**
   - Protected route (requires admin login)
   - All orders listed with customer info, items, totals, status, cancel requests
   - Approve/Reject cancel buttons
   - Approve → sets status="Cancelled", cancel_request="Approved", opens WhatsApp to notify customer
   - Reject → sets cancel_request="Rejected"

## Pricing Logic (hardcoded in a constants file)

All pricing as specified: Flower Bouquet (549–1149), Chocolate Bouquet (649–1199), Chocolate Tower (699–1699), Keychains (199), Bracelets (299), Coffee Cup (399), Greeting Cards (249).

## Implementation Steps

1. **Set up Supabase Cloud** — create tables, RLS policies, admin role
2. **Build shared constants** — product definitions, pricing map, product-option mappings
3. **Build Customer Order Page** — form with dynamic product rows, validation, order submission
4. **Build order success flow** — display Order ID, total, WhatsApp link, UPI button
5. **Build My Orders page** — phone lookup, order list, cancel request functionality
6. **Build Admin auth** — login page, admin check, protected routes
7. **Build Admin dashboard** — order management, approve/reject cancellations
8. **Mobile responsive styling** — clean, branded UI throughout

## Technical Details

- Supabase Cloud for database + auth + RLS
- React Router for navigation
- React Hook Form + Zod for validation
- Tailwind CSS for responsive styling
- Edge function for order processing (validate, calculate total, insert)
- WhatsApp via `https://wa.me/{number}?text={encoded_message}`
- UPI via `upi://pay?pa={upi_id}&am={amount}` deep link

