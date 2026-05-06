# Data Models & Entity Relationships

**Last Updated:** 2026-05-06  
**Status:** Initial Design - To be refined during implementation  
**Database:** PostgreSQL with Prisma ORM

---

## Overview

This document defines the data models for the LWO platform. The relational structure supports:
- Booking experiences with availability management
- E-commerce for physical products
- Payment processing and order tracking
- Staff authentication and user management
- Content management (via Strapi)

---

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │ (Staff accounts for admin access)
└─────────────┘
       │
       │
       ▼
┌─────────────┐       ┌──────────────┐
│  Customer   │◄─────►│   Booking    │
└─────────────┘       └──────────────┘
       │                      │
       │                      │
       ▼                      ▼
┌─────────────┐       ┌──────────────┐
│    Order    │◄─────►│  Experience  │ (from Strapi)
└─────────────┘       └──────────────┘
       │                      │
       │                      │
       ▼                      ▼
┌─────────────┐       ┌──────────────┐
│   Payment   │       │ Availability │
└─────────────┘       └──────────────┘
```

---

## Core Entities

### 1. User (Staff Authentication)

Staff accounts for admin site access. Managed via NextAuth.

```prisma
model User {
  id             String    @id @default(cuid())
  username       String    @unique
  email          String?   @unique
  hashedPassword String
  role           String    @default("staff") // Future: admin, staff, readonly
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  lastLoginAt    DateTime?

  @@map("users")
}
```

**Fields:**
- `id` - Unique identifier (CUID)
- `username` - Login username (unique)
- `email` - Optional email address
- `hashedPassword` - bcrypt hashed password
- `role` - Permission level (currently single level, future-proofed)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last modification timestamp
- `lastLoginAt` - Last successful login

**Notes:**
- Passwords hashed with bcrypt (10 rounds)
- NextAuth handles session management
- Initially 2-3 accounts total (may be shared)

---

### 2. Customer

Represents visitors who make bookings or purchases. Anonymous until purchase.

```prisma
model Customer {
  id          String    @id @default(cuid())
  email       String    @unique
  firstName   String
  lastName    String
  phone       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  bookings    Booking[]
  orders      Order[]

  @@map("customers")
}
```

**Fields:**
- `id` - Unique identifier
- `email` - Customer email (unique, used for lookups)
- `firstName` / `lastName` - Customer name
- `phone` - Optional contact number
- `createdAt` / `updatedAt` - Timestamps

**Relationships:**
- One customer → Many bookings
- One customer → Many orders

**Notes:**
- Created during checkout (first booking/purchase)
- Email is unique identifier for returning customers
- No password/authentication (anonymous purchases)

---

### 3. Experience

Bookable activities (e.g., "Meet the Meerkats"). Managed in Strapi CMS.

```prisma
model Experience {
  id                String    @id @default(cuid())
  strapiId          Int       @unique // Link to Strapi content
  name              String
  slug              String    @unique
  description       String?
  price             Decimal   @db.Decimal(10, 2)
  duration          Int       // Duration in minutes
  maxCapacity       Int       // Max participants per slot
  isActive          Boolean   @default(true)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  bookings          Booking[]
  availabilityRules AvailabilityRule[]

  @@map("experiences")
}
```

**Fields:**
- `id` - Unique identifier
- `strapiId` - ID from Strapi CMS (for syncing)
- `name` - Experience name
- `slug` - URL-friendly identifier
- `description` - Full description (may cache from Strapi)
- `price` - Cost per person (in GBP)
- `duration` - Length of experience (minutes)
- `maxCapacity` - Maximum participants per time slot
- `isActive` - Whether currently bookable

**Relationships:**
- One experience → Many bookings
- One experience → Many availability rules

**Notes:**
- Primary management in Strapi CMS
- This table caches key data for performance/availability checks
- Sync mechanism TBD (webhook or scheduled job)

---

### 4. AvailabilityRule

Defines when experiences are available and capacity constraints.

```prisma
model AvailabilityRule {
  id           String    @id @default(cuid())
  experienceId String
  experience   Experience @relation(fields: [experienceId], references: [id], onDelete: Cascade)

  // Recurrence
  dayOfWeek    Int?      // 0 = Sunday, 6 = Saturday (null = any day)
  startDate    DateTime? // Optional start date
  endDate      DateTime? // Optional end date
  
  // Time slots
  startTime    String    // HH:MM format (e.g., "10:00")
  endTime      String?   // Optional end time if different from duration
  
  // Capacity override
  capacity     Int?      // Override maxCapacity for this rule
  
  // Blackout dates
  isBlackout   Boolean   @default(false) // If true, experience NOT available
  
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@map("availability_rules")
}
```

**Fields:**
- `experienceId` - Link to experience
- `dayOfWeek` - Day of week (0-6, null = any)
- `startDate` / `endDate` - Date range (optional)
- `startTime` - Time slot start (HH:MM)
- `endTime` - Time slot end (optional)
- `capacity` - Override capacity (optional)
- `isBlackout` - Block availability (holidays, etc.)

**Notes:**
- Complex availability logic (daily slots, seasonal changes, blackouts)
- Multiple rules can apply to same experience
- Query logic: Find applicable rules → Calculate available slots

---

### 5. Booking

Customer reservation for an experience on a specific date/time.

```prisma
model Booking {
  id                String    @id @default(cuid())
  confirmationCode  String    @unique @default(cuid())
  
  // Customer
  customerId        String
  customer          Customer  @relation(fields: [customerId], references: [id])
  
  // Experience
  experienceId      String
  experience        Experience @relation(fields: [experienceId], references: [id])
  
  // Booking details
  bookingDate       DateTime  // Date of visit
  bookingTime       String    // Time slot (HH:MM)
  participants      Int       @default(1) // Number of people
  
  // Pricing
  pricePerPerson    Decimal   @db.Decimal(10, 2)
  totalPrice        Decimal   @db.Decimal(10, 2)
  
  // Status
  status            BookingStatus @default(PENDING)
  paymentId         String?   @unique
  payment           Payment?  @relation(fields: [paymentId], references: [id])
  
  // Check-in
  checkedInAt       DateTime?
  checkedInBy       String?   // User ID who checked in
  
  // Metadata
  specialRequests   String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([bookingDate, bookingTime])
  @@index([experienceId, bookingDate])
  @@map("bookings")
}

