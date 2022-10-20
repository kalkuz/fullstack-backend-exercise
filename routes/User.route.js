import { Router } from 'express';
import { User } from '../controllers/index.js';

const router = Router();

router.get('/', User.read.all);
router.get('/:id', User.read.single);

router.post('/', User.create.single);

router.put('/:id', User.update.single);

router.delete('/:id', User.del.single);

export default router;
