/* Interactive swipe-to-complete habit card — mirrors habitra-web/src/components/habit-card.tsx */

const { useState, useRef, useEffect } = React;

function WeekDots({ week, color, compact = false }) {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const size = compact ? 6 : 7;
  return (
    <div style={{ display: "flex", gap: compact ? 4 : 5, alignItems: "center" }}>
      {week.map((v, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div
            style={{
              width: size, height: size, borderRadius: "50%",
              background: v ? color : "transparent",
              border: v ? `1px solid ${color}` : "1px solid var(--border)",
              transition: "all 300ms ease",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function HabitCard({ habit, onToggle }) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [bgState, setBgState] = useState("none"); // none | complete | skip | undo
  const [animating, setAnimating] = useState(false);
  const startX = useRef(0);
  const THRESHOLD = 72;
  const isDone = habit.done;
  const accent = habit.color;
  const isNegative = habit.type === "negative";

  function onPointerDown(e) {
    if (animating) return;
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startX.current;
    if (isDone) {
      const x = Math.max(0, dx);
      setDragX(x);
      setBgState(x > 8 ? "undo" : "none");
    } else {
      setDragX(dx);
      setBgState(dx < -8 ? "complete" : dx > 8 ? "skip" : "none");
    }
  }
  function onPointerUp() {
    if (!dragging) return;
    setDragging(false);
    const dx = dragX;
    if (isDone) {
      if (dx > THRESHOLD) onToggle(habit.id);
    } else {
      if (dx < -THRESHOLD) onToggle(habit.id);
    }
    setDragX(0);
    setBgState("none");
  }

  function handleClick() {
    if (Math.abs(dragX) > 5) return;
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
    onToggle(habit.id);
  }

  return (
    <div style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius)" }}>
      {/* swipe hint layer */}
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: "var(--radius)",
          display: "flex", alignItems: "center", padding: "0 16px",
          pointerEvents: "none",
          opacity: bgState !== "none" ? 1 : 0,
          transition: "opacity 180ms",
          background:
            bgState === "complete" ? "oklch(0.55 0.16 155 / 0.25)"
            : bgState === "skip" ? "oklch(0.72 0.14 70 / 0.2)"
            : bgState === "undo" ? "oklch(0.62 0.16 30 / 0.22)"
            : "transparent",
        }}
      >
        {bgState === "undo" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        )}
        {bgState === "skip" && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        )}
        <div style={{ flex: 1 }} />
        {bgState === "complete" && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        )}
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={handleClick}
        style={{
          position: "relative",
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 16px",
          borderRadius: "var(--radius)",
          transform: `translateX(${dragX}px) scale(${dragging ? 1.01 : 1})`,
          transition: dragging ? "none" : "transform 220ms cubic-bezier(.2,.8,.2,1)",
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
          background: isDone
            ? `color-mix(in oklch, ${accent} 10%, var(--surface))`
            : isNegative
            ? "oklch(var(--critical-c) / 0.06)"
            : "oklch(var(--surface-c) / 0.85)",
          border: isDone
            ? `1px solid color-mix(in oklch, ${accent} 35%, transparent)`
            : isNegative
            ? "1px solid oklch(var(--critical-c) / 0.25)"
            : "1px solid var(--border)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        {/* accent left stripe */}
        <div
          style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: 3, borderRadius: "var(--radius) 0 0 var(--radius)",
            background: isNegative ? "var(--critical)" : accent,
            opacity: isDone ? 1 : 0.7,
          }}
        />

        {/* icon */}
        <div
          style={{
            width: 36, height: 36,
            borderRadius: "var(--radius-sm)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, flexShrink: 0,
            background: isDone ? `color-mix(in oklch, ${accent} 20%, var(--surface-2))` : "var(--surface-2)",
            border: `1.5px solid ${isDone ? accent + "55" : "var(--border)"}`,
          }}
        >
          {isDone ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <span>{habit.icon}</span>
          )}
        </div>

        {/* text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <p
              style={{
                margin: 0, fontSize: 14, fontWeight: 600, lineHeight: 1.3,
                color: isDone ? "var(--muted)" : "var(--fg)",
                textDecoration: isDone ? "line-through" : "none",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
            >
              {habit.name}
            </p>
            {habit.streak > 1 && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 2,
                fontSize: 10, fontWeight: 600,
                color: habit.streak >= 10 ? "#f0a646" : "#d97706",
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" opacity="0.9"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>
                {habit.streak}
              </span>
            )}
            {isNegative && !isDone && (
              <span style={{
                fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em",
                padding: "2px 6px", borderRadius: 999,
                background: "oklch(var(--critical-c) / 0.12)", color: "var(--critical)",
              }}>break</span>
            )}
          </div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 10 }}>
            <WeekDots week={habit.week} color={accent} />
            {habit.unit && (
              <span style={{ fontSize: 10, color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                {isDone ? habit.target : 0}/{habit.target} {habit.unit}
              </span>
            )}
            <span style={{ fontSize: 10, color: habit.rate >= 0.8 ? "var(--ok)" : habit.rate >= 0.5 ? "#d97706" : "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
              {Math.round(habit.rate * 100)}%
            </span>
          </div>
        </div>

        {/* completion indicator */}
        <div
          style={{
            width: 20, height: 20, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            border: isDone ? "none" : "2px solid var(--surface-3)",
            background: isDone ? (isNegative ? "var(--critical)" : accent) : "transparent",
            boxShadow: isDone ? `0 0 8px ${isNegative ? "var(--critical)" : accent}60` : "none",
            transition: "all 300ms",
          }}
        >
          {isDone && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ completed, total, size = 88 }) {
  const pct = total ? completed / total : 0;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const color = pct >= 1 ? "#f0a646" : pct >= 0.5 ? "var(--ok)" : "var(--info)";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--surface-3)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size/2} cy={size/2} r={r}
          stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 700ms cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: size * 0.26, fontWeight: 700, color: "var(--fg)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {completed}
        </span>
        <span style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>of {total}</span>
      </div>
    </div>
  );
}

