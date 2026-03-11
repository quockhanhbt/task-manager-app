import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from '../auth/passport.js';

const router = Router();

// Redirect to Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Google callback → redirect to frontend with token in URL
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}?error=auth_failed`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, name: req.user.name, avatar: req.user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  }
);

// Return current user from Authorization header
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.json({ data: null });
  try {
    const { id, email, name, avatar } = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ data: { id, email, name, avatar } });
  } catch {
    res.json({ data: null });
  }
});

// Logout — handled client-side (just remove token from localStorage)
router.post('/logout', (_req, res) => {
  res.json({ data: { ok: true } });
});

export default router;
