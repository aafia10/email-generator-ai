const { google } = require('googleapis');

class GmailAuth {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/gmail.send'];
    
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
    
    return url;
  }

  async getTokens(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens;
  }

  setCredentials(tokens) {
    this.oauth2Client.setCredentials(tokens);
  }

  async sendEmail(emailData) {
    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    
    const raw = this.makeBody(
      emailData.to,
      emailData.from,
      emailData.subject,
      emailData.body
    );

    const result = await gmail.users.messages.send({
      userId: 'me',
      resource: { raw }
    });

    return result;
  }

  makeBody(to, from, subject, message) {
    const str = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      'MIME-Version: 1.0\n',
      'Content-Transfer-Encoding: 7bit\n',
      `to: ${to}\n`,
      `from: ${from}\n`,
      `subject: ${subject}\n\n`,
      message
    ].join('');

    return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  }
}

module.exports = GmailAuth;