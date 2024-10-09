import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentCollectionService } from './payment-collection.service';

const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentCollectionService.createPayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment started successfully!!',
    data: result,
  });
});

export const PaymentCollectionController = {
    createPayment,
}