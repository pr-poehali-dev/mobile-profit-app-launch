import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const API = 'https://functions.poehali.dev/a6dda7d3-1631-487b-9890-32755c56da3a';
const USER_ID = 'default';

type TabId = 'home' | 'wallet' | 'tasks' | 'history' | 'profile' | 'support' | 'settings';

type Op = { id: number; icon: string; title: string; sub: string; amount: number; up: boolean; day: string };

const NAV: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: 'Главная', icon: 'LayoutGrid' },
  { id: 'wallet', label: 'Кошелёк', icon: 'Wallet' },
  { id: 'tasks', label: 'Задания', icon: 'Target' },
  { id: 'history', label: 'История', icon: 'Clock' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

const MIN_WITHDRAW = 100;

const fmt = (n: number) => n.toLocaleString('ru-RU');
const signed = (op: Op) => `${op.up ? '+' : '−'}${fmt(Math.abs(op.amount))} ₽`;

const INITIAL_OPS: Op[] = [
  { id: 1, icon: 'CheckCircle2', title: 'Опрос завершён', sub: '14:20', amount: 320, up: true, day: 'Сегодня' },
  { id: 2, icon: 'Video', title: 'Просмотр обзора', sub: '11:08', amount: 80, up: true, day: 'Сегодня' },
  { id: 3, icon: 'ArrowDownToLine', title: 'Вывод · Тинькофф', sub: '19:05', amount: 5000, up: false, day: 'Вчера' },
  { id: 4, icon: 'Download', title: 'Установка приложения', sub: '12:30', amount: 150, up: true, day: 'Вчера' },
  { id: 5, icon: 'Star', title: 'Отзыв в App Store', sub: '16:42', amount: 200, up: true, day: '18 июня' },
];

function Header({ onMenu, balance }: { onMenu: (t: TabId) => void; balance: number }) {
  return (
    <div className="gradient-navy px-5 pt-12 pb-7 text-white rounded-b-[28px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-gold flex items-center justify-center">
            <Icon name="Banknote" size={18} className="text-navy-deep" />
          </div>
          <span className="text-lg font-bold tracking-tight">Payvo</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onMenu('support')} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Icon name="LifeBuoy" size={17} className="text-white" />
          </button>
          <button onClick={() => onMenu('settings')} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <Icon name="Settings" size={17} className="text-white" />
          </button>
        </div>
      </div>
      <div className="mt-7">
        <p className="text-white/60 text-[13px] font-medium">Доступно к выводу</p>
        <div className="flex items-end gap-1.5 mt-1">
          <span className="text-4xl font-bold font-mono-num tracking-tight">{fmt(balance)}</span>
          <span className="text-xl font-semibold text-white/80 mb-0.5">₽</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-gold text-[13px] font-medium">
          <Icon name="TrendingUp" size={14} />
          <span>+1 240 ₽ за эту неделю</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-card rounded-2xl p-4 card-shadow flex-1">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${accent ? 'gradient-gold' : 'bg-secondary'}`}>
        <Icon name={icon} size={17} className={accent ? 'text-navy-deep' : 'text-navy'} />
      </div>
      <p className="text-muted-foreground text-[12px] font-medium">{label}</p>
      <p className="text-foreground text-lg font-bold font-mono-num mt-0.5">{value}</p>
    </div>
  );
}

