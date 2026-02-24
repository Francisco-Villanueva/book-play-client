import { axiosInstance } from "@/utils/api";
import type { TBooking, TCreateBookingInput } from "@/models/booking.model";

export class BookingService {
  static async getBookingsByBusiness(businessId: string): Promise<TBooking[]> {
    const res = await axiosInstance.get(`/businesses/${businessId}/bookings`);
    return res.data;
  }

  static async getBookingDetails(
    businessId: string,
    bookingId: string,
  ): Promise<TBooking> {
    const res = await axiosInstance.get(
      `/businesses/${businessId}/bookings/${bookingId}`,
    );
    return res.data;
  }

  static async createBooking(
    businessId: string,
    data: TCreateBookingInput,
  ): Promise<TBooking> {
    const res = await axiosInstance.post(
      `/businesses/${businessId}/bookings`,
      data,
    );
    return res.data;
  }

  static async cancelBooking(
    businessId: string,
    bookingId: string,
  ): Promise<TBooking> {
    const res = await axiosInstance.patch(
      `/businesses/${businessId}/bookings/${bookingId}/cancel`,
    );
    return res.data;
  }
}
