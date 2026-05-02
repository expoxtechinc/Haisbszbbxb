import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Clock, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import { useSchoolData } from "@/lib/data";
import { Seo } from "@/components/seo";

function pad(n: number) { return String(n).padStart(2, "0"); }

function LiveClock() {
  const [now, setNow] = useState(new Date());
  const [tz] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const dateStr = now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const tzShort = now.toLocaleTimeString(undefined, { timeZoneName: "short" }).split(" ").pop() ?? tz;

  return (
    <div className="bg-primary text-primary-foreground rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center justify-between shadow-xl">
      <div>
        <div className="flex items-center gap-2 text-primary-foreground/70 text-sm mb-1">
          <Globe className="w-4 h-4" /> <span>Auto-detected timezone</span>
        </div>
        <div className="font-mono text-4xl md:text-6xl font-bold tracking-tight">{formatted}</div>
        <div className="text-primary-foreground/80 text-lg mt-1">{dateStr}</div>
      </div>
      <div className="flex flex-col items-center md:items-end gap-1">
        <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
          <Clock className="w-4 h-4" /> Your timezone
        </div>
        <div className="font-bold text-xl">{tzShort}</div>
        <div className="text-primary-foreground/60 text-xs max-w-[200px] text-center md:text-right">{tz.replace(/_/g, " ")}</div>
        <div className="mt-2 px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-sm font-medium">
          School hours: 8:00 AM – 3:00 PM WAT (GMT+0)
        </div>
      </div>
    </div>
  );
}

