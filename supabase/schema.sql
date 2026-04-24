-- PostAll Supabase Schema
-- Fully migrated to Supabase/PostgreSQL
-- App uses custom auth (magic_link), NOT Supabase Auth

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== PROFILES ====================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  password_hash TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'buyer',
  account_type TEXT DEFAULT 'individual',
  photo TEXT,
  bio TEXT,
  city TEXT,
  skills TEXT DEFAULT '[]',
  rating FLOAT DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  response_time TEXT,
  member_since TIMESTAMPTZ DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  profile_strength INTEGER DEFAULT 0,
  preferred_lang TEXT DEFAULT 'en',
  crypto_wallet TEXT,
  crypto_verified BOOLEAN DEFAULT FALSE,
  notifications TEXT DEFAULT '{}',
  privacy_level TEXT DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email) WHERE email IS NOT NULL;
CREATE INDEX idx_profiles_phone ON profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_username ON profiles(username);

-- ==================== AUTH SESSIONS ====================

CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  method TEXT DEFAULT 'magic_link',
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_auth_sessions_token ON auth_sessions(token);
CREATE INDEX idx_auth_sessions_user_id ON auth_sessions(user_id);

-- ==================== VERIFICATIONS ====================

CREATE TABLE IF NOT EXISTS verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  document_url TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_verifications_user_id ON verifications(user_id);

-- ==================== USER BADGES ====================

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- ==================== TASKS ====================

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  budget FLOAT NOT NULL,
  currency TEXT DEFAULT 'NGN',
  city TEXT NOT NULL,
  location TEXT,
  latitude FLOAT,
  longitude FLOAT,
  deadline TIMESTAMPTZ,
  urgency TEXT DEFAULT 'normal',
  status TEXT DEFAULT 'open',
  photos TEXT DEFAULT '[]',
  logistics TEXT DEFAULT '{}',
  ai_enhanced BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  posted_by_id UUID NOT NULL REFERENCES profiles(id),
  assigned_to_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_city ON tasks(city);
CREATE INDEX idx_tasks_posted_by ON tasks(posted_by_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to_id);
CREATE INDEX idx_tasks_urgency ON tasks(urgency);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Full-text search index
CREATE INDEX idx_tasks_search ON tasks USING gin(
  (to_tsvector('english', coalesce(title, '')) || to_tsvector('english', coalesce(description, '')))
);

-- ==================== LISTINGS ====================

CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price FLOAT NOT NULL,
  currency TEXT DEFAULT 'NGN',
  condition TEXT,
  city TEXT NOT NULL,
  location TEXT,
  latitude FLOAT,
  longitude FLOAT,
  status TEXT DEFAULT 'active',
  photos TEXT DEFAULT '[]',
  delivery_options TEXT DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  posted_by_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_posted_by ON listings(posted_by_id);
CREATE INDEX idx_listings_condition ON listings(condition);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);

-- Full-text search index
CREATE INDEX idx_listings_search ON listings USING gin(
  (to_tsvector('english', coalesce(title, '')) || to_tsvector('english', coalesce(description, '')))
);

-- ==================== APPLICATIONS (task_applications) ====================

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  proposed_price FLOAT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, user_id)
);

CREATE INDEX idx_applications_task_id ON applications(task_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);

-- View alias so code can use either name
CREATE OR REPLACE VIEW task_applications AS SELECT * FROM applications;

-- ==================== CONVERSATIONS ====================

CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_buyer ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller ON conversations(seller_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);

-- ==================== MESSAGES ====================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_is_read ON messages(is_read, conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at ASC);

-- ==================== WALLETS ====================

CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance FLOAT DEFAULT 0,
  currency TEXT DEFAULT 'NGN',
  total_earnings FLOAT DEFAULT 0,
  total_spending FLOAT DEFAULT 0,
  instant_pay_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TRANSACTIONS ====================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  amount FLOAT NOT NULL,
  currency TEXT DEFAULT 'NGN',
  method TEXT,
  crypto_network TEXT,
  status TEXT DEFAULT 'pending',
  reference TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- ==================== PAYMENT METHODS ====================

CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  label TEXT,
  details TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_wallet ON payment_methods(wallet_id);

-- ==================== ESCROWS ====================

CREATE TABLE IF NOT EXISTS escrows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id UUID NOT NULL,
  reference_type TEXT NOT NULL,
  amount FLOAT NOT NULL,
  currency TEXT DEFAULT 'NGN',
  funded_by_id UUID NOT NULL,
  funded_for_id UUID,
  status TEXT DEFAULT 'pending',
  funded_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  auto_release_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_escrows_reference ON escrows(reference_id, reference_type);
CREATE INDEX idx_escrows_funded_by ON escrows(funded_by_id);
CREATE INDEX idx_escrows_status ON escrows(status);

-- ==================== REVIEWS ====================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewee_id UUID NOT NULL REFERENCES profiles(id),
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_task ON reviews(task_id);
CREATE INDEX idx_reviews_listing ON reviews(listing_id);

-- ==================== DISPUTES ====================

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  escrow_id UUID NOT NULL REFERENCES escrows(id) ON DELETE CASCADE,
  opened_by_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  resolution TEXT,
  evidence TEXT DEFAULT '[]',
  notes TEXT,
  resolved_by_id UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_disputes_escrow ON disputes(escrow_id);
CREATE INDEX idx_disputes_status ON disputes(status);

-- ==================== REPORTS ====================

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_status ON reports(status);

