// Shared TypeScript types for LWO platform

/**
 * Booking status enum
 */
export type BookingStatus = "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CANCELLED" | "NO_SHOW";

/**
 * Payment status enum
 */
export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

/**
 * Order status enum
 */
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

/**
 * Example type - will be expanded as we build features
 */
export type User = {
  id: string;
  username: string;
  email: string | null;
  role: string;
};
