import { Router } from 'express';
import { PaymentCollectionController } from './payment-collection.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/create-payment', PaymentCollectionController.createPayment);
router.get('/', auth('ADMIN'), PaymentCollectionController.getPayments);

export const PaymentCollectionRoutes = router;
