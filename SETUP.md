# Driver Health Assessment - Setup Guide

## 🚀 Project Overview
This is a comprehensive health assessment application for truck drivers, built with Next.js 14, Supabase, and Resend for email notifications. The application features a multi-step form with auto-save functionality and professional email notifications.

## 📋 Prerequisites
- Node.js 18+ installed
- Supabase account
- Resend account for email notifications
- Vercel account (for deployment)

## 🔧 Environment Setup

### 1. Create Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key

# Notification Email
NOTIFICATION_EMAIL=kevin@letstruck.com

# Optional: Analytics or other services
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Supabase Setup

#### Create a new Supabase project:
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and service role key

#### Create the database table:
Run this SQL in your Supabase SQL editor:

```sql
-- Create driver_assessments table
CREATE TABLE driver_assessments (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Driver Profile
  driver_name TEXT NOT NULL,
  age INTEGER,
  email TEXT NOT NULL,
  phone TEXT,
  years_driving TEXT,
  route_type TEXT,
  
  -- Equipment & Setup
  truck_type TEXT,
  sleeper_size TEXT,
  equipment_available TEXT[],
  
  -- Current Health
  health_rating TEXT,
  energy_level TEXT,
  health_concerns TEXT,
  current_medications TEXT,
  
  -- Lifestyle Factors
  sleep_quality INTEGER,
  average_sleep_hours DECIMAL,
  stress_level INTEGER,
  exercise_frequency TEXT,
  
  -- Health Goals
  primary_goals TEXT,
  commitment_level TEXT,
  additional_goals TEXT,
  
  -- Metadata
  assessment_data JSONB,
  status TEXT DEFAULT 'submitted',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_driver_assessments_email ON driver_assessments(email);
CREATE INDEX idx_driver_assessments_status ON driver_assessments(status);
CREATE INDEX idx_driver_assessments_created_at ON driver_assessments(created_at);

-- Enable Row Level Security (optional)
ALTER TABLE driver_assessments ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (allows API access)
CREATE POLICY "Service role can do everything" ON driver_assessments
  FOR ALL USING (auth.role() = 'service_role');
```

### 3. Resend Setup

#### Create a Resend account:
1. Go to [resend.com](https://resend.com)
2. Sign up for an account
3. Get your API key from the dashboard
4. Verify your domain (letstruck.com) for sending emails

## 🏃‍♂️ Local Development

### Install dependencies:
```bash
npm install
```

### Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🚀 Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables in Vercel:**
   - Go to your Vercel dashboard
   - Select your project
   - Go to Settings > Environment Variables
   - Add all the variables from your `.env.local` file

### Option 2: Deploy to Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Add environment variables in Netlify dashboard

## 🔍 Testing the Application

### 1. Test the Form Flow:
- Fill out all sections of the assessment
- Test auto-save functionality
- Submit the assessment
- Verify emails are sent

### 2. Test Email Notifications:
- Check that notification email is sent to Kevin
- Check that confirmation email is sent to the driver
- Verify email templates render correctly

### 3. Test Database:
- Check Supabase dashboard for new records
- Verify all data is stored correctly

## 🛠️ Customization

### Update Contact Information:
Edit the following files to update contact information:
- `app/page.js` - Update Kevin's contact info in the success screen
- `app/api/submit-assessment/route.js` - Update email templates

### Modify Form Fields:
- Add/remove fields in `app/page.js`
- Update validation in the `validateSection` function
- Update database schema accordingly

### Update Styling:
- Modify `app/globals.css` for custom styles
- Update Tailwind classes in components

## 🔒 Security Considerations

1. **Environment Variables:** Never commit `.env.local` to version control
2. **API Keys:** Use service role keys only on the server side
3. **Email Verification:** Verify your domain with Resend
4. **Rate Limiting:** Consider adding rate limiting for form submissions

## 📞 Support

For technical support or questions about the application:
- Email: support@letstruck.com
- Phone: 855-800-3835

## 🎯 Next Steps

After deployment:
1. Test the complete user flow
2. Set up monitoring and analytics
3. Configure backup and recovery procedures
4. Set up automated testing
5. Plan for scaling as usage grows 