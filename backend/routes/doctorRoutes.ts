import express from 'express';
const router = express.Router();
import User from '../models/User';
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

router.get('/', cacheMiddleware(300), async (req: express.Request, res: express.Response) => {
  try {
    const doctors = await User.findAll({
      where: { role: 'Doctor', banned: false },
      attributes: ['id', 'full_name', 'specialization']
    });
    res.json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
});

module.exports = router;
