import nodemailer from 'nodemailer';
import { supabase } from '../config/supabase.js';
import { handleError } from '../utils/errorhandler.js';



// Register
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic input validation
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    console.log(email, password);

    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log(data);


    if (error) {
      if (error.status === 400) {
        throw new Error(error.message); // Handle specific 400 errors (e.g., email already exists)
      } else {
        throw new Error(error.message);
      }
    }

    res.status(200).json({ message: 'User registered successfully', data });

  } catch (error) {
    handleError(res, error, 'An error occurred during registration.');
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('Email and password are required.');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    res.status(200).json({ message: 'User logged in successfully', data });
  } catch (error) {
    handleError(res, error, 'An error occurred during login.');
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    handleError(res, error, 'Internal server error');
  }
};

// Get Profile 
export const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    res.json({ user: data.user });
  } catch (error) {
    handleError(res, error, 'Internal server error');
  }
};

// Protected Route (requires authentication)
export const protectedData = async (req, res) => {
  const { headers } = req;

  try {
    // Verify authentication (e.g., check for access token in headers)
    const { data, error } = await supabase.auth.getUser({ headers });

    if (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Access user data or perform actions that require authentication
    const { data: userData, error: userError } = await supabase
      .from('your_table_name') // Replace with your table name
      .select('*')
      .eq('user_id', data.user.id);

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    res.json({ data: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Forgot Password API
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) throw new Error('Email is required.');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://example.com/update-password',
    });
    if (error) throw error;

    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (error) {
    handleError(res, error, 'An error occurred while sending the password reset email.');
  }
};

// Reset Password API
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) throw new Error('Token and password are required.');

    const { error } = await supabase.auth.verifyOtp({ type: 'recovery', token, password });
    if (error) throw error;

    res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    handleError(res, error, 'An error occurred while resetting the password.');
  }
};

// send otp
export const sendLoginOtp = async (req, res) => {
  try {
    const { user } = req.body;


    if (!user || !user.email) {
      throw new Error('Missing user or email in request body.');
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, '0');

    // Securely store the OTP (e.g., database with expiration)
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await supabase.from('otp_codes').insert({
      user_id: user.id,
      otp,
      expiry: otpExpiry,
    });

    // Send OTP via email using a dedicated email service (e.g., SendGrid, Mailgun)
    await sendEmail(user.email, `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP sent to your email.' });

  } catch (error) {
    handleError(res, error, 'An error occurred while sending the OTP.');
  }
};

async function sendEmail(to, subject, text) {
  // Configure your email service credentials (replace with your actual values)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Adjust based on your email service requirements
    auth: {
      user: to,
      pass: 'ykue sthw gbho zqhp',
    },
  });

  const mailOptions = {
    from: `Nns : ${to}`,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email Sending Error:', error);
    throw error; // Re-throw to trigger catch block in sendLoginOtp
  }
}

// Resend Otp
export const resendLoginOtp = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user || !user.email) {
      return res.status(400).json({ error: 'Missing user or email in request body.' });
    }

    // Retrieve existing OTP for the user
    const { data: existingOtp, error: otpError } = await supabase
      .from('otp_codes')
      .select()
      .eq('user_id', user.id);

    if (otpError) {
      console.error('Supabase Query Error:', otpError);
      throw new Error('Error retrieving OTP.');
    }

    let otp;
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expiry time set to 10 minutes

    if (existingOtp && existingOtp.length > 0) {
      // If OTP exists, update it
      otp = Math.floor(100000 + Math.random() * 900000).toString();

      const { error: updateError } = await supabase
        .from('otp_codes')
        .update({ otp, expiry: otpExpiry })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Supabase Update Error:', updateError);
        throw new Error('Failed to update OTP.');
      }
    } else {
      // If no OTP exists, create a new one
      otp = Math.floor(100000 + Math.random() * 900000).toString();

      const { error: insertError } = await supabase.from('otp_codes').insert({
        user_id: user.id,
        otp,
        expiry: otpExpiry,
      });

      if (insertError) {
        console.error('Supabase Insert Error:', insertError);
        throw new Error('Failed to insert new OTP.');
      }
    }

    // Send the OTP via email
    await sendEmail(user.email, 'Your OTP Code', `Your OTP is: ${otp}`);

    res.status(200).json({ message: 'OTP resent to your email.' });
  } catch (error) {
    handleError(res, error, 'Failed to resend OTP. Please try again later.');
  }
};