enum BookingStatus {
  PENDING           // Awaiting payment
  CONFIRMED         // Payment successful
  CHECKED_IN        // Customer arrived and checked in
  CANCELLED         // Booking cancelled
  NO_SHOW           // Customer didn't arrive
}
```

**Fields:**
- `confirmationCode` - Unique code for customer reference
- `customerId` / `experienceId` - Links to customer and experience
- `bookingDate` / `bookingTime` - When experience happens
- `participants` - Number of people
- `pricePerPerson` / `totalPrice` - Pricing (captured at booking time)
- `status` - Current booking state
- `paymentId` - Link to payment record
- `checkedInAt` / `checkedInBy` - Check-in tracking
- `specialRequests` - Customer notes

**Relationships:**
- Many bookings → One customer
- Many bookings → One experience
- One booking → One payment (optional, if paid)

**Indexes:**
- By date/time for calendar queries
- By experience + date for availability checks

---

### 6. Payment

Payment transaction records for bookings and orders.

```prisma
model Payment {
  id                String        @id @default(cuid())
  
  // PayPal details
  paypalOrderId     String        @unique
  paypalCaptureId   String?       @unique
  
  // Amount
  amount            Decimal       @db.Decimal(10, 2)
  currency          String        @default("GBP")
  
  // Status
  status            PaymentStatus @default(PENDING)
  
  // Metadata
  paymentMethod     String?       // e.g., "paypal", "card"
  payer             Json?         // PayPal payer details
  errorMessage      String?       // If failed
  
  // Relationships
  booking           Booking?
  order             Order?
  
  // Timestamps
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  completedAt       DateTime?

  @@map("payments")
}

enum PaymentStatus {
  PENDING           // Payment initiated
  PROCESSING        // Being processed
  COMPLETED         // Successfully captured
  FAILED            // Payment failed
  REFUNDED          // Payment refunded
  CANCELLED         // Payment cancelled
}
```

**Fields:**
- `paypalOrderId` - PayPal order ID (from create-order)
- `paypalCaptureId` - PayPal capture ID (from capture-order)
- `amount` / `currency` - Payment amount
- `status` - Payment state
- `paymentMethod` - Payment type
- `payer` - PayPal payer info (JSON)
- `errorMessage` - Error details if failed
- `completedAt` - When payment completed

**Relationships:**
- One payment → One booking OR one order (not both)

**Notes:**
- Comprehensive logging for debugging payment issues
- Store PayPal transaction IDs for reconciliation
- Status transitions: PENDING → PROCESSING → COMPLETED/FAILED

---

### 7. Product

Physical products for sale (e.g., adoption packs). Managed in Strapi.

```prisma
model Product {
  id          String    @id @default(cuid())
  strapiId    Int       @unique
  name        String
  slug        String    @unique
  description String?
  price       Decimal   @db.Decimal(10, 2)
  stock       Int?      // Null = unlimited
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  orderItems  OrderItem[]

  @@map("products")
}
```

**Fields:**
- `strapiId` - Link to Strapi CMS
- `name` / `slug` / `description` - Product details
- `price` - Cost (GBP)
- `stock` - Inventory (null = unlimited)
- `isActive` - Whether currently available

**Relationships:**
- One product → Many order items

---

### 8. Order

Purchase of physical products (non-booking purchases).

```prisma
model Order {
  id                String      @id @default(cuid())
  orderNumber       String      @unique @default(cuid())
  
  // Customer
  customerId        String
  customer          Customer    @relation(fields: [customerId], references: [id])
  
  // Pricing
  subtotal          Decimal     @db.Decimal(10, 2)
  shippingCost      Decimal     @db.Decimal(10, 2) @default(0)
  total             Decimal     @db.Decimal(10, 2)
  
  // Status
  status            OrderStatus @default(PENDING)
  paymentId         String?     @unique
  payment           Payment?    @relation(fields: [paymentId], references: [id])
  
  // Shipping
  shippingAddress   Json        // Full address object
  
  // Fulfillment
  fulfilledAt       DateTime?
  trackingNumber    String?
  
  // Metadata
  items             OrderItem[]
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  @@map("orders")
}

