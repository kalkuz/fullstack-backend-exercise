import { Router } from 'express';
import Person from './Person.route.js';
import Blog from './Blog.route.js';
import User from './User.route.js';

const router = Router();

router.use('/persons', Person);
router.use('/blogs', Blog);
router.use('/users', User);

export default router;
