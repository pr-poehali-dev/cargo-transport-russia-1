import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const TRUCK_IMG = "https://cdn.poehali.dev/projects/d9af6f2f-c9a4-4eac-9fca-f9a157039e96/files/beb26dd7-d331-4904-afea-0fb17385eb4d.jpg";
const WAREHOUSE_IMG = "https://cdn.poehali.dev/projects/d9af6f2f-c9a4-4eac-9fca-f9a157039e96/files/5f79d554-2678-4c57-9cd3-f2427717eff9.jpg";
const FLEET_IMG = "https://cdn.poehali.dev/projects/d9af6f2f-c9a4-4eac-9fca-f9a157039e96/files/25c63b46-243b-4c70-b9f4-a62b69fb7cbf.jpg";
const HIGHWAY_IMG = "https://cdn.poehali.dev/projects/d9af6f2f-c9a4-4eac-9fca-f9a157039e96/files/69c78269-170c-4036-9868-696aa4c4f9ac.jpg";

const SEND_ORDER_URL = "https://functions.poehali.dev/4f9d2b4a-aed3-41f2-b5ef-7c3e71950b1e";

const services = [
  { icon: "Truck", title: "Сборные грузы", desc: "Объединяем партии от разных отправителей — платите только за свой объём" },
  { icon: "Package", title: "Негабаритные грузы", desc: "Спецтехника и оборудование любых размеров под ключ" },
  { icon: "Snowflake", title: "Рефрижераторы", desc: "Перевозка продуктов и лекарств при заданной температуре" },
  { icon: "Building2", title: "Переезды бизнеса", desc: "Офисы, склады, производства — без остановки работы" },
];

const advantages = [
  { num: "15+", label: "лет на рынке" },
  { num: "50 000+", label: "доставок выполнено" },
  { num: "300+", label: "городов России" },
];

const reviews = [
  { name: "Алексей Морозов", company: "ООО «СтройМаш»", city: "Москва", text: "Перевезли станки с завода в Екатеринбург — всё без единой царапины. Машина пришла точно в срок, менеджер был на связи всю дорогу. Работаем уже третий год.", stars: 5 },
  { name: "Елена Соколова", company: "ИП Соколова", city: "Новосибирск", text: "Заказывала рефрижератор для перевозки кондитерских изделий. Температурный режим выдержан идеально. Цена оказалась ниже, чем у конкурентов. Рекомендую!", stars: 5 },
  { name: "Дмитрий Павлов", company: "«Техника Плюс»", city: "Санкт-Петербург", text: "Перевезли офис при переезде. Разобрали, упаковали, собрали на месте. Ни один предмет не потерялся. Очень профессиональный подход.", stars: 5 },
  { name: "Марина Иванова", company: "Сеть магазинов «Уют»", city: "Казань", text: "Сотрудничаем на постоянной основе — каждую неделю возим товар из Москвы. Всегда вовремя, всегда аккуратно. Отличная логистика.", stars: 5 },
  { name: "Игорь Зайцев", company: "ЗАО «МеталлГрупп»", city: "Челябинск", text: "Нужно было срочно отправить партию металлопроката. Машину подали через 3 часа после звонка. Груз доставлен в целости. Спасибо за оперативность!", stars: 5 },
  { name: "Светлана Кузнецова", company: "ООО «ФармаЛогист»", city: "Краснодар", text: "Доверяем только ЮЛМИ-ТРАНС для перевозки фармацевтики. Соблюдают все требования по температуре и документации. Работаем уже два года.", stars: 5 },
];

const perks = [
  { icon: "Zap", title: "Молниеносная подача", desc: "Машина у ваших ворот через 2 часа после заявки в большинстве городов" },
  { icon: "Shield", title: "Страхование груза", desc: "Полное покрытие стоимости груза — без скрытых ограничений" },
  { icon: "MapPin", title: "GPS-трекинг", desc: "Следите за перемещением груза в реальном времени в личном кабинете" },
  { icon: "Headphones", title: "Поддержка 24/7", desc: "Персональный менеджер на связи в любое время суток" },
  { icon: "BadgePercent", title: "Фиксированные цены", desc: "Цена из заявки — финальная. Никаких доплат по дороге" },
  { icon: "Star", title: "Гарантия сохранности", desc: "Вернём 100% стоимости если груз повреждён или утерян" },
];

