import { Router } from 'express';
import { FavouriteController } from './favourite.controller';

const router = Router();

router.post('/', FavouriteController.addFavourite);
router.get('/:id', FavouriteController.getFavourites);

router.delete('/:id', FavouriteController.removeFavourite);

export const FavouriteRoutes = router;
