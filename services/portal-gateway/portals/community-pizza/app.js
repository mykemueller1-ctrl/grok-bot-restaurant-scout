/* Community Tap & Pizza — secure portal client */
(async function () {
  const VENUE = "community-pizza";
  const errEl = () => document.getElementById("err");
  let door = null;
  let seatsDoc = null;
  let salesDoc = null;
  let driveLib = null;

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
      opt.textContent = `${s.label} · ${s.assignee_name} (${s.price})`;
      select.appendChild(opt);
    }
    select.addEventListener("change", () => {
      const found = door.seats.find((s) => s.login_id === select.value);
      document.getElementById("name").value = found ? found.assignee_name : "";
      errEl().textContent = "";
    });
    const me = await Never86Portal.api.me();
    if (me?.venue_id === VENUE && me.login_id) {
      await loadProtected(me.login_id);
    }
  }

  async function loadProtected(loginId) {
    seatsDoc = await Never86Portal.api.venueJson(VENUE, "seats.json");
    salesDoc = await Never86Portal.api.venueJson(VENUE, "data/historical-sales.json");
    driveLib = await Never86Portal.api.venueJson(VENUE, "data/drive-library.json");
    Never86Portal.assertOwnData(seatsDoc, VENUE, "seats");
    Never86Portal.assertOwnData(salesDoc, VENUE, "historical-sales");
    Never86Portal.assertOwnData(driveLib, VENUE, "drive-library");
    renderDesk(loginId);
  }

  function renderDesk(loginId) {
    const active = seatsDoc.seats.find((s) => s.login_id === loginId);
    if (!active) return;
    const live = salesDoc.live_book;
    const archive = salesDoc.archive_week_2025_09;
    const recent = salesDoc.recentZ || [];
    const asOf = salesDoc.as_of || "2026-09-04";
    document.getElementById("door").classList.add("off");
    const desk = document.getElementById("desk");
    desk.classList.add("on");
    desk.innerHTML = `
      <div class="top">
        <div>
          <div class="mark">Never 86<em>'d</em> · CTAP Beta R&D</div>
          <div class="meta">${seatsDoc.venue_name} · Fort Dodge · enterprise secure · as of ${asOf}</div>
        </div>
        <button class="signout" type="button" id="signout">Sign out</button>
      </div>
      <div class="who">
        <strong>${active.label} · ${active.assignee.name}</strong>
        <p>${active.assignee.title || "Owner-operator"} · house ${active.house} · ${active.price} seat</p>
      </div>
      <div class="grid">
        ${seatsDoc.seats
          .map(
            (s) => `
          <article class="seat ${s.login_id === active.login_id ? "active" : ""}">
            <div class="badge ${s.price === "paid" ? "paid" : ""}">${s.status} · ${s.price}</div>
            <h2>${s.label}</h2>
            <div class="person">${s.assignee.name}</div>
            <ul>${s.owns.slice(0, 4).map((o) => `<li>${o}</li>`).join("")}</ul>
          </article>`
          )
          .join("")}
      </div>
      <section class="sales">
        <h3>Live book · through Fri 9/4 only</h3>
        <p>${live.start} → ${live.end}. Community data only — server boundary blocks Bamba and Grill.</p>
        <div class="stats">
          <div class="stat"><b>${Never86Portal.money(live.week_grand_total)}</b><span>Week net so far (Z hole)</span></div>
          <div class="stat"><b>${Never86Portal.money(live.week_labor_total)}</b><span>Week labor so far</span></div>
          <div class="stat"><b>${recent.length ? Never86Portal.money(recent[0].grandTotal) : "—"}</b><span>Latest sample Z ${recent[0]?.label || ""}</span></div>
        </div>
        <p class="lock">Drive sync ${salesDoc.drive_synced_at || "—"} · Archive ${archive.folder}: ${Never86Portal.money(archive.week_grand_total)} · labor ${Never86Portal.money(archive.week_labor_total)}</p>
        <div class="stats" style="margin-top:12px">
          ${(archive.days || [])
            .map(
              (d) =>
                `<div class="stat"><b>${Never86Portal.money(d.grandTotal)}</b><span>${d.label} · labor ${Never86Portal.money(d.labor)}</span></div>`
            )
            .join("")}
        </div>
      </section>
      <section class="sales" style="margin-top:14px">
        <h3>Google Drive → Community</h3>
        <p>${(driveLib.packs || []).length} packs pulled from ${driveLib.drive_account}. Exclusive to this house.</p>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
          ${(driveLib.packs || [])
            .map(
              (p) => `
            <article class="seat">
              <div class="badge paid">${p.kind}</div>
              <h2 style="font-size:16px">${p.title}</h2>
              <ul>${(p.files || [])
                .slice(0, 4)
                .map((f) => `<li>${f.title || f.date || f.id}</li>`)
                .join("")}</ul>
            </article>`
            )
            .join("")}
        </div>
      </section>
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
      errEl().textContent = "Pick a sold seat first.";
      return;
    }
    try {
      await Never86Portal.api.login(VENUE, code, id);
    } catch (err) {
      errEl().textContent =
        err.status === 429
          ? "Too many attempts — wait a minute."
          : "House code or seat didn’t match. Use ctap-fort-dodge + myke / kenzy / tom.";
      return;
    }
    try {
      await loadProtected(id);
    } catch (err) {
      errEl().textContent =
        "Signed in, but the desk pack failed to load (" +
        (err.message || "data error") +
        "). Refresh once.";
    }
  });

  boot().catch((err) => {
    errEl().textContent = String(err.message || err);
  });
})();