function HomeView({ go, balance, ops }: { go: (t: TabId) => void; balance: number; ops: Op[] }) {
  const actions = [
    { icon: 'ArrowDownToLine', label: 'Вывести', tab: 'wallet' as TabId, accent: true },
    { icon: 'Target', label: 'Задания', tab: 'tasks' as TabId },
    { icon: 'Clock', label: 'История', tab: 'history' as TabId },
    { icon: 'LifeBuoy', label: 'Помощь', tab: 'support' as TabId },
  ];
  const feed = ops.slice(0, 3);
  return (
    <div className="px-5 space-y-6">
      <div className="grid grid-cols-4 gap-2.5 -mt-7 relative z-10 animate-fade-up">
        {actions.map((a) => (
          <button key={a.label} onClick={() => go(a.tab)} className="bg-card rounded-2xl py-3.5 px-1 card-shadow flex flex-col items-center gap-2 hover:-translate-y-0.5 transition-transform">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.accent ? 'gradient-gold' : 'bg-secondary'}`}>
              <Icon name={a.icon} size={18} className={a.accent ? 'text-navy-deep' : 'text-navy'} />
            </div>
            <span className="text-[11px] font-medium text-foreground">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2.5 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <StatCard icon="Wallet" label="Всего заработано" value="48 920 ₽" accent />
        <StatCard icon="CheckCheck" label="Заданий выполнено" value="184" />
      </div>

      <div className="gradient-navy rounded-2xl p-5 text-white card-shadow animate-fade-up" style={{ animationDelay: '120ms' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-[12px] font-medium">Привязанный счёт</p>
            <p className="font-semibold mt-1 font-mono-num tracking-wide">•••• 4417 · Тинькофф</p>
          </div>
          <Icon name="ShieldCheck" size={26} className="text-gold" />
        </div>
        <button onClick={() => go('wallet')} className="w-full mt-4 gradient-gold text-navy-deep font-semibold text-sm rounded-xl py-3 glow-gold hover:opacity-95 transition-opacity">
          Вывести на счёт
        </button>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '160ms' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-foreground">Последние операции</h2>
          <button onClick={() => go('history')} className="text-[13px] text-muted-foreground font-medium">Все</button>
        </div>
        <div className="bg-card rounded-2xl card-shadow divide-y divide-border">
          {feed.map((f) => (
            <div key={f.id} className="flex items-center gap-3 p-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.up ? 'bg-emerald-50' : 'bg-secondary'}`}>
                <Icon name={f.icon} size={18} className={f.up ? 'text-emerald-600' : 'text-navy'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{f.title}</p>
                <p className="text-muted-foreground text-[12px]">{f.day}, {f.sub}</p>
              </div>
              <span className={`font-semibold font-mono-num text-sm ${f.up ? 'text-emerald-600' : 'text-foreground'}`}>{signed(f)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WalletView({ balance, onWithdraw, goHistory }: { balance: number; onWithdraw: (n: number) => Promise<boolean>; goHistory: () => void }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const chips = [1000, 5000, balance];
  const num = Number(amount) || 0;

  let error = '';
  if (amount !== '' && num < MIN_WITHDRAW) error = `Минимальная сумма вывода — ${MIN_WITHDRAW} ₽`;
  else if (num > balance) error = 'Сумма больше доступного баланса';
  const valid = num >= MIN_WITHDRAW && num <= balance;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true);
    const ok = await onWithdraw(num);
    if (ok) {
      toast.success('Заявка на вывод создана', { description: `${fmt(num)} ₽ поступят на счёт •••• 4417` });
      setAmount('');
      goHistory();
    }
    setLoading(false);
  };

  return (
    <div className="px-5 space-y-5">
      <div className="bg-card rounded-2xl p-5 card-shadow animate-fade-up">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-[13px] font-medium">Сумма вывода</p>
          <p className="text-[12px] text-muted-foreground">Доступно: <span className="font-mono-num font-semibold text-foreground">{fmt(balance)} ₽</span></p>
        </div>
        <div className={`flex items-end gap-1 mt-2 border-b pb-3 ${error ? 'border-destructive' : 'border-border'}`}>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 7))}
            placeholder="0"
            inputMode="numeric"
            className="flex-1 text-4xl font-bold font-mono-num bg-transparent outline-none placeholder:text-muted-foreground/40 min-w-0"
          />
          <span className="text-2xl font-semibold text-muted-foreground mb-1">₽</span>
        </div>
        {error ? (
          <p className="flex items-center gap-1.5 text-destructive text-[12px] font-medium mt-2">
            <Icon name="AlertCircle" size={13} /> {error}
          </p>
        ) : null}
        <div className="flex gap-2 mt-3">
          {chips.map((c, i) => (
            <button key={i} onClick={() => setAmount(String(c))} className="flex-1 bg-secondary rounded-xl py-2 text-[13px] font-semibold text-navy font-mono-num hover:bg-secondary/70 transition-colors">
              {i === 2 ? 'Всё' : `${fmt(c)} ₽`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl card-shadow animate-fade-up" style={{ animationDelay: '60ms' }}>
        <div className="flex items-center gap-3 p-4">
          <div className="w-11 h-11 rounded-xl gradient-navy flex items-center justify-center">
            <Icon name="CreditCard" size={20} className="text-gold" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">Тинькофф Банк</p>
            <p className="text-muted-foreground text-[13px] font-mono-num">•••• 4417</p>
          </div>
          <Icon name="Check" size={20} className="text-emerald-600" />
        </div>
        <button onClick={() => toast('Добавление счёта скоро будет доступно')} className="w-full flex items-center justify-center gap-2 py-3.5 border-t border-border text-navy font-medium text-sm hover:bg-secondary/40 transition-colors rounded-b-2xl">
          <Icon name="Plus" size={16} /> Добавить счёт
        </button>
      </div>

      <div className="bg-secondary/60 rounded-2xl p-4 flex gap-3 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <Icon name="Info" size={18} className="text-navy shrink-0 mt-0.5" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Вывод на банковский счёт без комиссии. Зачисление — от 5 минут до 1 рабочего дня.
        </p>
      </div>

      <button
        onClick={submit}
        disabled={!valid || loading}
        className="w-full gradient-gold text-navy-deep font-bold rounded-2xl py-4 glow-gold hover:opacity-95 transition-all disabled:opacity-40 disabled:glow-none flex items-center justify-center gap-2 animate-fade-up"
        style={{ animationDelay: '140ms' }}
      >
        {loading ? (
          <><Icon name="Loader2" size={18} className="animate-spin" /> Обработка…</>
        ) : (
          <>Вывести{num > 0 ? ` ${fmt(num)} ₽` : ' на счёт'}</>
        )}
      </button>
    </div>
  );
}

function TasksView() {
  const tasks = [
    { icon: 'ClipboardList', title: 'Пройти опрос о финансах', time: '5 мин', reward: 320 },
    { icon: 'Download', title: 'Установить приложение банка', time: '3 мин', reward: 150 },
    { icon: 'Video', title: 'Посмотреть обзор продукта', time: '2 мин', reward: 80 },
    { icon: 'Star', title: 'Оставить отзыв в сторе', time: '4 мин', reward: 200 },
    { icon: 'UserPlus', title: 'Пригласить друга', time: '1 мин', reward: 500 },
  ];
  return (
    <div className="px-5 space-y-4">
      <div className="gradient-navy rounded-2xl p-5 text-white card-shadow animate-fade-up">
        <p className="text-white/60 text-[12px] font-medium">Доступно заданий сегодня</p>
        <p className="text-3xl font-bold font-mono-num mt-1">{tasks.length}</p>
        <p className="text-gold text-[13px] font-medium mt-1">Возможный доход — 1 250 ₽</p>
      </div>
      <div className="space-y-3">
        {tasks.map((t, i) => (
          <div key={t.title} className="bg-card rounded-2xl p-4 card-shadow flex items-center gap-3 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Icon name={t.icon} size={19} className="text-navy" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{t.title}</p>
              <div className="flex items-center gap-1 text-muted-foreground text-[12px] mt-0.5">
                <Icon name="Clock" size={12} /> {t.time}
              </div>
            </div>
            <button className="gradient-gold text-navy-deep font-bold text-[13px] font-mono-num rounded-xl px-3.5 py-2 shrink-0 hover:opacity-90 transition-opacity">
              +{t.reward} ₽
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryView({ ops }: { ops: Op[] }) {
  const days = Array.from(new Set(ops.map((o) => o.day)));
  return (
    <div className="px-5 space-y-5">
      {days.map((day, gi) => (
        <div key={day} className="animate-fade-up" style={{ animationDelay: `${gi * 60}ms` }}>
          <p className="text-muted-foreground text-[12px] font-semibold uppercase tracking-wide mb-2 px-1">{day}</p>
          <div className="bg-card rounded-2xl card-shadow divide-y divide-border">
            {ops.filter((o) => o.day === day).map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.up ? 'bg-emerald-50' : 'bg-secondary'}`}>
                  <Icon name={f.icon} size={18} className={f.up ? 'text-emerald-600' : 'text-navy'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{f.title}</p>
                  <p className="text-muted-foreground text-[12px]">{f.sub}</p>
                </div>
                <span className={`font-semibold font-mono-num text-sm ${f.up ? 'text-emerald-600' : 'text-foreground'}`}>{signed(f)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileView() {
  const rows = [
    { icon: 'BadgeCheck', label: 'Верификация', value: 'Пройдена', accent: true },
    { icon: 'Mail', label: 'Email', value: 'user@payvo.ru' },
    { icon: 'Phone', label: 'Телефон', value: '+7 ••• ••• 44 17' },
    { icon: 'Award', label: 'Уровень', value: 'Профи · 3' },
  ];
  return (
    <div className="px-5 space-y-5">
      <div className="bg-card rounded-2xl p-5 card-shadow flex items-center gap-4 animate-fade-up">
        <div className="w-16 h-16 rounded-2xl gradient-navy flex items-center justify-center text-gold text-2xl font-bold">А</div>
        <div>
          <p className="font-bold text-foreground text-lg">Александр Н.</p>
          <p className="text-muted-foreground text-[13px]">В Payvo с марта 2025</p>
        </div>
      </div>
      <div className="flex gap-2.5 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <StatCard icon="Wallet" label="Заработано" value="48 920 ₽" accent />
        <StatCard icon="Users" label="Рефералов" value="12" />
      </div>
      <div className="bg-card rounded-2xl card-shadow divide-y divide-border animate-fade-up" style={{ animationDelay: '100ms' }}>
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 p-4">
            <Icon name={r.icon} size={18} className="text-navy" />
            <span className="flex-1 text-foreground text-sm font-medium">{r.label}</span>
            <span className={`text-[13px] font-medium ${r.accent ? 'text-emerald-600' : 'text-muted-foreground'}`}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SupportView() {
  const faq = [
    { icon: 'HelpCircle', q: 'Как вывести деньги на счёт?', a: 'Откройте «Кошелёк», укажите сумму и подтвердите вывод.' },
    { icon: 'Timer', q: 'Сколько идёт зачисление?', a: 'От 5 минут до 1 рабочего дня в зависимости от банка.' },
    { icon: 'ShieldCheck', q: 'Безопасны ли мои данные?', a: 'Данные защищены шифрованием, мы не храним номер карты.' },
  ];
  return (
    <div className="px-5 space-y-5">
      <div className="gradient-navy rounded-2xl p-5 text-white card-shadow animate-fade-up">
        <Icon name="Headset" size={28} className="text-gold" />
        <p className="font-bold text-lg mt-3">Мы на связи 24/7</p>
        <p className="text-white/60 text-[13px] mt-1">Среднее время ответа — 4 минуты</p>
        <button onClick={() => toast('Чат с поддержкой скоро будет доступен')} className="w-full mt-4 gradient-gold text-navy-deep font-semibold text-sm rounded-xl py-3 hover:opacity-95 transition-opacity">
          Написать в поддержку
        </button>
      </div>
      <div className="space-y-3">
        {faq.map((f, i) => (
          <div key={f.q} className="bg-card rounded-2xl p-4 card-shadow flex gap-3 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <Icon name={f.icon} size={18} className="text-navy" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{f.q}</p>
              <p className="text-muted-foreground text-[13px] mt-0.5 leading-relaxed">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  const [push, setPush] = useState(true);
  const [biometry, setBiometry] = useState(true);
  const toggles = [
    { icon: 'Bell', label: 'Push-уведомления', on: push, set: setPush },
    { icon: 'Fingerprint', label: 'Вход по биометрии', on: biometry, set: setBiometry },
  ];
  const links = [
    { icon: 'CreditCard', label: 'Платёжные счета' },
    { icon: 'Lock', label: 'Безопасность' },
    { icon: 'FileText', label: 'Документы и договор' },
    { icon: 'LogOut', label: 'Выйти', danger: true },
  ];
  return (
    <div className="px-5 space-y-5">
      <div className="bg-card rounded-2xl card-shadow divide-y divide-border animate-fade-up">
        {toggles.map((t) => (
          <div key={t.label} className="flex items-center gap-3 p-4">
            <Icon name={t.icon} size={18} className="text-navy" />
            <span className="flex-1 text-foreground text-sm font-medium">{t.label}</span>
            <button onClick={() => t.set(!t.on)} className={`w-11 h-6 rounded-full transition-colors relative ${t.on ? 'bg-navy' : 'bg-muted'}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${t.on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
            </button>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl card-shadow divide-y divide-border animate-fade-up" style={{ animationDelay: '60ms' }}>
        {links.map((l) => (
          <button key={l.label} onClick={() => toast(l.label)} className="w-full flex items-center gap-3 p-4 hover:bg-secondary/40 transition-colors first:rounded-t-2xl last:rounded-b-2xl">
            <Icon name={l.icon} size={18} className={l.danger ? 'text-destructive' : 'text-navy'} />
            <span className={`flex-1 text-left text-sm font-medium ${l.danger ? 'text-destructive' : 'text-foreground'}`}>{l.label}</span>
            {!l.danger && <Icon name="ChevronRight" size={18} className="text-muted-foreground" />}
          </button>
        ))}
      </div>
      <p className="text-center text-muted-foreground text-[12px] animate-fade-up">Payvo · версия 1.0.0</p>
    </div>
  );
}

const TITLES: Record<TabId, string> = {
  home: 'Главная', wallet: 'Кошелёк', tasks: 'Задания', history: 'История',
  profile: 'Профиль', support: 'Поддержка', settings: 'Настройки',
};

const Index = () => {
  const [tab, setTab] = useState<TabId>('home');
  const [balance, setBalance] = useState(12480);
  const [ops, setOps] = useState<Op[]>(INITIAL_OPS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}?user_id=${USER_ID}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.operations) setOps(data.operations);
        if (typeof data.balance === 'number') setBalance(data.balance);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleWithdraw = async (sum: number): Promise<boolean> => {
    const res = await fetch(`${API}?user_id=${USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: sum, bank_name: 'Тинькофф Банк', card_mask: '•••• 4417' }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || 'Ошибка вывода');
      return false;
    }
    if (typeof data.balance === 'number') setBalance(data.balance);
    const now = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setOps((prev) => [
      { id: Date.now(), icon: 'ArrowDownToLine', title: 'Вывод · Тинькофф', sub: now, amount: sum, up: false, day: 'Сегодня' },
      ...prev,
    ]);
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-navy flex items-center justify-center">
            <Icon name="Banknote" size={26} className="text-gold" />
          </div>
          <Icon name="Loader2" size={24} className="text-navy animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md bg-background min-h-screen relative pb-24">
        {tab === 'home' ? (
          <Header onMenu={setTab} balance={balance} />
        ) : (
          <div className="gradient-navy px-5 pt-12 pb-5 text-white rounded-b-[28px] flex items-center gap-3">
            {!NAV.some((n) => n.id === tab) ? (
              <button onClick={() => setTab('home')} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon name="ChevronLeft" size={20} className="text-white" />
              </button>
            ) : null}
            <h1 className="text-xl font-bold tracking-tight">{TITLES[tab]}</h1>
          </div>
        )}

        <main className="mt-6 pb-4" key={tab}>
          {tab === 'home' && <HomeView go={setTab} balance={balance} ops={ops} />}
          {tab === 'wallet' && <WalletView balance={balance} onWithdraw={handleWithdraw} goHistory={() => setTab('history')} />}
          {tab === 'tasks' && <TasksView />}
          {tab === 'history' && <HistoryView ops={ops} />}
          {tab === 'profile' && <ProfileView />}
          {tab === 'support' && <SupportView />}
          {tab === 'settings' && <SettingsView />}
        </main>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-lg border-t border-border px-2 py-2 flex items-center justify-around">
          {NAV.map((n) => {
            const active = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)} className="flex flex-col items-center gap-1 py-1 px-2 flex-1">
                <div className={`flex items-center justify-center w-11 h-7 rounded-lg transition-colors ${active ? 'bg-navy' : ''}`}>
                  <Icon name={n.icon} size={19} className={active ? 'text-gold' : 'text-muted-foreground'} />
                </div>
                <span className={`text-[10px] font-medium ${active ? 'text-navy' : 'text-muted-foreground'}`}>{n.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Index;