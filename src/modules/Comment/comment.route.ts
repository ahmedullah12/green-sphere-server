import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { CommentValidations } from './comment.validations';
import { CommentController } from './comment.controller';

const router = Router();

router.post(
  '/',
  validateRequest(CommentValidations.createCommentValidationSchema),
  CommentController.createComment,
);
router.get('/:id', CommentController.getComments);
router.put(
  '/:id',
  validateRequest(CommentValidations.updateCommentValidationSchema),
  CommentController.updateComments,
);
router.delete('/:id', CommentController.deleteComments);

export const CommentRoutes = router;
