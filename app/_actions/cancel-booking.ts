"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../_lib/prisma";

export const cancelBooking = async (bookingId: string) => {
  await prisma.booking.delete({
    where: {
      id: bookingId,
    },
  });
  revalidatePath("/bookings");
};
