const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function sendMessage(data) {
    const res = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to send");
    return res.json();
}

export async function trackVisit() {
    try {
        await fetch(`${API}/api/analytics/visit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: location.pathname, referrer: document.referrer }),
        });
    } catch { /* analytics must never break the experience */ }
}
