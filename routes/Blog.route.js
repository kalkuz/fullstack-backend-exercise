import { Router } from 'express';
import { Blog } from '../controllers';

const router = Router();

router.get('/', Blog.read.all);
router.get('/:id', Blog.read.single);

router.post('/', Blog.create.single);

router.put('/:id', Blog.update.single);

router.delete('/:id', Blog.del.single);

export default router;
