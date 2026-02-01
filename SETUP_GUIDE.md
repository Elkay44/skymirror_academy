# Skymirror Academy Application Form Setup Guide

This guide will help you set up the automatic email notifications and Google Sheets integration for the application form.

## Overview

The application form now:
- ✅ Removes the payment plans section (€149, €124, €129)
- ✅ Sends automatic confirmation emails to applicants
- ✅ Sends notification emails to you (lukman.ibrahim@skymirror.eu)
- ✅ Saves all applications to a Google Spreadsheet

## Setup Steps

### Step 1: Create a Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Skymirror Academy Applications" (or any name you prefer)
4. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`
   - Copy the long string between `/d/` and `/edit`

### Step 2: Set Up Google Apps Script

1. Open your Google Spreadsheet
2. Click on **Extensions** → **Apps Script**
3. Delete any existing code in the editor
4. Copy and paste the entire content from `GoogleAppsScript.gs` file
5. **Important:** Replace `YOUR_SPREADSHEET_ID_HERE` on line 2 with your actual Spreadsheet ID from Step 1
6. Click **Save** (disk icon)
7. Name your project (e.g., "Skymirror Application Handler")

### Step 3: Deploy the Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description:** "Skymirror Application Form Handler"
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. **Authorize the app:**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to [Project Name] (unsafe)"
   - Click "Allow"
7. **Copy the Web App URL** - it will look like:
   ```
   https://script.google.com/macros/s/LONG_STRING_HERE/exec
   ```

### Step 4: Update the Website

1. Open `js/form-handler.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` on line 7 with your Web App URL from Step 3
3. Save the file

### Step 5: Test the Form

1. Open your website locally or deploy it
2. Go to the Apply page
3. Fill out the application form with test data
4. Submit the form
5. Verify:
   - ✅ You see a success message on the page
   - ✅ You receive an email notification at lukman.ibrahim@skymirror.eu
   - ✅ The applicant receives a confirmation email
   - ✅ The data appears in your Google Spreadsheet

## What Happens When Someone Applies

1. **Form Submission:** User fills out and submits the application form
2. **Data Saved:** Application data is automatically saved to your Google Spreadsheet with:
   - Timestamp
   - All form fields (name, email, phone, country, program, etc.)
   - Formatted with headers and auto-sized columns
3. **Admin Email:** You receive an email notification with all application details
4. **Applicant Email:** The applicant receives an automatic confirmation email with:
   - Personalized greeting
   - Next steps information
   - Your contact information

## Email Templates

### Admin Notification Email
- **To:** lukman.ibrahim@skymirror.eu
- **Subject:** "New Skymirror Academy Application"
- **Content:** Table with all application details

### Applicant Confirmation Email
- **To:** Applicant's email address
- **Subject:** "Skymirror Academy Application Received"
- **Content:** 
  - Thank you message
  - Next steps (review within 7-10 business days)
  - Contact information

## Customization

### Change Admin Email
Edit line 1 in `GoogleAppsScript.gs`:
```javascript
const ADMIN_EMAIL = 'your-new-email@example.com';
```

### Modify Email Templates
Edit the `sendAdminNotification()` and `sendConfirmationEmail()` functions in `GoogleAppsScript.gs`

### Add More Form Fields
1. Add the field to `apply.html`
2. Update `js/form-handler.js` to include the new field in the `data` object
3. Update `GoogleAppsScript.gs`:
   - Add column header in `saveToSpreadsheet()` function
   - Add data field in the `sheet.appendRow()` call
   - Update email templates if needed

## Troubleshooting

### Form doesn't submit
- Check browser console for errors (F12 → Console tab)
- Verify the Google Apps Script URL is correct in `js/form-handler.js`
- Make sure the Web App is deployed with "Anyone" access

### No emails received
- Check spam/junk folders
- Verify email addresses are correct in `GoogleAppsScript.gs`
- Check Apps Script execution logs: Apps Script editor → Executions

### Data not appearing in spreadsheet
- Verify the Spreadsheet ID is correct in `GoogleAppsScript.gs`
- Check that the script has permission to access the spreadsheet
- Review Apps Script execution logs for errors

### CORS errors
- The form uses `no-cors` mode, so this shouldn't be an issue
- If you see CORS errors, verify the Apps Script deployment settings

## Security Notes

- The Web App URL should be kept private (don't commit to public repositories)
- Consider adding rate limiting if you experience spam
- The spreadsheet should have restricted access (only you can view/edit)

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Apps Script execution logs
3. Contact: lukman.ibrahim@skymirror.eu

---

**Changes Made:**
- ✅ Removed payment plans section (€149, €124, €129 with "0% Interest" badge)
- ✅ Removed "No credit check • Flexible schedule • Start immediately" text
- ✅ Integrated Google Sheets for automatic data storage
- ✅ Set up automatic email notifications for applicants
- ✅ Set up admin notifications for new applications