function MonthCalendar({ events }: { events: { date: string; title: string; color?: string }[] }) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const today = new Date();
  const { year, month } = viewDate;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setViewDate(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const nextMonth = () => setViewDate(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });

  const monthName = new Date(year, month, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const eventMap: Record<string, { title: string; color?: string }[]> = {};
  events.forEach(ev => {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = String(d.getDate());
      if (!eventMap[key]) eventMap[key] = [];
      eventMap[key].push({ title: ev.title, color: ev.color });
    }
  });

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted/50 transition-colors" aria-label="Previous month"><ChevronLeft className="w-5 h-5" /></button>
        <h3 className="font-serif font-bold text-lg text-foreground">{monthName}</h3>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted/50 transition-colors" aria-label="Next month"><ChevronRight className="w-5 h-5" /></button>
      </div>

      <div className="grid grid-cols-7 border-b border-border/50">
        {dayNames.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          const isToday = day !== null && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const isWeekend = i % 7 === 0 || i % 7 === 6;
          const dayEvents = day ? (eventMap[String(day)] ?? []) : [];
          return (
            <div
              key={i}
              className={`min-h-[56px] p-1 border-b border-r border-border/30 last:border-r-0 ${!day ? "bg-muted/20" : isWeekend ? "bg-muted/10" : ""}`}
            >
              {day && (
                <>
                  <div className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? "bg-primary text-primary-foreground" : "text-foreground"}`}>
                    {day}
                  </div>
                  {dayEvents.slice(0, 2).map((ev, j) => (
                    <div key={j} className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate mb-0.5 font-medium ${ev.color ?? "bg-secondary/20 text-secondary-foreground"}`}>
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</div>}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ACADEMIC_EVENTS = [
  // Term dates
  { date: `${new Date().getFullYear()}-09-02`, title: "First Term Begins", color: "bg-primary/20 text-primary" },
  { date: `${new Date().getFullYear()}-11-22`, title: "First Term Ends", color: "bg-primary/20 text-primary" },
  { date: `${new Date().getFullYear()}-11-25`, title: "Second Term Begins", color: "bg-blue-100 text-blue-800" },
  { date: `${new Date().getFullYear() + 1}-03-14`, title: "Second Term Ends", color: "bg-blue-100 text-blue-800" },
  { date: `${new Date().getFullYear() + 1}-03-17`, title: "Third Term Begins", color: "bg-green-100 text-green-800" },
  { date: `${new Date().getFullYear() + 1}-06-13`, title: "Third Term Ends", color: "bg-green-100 text-green-800" },
  // Holidays
  { date: `${new Date().getFullYear()}-11-26`, title: "Thanksgiving Day", color: "bg-yellow-100 text-yellow-800" },
  { date: `${new Date().getFullYear()}-12-25`, title: "Christmas Day", color: "bg-red-100 text-red-800" },
  { date: `${new Date().getFullYear() + 1}-01-01`, title: "New Year's Day", color: "bg-yellow-100 text-yellow-800" },
  { date: `${new Date().getFullYear() + 1}-02-11`, title: "Armed Forces Day", color: "bg-yellow-100 text-yellow-800" },
  { date: `${new Date().getFullYear() + 1}-03-15`, title: "J.J. Roberts Day", color: "bg-yellow-100 text-yellow-800" },
  { date: `${new Date().getFullYear() + 1}-07-26`, title: "Independence Day", color: "bg-red-100 text-red-800" },
  // School events
  { date: `${new Date().getFullYear()}-10-15`, title: "Sports Day", color: "bg-orange-100 text-orange-800" },
  { date: `${new Date().getFullYear()}-12-12`, title: "Quiz Competition", color: "bg-purple-100 text-purple-800" },
  { date: `${new Date().getFullYear() + 1}-05-23`, title: "Graduation Day", color: "bg-secondary/30 text-secondary-foreground" },
  { date: `${new Date().getFullYear() + 1}-06-06`, title: "End of Year Celebration", color: "bg-orange-100 text-orange-800" },
];

const TERM_SCHEDULE = [
  { term: "First Term", start: "September", end: "November", color: "bg-primary/10 border-primary/30" },
  { term: "Second Term", start: "November", end: "March", color: "bg-blue-50 border-blue-200" },
  { term: "Third Term", start: "March", end: "June", color: "bg-green-50 border-green-200" },
];

export default function CalendarPage() {
  const { schoolInfo, activities } = useSchoolData();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const allEvents = [
    ...ACADEMIC_EVENTS,
    ...activities
      .filter(a => a.date)
      .map(a => {
        const parsed = new Date(a.date ?? "");
        if (!isNaN(parsed.getTime())) {
          return { date: parsed.toISOString().split("T")[0], title: a.title, color: "bg-secondary/20 text-secondary-foreground" };
        }
        return null;
      })
      .filter(Boolean) as { date: string; title: string; color?: string }[],
  ];

  const upcoming = allEvents
    .map(ev => ({ ...ev, dateObj: new Date(ev.date) }))
    .filter(ev => ev.dateObj >= new Date(now.toDateString()))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .slice(0, 8);

  return (
    <div className="flex flex-col w-full pb-20">
      <Seo
        title={`School Calendar ${new Date().getFullYear()}–${new Date().getFullYear() + 1} — ${schoolInfo.name}`}
        description={`Academic calendar for Dr. Abraham S. Borbor Memorial School Of Excellence. Term dates, school events, holidays, and schedule for ${new Date().getFullYear()}–${new Date().getFullYear() + 1}.`}
        path="/calendar"
      />

      <section className="bg-primary pt-20 pb-16 text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4">School Calendar</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Academic schedule, term dates, school events, and public holidays for {new Date().getFullYear()}–{new Date().getFullYear() + 1}.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 md:px-6 py-10 max-w-5xl space-y-8">
        {/* Live Clock */}
        <LiveClock />

        {/* Term overview */}
        <div>
          <h2 className="font-serif text-2xl font-bold text-primary mb-4">Academic Year Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TERM_SCHEDULE.map((t) => (
              <div key={t.term} className={`rounded-2xl border-2 p-5 ${t.color}`}>
                <div className="font-bold text-lg text-foreground">{t.term}</div>
                <div className="text-muted-foreground text-sm mt-1">{t.start} — {t.end}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar grid */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-primary mb-4">Monthly View</h2>
            <MonthCalendar events={allEvents} />
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {[
                { color: "bg-primary/20", label: "Term dates" },
                { color: "bg-yellow-100", label: "Public holidays" },
                { color: "bg-orange-100", label: "School events" },
                { color: "bg-secondary/20", label: "Activities" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-sm ${l.color}`} />
                  <span className="text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming events list */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-primary mb-4">Upcoming Events</h2>
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-muted-foreground text-sm">No upcoming events.</p>
              ) : upcoming.map((ev, i) => {
                const daysUntil = Math.ceil((ev.dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-3 items-start p-3 rounded-xl bg-card border border-border/50"
                  >
                    <div className="shrink-0 text-center w-12">
                      <div className="text-xs text-muted-foreground font-medium">{ev.dateObj.toLocaleString(undefined, { month: "short" })}</div>
                      <div className="text-xl font-bold text-primary leading-tight">{ev.dateObj.getDate()}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{ev.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {daysUntil === 0 ? "Today!" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