// The "app preview" panel — looks like a window with the Today screen inside
function HabitraPreview({ habits, onToggle, compact = false }) {
  const done = habits.filter(h => h.done).length;
  const total = habits.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const groups = [
    { key: "morning", label: "Morning", emoji: "🌅" },
    { key: "afternoon", label: "Afternoon", emoji: "☀️" },
    { key: "evening", label: "Evening", emoji: "🌙" },
    { key: "anytime", label: "Anytime", emoji: "⚡" },
  ];

  return (
    <div
      style={{
        borderRadius: 12,
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        boxShadow: "0 30px 80px -20px oklch(0 0 0 / 0.5), 0 0 0 1px var(--hairline)",
        overflow: "hidden",
      }}
    >
      {/* window chrome */}
      <div style={{
        height: 34, display: "flex", alignItems: "center", gap: 6,
        padding: "0 12px",
        background: "var(--surface-2)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef5350" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f4bf4f" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#5ac45a" }} />
        </div>
        <div style={{ flex: 1, textAlign: "center", fontSize: 11, color: "var(--subtle)", fontFamily: "var(--font-mono)" }}>
          habitra.app / today
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: compact ? "1fr" : "52px 1fr", minHeight: 520 }}>
        {/* sidebar */}
        {!compact && (
          <div style={{
            borderRight: "1px solid var(--hairline)",
            padding: "14px 0",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: "oklch(var(--surface-c) / 0.5)",
          }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: "var(--accent)", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13,
              marginBottom: 10,
            }}>H</div>
            {["🏠", "✓", "📊", "📖", "🔔"].map((em, i) => (
              <div key={i} style={{
                width: 32, height: 32, borderRadius: 6,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: i === 0 ? "var(--accent)" : "var(--muted)",
                background: i === 0 ? "oklch(0.65 0.17 250 / 0.09)" : "transparent",
              }}>{em}</div>
            ))}
          </div>
        )}

        {/* main */}
        <div style={{ padding: "18px 22px 22px", position: "relative" }}>
          {/* header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: "var(--muted)", fontWeight: 500 }}>Friday, April 24</p>
              <h3 style={{ margin: "2px 0 0", fontSize: 18, fontWeight: 700, color: "var(--fg)", letterSpacing: "-0.01em" }}>
                Good morning, Karuppan
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--muted)" }}>
                {total - done > 0 ? `${total - done} habit${total - done !== 1 ? "s" : ""} this morning` : "All morning habits done 🎉"}
              </p>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 12,
              background: "oklch(var(--surface-c) / 0.6)",
              border: "1px solid var(--border)",
            }}>
              <ProgressRing completed={done} total={total} size={56} />
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--fg)" }}>
                  {done === total ? "All done! 🎉" : `${total - done} left`}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 10.5, color: "var(--muted)" }}>{pct}% today</p>
              </div>
            </div>
          </div>

          {/* grouped habits */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {groups.map(({ key, label, emoji }) => {
              const gh = habits.filter(h => h.period === key);
              if (!gh.length) return null;
              const gDone = gh.filter(h => h.done).length;
              return (
                <section key={key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13 }}>{emoji}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-dim)" }}>{label}</span>
                      {key === "morning" && (
                        <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em",
                          padding: "2px 6px", borderRadius: 999,
                          background: "#7aa5e822", color: "var(--accent)" }}>Now</span>
                      )}
                    </div>
                    <span style={{ fontSize: 10, color: "var(--subtle)", fontVariantNumeric: "tabular-nums" }}>{gDone}/{gh.length}</span>
                  </div>
                  {gh.map(h => <HabitCard key={h.id} habit={h} onToggle={onToggle} />)}
                </section>
              );
            })}
          </div>

          {/* FAB */}
          <div style={{
            position: "absolute", bottom: 18, right: 22,
            width: 44, height: 44, borderRadius: 10,
            background: "var(--fg)", color: "var(--bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px oklch(0 0 0 / 0.3)",
            animation: "pulse-ring 2.4s ease-out infinite",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HabitCard, HabitraPreview, ProgressRing, WeekDots });
