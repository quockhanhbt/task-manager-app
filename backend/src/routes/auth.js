import { Router } from 'express';
import jwt from 'jsonwebtoken';
import passport from '../auth/passport.js';

const router = Router();

const COOKIE_OPTS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
};

// Redirect to Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Google callback → set JWT cookie → redirect to frontend
router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, name: req.user.name, avatar: req.user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, COOKIE_OPTS);
    res.redirect(process.env.FRONTEND_URL);
  }
);

// Return current user from cookie (no error if not logged in)
router.get('/me', (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ data: null });
  try {
    const { id, email, name, avatar } = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ data: { id, email, name, avatar } });
  } catch {
    res.json({ data: null });
  }
});

// Logout — clear cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token', COOKIE_OPTS);
  res.json({ data: { ok: true } });
});

export default router;
