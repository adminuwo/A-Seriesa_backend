import ContactSubmission from '../models/ContactSubmission.js';
import nodemailer from 'nodemailer';

// Configure nodemailer - only if email credentials are provided
let transporter = null;

if (process.env.EMAIL && process.env.EMAIL_PASS_KEY) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: (process.env.SMTP_PORT || 465) == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS_KEY,
    },
  });
} else {
  console.warn('⚠️  Gmail credentials not configured. Contact emails will be logged only.');
}

/**
 * Submit a contact form
 * POST /api/contact/submit
 */
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, category, message } = req.body;
    console.log('📝 Contact form submission received:', { name, email, phone, subject, category, message });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required',
      });
    }

    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress;
    console.log('🌐 IP Address:', ipAddress);

    // Create contact submission
    const contactSubmission = new ContactSubmission({
      name,
      email,
      phone,
      subject,
      category,
      message,
      ipAddress,
      userId: req.user?._id || null,
    });

    console.log('💾 Attempting to save contact submission...');
    await contactSubmission.save();
    console.log('✅ Contact submission saved:', contactSubmission._id);

    // Send email notification to support team
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: 'admin@uwo24.com',
          subject: `New Contact Submission: ${subject}`,
          html: `
            <h2>New Contact Submission</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p><small>Submitted on: ${new Date().toLocaleString()}</small></p>
            <p><small>Submission ID: ${contactSubmission._id}</small></p>
          `,
        });
        console.log('✅ Support notification email sent');
      } catch (emailError) {
        console.error('⚠️  Error sending email notification:', emailError);

        // Don't fail the request if email fails
      }

      // Send confirmation email to user
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: 'We received your message - A-Series™ Support',
          html: `
            <h2>Thank you for contacting us!</h2>
            <p>Hi ${name},</p>
            <p>We have received your message and our team will get back to you within 24 hours.</p>
            <p><strong>Your Submission Details:</strong></p>
            <ul>
              <li><strong>Subject:</strong> ${subject}</li>
              <li><strong>Category:</strong> ${category}</li>
              <li><strong>Reference ID:</strong> ${contactSubmission._id}</li>
            </ul>
            <p>If you have any urgent matters, please call us at <strong>+91 83598 90909</strong></p>
            <p>Best regards,<br>A-Series™ Support Team</p>
          `,
        });
        console.log('✅ Confirmation email sent to user');
      } catch (emailError) {
        console.error('⚠️  Error sending confirmation email:', emailError.message);
        // Don't fail the request if email fails
      }
    } else {
      console.log('📝 Email not configured. Contact submission logged instead.');
      console.log('Contact Details:', { name, email, subject, category, message });
    }

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will respond within 24 hours.',
      submissionId: contactSubmission._id,
    });
  } catch (error) {
    console.error('❌ Contact submission error:', error);

    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '), // Send specific validation error
      });
    }

    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error submitting contact form. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get all contact submissions (Admin only)
 * GET /api/contact/submissions
 */
export const getAllSubmissions = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const submissions = await ContactSubmission.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email')
      .populate('respondedBy', 'name email');

    const total = await ContactSubmission.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        totalRecords: total,
      },
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
    });
  }
};

/**
 * Get submission by ID
 * GET /api/contact/submissions/:id
 */
export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await ContactSubmission.findById(id)
      .populate('userId', 'name email')
      .populate('respondedBy', 'name email');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission',
    });
  }
};

/**
 * Update submission status (Admin only)
 * PATCH /api/contact/submissions/:id/status
 */
export const updateSubmissionStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const { id } = req.params;
    const { status, response } = req.body;

    if (!['new', 'read', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      {
        status,
        response: response || undefined,
        respondedBy: req.user._id,
        respondedAt: new Date(),
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    // Send response email if provided
    if (response && transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL,
          to: submission.email,
          subject: `Response to your submission: ${submission.subject}`,
          html: `
            <h2>Response to Your Inquiry</h2>
            <p>Hi ${submission.name},</p>
            <p>Thank you for reaching out to us. Here's our response:</p>
            <hr>
            <p>${response.replace(/\n/g, '<br>')}</p>
            <hr>
            <p>If you have further questions, feel free to contact us again.</p>
            <p>Best regards,<br>A-Series™ Support Team</p>
          `,
        });
        console.log('✅ Response email sent');
      } catch (emailError) {
        console.error('⚠️  Error sending response email:', emailError.message);
      }
    } else if (response && !transporter) {
      console.log('📝 Email not configured. Response would be:', response);
    }

    res.status(200).json({
      success: true,
      message: 'Submission updated successfully',
      data: submission,
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating submission',
    });
  }
};

/**
 * Delete submission (Admin only)
 * DELETE /api/contact/submissions/:id
 */
export const deleteSubmission = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.',
      });
    }

    const { id } = req.params;

    const submission = await ContactSubmission.findByIdAndDelete(id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Submission deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting submission',
    });
  }
};
