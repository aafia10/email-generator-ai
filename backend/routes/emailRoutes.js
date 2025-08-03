require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate email endpoint
router.post('/generate-email', async (req, res) => {
  try {
    const {
      senderName,
      recipientName,
      senderEmail,
      recipientEmail,
      subject,
      emailType,
      tone,
      context
    } = req.body;

    // Validate required fields
    if (!senderName || !recipientName || !subject || !emailType) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['senderName', 'recipientName', 'subject', 'emailType']
      });
    }

    // Create the prompt for GPT
    const prompt = `Generate a professional email with the following specifications:

**Email Details:**
- From: ${senderName} (${senderEmail})
- To: ${recipientName} (${recipientEmail})
- Subject: ${subject}
- Type: ${emailType}
- Tone: ${tone || 'professional'}
- Context: ${context || 'No additional context provided'}

**Instructions:**
1. Write a ${tone || 'professional'} email for ${emailType}
2. Use appropriate greeting and closing
3. Keep it concise but complete
4. Include relevant details from the context
5. Make it sound natural and human-like
6. Use proper email formatting

**Response Format:**
Return ONLY the email body content (no subject line, no "From/To" headers). Start directly with the greeting.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional email writing assistant. Generate well-structured, appropriate emails based on the user's requirements. Focus on clarity, professionalism, and effectiveness."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const emailBody = completion.choices[0].message.content.trim();

    // Return the generated email
    res.json({
      success: true,
      emailData: {
        from: `${senderName} <${senderEmail}>`,
        to: `${recipientName} <${recipientEmail}>`,
        subject: subject,
        body: emailBody,
        type: emailType,
        tone: tone,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Email generation error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        error: 'OpenAI API quota exceeded',
        message: 'Please check your OpenAI billing settings'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        error: 'Invalid OpenAI API key',
        message: 'Please check your API key configuration'
      });
    }

    res.status(500).json({
      error: 'Failed to generate email',
      message: error.message || 'Unknown error occurred'
    });
  }
});

// Send email endpoint (Gmail integration placeholder)
router.post('/send-email', async (req, res) => {
  try {
    const { emailData, accessToken } = req.body;

    // This is a placeholder for Gmail API integration
    // In a real implementation, you would:
    // 1. Verify the access token
    // 2. Use Gmail API to send the email
    // 3. Handle authentication and permissions

    console.log('Email send request:', emailData);

    // Simulate email sending
    setTimeout(() => {
      res.json({
        success: true,
        message: 'Email sent successfully!',
        messageId: 'mock_message_id_' + Date.now()
      });
    }, 1500);

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      error: 'Failed to send email',
      message: error.message
    });
  }
});

module.exports = router;