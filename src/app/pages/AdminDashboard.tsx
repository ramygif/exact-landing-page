import React, { useState, useEffect, useCallback } from "react";

const API = "https://exact-api.ramydjebbi.workers.dev";

interface DashboardData {
  requests: { today: number; this_week: number };
  errors_by_endpoint: { endpoint: string; count: number }[];
  avg_response_time: { endpoint: string; avg_ms: number; count: number }[];
  active_users_today: number;
  unresolved_crashes: number;
  corrections_by_mode: { correction_mode: string; count: number }[];
}

interface CrashReport {
  id: number;
  timestamp: string;
  user_id: string;
  device_id: string;
  app_version: string;
  os_version: string;
  error_type: string;
  error_message: string;
  stack_trace: string;
  context: string;
  resolved: number;
}

interface LogEntry {
  id: number;
  timestamp: string;
  level: string;
  endpoint: string;
  method: string;
  status_code: number;
  duration_ms: number;
  user_id: string | null;
  message: string | null;
  request_id: string | null;
  app_version: string | null;
  correction_mode: string | null;
  text_length: number | null;
  source: string | null;
}

export function AdminDashboard() {
  const [secret, setSecret] = useState(sessionStorage.getItem("admin_secret") || "");
  const [authenticated, setAuthenticated] = useState(!!sessionStorage.getItem("admin_secret"));
  const [authError, setAuthError] = useState("");

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [crashes, setCrashes] = useState<CrashReport[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);

  // Filters
  const [logLevel, setLogLevel] = useState("");
  const [logEndpoint, setLogEndpoint] = useState("");
  const [logUserId, setLogUserId] = useState("");
  const [logSource, setLogSource] = useState("");
  const [logLimit, setLogLimit] = useState(30);
  const [logOffset, setLogOffset] = useState(0);

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"overview" | "crashes" | "logs">("overview");

  const headers = { "X-Admin-Secret": sessionStorage.getItem("admin_secret") || "" };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch(`${API}/api/admin/stats`, { headers: { "X-Admin-Secret": secret } });
      if (res.ok) {
        sessionStorage.setItem("admin_secret", secret);
        setAuthenticated(true);
      } else {
        setAuthError("Secret invalide");
      }
    } catch {
      setAuthError("Erreur reseau");
    }
  };

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/dashboard-data`, { headers });
      if (res.ok) setDashboard(await res.json());
    } catch {}
    setLoading(false);
  }, []);

  const fetchCrashes = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/crash-reports?resolved=false&limit=50`, { headers });
      if (res.ok) { const data = await res.json(); setCrashes(data.crash_reports); }
    } catch {}
  }, []);

  const fetchLogs = useCallback(async () => {
    const params = new URLSearchParams();
    params.set("limit", String(logLimit));
    params.set("offset", String(logOffset));
    if (logLevel) params.set("level", logLevel);
    if (logEndpoint) params.set("endpoint", logEndpoint);
    if (logUserId) params.set("user_id", logUserId);
    if (logSource) params.set("source", logSource);

    try {
      const res = await fetch(`${API}/api/admin/logs?${params}`, { headers });
      if (res.ok) { const data = await res.json(); setLogs(data.logs); setLogsTotal(data.total); }
    } catch {}
  }, [logLevel, logEndpoint, logUserId, logLimit, logOffset]);

  const resolveCrash = async (id: number) => {
    await fetch(`${API}/api/admin/crash-reports/${id}/resolve`, { method: "POST", headers });
    setCrashes(prev => prev.filter(c => c.id !== id));
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchDashboard();
    fetchCrashes();
    fetchLogs();
  }, [authenticated]);

  useEffect(() => {
    if (authenticated) fetchLogs();
  }, [logLevel, logEndpoint, logUserId, logSource, logLimit, logOffset]);

  if (!authenticated) {
    return (
      <div style={styles.loginContainer}>
        <form onSubmit={handleLogin} style={styles.loginForm}>
          <h1 style={styles.loginTitle}>exact admin</h1>
          <input
            type="password"
            placeholder="Admin Secret"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            style={styles.input}
            autoFocus
          />
          {authError && <p style={styles.error}>{authError}</p>}
          <button type="submit" style={styles.btn}>Connexion</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>exact <span style={styles.badge}>admin</span></h1>
        <div style={styles.tabs}>
          {(["overview", "crashes", "logs"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={tab === t ? { ...styles.tab, ...styles.tabActive } : styles.tab}>
              {t === "overview" ? "Vue d'ensemble" : t === "crashes" ? `Crashes (${crashes.length})` : "Logs"}
            </button>
          ))}
        </div>
        <button onClick={() => { fetchDashboard(); fetchCrashes(); fetchLogs(); }} style={styles.refreshBtn}>
          {loading ? "..." : "Actualiser"}
        </button>
      </header>

      {tab === "overview" && dashboard && (
        <div style={styles.content}>
          {/* Stats cards */}
          <div style={styles.grid4}>
            <StatCard label="Requetes aujourd'hui" value={dashboard.requests.today} />
            <StatCard label="Cette semaine" value={dashboard.requests.this_week} />
            <StatCard label="Users actifs" value={dashboard.active_users_today} />
            <StatCard label="Crashes non resolus" value={dashboard.unresolved_crashes} color={dashboard.unresolved_crashes > 0 ? "#ff4d4d" : "#4ade80"} />
          </div>

          {/* Errors by endpoint */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Erreurs par endpoint</h3>
            {dashboard.errors_by_endpoint.length === 0 ? (
              <p style={styles.muted}>Aucune erreur cette semaine</p>
            ) : (
              <div style={styles.barChart}>
                {dashboard.errors_by_endpoint.map((e, i) => {
                  const max = Math.max(...dashboard.errors_by_endpoint.map(x => x.count));
                  return (
                    <div key={i} style={styles.barRow}>
                      <span style={styles.barLabel}>{e.endpoint}</span>
                      <div style={styles.barTrack}>
                        <div style={{ ...styles.barFill, width: `${(e.count / max) * 100}%` }} />
                      </div>
                      <span style={styles.barValue}>{e.count}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Response times + Corrections by mode */}
          <div style={styles.grid2}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Temps de reponse moyen</h3>
              {dashboard.avg_response_time.map((r, i) => (
                <div key={i} style={styles.statRow}>
                  <span style={styles.muted}>{r.endpoint}</span>
                  <span style={{ color: r.avg_ms > 1000 ? "#ff4d4d" : r.avg_ms > 500 ? "#fbbf24" : "#4ade80" }}>
                    {r.avg_ms}ms
                  </span>
                </div>
              ))}
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Corrections par mode</h3>
              {dashboard.corrections_by_mode.length === 0 ? (
                <p style={styles.muted}>Aucune correction cette semaine</p>
              ) : dashboard.corrections_by_mode.map((m, i) => (
                <div key={i} style={styles.statRow}>
                  <span>{m.correction_mode}</span>
                  <span style={{ color: "#60a5fa" }}>{m.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "crashes" && (
        <div style={styles.content}>
          {crashes.length === 0 ? (
            <div style={styles.card}><p style={styles.muted}>Aucun crash non resolu</p></div>
          ) : crashes.map(c => (
            <div key={c.id} style={styles.crashCard}>
              <div style={styles.crashHeader}>
                <span style={styles.crashType}>{c.error_type}</span>
                <span style={styles.muted}>{c.timestamp}</span>
                <button onClick={() => resolveCrash(c.id)} style={styles.resolveBtn}>Resoudre</button>
              </div>
              <p style={styles.crashMsg}>{c.error_message}</p>
              <div style={styles.crashMeta}>
                <span>v{c.app_version || "?"}</span>
                <span>{c.os_version || "?"}</span>
                <span>{c.user_id?.slice(0, 8) || "?"}</span>
              </div>
              {c.stack_trace && <pre style={styles.stackTrace}>{c.stack_trace}</pre>}
              {c.context && <p style={styles.muted}>Context: {c.context}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "logs" && (
        <div style={styles.content}>
          {/* Filters */}
          <div style={styles.filters}>
            <select value={logLevel} onChange={e => { setLogLevel(e.target.value); setLogOffset(0); }} style={styles.select}>
              <option value="">Tous les levels</option>
              <option value="info">info</option>
              <option value="warn">warn</option>
              <option value="error">error</option>
            </select>
            <input placeholder="Endpoint" value={logEndpoint} onChange={e => { setLogEndpoint(e.target.value); setLogOffset(0); }} style={styles.filterInput} />
            <input placeholder="User ID" value={logUserId} onChange={e => { setLogUserId(e.target.value); setLogOffset(0); }} style={styles.filterInput} />
            <select value={logSource} onChange={e => { setLogSource(e.target.value); setLogOffset(0); }} style={styles.select}>
              <option value="">Toutes sources</option>
              <option value="app">App macOS</option>
              <option value="web">Site web</option>
              <option value="api">API directe</option>
            </select>
            <span style={styles.muted}>{logsTotal} resultats</span>
          </div>

          {/* Logs table */}
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Source</th>
                  <th style={styles.th}>Level</th>
                  <th style={styles.th}>Method</th>
                  <th style={styles.th}>Endpoint</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Ms</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Message</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(l => (
                  <tr key={l.id} style={l.level === "error" ? styles.rowError : l.level === "warn" ? styles.rowWarn : {}}>
                    <td style={styles.td}>{l.timestamp.slice(11, 19)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.levelBadge, background: l.source === "app" ? "#7c3aed" : l.source === "web" ? "#2563eb" : "#525252" }}>
                        {l.source || "?"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.levelBadge, background: l.level === "error" ? "#dc2626" : l.level === "warn" ? "#d97706" : "#16a34a" }}>
                        {l.level}
                      </span>
                    </td>
                    <td style={styles.td}>{l.method}</td>
                    <td style={styles.td}>{l.endpoint}</td>
                    <td style={styles.td}>{l.status_code}</td>
                    <td style={styles.td}>{l.duration_ms}</td>
                    <td style={styles.td}>{l.user_id?.slice(0, 8) || "—"}</td>
                    <td style={{ ...styles.td, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>{l.message || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            <button disabled={logOffset === 0} onClick={() => setLogOffset(Math.max(0, logOffset - logLimit))} style={styles.pageBtn}>Precedent</button>
            <span style={styles.muted}>Page {Math.floor(logOffset / logLimit) + 1} / {Math.ceil(logsTotal / logLimit) || 1}</span>
            <button disabled={logOffset + logLimit >= logsTotal} onClick={() => setLogOffset(logOffset + logLimit)} style={styles.pageBtn}>Suivant</button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div style={styles.statCard}>
      <span style={styles.statValue as any}>
        <span style={{ color: color || "#60a5fa" }}>{value}</span>
      </span>
      <span style={styles.statLabel}>{label}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  loginContainer: { minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" },
  loginForm: { background: "#141414", border: "1px solid #262626", borderRadius: 12, padding: 40, width: 360, display: "flex", flexDirection: "column", gap: 16 },
  loginTitle: { color: "#fff", fontSize: 24, fontWeight: 900, textTransform: "lowercase" as const, margin: 0, letterSpacing: -1 },
  input: { background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" },
  error: { color: "#ef4444", fontSize: 13, margin: 0 },
  btn: { background: "#2563eb", color: "#fff", border: "none", borderRadius: 8, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" },

  container: { minHeight: "100vh", background: "#0a0a0a", color: "#e5e5e5", fontFamily: "system-ui, -apple-system, sans-serif" },
  header: { borderBottom: "1px solid #1a1a1a", padding: "16px 24px", display: "flex", alignItems: "center", gap: 16 },
  title: { fontSize: 20, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: -1 },
  badge: { fontSize: 11, background: "#2563eb", color: "#fff", padding: "2px 8px", borderRadius: 4, marginLeft: 8, fontWeight: 700, textTransform: "uppercase" as const },
  tabs: { display: "flex", gap: 4, flex: 1, marginLeft: 16 },
  tab: { background: "none", border: "1px solid #262626", borderRadius: 6, padding: "6px 14px", color: "#888", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  tabActive: { background: "#1a1a1a", color: "#fff", borderColor: "#333" },
  refreshBtn: { background: "#1a1a1a", border: "1px solid #262626", borderRadius: 6, padding: "6px 14px", color: "#888", fontSize: 12, cursor: "pointer" },

  content: { padding: 24, maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 },
  card: { background: "#141414", border: "1px solid #1f1f1f", borderRadius: 10, padding: 20 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: "#999", textTransform: "uppercase" as const, marginTop: 0, marginBottom: 16, letterSpacing: 0.5 },

  statCard: { background: "#141414", border: "1px solid #1f1f1f", borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 6 },
  statValue: { fontSize: 36, fontWeight: 900, letterSpacing: -2 },
  statLabel: { fontSize: 12, color: "#666", fontWeight: 600, textTransform: "uppercase" as const },

  barChart: { display: "flex", flexDirection: "column", gap: 10 },
  barRow: { display: "flex", alignItems: "center", gap: 12 },
  barLabel: { fontSize: 12, color: "#888", width: 180, textAlign: "right" as const, flexShrink: 0 },
  barTrack: { flex: 1, height: 8, background: "#1a1a1a", borderRadius: 4, overflow: "hidden" },
  barFill: { height: "100%", background: "#ef4444", borderRadius: 4 },
  barValue: { fontSize: 13, fontWeight: 700, color: "#ef4444", width: 30 },

  statRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1a1a1a", fontSize: 13 },
  muted: { color: "#555", fontSize: 13 },

  crashCard: { background: "#141414", border: "1px solid #1f1f1f", borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 8 },
  crashHeader: { display: "flex", alignItems: "center", gap: 12 },
  crashType: { background: "#dc2626", color: "#fff", padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700 },
  crashMsg: { fontSize: 14, color: "#ddd", margin: 0 },
  crashMeta: { display: "flex", gap: 12, fontSize: 12, color: "#555" },
  stackTrace: { background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 6, padding: 12, fontSize: 11, color: "#888", overflow: "auto", maxHeight: 120, margin: 0, whiteSpace: "pre-wrap" as const },
  resolveBtn: { marginLeft: "auto", background: "#16a34a", color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" },

  filters: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" as const },
  select: { background: "#1a1a1a", border: "1px solid #262626", borderRadius: 6, padding: "6px 12px", color: "#ccc", fontSize: 13 },
  filterInput: { background: "#1a1a1a", border: "1px solid #262626", borderRadius: 6, padding: "6px 12px", color: "#ccc", fontSize: 13, width: 140 },

  tableWrap: { overflowX: "auto" as const },
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 13 },
  th: { textAlign: "left" as const, padding: "8px 12px", borderBottom: "1px solid #262626", color: "#555", fontWeight: 700, fontSize: 11, textTransform: "uppercase" as const },
  td: { padding: "8px 12px", borderBottom: "1px solid #1a1a1a", whiteSpace: "nowrap" as const },
  rowError: { background: "rgba(220, 38, 38, 0.08)" },
  rowWarn: { background: "rgba(217, 119, 6, 0.05)" },
  levelBadge: { padding: "2px 6px", borderRadius: 3, fontSize: 11, fontWeight: 700, color: "#fff" },

  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: 16, paddingTop: 8 },
  pageBtn: { background: "#1a1a1a", border: "1px solid #262626", borderRadius: 6, padding: "6px 16px", color: "#888", fontSize: 13, cursor: "pointer" },
};
