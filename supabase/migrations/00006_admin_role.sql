-- Admin rolü ekle
ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

-- avlacmustafa@gmail.com hesabını admin yap
UPDATE profiles
SET is_admin = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'avlacmustafa@gmail.com');

-- Admin kullanıcılar tüm profilleri görebilsin
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() = id
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- Admin kullanıcılar tüm profilleri güncelleyebilsin
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- Admin kullanıcılar tüm forum konularını silebilsin
CREATE POLICY "Admins can delete any topic" ON forum_topics
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- Admin kullanıcılar tüm forum konularını güncelleyebilsin
CREATE POLICY "Admins can update any topic" ON forum_topics
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

-- Admin kullanıcılar tüm yanıtları silebilsin
CREATE POLICY "Admins can delete any reply" ON forum_replies
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );
