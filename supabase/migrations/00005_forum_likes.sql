-- Forum yanıt beğenileri
CREATE TABLE forum_reply_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id UUID NOT NULL REFERENCES forum_replies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(reply_id, user_id)
);

CREATE INDEX idx_forum_reply_likes_reply ON forum_reply_likes(reply_id);
CREATE INDEX idx_forum_reply_likes_user ON forum_reply_likes(user_id);

-- RLS
ALTER TABLE forum_reply_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes" ON forum_reply_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON forum_reply_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON forum_reply_likes FOR DELETE USING (auth.uid() = user_id);
