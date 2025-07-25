/* eslint-disable @typescript-eslint/no-explicit-any */

import AppError from "../../errorHelpers/appError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from 'http-status-codes'



const initPayment = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment not found . You have not booked this tour")
    }

    const booking = await Booking.findById(payment.booking)

    const userAddress = (booking?.user as any).address;
    const userEmail = (booking?.user as any).email;
    const userPhoneNumber = (booking?.user as any).phone;
    const userName = (booking?.user as any).name

    // console.log(userName);


    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    // console.log('after',sslPayload.name);

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    return {
        paymentURL: sslPayment.GatewayPageURL
    }
};


const successPayment = async (query: Record<string, string>) => {

    // Update Booking Status to Confirm 
    // Update Payment Status to PAID
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {

            status: PAYMENT_STATUS.PAID,

        }, { runValidators: true, session: session })

        // const updateBooking = await Booking
        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                { new: true, runValidators: true, session }
            )

        await session.commitTransaction();       //transaction
        session.endSession();

        return { success: true, message: "Payment Completed Successfully" };


    } catch (error) {
        await session.abortTransaction();        //rollBack
        session.endSession();
        throw error;
    }
};


const failPayment = async (query: Record<string, string>) => {
    // Update Booking Status to fail 
    // Update Payment Status to fail

    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {

            status: PAYMENT_STATUS.FAILED,

        }, { runValidators: true, session: session })

        // const updateBooking = await Booking
        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.FAILED },
                // { new: true, runValidators: true, session }
                { runValidators: true, session }
            )

        await session.commitTransaction();       //transaction
        session.endSession();

        return { success: false, message: "Payment failed" };

    } catch (error) {
        await session.abortTransaction();        //rollBack
        session.endSession();
        throw error;
    }
};


const cancelPayment = async (query: Record<string, string>) => {
    // Update Booking Status to cancel 
    // Update Payment Status to cancel
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {

            status: PAYMENT_STATUS.CANCELLED,

        }, { runValidators: true, session: session })

        // const updateBooking = await Booking
        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                { runValidators: true, session }
            )

        await session.commitTransaction();       //transaction
        session.endSession();

        return { success: false, message: "Payment cancelled" };

    } catch (error) {
        await session.abortTransaction();        //rollBack
        session.endSession();
        throw error;
    }
};


export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};