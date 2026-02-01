const ADMIN_EMAIL = 'admissions@skymirror.eu';
const SPREADSHEET_ID = '1lxgWj1OIh_0f3ut9PjTvG0JMamYr93lWwtzVE_XpEeI';

function doOptions(e) {
  return ContentService.createTextOutput(JSON.stringify({status: "success"}))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    console.log('Application received:', data);
    
    try {
      saveToSpreadsheet(data);
      console.log('Data saved to spreadsheet successfully');
    } catch (sheetError) {
      console.log('Error saving to spreadsheet:', sheetError.toString());
    }
    
    try {
      sendAdminNotification(data);
      console.log('Admin notification sent successfully');
    } catch (emailError) {
      console.log('Error sending admin notification:', emailError.toString());
    }
    
    try {
      sendConfirmationEmail(data);
      console.log('Confirmation email sent successfully');
    } catch (emailError) {
      console.log('Error sending confirmation email:', emailError.toString());
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Application submitted successfully"
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
      
  } catch (error) {
    console.log('Error in doPost:', error.toString());
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Failed to process application"
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
      .setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
}

function saveToSpreadsheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Applications') || ss.insertSheet('Applications');
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Country',
      'Program',
      'Background',
      'Why Interested',
      'Global Field Labs Interest'
    ]);
    
    const headerRange = sheet.getRange(1, 1, 1, 10);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');
  }
  
  sheet.appendRow([
    new Date().toLocaleString(),
    data.firstName || '',
    data.lastName || '',
    data.email || '',
    data.phone || '',
    data.country || '',
    data.program || '',
    data.background || '',
    data.whyInterested || '',
    data.VanguardCohortInterest ? 'Yes' : 'No'
  ]);
  
  sheet.autoResizeColumns(1, 10);
}

