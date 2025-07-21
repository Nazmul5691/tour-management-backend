/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model"
import { BOOKING_STATUS, IBooking } from "./booking.interface"
import httpStatus from 'http-status-codes'
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";


const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}


const createBooking = async (payload: Partial<IBooking>, userId: string) => {

    const transactionId = getTransactionId();

    const user = await User.findById(userId);
    // console.log(user?.phone, user?.address);

    // if (!user?.phone) {
    if (!user?.phone || !user?.address) {
        throw new AppError(httpStatus.BAD_REQUEST, "Please update your profile to Book a tour")
    }

    const tour = await Tour.findById(payload.tour).select("costFrom")

    const amount = Number(tour?.costFrom) * Number(payload.guestCount!)

    const booking = await Booking.create({
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
    })

    throw new Error("some fake error")

    const payment = await Payment.create({
        booking: booking._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: transactionId,
        amount: amount
    })

    const updateBooking = await Booking
    .findByIdAndUpdate(
        booking._id, 
        { payment: payment._id }, 
        { new: true, runValidators: true }
    )
    .populate("user", "name email phone address")
    .populate("tour", "title costFrom")
    .populate("payment")



    return updateBooking;
}





const getUserBookings = async () => {

    return {

    }
}


const getBookingById = async () => {

    return {

    }
}


const updateBookingStatus = async () => {

    return {

    }
}


const getAllBookings = async () => {

    return {}
}



export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings
}


