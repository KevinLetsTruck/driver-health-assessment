-- Complete Database Setup for Driver Health Assessment Platform
-- Run this entire script in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create role enum for clients
DO $$ BEGIN
    CREATE TYPE client_role AS ENUM ('client', 'practitioner', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Create clients table FIRST (since other tables reference it)
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Authentication
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  
  -- Personal Information
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  
  -- Professional Information
  cdl_number TEXT,
  company_name TEXT,
  
  -- Health Information
  height_inches INTEGER,
  weight_lbs DECIMAL,
  blood_type TEXT,
  
  -- Account Status
  status TEXT DEFAULT 'active',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Preferences
  timezone TEXT DEFAULT 'America/New_York',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false}',
  
  -- Metrics
  weekly_check_ins_required BOOLEAN DEFAULT true,
  lab_work_frequency INTEGER DEFAULT 90, -- days
  
  -- Role
  role client_role DEFAULT 'client'
);

-- 2. Create protocols table
CREATE TABLE IF NOT EXISTS protocols (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Protocol Information
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration_weeks INTEGER,
  
  -- Phases and Content
  phases JSONB,
  supplements JSONB,
  lifestyle_recommendations JSONB,
  dietary_guidelines JSONB,
  
  -- Metadata
  created_by BIGINT REFERENCES clients(id),
  is_template BOOLEAN DEFAULT true,
  success_metrics JSONB
);

-- 3. Create other tables that depend on clients
CREATE TABLE IF NOT EXISTS lab_results (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Test Information
  test_date DATE NOT NULL,
  test_type TEXT NOT NULL,
  lab_name TEXT,
  ordering_provider TEXT,
  
  -- Results
  results JSONB,
  pdf_url TEXT,
  
  -- Analysis
  ai_analysis TEXT,
  practitioner_notes TEXT,
  flagged_values JSONB,
  
  -- Status
  status TEXT DEFAULT 'pending_review',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by BIGINT REFERENCES clients(id)
);

-- 4. Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id),
  date DATE NOT NULL,
  meals JSONB,
  water_intake INTEGER,
  symptoms JSONB,
  mood INTEGER,
  energy_level INTEGER,
  stress_level INTEGER,
  sleep_hours DECIMAL,
  sleep_quality INTEGER,
  exercise_minutes INTEGER,
  exercise_type TEXT,
  bowel_movements INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create daily_journals table (legacy, keeping for compatibility)
CREATE TABLE IF NOT EXISTS daily_journals (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metrics
  energy_level INTEGER,
  mood_rating INTEGER,
  stress_level INTEGER,
  sleep_hours DECIMAL,
  sleep_quality INTEGER,
  water_intake_oz INTEGER,
  
  -- Food Diary
  meals JSONB,
  
  -- Symptoms
  symptoms JSONB,
  
  -- Exercise
  exercise_minutes INTEGER,
  exercise_type TEXT,
  
  -- Notes
  general_notes TEXT,
  gratitude TEXT,
  
  UNIQUE(client_id, date)
);

-- 6. Create other supporting tables
CREATE TABLE IF NOT EXISTS client_protocols (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  protocol_id BIGINT REFERENCES protocols(id),
  
  -- Timeline
  start_date DATE NOT NULL,
  end_date DATE,
  current_phase INTEGER DEFAULT 1,
  
  -- Progress
  status TEXT DEFAULT 'active',
  adherence_percentage INTEGER DEFAULT 0,
  last_check_in DATE,
  
  -- Customizations
  custom_modifications JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wearable_data (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Source
  device_type TEXT NOT NULL, -- oura, fitbit, apple_watch, etc.
  
  -- Timestamp
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  date DATE NOT NULL,
  
  -- Metrics
  steps INTEGER,
  heart_rate_avg INTEGER,
  heart_rate_resting INTEGER,
  hrv DECIMAL,
  temperature_deviation DECIMAL,
  respiratory_rate DECIMAL,
  
  -- Sleep
  sleep_duration_minutes INTEGER,
  sleep_efficiency INTEGER,
  rem_minutes INTEGER,
  deep_minutes INTEGER,
  
  -- Activity
  active_calories INTEGER,
  activity_minutes INTEGER,
  
  -- Raw data from API
  raw_data JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Participants
  from_user_id BIGINT REFERENCES clients(id),
  to_user_id BIGINT REFERENCES clients(id),
  
  -- Content
  subject TEXT,
  body TEXT NOT NULL,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Threading
  parent_message_id BIGINT REFERENCES messages(id),
  
  -- Attachments
  attachments JSONB
);

CREATE TABLE IF NOT EXISTS group_sessions (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Session Details
  title TEXT NOT NULL,
  description TEXT,
  
  -- Schedule
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 120,
  
  -- Meeting Info
  meeting_url TEXT,
  meeting_id TEXT,
  passcode TEXT,
  
  -- Capacity
  max_participants INTEGER DEFAULT 20,
  
  -- Content
  topics JSONB,
  resources JSONB,
  
  -- Recording
  recording_url TEXT,
  
  -- Status
  status TEXT DEFAULT 'scheduled'
);

CREATE TABLE IF NOT EXISTS group_session_participants (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT REFERENCES group_sessions(id) ON DELETE CASCADE,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Registration
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Attendance
  attended BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(session_id, client_id)
);

CREATE TABLE IF NOT EXISTS supplements (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Supplement Info
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  
  -- Dosage
  dosage_amount TEXT,
  dosage_unit TEXT,
  frequency TEXT,
  
  -- Details
  description TEXT,
  benefits TEXT[],
  warnings TEXT[],
  
  -- Links
  purchase_url TEXT,
  info_url TEXT
);

CREATE TABLE IF NOT EXISTS client_supplements (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  supplement_id BIGINT REFERENCES supplements(id),
  
  -- Schedule
  start_date DATE NOT NULL,
  end_date DATE,
  
  -- Dosage (can override default)
  custom_dosage TEXT,
  timing TEXT, -- morning, evening, with meals, etc.
  
  -- Tracking
  adherence_percentage INTEGER DEFAULT 0,
  notes TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Notification Details
  type TEXT NOT NULL, -- reminder, alert, message, etc.
  title TEXT NOT NULL,
  body TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Action
  action_url TEXT,
  action_data JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lab_results_client_id ON lab_results(client_id);
CREATE INDEX IF NOT EXISTS idx_journal_client_date ON journal_entries(client_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_journals_client_date ON daily_journals(client_id, date);
CREATE INDEX IF NOT EXISTS idx_wearable_data_client_date ON wearable_data(client_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_messages_users ON messages(from_user_id, to_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_client_unread ON notifications(client_id, is_read);

-- Enable Row Level Security on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearable_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authentication
CREATE POLICY "Users can view own client profile" ON clients
    FOR SELECT USING (auth.uid()::text = email);

CREATE POLICY "Users can update own client profile" ON clients
    FOR UPDATE USING (auth.uid()::text = email);

CREATE POLICY "Practitioners can view all clients" ON clients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM clients 
            WHERE email = auth.uid()::text 
            AND role = 'practitioner'
        )
    );

-- Add yourself as a practitioner
INSERT INTO clients (email, first_name, last_name, role, status)
VALUES ('kevin@letstruck.com', 'Kevin', 'Rutherford', 'practitioner', 'active')
ON CONFLICT (email) 
DO UPDATE SET role = 'practitioner';

-- Success message
SELECT 'Database setup completed successfully!' as message; 