-- ==================== FAVORITES ====================

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_target ON favorites(target_type, target_id);

-- ==================== NOTIFICATIONS ====================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ==================== REFERRALS ====================

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);

-- ==================== SMART ALERTS ====================

CREATE TABLE IF NOT EXISTS smart_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  query TEXT NOT NULL,
  category TEXT,
  city TEXT,
  frequency TEXT DEFAULT 'instant',
  delivery_method TEXT DEFAULT 'push',
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_smart_alerts_user ON smart_alerts(user_id);

-- ==================== SAFE SPOTS ====================

CREATE TABLE IF NOT EXISTS safe_spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  submitted_by_id UUID,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_safe_spots_city ON safe_spots(city);
CREATE INDEX idx_safe_spots_approved ON safe_spots(is_approved);

-- ==================== PROOF PHOTOS ====================

CREATE TABLE IF NOT EXISTS proof_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  photo_url TEXT NOT NULL,
  timestamp BOOLEAN DEFAULT TRUE,
  location BOOLEAN DEFAULT TRUE,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TEAM TASKS ====================

CREATE TABLE IF NOT EXISTS team_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== TEAM MEMBERS ====================

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_task_id UUID NOT NULL REFERENCES team_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_team_members_task ON team_members(team_task_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- ==================== FREECYCLE ITEMS ====================

CREATE TABLE IF NOT EXISTS freecycle_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  photos TEXT DEFAULT '[]',
  city TEXT NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'available',
  posted_by_id UUID NOT NULL,
  requester_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_freecycle_items_city ON freecycle_items(city);
CREATE INDEX idx_freecycle_items_status ON freecycle_items(status);

-- ==================== SHIP QUOTES ====================

CREATE TABLE IF NOT EXISTS ship_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  courier TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  weight FLOAT,
  dimensions TEXT,
  price FLOAT NOT NULL,
  currency TEXT DEFAULT 'NGN',
  estimated_days INTEGER,
  crypto_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ADMIN LOGS ====================

CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_id UUID,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);

-- ==================== CITIES ====================

CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  country TEXT NOT NULL,
  currency TEXT DEFAULT 'NGN',
  is_active BOOLEAN DEFAULT TRUE,
  popular_categories TEXT DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== PLATFORM STATS ====================

CREATE TABLE IF NOT EXISTS platform_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TEXT UNIQUE NOT NULL,
  daily_active_users INTEGER DEFAULT 0,
  new_signups INTEGER DEFAULT 0,
  tasks_posted INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0,
  revenue FLOAT DEFAULT 0,
  dispute_rate FLOAT DEFAULT 0
);

-- ==================== UPDATED_AT TRIGGER ====================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_escrows_updated_at BEFORE UPDATE ON escrows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_smart_alerts_updated_at BEFORE UPDATE ON smart_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_tasks_updated_at BEFORE UPDATE ON team_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_freecycle_items_updated_at BEFORE UPDATE ON freecycle_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== ROW LEVEL SECURITY ====================
-- App uses custom auth (not Supabase Auth), so auth.uid() is always NULL.
-- The API server is a trusted backend that validates auth via auth_sessions.
-- Therefore, allow anon (key-based) full access on all tables.

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE safe_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE freecycle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ship_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;

-- Allow full access via anon key (API server is trusted backend with custom auth)
CREATE POLICY "Allow anon full access on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on auth_sessions" ON auth_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on verifications" ON verifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on user_badges" ON user_badges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on listings" ON listings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on applications" ON applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on conversations" ON conversations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on wallets" ON wallets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on payment_methods" ON payment_methods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on escrows" ON escrows FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on disputes" ON disputes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on reports" ON reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on favorites" ON favorites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on referrals" ON referrals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on smart_alerts" ON smart_alerts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on safe_spots" ON safe_spots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on proof_photos" ON proof_photos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on team_tasks" ON team_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on team_members" ON team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on freecycle_items" ON freecycle_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on ship_quotes" ON ship_quotes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on admin_logs" ON admin_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on cities" ON cities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon full access on platform_stats" ON platform_stats FOR ALL USING (true) WITH CHECK (true);

-- ==================== STORAGE BUCKET ====================

INSERT INTO storage.buckets (id, name, public) VALUES ('postall-assets', 'postall-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for postall-assets" ON storage.objects FOR SELECT
  USING (bucket_id = 'postall-assets');

CREATE POLICY "Authenticated users can upload to postall-assets" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'postall-assets');

CREATE POLICY "Owners can delete from postall-assets" ON storage.objects FOR DELETE
  USING (bucket_id = 'postall-assets');

-- ==================== SEED DATA ====================

INSERT INTO cities (name, country, currency) VALUES
  ('Lagos', 'Nigeria', 'NGN'),
  ('Abuja', 'Nigeria', 'NGN'),
  ('Port Harcourt', 'Nigeria', 'NGN'),
  ('Ibadan', 'Nigeria', 'NGN'),
  ('Kano', 'Nigeria', 'NGN'),
  ('Accra', 'Ghana', 'GHS'),
  ('Nairobi', 'Kenya', 'KES'),
  ('Johannesburg', 'South Africa', 'ZAR'),
  ('Cairo', 'Egypt', 'EGP'),
  ('Dubai', 'UAE', 'AED'),
  ('London', 'UK', 'GBP'),
  ('New York', 'USA', 'USD'),
  ('Toronto', 'Canada', 'CAD'),
  ('Sydney', 'Australia', 'AUD')
ON CONFLICT (name) DO NOTHING;
