-- Enhanced Driver Health Assessment Tables

-- Enable UUID extension for better IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main driver assessments table (already exists, but let's enhance it)
ALTER TABLE driver_assessments 
ADD COLUMN IF NOT EXISTS headaches TEXT,
ADD COLUMN IF NOT EXISTS fatigue TEXT,
ADD COLUMN IF NOT EXISTS joint_pain TEXT,
ADD COLUMN IF NOT EXISTS digestive_issues TEXT,
ADD COLUMN IF NOT EXISTS family_history JSONB,
ADD COLUMN IF NOT EXISTS environmental_exposures JSONB,
ADD COLUMN IF NOT EXISTS diet_information JSONB,
ADD COLUMN IF NOT EXISTS symptom_tracking JSONB;

-- Clients table (main user management)
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Information
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  
  -- Driver Specific
  cdl_number TEXT,
  years_driving INTEGER,
  route_type TEXT,
  company_name TEXT,
  
  -- Account Status
  status TEXT DEFAULT 'active',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Family Support
  family_members JSONB DEFAULT '[]'
);

-- Lab Results Table
CREATE TABLE IF NOT EXISTS lab_results (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Lab Information
  lab_name TEXT NOT NULL,
  test_date DATE NOT NULL,
  report_date DATE,
  ordering_provider TEXT,
  
  -- File Storage
  file_url TEXT,
  file_name TEXT,
  file_type TEXT,
  
  -- Parsed Data
  parsed_data JSONB,
  ai_analysis JSONB,
  
  -- Categories
  test_category TEXT, -- blood, urine, stool, saliva, etc.
  test_type TEXT, -- comprehensive metabolic, hormone, microbiome, etc.
  
  -- Status
  status TEXT DEFAULT 'pending_review',
  reviewed_by BIGINT,
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Protocols Table
CREATE TABLE IF NOT EXISTS protocols (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Protocol Information
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- nutrition, supplement, lifestyle, etc.
  
  -- Protocol Details
  phases JSONB NOT NULL, -- Array of phases with instructions
  duration_weeks INTEGER,
  
  -- Templates
  is_template BOOLEAN DEFAULT FALSE,
  created_by BIGINT,
  
  -- Tracking
  success_metrics JSONB
);

-- Client Protocols (assigned protocols)
CREATE TABLE IF NOT EXISTS client_protocols (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  protocol_id BIGINT REFERENCES protocols(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  
  -- Progress Tracking
  current_phase INTEGER DEFAULT 1,
  phase_started_at TIMESTAMP WITH TIME ZONE,
  
  -- Customization
  custom_modifications JSONB,
  
  -- Status
  status TEXT DEFAULT 'assigned', -- assigned, active, paused, completed
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  practitioner_notes TEXT,
  client_notes TEXT
);

-- Daily Journals
CREATE TABLE IF NOT EXISTS daily_journals (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Food Tracking
  meals JSONB DEFAULT '[]',
  water_intake DECIMAL,
  
  -- Symptom Tracking
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  symptoms JSONB DEFAULT '[]',
  
  -- Sleep Data
  sleep_hours DECIMAL,
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  
  -- Exercise
  exercise_minutes INTEGER,
  exercise_type TEXT,
  
  -- Notes
  notes TEXT,
  
  UNIQUE(client_id, date)
);

-- Wearable Device Data
CREATE TABLE IF NOT EXISTS wearable_data (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL, -- oura, fitbit, apple_watch, etc.
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Common Metrics
  heart_rate_avg INTEGER,
  heart_rate_variability INTEGER,
  steps INTEGER,
  calories_burned INTEGER,
  
  -- Sleep Metrics
  deep_sleep_minutes INTEGER,
  rem_sleep_minutes INTEGER,
  light_sleep_minutes INTEGER,
  awake_minutes INTEGER,
  
  -- Activity Metrics
  active_minutes INTEGER,
  sedentary_minutes INTEGER,
  
  -- Raw Data
  raw_data JSONB,
  
  UNIQUE(client_id, device_type, recorded_at)
);

-- Messages (secure messaging)
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Participants
  from_user_id BIGINT NOT NULL,
  to_user_id BIGINT NOT NULL,
  
  -- Message Content
  subject TEXT,
  body TEXT NOT NULL,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  
  -- Threading
  thread_id BIGINT,
  parent_message_id BIGINT REFERENCES messages(id)
);

-- Group Coaching Sessions
CREATE TABLE IF NOT EXISTS group_sessions (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Session Information
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 120,
  
  -- Meeting Details
  meeting_url TEXT,
  meeting_id TEXT,
  recording_url TEXT,
  
  -- Capacity
  max_participants INTEGER DEFAULT 20,
  
  -- Status
  status TEXT DEFAULT 'scheduled' -- scheduled, in_progress, completed, cancelled
);

-- Group Session Participants
CREATE TABLE IF NOT EXISTS group_session_participants (
  id BIGSERIAL PRIMARY KEY,
  session_id BIGINT REFERENCES group_sessions(id) ON DELETE CASCADE,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Attendance
  attended BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(session_id, client_id)
);

-- Supplements Tracking
CREATE TABLE IF NOT EXISTS supplements (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Supplement Info
  name TEXT NOT NULL,
  brand TEXT,
  dosage TEXT,
  frequency TEXT,
  
  -- Timing
  start_date DATE,
  end_date DATE,
  
  -- Notes
  purpose TEXT,
  notes TEXT,
  
  -- Status
  active BOOLEAN DEFAULT TRUE
);

-- Notifications
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
CREATE INDEX IF NOT EXISTS idx_daily_journals_client_date ON daily_journals(client_id, date);
CREATE INDEX IF NOT EXISTS idx_wearable_data_client_date ON wearable_data(client_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_messages_users ON messages(from_user_id, to_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_client_unread ON notifications(client_id, is_read);

-- Enable Row Level Security on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE wearable_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create role enum for clients
DO $$ BEGIN
    CREATE TYPE client_role AS ENUM ('client', 'practitioner', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Alter clients table to add role
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS role client_role DEFAULT 'client';

-- Daily Journal Entries (for the new comprehensive journal)
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

CREATE INDEX IF NOT EXISTS idx_journal_client_date ON journal_entries(client_id, date);

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