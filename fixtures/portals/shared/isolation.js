/**
 * Portal client — talks to the secure gateway.
 * House codes never live in tenant.json; login is server-verified.
 */
(function (global) {
  const api = {
    async login(venueId, houseCode, loginId) {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          venue_id: venueId,
          house_code: houseCode,
          login_id: loginId,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.error || "login failed");
        err.status = res.status;
        throw err;
      }
      return data;
    },
    async logout() {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
    },
    async me() {
      const res = await fetch("/api/auth/me", {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("session check failed");
      return res.json();
    },
    async venueJson(venueId, relPath) {
      const clean = String(relPath || "").replace(/^\.\//, "");
      const res = await fetch(`/api/venue/${encodeURIComponent(venueId)}/${clean}`, {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.error || "data fetch failed");
        err.status = res.status;
        throw err;
      }
      return data;
    },
  };

  async function loadTenantBound(expectedVenueId) {
    const tenant = await fetch("./tenant.json", {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    }).then((r) => {
      if (!r.ok) throw new Error("tenant.json missing");
      return r.json();
    });
    if (tenant.venue_id !== expectedVenueId) {
      throw new Error(
        `Isolation breach: tenant venue_id ${tenant.venue_id} ≠ ${expectedVenueId}`
      );
    }
    if (tenant.access_gate && tenant.access_gate.code) {
      throw new Error("Security breach: plaintext house code exposed in tenant.json");
    }
    return { tenant, money: global.Never86Portal.money, pct: global.Never86Portal.pct };
  }

  function assertOwnData(doc, expectedVenueId, label) {
    if (!doc || doc.venue_id !== expectedVenueId) {
      throw new Error(
        `Isolation breach: ${label} venue_id ${doc && doc.venue_id} ≠ ${expectedVenueId}`
      );
    }
  }

  const money = (n, digits = 0) => {
    if (n == null || Number.isNaN(Number(n))) return "—";
    return Number(n).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: digits,
    });
  };

  const pct = (n) => {
    if (n == null || Number.isNaN(Number(n))) return "—";
    return `${(Number(n) * 100).toFixed(1)}%`;
  };

  global.Never86Portal = {
    ...(global.Never86Portal || {}),
    money,
    pct,
    api,
    loadTenantBound,
    assertOwnData,
  };
})(window);
