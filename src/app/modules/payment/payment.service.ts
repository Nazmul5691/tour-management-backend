import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";



const successPayment = async (query: Record<string, string>) => {

    // Update Booking Status to Confirm 
    // Update Payment Status to PAID
    const session = await Booking.startSession();
    session.startTransaction();


    try {


        const updatedPayment = await Payment.findOneAndUpdate({ transactionId: query.transactionId }, {

            status: PAYMENT_STATUS.PAID,

        }, { new: true, runValidators: true, session: session })

        // const updateBooking = await Booking
        await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                { new: true, runValidators: true, session }
            )
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment")



        await session.commitTransaction();       //transaction
        session.endSession();

        return {success: true, message: "Payment Completed Successfully"};


    } catch (error) {
        await session.abortTransaction();        //rollBack
        session.endSession();
        throw error;
    }


};


const failPayment = async (query: Record<string, string>) => {
    // Update Booking Status to fail 
    // Update Payment Status to fail

};


const cancelPayment = async (query: Record<string, string>) => {
    // Update Booking Status to cancel 
    // Update Payment Status to cancel
};


export const PaymentService = {
    // initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};