let generatedEmailData = null;

// API base URL
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001/api'
  : window.location.origin + '/api';

// Generate email function
async function generateEmail() {
    const form = document.getElementById('emailForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['senderName', 'recipientName', 'senderEmail', 'recipientEmail', 'subject', 'emailType'];
    const missingFields = [];
    
    requiredFields.forEach(field => {
        const value = document.getElementById(field).value.trim();
        if (!value) {
            missingFields.push(field);
        }
    });
    
    if (missingFields.length > 0) {
        showStatus('error', `Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
    }
    
    // Show loading state
    showLoading(true);
    updateGenerateButton(true);
    
    try {
        const emailData = {
            senderName: document.getElementById('senderName').value.trim(),
            recipientName: document.getElementById('recipientName').value.trim(),
            senderEmail: document.getElementById('senderEmail').value.trim(),
            recipientEmail: document.getElementById('recipientEmail').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            emailType: document.getElementById('emailType').value,
            tone: document.getElementById('tone').value,
            context: document.getElementById('context').value.trim()
        };
        
        console.log('Sending request to generate email...', emailData);
        
        const response = await fetch(`${API_BASE_URL}/generate-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || result.error || 'Failed to generate email');
        }
        
        if (result.success) {
            generatedEmailData = result.emailData;
            displayEmailPreview(result.emailData);
            document.getElementById('sendBtn').disabled = false;
            showStatus('success', 'Email generated successfully! ✨');
        } else {
            throw new Error(result.error || 'Failed to generate email');
        }
        
    } catch (error) {
        console.error('Error generating email:', error);
        showStatus('error', `Failed to generate email: ${error.message}`);
        document.getElementById('sendBtn').disabled = true;
    } finally {
        showLoading(false);
        updateGenerateButton(false);
    }
}

// Send email function
async function sendEmail() {
    if (!generatedEmailData) {
        showStatus('error', 'No email to send. Please generate an email first.');
        return;
    }
    
    // Show loading state for send button
    const sendBtn = document.getElementById('sendBtn');
    const originalText = sendBtn.innerHTML;
    sendBtn.innerHTML = ' Sending...';
    sendBtn.disabled = true;
    
    try {
        showStatus('info', 'Sending email... 📤');
        
        const response = await fetch(`${API_BASE_URL}/send-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailData: generatedEmailData,
                accessToken: null // In real implementation, this would be the Gmail access token
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || result.error || 'Failed to send email');
        }
        
        if (result.success) {
            showStatus('success', '✅ Email sent successfully!');
            // Reset form after successful send
            setTimeout(() => {
                resetForm();
            }, 2000);
        } else {
            throw new Error(result.error || 'Failed to send email');
        }
        
    } catch (error) {
        console.error('Error sending email:', error);
        showStatus('error', `Failed to send email: ${error.message}`);
    } finally {
        sendBtn.innerHTML = originalText;
        sendBtn.disabled = false;
    }
}

// Display email preview
function displayEmailPreview(emailData) {
    document.getElementById('placeholder').style.display = 'none';
    document.getElementById('emailContent').style.display = 'block';
    
    document.getElementById('previewFrom').textContent = emailData.from;
    document.getElementById('previewTo').textContent = emailData.to;
    document.getElementById('previewSubject').textContent = emailData.subject;
    document.getElementById('previewBody').textContent = emailData.body;
}

// Show/hide loading state
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
    if (show) {
        document.getElementById('placeholder').style.display = 'none';
        document.getElementById('emailContent').style.display = 'none';
    }
}

// Update generate button state
function updateGenerateButton(loading) {
    const btn = document.querySelector('.btn-primary');
    const textSpan = btn.querySelector('.btn-text');
    const loadingSpan = btn.querySelector('.btn-loading');
    
    if (loading) {
        textSpan.style.display = 'none';
        loadingSpan.style.display = 'inline-flex';
        btn.disabled = true;
    } else {
        textSpan.style.display = 'inline';
        loadingSpan.style.display = 'none';
        btn.disabled = false;
    }
}

// Show status message
function showStatus(type, message) {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.className = `status-message status-${type}`;
    statusDiv.textContent = message;
    statusDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

// Reset form
function resetForm() {
    document.getElementById('emailForm').reset();
    document.getElementById('placeholder').style.display = 'block';
    document.getElementById('emailContent').style.display = 'none';
    document.getElementById('sendBtn').disabled = true;
    document.getElementById('statusMessage').style.display = 'none';
    generatedEmailData = null;
}

// Add some sample data for demo purposes
document.addEventListener('DOMContentLoaded', function() {
    // You can pre-fill some demo data
    document.getElementById('senderName').value = 'John Doe';
    document.getElementById('senderEmail').value = 'john.doe@company.com';
});

// Add Enter key support for form submission
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.ctrlKey) {
        generateEmail();
    }
});