import { Router } from "express";
import { PaymentCollectionController } from "./payment-collection.controller";


const router = Router();


router.post("/create-payment", PaymentCollectionController.createPayment);

export const PaymentCollectionRoutes = router;