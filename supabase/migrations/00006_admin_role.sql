-- Admin rolü ekle
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

-- avlacmustafa@gmail.com hesabını admin yap
UPDATE profiles
SET is_admin = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'avlacmustafa@gmail.com');

-- RLS döngüsünü kırmak için security definer fonksiyon
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT is_admin FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admin tüm profilleri görebilsin
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin());

-- Admin tüm profilleri güncelleyebilsin
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin());

-- Admin tüm forum konularını silebilsin
CREATE POLICY "Admins can delete any topic" ON forum_topics
  FOR DELETE USING (is_admin());

-- Admin tüm forum konularını güncelleyebilsin
CREATE POLICY "Admins can update any topic" ON forum_topics
  FOR UPDATE USING (is_admin());

-- Admin tüm yanıtları silebilsin
CREATE POLICY "Admins can delete any reply" ON forum_replies
  FOR DELETE USING (is_admin());