export default function Index() {
  const [formData, setFormData] = useState({ from: "", to: "", weight: "", name: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  const isVisible = (id: string) => visibleSections.has(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch(SEND_ORDER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) { console.error(err); }
    setSending(false);
    setSubmitted(true);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <style>{`
        @keyframes slideRight {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(40px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes roadStripe {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes pulseMint {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(255, 107, 0, 0); }
        }
        .anim-slide-right { animation: slideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-fade-up { animation: fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .anim-scale-in { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .road-stripes { animation: roadStripe 1.5s linear infinite; }
        .pulse-btn { animation: pulseMint 2s ease-in-out infinite; }
        .hide { opacity: 0; }
        .d100 { animation-delay: 0.1s; }
        .d200 { animation-delay: 0.2s; }
        .d300 { animation-delay: 0.3s; }
        .d400 { animation-delay: 0.4s; }
        .d500 { animation-delay: 0.5s; }
        .d600 { animation-delay: 0.6s; }
        .card-hov { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .card-hov:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(255,107,0,0.15); }
        .nav-ul::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px; background: #ff6b00; transition: width 0.3s ease; }
        .nav-ul:hover::after { width: 100%; }
        .inp { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: border-color 0.3s ease, background 0.3s ease; color: white; }
        .inp::placeholder { color: rgba(255,255,255,0.3); }
        .inp:focus { outline: none; border-color: #ff6b00; background: rgba(255,107,0,0.05); }
        .stripe-bg { background: repeating-linear-gradient(90deg, rgba(255,107,0,0.8) 0px, rgba(255,107,0,0.8) 40px, transparent 40px, transparent 80px); }
        .oswald { font-family: 'Oswald', sans-serif; }
        .tg-link { transition: color 0.2s, opacity 0.2s; }
        .tg-link:hover { opacity: 0.8; }
      `}</style>

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: scrollY > 50 ? 'rgba(10,10,10,0.95)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
          borderBottom: scrollY > 50 ? '1px solid rgba(255,107,0,0.2)' : 'none'
        }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center" style={{ background: '#ff6b00' }}>
            <Icon name="Truck" size={16} className="text-white" />
          </div>
          <span className="oswald text-xl font-bold tracking-widest uppercase">
            ЮЛМИ-<span style={{ color: '#ff6b00' }}>ТРАНС</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[["services", "Услуги"], ["advantages", "Преимущества"], ["reviews", "Отзывы"], ["order", "Заказать"]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}
              className="nav-ul relative text-sm text-gray-300 hover:text-white transition-colors uppercase tracking-widest">
              {label}
            </button>
          ))}
          <a href="https://t.me/Yulmitrans" target="_blank" rel="noopener noreferrer"
            className="tg-link flex items-center gap-2 text-sm text-gray-300 hover:text-white uppercase tracking-widest">
            <Icon name="Send" size={14} style={{ color: '#ff6b00' }} />
            Telegram
          </a>
        </div>
        <button onClick={() => scrollTo("order")}
          className="pulse-btn text-white text-sm px-6 py-2 uppercase tracking-widest oswald hover:opacity-90 transition-opacity"
          style={{ background: '#ff6b00' }}>
          Получить расчёт
        </button>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={TRUCK_IMG} alt="Грузоперевозки" className="w-full h-full object-cover"
            style={{ transform: `scale(1.1) translateY(${scrollY * 0.3}px)`, transition: 'transform 0.1s linear' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0a0a0a, rgba(10,10,10,0.7), transparent)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0a0a0a, transparent 60%)' }} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
          <div className="road-stripes stripe-bg h-full w-[200%]" />
        </div>

        <div className="relative z-10 px-8 md:px-16 lg:px-24 pt-24">
          <div className="anim-slide-right">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-12" style={{ background: '#ff6b00' }} />
              <span className="text-sm uppercase tracking-widest font-medium" style={{ color: '#ff6b00' }}>Грузоперевозки по всей России</span>
            </div>
          </div>

          {/* Телефон и Telegram между заголовком и подзаголовком */}
          <div className="anim-fade-up flex flex-wrap items-center gap-6 mb-4">
            <a href="tel:+79128887300"
              className="tg-link flex items-center gap-2 text-white text-lg font-bold hover:text-orange-400">
              <Icon name="Phone" size={18} style={{ color: '#ff6b00' }} />
              8 912 888-73-00
            </a>
            <a href="https://t.me/Yulmitrans" target="_blank" rel="noopener noreferrer"
              className="tg-link flex items-center gap-2 text-white text-lg font-bold hover:text-orange-400">
              <Icon name="Send" size={18} style={{ color: '#ff6b00' }} />
              t.me/Yulmitrans
            </a>
          </div>

          <h1 className="anim-fade-up d100 oswald font-bold leading-none uppercase mb-6"
            style={{ fontSize: 'clamp(60px, 10vw, 120px)' }}>
            <span className="block">Доставим</span>
            <span className="block" style={{ color: '#ff6b00' }}>быстрее</span>
            <span className="block">всех</span>
          </h1>
          <p className="anim-fade-up d200 text-gray-300 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
            Перевозим грузы любого объёма по России за фиксированную цену.
          </p>
          <div className="anim-fade-up d300 flex flex-wrap gap-4">
            <button onClick={() => scrollTo("order")}
              className="text-white oswald text-lg px-10 py-4 uppercase tracking-widest transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#ff6b00' }}>
              Заказать доставку
            </button>
            <a href="https://t.me/Yulmitrans" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-white oswald text-lg px-10 py-4 uppercase tracking-widest transition-all hover:text-orange-400"
              style={{ border: '1px solid rgba(255,255,255,0.3)' }}>
              <Icon name="Send" size={18} />
              Написать в Telegram
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 py-4 px-8" style={{ background: 'rgba(255,107,0,0.9)', backdropFilter: 'blur(8px)' }}>
          <div className="flex flex-wrap justify-center md:justify-around gap-6">
            {advantages.map((a, i) => (
              <div key={i} className="text-center">
                <div className="oswald text-2xl font-bold text-white">{a.num}</div>
                <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.8)' }}>{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-16 px-8 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative overflow-hidden group" style={{ height: '260px' }}>
            <img src={HIGHWAY_IMG} alt="Автопарк на трассе" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-end p-6"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <span className="oswald text-white text-lg uppercase tracking-widest">Автопарк</span>
            </div>
          </div>
          <div className="relative overflow-hidden group" style={{ height: '260px' }}>
            <img src={WAREHOUSE_IMG} alt="Складской комплекс" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-end p-6"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <span className="oswald text-white text-lg uppercase tracking-widest">Складирование</span>
            </div>
          </div>
          <div className="relative overflow-hidden group" style={{ height: '260px' }}>
            <img src={FLEET_IMG} alt="Флот грузовиков" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 flex items-end p-6"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <span className="oswald text-white text-lg uppercase tracking-widest">Флот</span>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" ref={setRef("services")} className="py-24 px-8 md:px-16 lg:px-24">
        <div className={isVisible("services") ? "anim-fade-up mb-16" : "hide mb-16"}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: '#ff6b00' }} />
            <span className="text-sm uppercase tracking-widest" style={{ color: '#ff6b00' }}>Что мы делаем</span>
          </div>
          <h2 className="oswald font-bold uppercase" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>Наши услуги</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <div key={i}
              className={`card-hov p-8 group cursor-pointer ${isVisible("services") ? `anim-fade-up d${(i + 1) * 100}` : "hide"}`}
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-orange-500"
                  style={{ background: 'rgba(255,107,0,0.1)' }}>
                  <Icon name={s.icon} size={24} style={{ color: '#ff6b00' }} />
                </div>
                <div>
                  <h3 className="oswald text-2xl font-bold uppercase mb-3 transition-colors group-hover:text-orange-400">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
              <div className="mt-6 h-px" style={{ background: 'linear-gradient(to right, rgba(255,107,0,0.5), transparent)' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ADVANTAGES */}
      <section id="advantages" ref={setRef("advantages")} className="py-24 px-8 md:px-16 lg:px-24" style={{ background: '#0f0f0f' }}>
        <div className={isVisible("advantages") ? "anim-fade-up mb-16" : "hide mb-16"}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: '#ff6b00' }} />
            <span className="text-sm uppercase tracking-widest" style={{ color: '#ff6b00' }}>Почему выбирают нас</span>
          </div>
          <h2 className="oswald font-bold uppercase" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>Преимущества</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((p, i) => (
            <div key={i}
              className={`card-hov p-8 group ${isVisible("advantages") ? `anim-scale-in d${(i + 1) * 100}` : "hide"}`}
              style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="w-12 h-12 flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                style={{ background: '#ff6b00' }}>
                <Icon name={p.icon} size={20} className="text-white" />
              </div>
              <h3 className="oswald text-xl font-bold uppercase mb-3">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ORDER FORM */}
      <section id="order" ref={setRef("order")} className="py-24 px-8 md:px-16 lg:px-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,107,0,0.05), transparent, rgba(255,107,0,0.05))' }} />
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,107,0,0.5), transparent)' }} />

        <div className={`relative z-10 max-w-2xl ${isVisible("order") ? "anim-fade-up" : "hide"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12" style={{ background: '#ff6b00' }} />
            <span className="text-sm uppercase tracking-widest" style={{ color: '#ff6b00' }}>Бесплатный расчёт</span>
          </div>
          <h2 className="oswald font-bold uppercase mb-4" style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>
            Заказать<br /><span style={{ color: '#ff6b00' }}>доставку</span>
          </h2>
          <p className="text-gray-400 mb-10">Оставьте заявку — менеджер свяжется в течение 15 минут и рассчитает стоимость</p>

          {submitted ? (
            <div className="p-10 text-center anim-scale-in" style={{ border: '1px solid #ff6b00' }}>
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6" style={{ background: '#ff6b00' }}>
                <Icon name="Check" size={32} className="text-white" />
              </div>
              <h3 className="oswald text-3xl font-bold uppercase mb-3">Заявка принята!</h3>
              <p className="text-gray-400">Менеджер свяжется с вами в ближайшие 15 минут</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Откуда</label>
                  <input className="inp w-full px-4 py-3 rounded-none"
                    placeholder="Город отправки" value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Куда</label>
                  <input className="inp w-full px-4 py-3 rounded-none"
                    placeholder="Город доставки" value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Вес груза (кг)</label>
                <input className="inp w-full px-4 py-3 rounded-none"
                  placeholder="Примерный вес" type="number" value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Ваше имя</label>
                  <input className="inp w-full px-4 py-3 rounded-none"
                    placeholder="Как вас зовут?" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Телефон</label>
                  <input className="inp w-full px-4 py-3 rounded-none"
                    placeholder="+7 (___) ___-__-__" type="tel" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
              </div>
              <button type="submit" disabled={sending}
                className="w-full text-white oswald text-lg py-5 uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 mt-2 disabled:opacity-60"
                style={{ background: '#ff6b00' }}>
                {sending ? 'Отправляем...' : 'Рассчитать стоимость →'}
              </button>
              <p className="text-gray-600 text-xs text-center">Нажимая кнопку, вы соглашаетесь с политикой обработки данных</p>
            </form>
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" ref={setRef("reviews")} className="py-24 overflow-hidden"
        style={{ background: '#0a0a0a' }}>
        <div className="px-8 md:px-16 lg:px-24 mb-14">
          <div className={`flex items-center gap-4 mb-4 ${isVisible("reviews") ? "anim-fade-up" : "hide"}`}>
            <div className="h-px w-12" style={{ background: '#ff6b00' }} />
            <span className="text-sm uppercase tracking-widest" style={{ color: '#ff6b00' }}>Отзывы клиентов</span>
          </div>
          <h2 className={`oswald text-4xl md:text-5xl font-bold uppercase ${isVisible("reviews") ? "anim-fade-up d100" : "hide"}`}>
            Нам доверяют
          </h2>
        </div>

        <div className="relative">
          <div className="flex gap-6 reviews-track px-8 md:px-16 lg:px-24"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(320px, 1fr))',
              gap: '24px',
            }}>
            {reviews.map((r, i) => (
              <div key={i} className={`p-8 flex flex-col gap-4 card-hov ${isVisible("reviews") ? `anim-fade-up` : "hide"}`}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  animationDelay: `${i * 0.1}s`
                }}>
                <div className="flex gap-1">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Icon key={j} name="Star" size={16} style={{ color: '#ff6b00', fill: '#ff6b00' }} />
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed flex-1">«{r.text}»</p>
                <div className="h-px w-full" style={{ background: 'rgba(255,107,0,0.2)' }} />
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center oswald font-bold text-white flex-shrink-0"
                    style={{ background: '#ff6b00', fontSize: '16px' }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{r.name}</div>
                    <div className="text-gray-500 text-xs">{r.company} · {r.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" ref={setRef("contacts")} className="py-16 px-8 md:px-16 lg:px-24"
        style={{ background: '#0f0f0f', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <div className={isVisible("contacts") ? "anim-fade-up" : "hide"}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 flex items-center justify-center" style={{ background: '#ff6b00' }}>
                <Icon name="Truck" size={16} className="text-white" />
              </div>
              <span className="oswald text-xl font-bold tracking-widest uppercase">
                ЮЛМИ-<span style={{ color: '#ff6b00' }}>ТРАНС</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">Надёжные грузоперевозки по всей России с 2010 года</p>
          </div>

          <div className={`flex flex-col gap-4 ${isVisible("contacts") ? "anim-fade-up d200" : "hide"}`}>
            <a href="tel:+79128887300" className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors">
              <Icon name="Phone" size={16} style={{ color: '#ff6b00' }} />
              <span>+7 912 888-73-00</span>
            </a>
            <a href="tel:+79128884300" className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors">
              <Icon name="Phone" size={16} style={{ color: '#ff6b00' }} />
              <span>+7 912 888-43-00</span>
            </a>
            <a href="tel:+79128880042" className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors">
              <Icon name="Phone" size={16} style={{ color: '#ff6b00' }} />
              <span>+7 912 888-00-42</span>
            </a>
            <a href="https://t.me/Yulmitrans" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors">
              <Icon name="Send" size={16} style={{ color: '#ff6b00' }} />
              <span>t.me/Yulmitrans</span>
            </a>
            <a href="mailto:yulmitrans@mail.ru" className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors">
              <Icon name="Mail" size={16} style={{ color: '#ff6b00' }} />
              <span>yulmitrans@mail.ru</span>
            </a>
            <div className="flex items-center gap-3 text-gray-400">
              <Icon name="Clock" size={16} style={{ color: '#ff6b00' }} />
              <span>Работаем 24/7</span>
            </div>
          </div>

          <div className={isVisible("contacts") ? "anim-fade-up d300" : "hide"}>
            <button onClick={() => scrollTo("order")}
              className="text-white oswald text-sm px-8 py-3 uppercase tracking-widest hover:opacity-90 transition-opacity"
              style={{ background: '#ff6b00' }}>
              Заказать сейчас
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-gray-600 text-xs">© 2024 ЮЛМИ-ТРАНС. Все права защищены.</p>
          <div className="overflow-hidden" style={{ opacity: 0.3 }}>
            <div className="road-stripes stripe-bg h-2 w-32 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
}