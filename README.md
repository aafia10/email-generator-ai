# 🤖 AI Email Generator

A powerful, AI-driven email generator that creates professional emails instantly using OpenAI's GPT-3.5 Turbo model. This application provides a sleek web interface for generating customized emails and includes Gmail integration capabilities.

## ✨ Features

- **AI-Powered Email Generation**: Uses GPT-3.5 Turbo for intelligent email composition
- **Multiple Email Types**: Support for meeting requests, follow-ups, proposals, thank you notes, and more
- **Customizable Tones**: Professional, friendly, formal, casual, urgent, and more
- **Real-time Preview**: See your generated email instantly
- **Gmail Integration Ready**: Built-in structure for Gmail API integration
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Rate Limiting**: Built-in protection against API abuse
- **Error Handling**: Comprehensive error handling and user feedback

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- OpenAI API key
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone 
   cd email-generator
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 OpenAI API Key Setup

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Go to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

## 📋 Usage

1. **Fill in the form fields**:
   - Your name and email
   - Recipient's name and email
   - Email subject
   - Email type (meeting, follow-up, etc.)
   - Tone preference
   - Additional context or details

2. **Generate the email**:
   - Click "Generate Email"
   - Wait for AI to craft your email
   - Review the preview

3. **Send the email**:
   - Click "Send Email" to dispatch
   - (Note: Gmail integration requires additional setup)

## 🛠️ Technical Architecture

### Backend (Node.js + Express)
- **RESTful API**: Clean API endpoints for email generation and sending
- **OpenAI Integration**: Direct integration with GPT-3.5 Turbo
- **Security**: Helmet.js for security headers, rate limiting, CORS protection
- **Error Handling**: Comprehensive error handling and logging

### Frontend (Vanilla JavaScript)
- **Modern UI**: Clean, responsive design with smooth animations
- **Real-time Preview**: Instant email preview as you generate
- **Form Validation**: Client-side validation for better UX
- **Loading States**: Visual feedback during API calls

## 🔌 API Endpoints

### POST `/api/generate-email`
Generates an email using AI based on provided parameters.

**Request Body:**
```json
{
  "senderName": "John Doe",
  "recipientName": "Jane Smith",
  "senderEmail": "john@company.com",
  "recipientEmail": "jane@company.com",
  "subject": "Meeting Request",
  "emailType": "meeting request",
  "tone": "professional",
  "context": "Discuss Q4 planning"
}
```

**Response:**
```json
{
  "success": true,
  "emailData": {
    "from": "John Doe ",
    "to": "Jane Smith ",
    "subject": "Meeting Request",
    "body": "Generated email content...",
    "type": "meeting request",
    "tone": "professional",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### POST `/api/send-email`
Sends the generated email (Gmail integration placeholder).

## 🎨 Customization

### Adding New Email Types
Edit `frontend/index.html` to add new options to the email type select:
```html
New Email Type
```

### Modifying AI Prompts
Update the prompt in `backend/routes/emailRoutes.js` to customize AI behavior:
```javascript
const prompt = `Your custom prompt here...`;
```

### Styling Changes
Modify `frontend/style.css` to customize the appearance:
```css
.your-custom-class {
  /* Your styles here */
}
```

## 🔐 Gmail Integration Setup

To enable actual email sending via Gmail:

1. **Enable Gmail API**:
   - Go to Google Cloud Console
   - Enable Gmail API for your project
   - Create credentials (OAuth 2.0)

2. **Install additional dependencies**:
   ```bash
   npm install googleapis
   ```

3. **Update the send endpoint**:
   Replace the placeholder in `emailRoutes.js` with actual Gmail API calls

4. **Frontend OAuth**:
   Add Google OAuth for user authentication

## 🚨 Security Considerations

- **API Key Protection**: Never expose your OpenAI API key in frontend code
- **Rate Limiting**: Built-in rate limiting prevents API abuse
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Properly configured CORS for security
- **Environment Variables**: Secure storage of sensitive configurations

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid OpenAI API Key"**
   - Check your API key in the `.env` file
   - Ensure no extra spaces or characters
   - Verify your OpenAI account has sufficient credits

2. **"Port already in use"**
   - Change the PORT in `.env` file
   - Kill existing processes on port 3000

3. **Email generation fails**
   - Check your internet connection
   - Verify OpenAI API status
   - Check browser console for detailed errors

4. **CORS errors**
   - Ensure backend server is running
   - Check CORS configuration in `server.js`

## 📊 Performance Tips

- **Caching**: Consider implementing response caching for similar requests
- **Batch Processing**: For multiple emails, implement batch processing
- **CDN**: Use CDN for static assets in production
- **Database**: Add database storage for email history

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**:
   ```env
   NODE_ENV=production
   OPENAI_API_KEY=your_production_key
   PORT=80
   ```

2. **Build and Deploy**:
   ```bash
   # Install production dependencies
   npm install --production
   
   # Start with PM2 (recommended)
   npm install -g pm2
   pm2 start server.js --name "email-generator"
   ```

3. **Reverse Proxy** (Nginx example):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 📈 Future Enhancements

- **Email Templates**: Pre-built templates for common scenarios
- **Multi-language Support**: Generate emails in different languages
- **Email Scheduling**: Schedule emails for later sending
- **Analytics Dashboard**: Track email generation and success rates
- **Team Collaboration**: Multi-user support with shared templates
- **Integration Hub**: Connect with Outlook, Thunderbird, etc.
- **AI Fine-tuning**: Custom AI models trained on company-specific data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT-3.5 Turbo API
- Express.js community for the robust web framework
- Contributors and testers who helped improve this project

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Contact the development team

---

**Happy emailing! 📧✨**
