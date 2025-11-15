const axios = require('axios');

/**
 * Verify Google reCAPTCHA v3 token
 * @param {string} token - The reCAPTCHA token from frontend
 * @returns {Promise<{success: boolean, score: number, action: string}>}
 */
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured');
    return { success: true, score: 1.0, action: 'newsletter_subscribe' }; // Allow if not configured
  }

  if (!token) {
    return { success: false, score: 0, action: '', error: 'No reCAPTCHA token provided' };
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    const data = response.data;

    return {
      success: data.success,
      score: data.score || 0,
      action: data.action || '',
      hostname: data.hostname,
      challenge_ts: data.challenge_ts,
      error: data['error-codes']?.[0] || null,
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error.message);
    return {
      success: false,
      score: 0,
      action: '',
      error: 'Verification failed',
    };
  }
}

module.exports = verifyRecaptcha;