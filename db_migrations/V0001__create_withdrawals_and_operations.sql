
CREATE TABLE t_p62889068_mobile_profit_app_la.withdrawals (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  amount INTEGER NOT NULL,
  bank_name TEXT NOT NULL DEFAULT 'Тинькофф Банк',
  card_mask TEXT NOT NULL DEFAULT '•••• 4417',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p62889068_mobile_profit_app_la.operations (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  sub TEXT NOT NULL,
  amount INTEGER NOT NULL,
  up BOOLEAN NOT NULL,
  day TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO t_p62889068_mobile_profit_app_la.operations (icon, title, sub, amount, up, day, created_at) VALUES
  ('CheckCircle2', 'Опрос завершён', '14:20', 320, TRUE, 'Сегодня', NOW()),
  ('Video', 'Просмотр обзора', '11:08', 80, TRUE, 'Сегодня', NOW() - INTERVAL '3 hours'),
  ('ArrowDownToLine', 'Вывод · Тинькофф', '19:05', 5000, FALSE, 'Вчера', NOW() - INTERVAL '1 day'),
  ('Download', 'Установка приложения', '12:30', 150, TRUE, 'Вчера', NOW() - INTERVAL '1 day 2 hours'),
  ('Star', 'Отзыв в App Store', '16:42', 200, TRUE, '18 июня', NOW() - INTERVAL '2 days');
