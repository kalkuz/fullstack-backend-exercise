import { Router } from 'express';
import { Person } from '../controllers';

const router = Router();

router.get('/', Person.read.all);
router.get('/:id', Person.read.single);

router.post('/', Person.create.single);

router.put('/:id', Person.update.single);

router.delete('/:id', Person.del.single);

export default router;