function sendAdminNotification(data) {
  MailApp.sendEmail({
    to: 'lukman.ibrahim@skymirror.eu',
    replyTo: ADMIN_EMAIL,
    name: 'Skymirror Academy Admin',
    subject: 'New Skymirror Academy Application',
    htmlBody: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #3b82f6;">New Application Received</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.email}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.phone || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Program:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.program || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Background:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.background || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Why Interested:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.whyInterested || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Vanguard Cohort:</td><td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${data.VanguardCohortInterest ? 'Yes' : 'No'}</td></tr>
        </table>
        <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
          Submitted at: ${new Date().toLocaleString()}
        </p>
      </div>
    `
  });
}

function sendConfirmationEmail(data) {
  GmailApp.sendEmail(
    data.email,
    '✨ Welcome to Skymirror Academy - Application Received',
    '',
    {
      from: 'noreply@skymirror.eu',
      replyTo: ADMIN_EMAIL,
      name: 'Skymirror Academy',
      htmlBody: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%); border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.2); box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15); overflow: hidden;">
                
                <!-- Header with gradient -->
                <tr>
                  <td style="background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                    <div style="width: 60px; height: 60px; margin: 0 auto 20px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 32px; font-weight: bold; color: white;">S</span>
                    </div>
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">Skymirror Academy</h1>
                    <p style="margin: 10px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">Application Received Successfully</p>
                  </td>
                </tr>
                
                <!-- Main content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; font-weight: 700;">Dear ${data.firstName},</h2>
                    
                    <p style="margin: 0 0 20px; color: #e2e8f0; font-size: 16px; line-height: 1.6;">
                      Thank you for applying to <strong style="color: #a78bfa;">Skymirror Academy</strong>! We're excited to review your application for the <strong style="color: #60a5fa;">${data.program}</strong> program.
                    </p>
                    
                    <!-- Application summary box -->
                    <div style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 20px; margin: 30px 0;">
                      <h3 style="margin: 0 0 15px; color: #a78bfa; font-size: 18px; font-weight: 600;">📋 Application Summary</h3>
                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; padding: 8px 0;">Name:</td>
                          <td style="color: #e2e8f0; font-size: 14px; font-weight: 600; padding: 8px 0; text-align: right;">${data.firstName} ${data.lastName}</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; padding: 8px 0;">Program:</td>
                          <td style="color: #e2e8f0; font-size: 14px; font-weight: 600; padding: 8px 0; text-align: right;">${data.program}</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; padding: 8px 0;">Country:</td>
                          <td style="color: #e2e8f0; font-size: 14px; font-weight: 600; padding: 8px 0; text-align: right;">${data.country}</td>
                        </tr>
                        <tr>
                          <td style="color: #94a3b8; font-size: 14px; padding: 8px 0;">Submitted:</td>
                          <td style="color: #e2e8f0; font-size: 14px; font-weight: 600; padding: 8px 0; text-align: right;">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <!-- Next steps -->
                    <h3 style="margin: 30px 0 20px; color: #ffffff; font-size: 20px; font-weight: 700;">🚀 What Happens Next?</h3>
                    
                    <div style="margin-bottom: 15px;">
                      <div style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold; margin-right: 12px; vertical-align: middle;">1</div>
                      <div style="display: inline-block; vertical-align: middle; width: calc(100% - 50px);">
                        <strong style="color: #e2e8f0; font-size: 16px;">Application Review</strong>
                        <p style="margin: 5px 0 0; color: #94a3b8; font-size: 14px; line-height: 1.5;">Our admissions team will carefully review your application and background.</p>
                      </div>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                      <div style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold; margin-right: 12px; vertical-align: middle;">2</div>
                      <div style="display: inline-block; vertical-align: middle; width: calc(100% - 50px);">
                        <strong style="color: #e2e8f0; font-size: 16px;">Interview Invitation</strong>
                        <p style="margin: 5px 0 0; color: #94a3b8; font-size: 14px; line-height: 1.5;">We'll contact you within 7-10 business days to schedule a brief interview.</p>
                      </div>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                      <div style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #8b5cf6, #3b82f6); border-radius: 50%; text-align: center; line-height: 32px; color: white; font-weight: bold; margin-right: 12px; vertical-align: middle;">3</div>
                      <div style="display: inline-block; vertical-align: middle; width: calc(100% - 50px);">
                        <strong style="color: #e2e8f0; font-size: 16px;">Admission Decision</strong>
                        <p style="margin: 5px 0 0; color: #94a3b8; font-size: 14px; line-height: 1.5;">You'll receive your admission decision and next steps via email.</p>
                      </div>
                    </div>
                    
                    <!-- CTA Box -->
                    <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15)); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
                      <p style="margin: 0 0 15px; color: #e2e8f0; font-size: 15px; line-height: 1.6;">
                        Have questions about your application?
                      </p>
                      <a href="mailto:${ADMIN_EMAIL}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; font-size: 15px;">Contact Admissions</a>
                    </div>
                    
                    <p style="margin: 30px 0 0; color: #94a3b8; font-size: 15px; line-height: 1.6;">
                      Best regards,<br>
                      <strong style="color: #e2e8f0;">The Skymirror Academy Team</strong>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background: rgba(15, 23, 42, 0.8); padding: 30px; text-align: center; border-top: 1px solid rgba(139, 92, 246, 0.2);">
                    <p style="margin: 0 0 10px; color: #64748b; font-size: 13px;">
                      <strong style="color: #94a3b8;">Skymirror Academy</strong><br>
                      Transforming Lives Through Technology Education
                    </p>
                    <p style="margin: 10px 0; color: #64748b; font-size: 12px;">
                      🌐 <a href="https://skymirror.eu" style="color: #60a5fa; text-decoration: none;">skymirror.eu</a> | 
                      ✉️ <a href="mailto:${ADMIN_EMAIL}" style="color: #60a5fa; text-decoration: none;">${ADMIN_EMAIL}</a>
                    </p>
                    <p style="margin: 15px 0 0; color: #475569; font-size: 11px;">
                      This is an automated message. Please do not reply directly to this email.<br>
                      For inquiries, contact us at ${ADMIN_EMAIL}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
    }
  );
}