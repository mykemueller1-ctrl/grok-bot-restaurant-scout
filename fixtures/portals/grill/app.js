/* The New American Grill — staged secure portal client */
(async function () {
  const VENUE = "grill";
  const errEl = () => document.getElementById("err");
  let door = null;
  let seatsDoc = null;
  let packs = null;

  async function boot() {
    await Never86Portal.loadTenantBound(VENUE);
    door = await fetch(`/api/venue/${VENUE}/door`, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    }).then((r) => r.json());
    const select = document.getElementById("seat");
    for (const s of door.seats) {
      const opt = document.createElement("option");
      opt.value = s.login_id;
      opt.textContent = `${s.label} · ${s.assignee_name} (${s.status})`;
      select.appendChild(opt);
    }
    const me = await Never86Portal.api.me();
    if (me?.venue_id === VENUE && me.login_id) {
      await loadProtected(me.login_id);
    }
  }

  async function loadProtected(loginId) {
    seatsDoc = await Never86Portal.api.venueJson(VENUE, "seats.json");
    packs = await Never86Portal.api.venueJson(VENUE, "data/kristen-packs.json");
    Never86Portal.assertOwnData(seatsDoc, VENUE, "seats");
    Never86Portal.assertOwnData(packs, VENUE, "kristen-packs");
    renderDesk(loginId);
  }

  function renderDesk(loginId) {
    const active = seatsDoc.seats.find((s) => s.login_id === loginId);
    if (!active) return;
    document.getElementById("door").classList.add("off");
    const desk = document.getElementById("desk");
    desk.classList.add("on");
    desk.innerHTML = `
      <div class="top">
        <div>
          <div class="mark">The Grill</div>
          <div class="meta">Ready after Community · Kristen packs · enterprise boundary · ${packs.as_of}</div>
        </div>
        <button class="signout" type="button" id="signout">Sign out</button>
      </div>
      <div class="banner">${packs.handoff}</div>
      <p style="margin:0 0 8px;font-size:14px"><strong>${active.label}</strong> · ${active.assignee.name} · ${active.status}</p>
      <div class="stats">
        <div class="stat"><b>${Never86Portal.money(packs.labor.net_sales, 2)}</b><span>Net sales (Kristen)</span></div>
        <div class="stat"><b>${packs.labor.labor_pct_net}%</b><span>Labor % net</span></div>
        <div class="stat"><b>${packs.labor.splh_net}</b><span>SPLH net</span></div>
      </div>
      <p class="fine" style="margin-top:14px">Source: ${packs.source_label}. Files: ${packs.courser_files.join(", ")}</p>
    `;
    document.getElementById("signout").onclick = async () => {
      await Never86Portal.api.logout();
      desk.classList.remove("on");
      desk.innerHTML = "";
      document.getElementById("door").classList.remove("off");
    };
  }

  document.getElementById("login").addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl().textContent = "";
    const code = document.getElementById("gate").value;
    const id = document.getElementById("seat").value;
    if (!id) {
      errEl().textContent = "Pick a draft seat first.";
      return;
    }
    try {
      await Never86Portal.api.login(VENUE, code, id);
      await loadProtected(id);
    } catch (err) {
      errEl().textContent =
        err.status === 429
          ? "Too many attempts — wait a minute."
          : "Invalid credentials for this house.";
    }
  });

  boot().catch((err) => {
    errEl().textContent = String(err.message || err);
  });
})();