enum OrderStatus {
  PENDING           // Awaiting payment
  PAID              // Payment received
  PROCESSING        // Being prepared
  SHIPPED           // Sent to customer
  DELIVERED         // Confirmed delivery
  CANCELLED         // Order cancelled
}

model OrderItem {
  id         String   @id @default(cuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  
  quantity   Int
  priceEach  Decimal  @db.Decimal(10, 2)
  total      Decimal  @db.Decimal(10, 2)
  
  createdAt  DateTime @default(now())

  @@map("order_items")
}
```

**Fields (Order):**
- `orderNumber` - Customer-facing order reference
- `customerId` - Link to customer
- `subtotal` / `shippingCost` / `total` - Pricing breakdown
- `status` - Order state
- `paymentId` - Link to payment
- `shippingAddress` - Delivery address (JSON)
- `fulfilledAt` / `trackingNumber` - Fulfillment tracking

**Fields (OrderItem):**
- Links to order and product
- `quantity` - Number ordered
- `priceEach` - Unit price (captured at purchase)
- `total` - Line total

**Notes:**
- Lower priority than booking system
- Shipping may be digital (adoption packs = PDF?)
- Stock management optional initially

---

## Strapi Content Types

Content managed in Strapi CMS (not in main database):

### NewsArticle
- `title` - Article title
- `slug` - URL slug
- `content` - Rich text content
- `excerpt` - Short summary
- `publishedAt` - Publish date
- `author` - Author name
- `featuredImage` - Image upload

### StaticPage
- `title` - Page title
- `slug` - URL slug
- `content` - Flexible content blocks
- `seoTitle` / `seoDescription` - SEO meta
- `publishedAt` - Publish date

**Note:** Experience and Product data synced to main database for performance.

---

## Data Flow Examples

### Booking Flow
1. Customer selects experience + date/time on public site
2. Check availability (query `Booking` + `AvailabilityRule`)
3. Create `Payment` record (status: PENDING)
4. Create PayPal order, get `paypalOrderId`
5. Customer completes PayPal checkout
6. Capture payment, update `Payment` (status: COMPLETED, `paypalCaptureId`)
7. Create `Booking` record (status: CONFIRMED, link to `Payment`)
8. Create/link `Customer` record
9. Send confirmation email

### Check-In Flow
1. Staff opens admin site booking calendar
2. Search by customer name/email or date
3. Find booking, verify details
4. Mark as checked in (`checkedInAt`, `checkedInBy`, status: CHECKED_IN)

### Availability Check
1. Query `AvailabilityRule` for experience + date
2. Calculate available slots based on rules
3. Query `Booking` for that experience + date
4. Count participants in each slot
5. Return slots with remaining capacity

---

## Indexes & Performance

**Critical Indexes:**
- `Booking.bookingDate + bookingTime` - Calendar queries
- `Booking.experienceId + bookingDate` - Availability checks
- `Customer.email` - Customer lookup
- `Payment.paypalOrderId` - Payment reconciliation
- `Experience.slug` - Public site lookups
- `Product.slug` - Public site lookups

**Query Optimization:**
- Availability queries may benefit from caching
- Consider materialized views for complex availability logic
- Index on `Booking.status` for admin filters

---

## Migration Strategy

1. **Initial schema** - Create all tables with basic fields
2. **Seed data** - Add test experiences, products, users
3. **Iterative refinement** - Add fields as features develop
4. **Production migration** - Import existing bookings from old system (if needed)

---

## Future Enhancements

**Potential additions (not in scope initially):**
- `Review` model for customer reviews
- `Voucher` model for gift vouchers
- `Membership` model for season tickets
- `Discount` model for promo codes
- Audit log tables for compliance
- Customer accounts with authentication
- Loyalty/rewards system

---

**Note:** This is a living document. Update as schema evolves during implementation.
