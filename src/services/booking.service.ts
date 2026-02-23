import { axiosInstance } from "@/utils/api";
import type { TBooking, TCreateBookingInput, TUpdateBookingInput } from "@/models/booking.model";

export class BookingService {
  static async getBookingsByBusiness(businessId: string): Promise<TBooking[]> {
    const res = await axiosInstance.get(`/businesses/${businessId}/bookings`);
    return res.data;
  }

  static async getBookingsByCourt(courtId: string): Promise<TBooking[]> {
    const res = await axiosInstance.get(`/courts/${courtId}/bookings`);
    return res.data;
  }

  static async getBookingDetails(bookingId: string): Promise<TBooking> {
    const res = await axiosInstance.get(`/bookings/${bookingId}`);
    return res.data;
  }

  static async createBooking(data: TCreateBookingInput): Promise<TBooking> {
    const res = await axiosInstance.post("/bookings", data);
    return res.data;
  }

  static async updateBooking(bookingId: string, data: TUpdateBookingInput): Promise<TBooking> {
    const res = await axiosInstance.patch(`/bookings/${bookingId}`, data);
    return res.data;
  }

  static async deleteBooking(bookingId: string): Promise<void> {
    await axiosInstance.delete(`/bookings/${bookingId}`);
  }
}
