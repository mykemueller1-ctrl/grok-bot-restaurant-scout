/**
 * Never86 secure venue portal — client isolation helpers.
 * Each door may only load JSON inside its own folder. Venue IDs must match.
 */
(function (global) {
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

  async function loadTenantBound(expectedVenueId) {
    const tenant = await fetch("./tenant.json").then((r) => {
      if (!r.ok) throw new Error("tenant.json missing");
      return r.json();
    });
    if (tenant.venue_id !== expectedVenueId) {
      throw new Error(
        `Isolation breach: tenant venue_id ${tenant.venue_id} ≠ ${expectedVenueId}`
      );
    }
    const forbidden = tenant.data_boundary?.forbidden_venue_ids || [];
    return { tenant, forbidden, money, pct };
  }

  function assertOwnData(doc, expectedVenueId, label) {
    if (!doc || doc.venue_id !== expectedVenueId) {
      throw new Error(
        `Isolation breach: ${label} venue_id ${doc && doc.venue_id} ≠ ${expectedVenueId}`
      );
    }
  }

  function saveSession(sessionKey, payload) {
    sessionStorage.setItem(sessionKey, JSON.stringify(payload));
  }

  function readSession(sessionKey) {
    try {
      return JSON.parse(sessionStorage.getItem(sessionKey) || "null");
    } catch {
      return null;
    }
  }

  function clearSession(sessionKey) {
    sessionStorage.removeItem(sessionKey);
  }

  function gateOk(tenant, code) {
    const expected = (tenant.access_gate && tenant.access_gate.code) || "";
    return String(code || "").trim() === expected;
  }

  global.Never86Portal = {
    money,
    pct,
    loadTenantBound,
    assertOwnData,
    saveSession,
    readSession,
    clearSession,
    gateOk,
  };
})(window);
