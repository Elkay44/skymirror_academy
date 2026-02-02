# Analytics & Conversion Tracking Setup Guide

## 📊 Overview
This guide will help you set up comprehensive conversion tracking for your Skymirror Academy application form.

---

## 1️⃣ Google Analytics 4 (GA4) Setup

### Step 1: Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (bottom left)
3. Click **Create Property**
4. Enter property name: "Skymirror Academy"
5. Select timezone and currency
6. Click **Next** → **Create**

### Step 2: Get Your Measurement ID
1. In your new property, go to **Admin** → **Data Streams**
2. Click **Add stream** → **Web**
3. Enter your website URL: `https://skymirror.eu`
4. Click **Create stream**
5. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 3: Update Your Code
In `apply.html`, replace `G-XXXXXXXXXX` with your actual Measurement ID:
```javascript
gtag('config', 'G-XXXXXXXXXX'); // Replace with your ID
```

### Step 4: Set Up Conversion Event
1. In GA4, go to **Admin** → **Events**
2. Click **Create event**
3. Create a custom event called `application_submitted`
4. Go to **Admin** → **Conversions**
5. Click **New conversion event**
6. Add `generate_lead` as a conversion event

---

## 2️⃣ Meta Pixel (Facebook/Instagram Ads) Setup

### Step 1: Create Meta Pixel
1. Go to [Meta Events Manager](https://business.facebook.com/events_manager)
2. Click **Connect Data Sources** → **Web**
3. Click **Get Started**
4. Name your pixel: "Skymirror Academy"
5. Enter your website URL
6. Click **Continue**

### Step 2: Get Your Pixel ID
1. In Events Manager, click on your pixel
2. Copy your **Pixel ID** (format: 16-digit number)

### Step 3: Update Your Code
In `apply.html`, replace `YOUR_PIXEL_ID` with your actual Pixel ID:
```javascript
fbq('init', 'YOUR_PIXEL_ID'); // Replace with your ID
```

### Step 4: Verify Installation
1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) Chrome extension
2. Visit your application page
3. Click the extension - it should show your pixel is active

---

## 3️⃣ Google Tag Manager (GTM) - Optional but Recommended

### Why Use GTM?
- Manage all tracking codes in one place
- Add/remove tags without editing code
- Advanced tracking capabilities

### Setup Steps:
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account and container
3. Install GTM code in your website
4. Add GA4 and Meta Pixel through GTM instead of hardcoding

---

## 4️⃣ Conversion Tracking Events

Your application form now tracks these events:

### Google Analytics Events:
- **PageView**: When someone visits the application page
- **generate_lead**: When application is submitted (conversion)
- **application_submitted**: Custom event with program details

### Meta Pixel Events:
- **PageView**: When someone visits the application page
- **Lead**: When application is submitted
- **CompleteRegistration**: Application completion

### Data Sent:
- Program selected
- Country
- Conversion value (€149)
- Email (for GA4 User-ID tracking)

---

## 5️⃣ Set Up Conversion Goals

### In Google Analytics:
1. Go to **Admin** → **Conversions**
2. Click **New conversion event**
3. Add these events as conversions:
   - `generate_lead`
   - `application_submitted`

### In Meta Events Manager:
1. Go to **Events Manager** → **Aggregated Event Measurement**
2. Configure your domain
3. Prioritize these events:
   - Lead
   - CompleteRegistration

---

## 6️⃣ Google Ads Conversion Tracking

### Step 1: Create Conversion Action
1. Go to [Google Ads](https://ads.google.com/)
2. Click **Tools & Settings** → **Conversions**
3. Click **+ New conversion action**
4. Select **Website**
5. Enter your website URL
6. Click **Scan** or **Add manually**

### Step 2: Get Conversion ID
1. After creating the conversion, copy the **Conversion ID**
2. Format: `AW-XXXXXXXXX/CONVERSION_ID`

### Step 3: Update Code
In `form-handler.js`, replace the conversion tracking:
```javascript
gtag('event', 'conversion', {
    'send_to': 'AW-XXXXXXXXX/CONVERSION_ID' // Your actual conversion ID
});
```

---

## 7️⃣ Testing Your Setup

### Test Checklist:
- [ ] GA4 Measurement ID is correct
- [ ] Meta Pixel ID is correct
- [ ] Visit application page and check:
  - [ ] GA4 shows PageView in real-time reports
  - [ ] Meta Pixel Helper shows pixel firing
- [ ] Submit test application and verify:
  - [ ] GA4 shows `generate_lead` event
  - [ ] Meta shows `Lead` event
  - [ ] Check Google Sheets for data
  - [ ] Receive admin and applicant emails

### Real-Time Testing:
1. **Google Analytics**: Go to **Reports** → **Realtime** → See active users
2. **Meta Events Manager**: Go to **Test Events** → Enter your IP → Submit form

---

## 8️⃣ Advanced Tracking (Optional)

### Track "Start Studying" Conversion
When a student actually starts their program, track it:

```javascript
// Add this to your student portal or welcome page
gtag('event', 'purchase', {
    'transaction_id': 'STUDENT_ID',
    'value': 149,
    'currency': 'EUR',
    'items': [{
        'item_name': 'Program Enrollment',
        'item_category': 'Education'
    }]
});

fbq('track', 'Purchase', {
    value: 149,
    currency: 'EUR'
});
```

### Enhanced E-commerce Tracking
Track the full funnel:
1. **View Application Page** → PageView
2. **Start Application** → `begin_checkout`
3. **Submit Application** → `generate_lead`
4. **Accept Offer** → `add_to_cart`
5. **Start Program** → `purchase`

---

## 9️⃣ Privacy & GDPR Compliance

### Cookie Consent
Add a cookie consent banner:
```html
<!-- Add to apply.html before </body> -->
<script src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css">
<script>
window.addEventListener("load", function(){
    window.cookieconsent.initialise({
        "palette": {
            "popup": {"background": "#1e293b"},
            "button": {"background": "#3b82f6"}
        },
        "content": {
            "message": "We use cookies to analyze traffic and improve your experience.",
            "dismiss": "Accept",
            "link": "Learn more",
            "href": "/privacy-policy"
        }
    })
});
</script>
```

---

## 🔟 Monitoring & Reporting

### Key Metrics to Track:
1. **Application Page Views**: How many people visit
2. **Application Submissions**: Conversion rate
3. **Cost Per Lead (CPL)**: If running ads
4. **Program Popularity**: Which programs get most applications
5. **Geographic Distribution**: Where applicants come from

### Create Custom Reports:
1. **GA4**: Go to **Explore** → Create custom funnel
2. **Meta**: Go to **Ads Manager** → Create custom dashboard

---

## 📞 Support

If you need help:
- **Google Analytics**: [GA4 Help Center](https://support.google.com/analytics)
- **Meta Pixel**: [Meta Business Help](https://www.facebook.com/business/help)
- **Google Tag Manager**: [GTM Help](https://support.google.com/tagmanager)

---

## ✅ Quick Setup Checklist

- [ ] Create GA4 property and get Measurement ID
- [ ] Update `apply.html` with GA4 Measurement ID
- [ ] Create Meta Pixel and get Pixel ID
- [ ] Update `apply.html` with Meta Pixel ID
- [ ] Test PageView tracking on application page
- [ ] Submit test application
- [ ] Verify conversion events in GA4 and Meta
- [ ] Set up conversion goals in both platforms
- [ ] (Optional) Set up Google Ads conversion tracking
- [ ] (Optional) Add cookie consent banner
- [ ] Monitor real-time reports

---

**Your tracking is now ready! All application submissions will be tracked automatically.**
