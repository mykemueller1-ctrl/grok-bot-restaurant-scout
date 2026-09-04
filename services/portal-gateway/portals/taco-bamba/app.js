/* Taco Bamba — secure multi-unit portal client */
(async function () {
  const VENUE = "taco-bamba";
  const errEl = () => document.getElementById("err");
  let door = null;
  let seatsDoc = null;
  let board = null;

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
      opt.textContent = `${s.label} · ${s.assignee_name}`;
      select.appendChild(opt);
    }
    select.addEventListener("change", () => {
      const found = door.seats.find((s) => s.login_id === select.value);
      document.getElementById("name").value = found ? found.assignee_name : "";
    });
    const me = await Never86Portal.api.me();
    if (me?.venue_id === VENUE && me.login_id) {
      await loadProtected(me.login_id);
    }
  }

  async function loadProtected(loginId) {
    seatsDoc = await Never86Portal.api.venueJson(VENUE, "seats.json");
    board = await Never86Portal.api.venueJson(VENUE, "data/multi-unit-board.json");
    Never86Portal.assertOwnData(seatsDoc, VENUE, "seats");
    Never86Portal.assertOwnData(board, VENUE, "board");
    renderDesk(loginId);
  }

  function renderDesk(loginId) {
    const active = seatsDoc.seats.find((s) => s.login_id === loginId);
    if (!active) return;
    document.getElementById("door").classList.add("off");
    const desk = document.getElementById("desk");
    desk.classList.add("on");
    const focus =
      active.role === "system_ops"
        ? board.regions
        : board.regions.filter((r) => r.area_leader.toLowerCase() === active.login_id);
    desk.innerHTML = `
      <div class="top">
        <div>
          <div class="mark">Taco <span>Bamba</span></div>
          <div class="meta">Enterprise secure multi-unit · ${board.period_note} · ${board.store_count} stores</div>
        </div>
        <button class="signout" type="button" id="signout">Sign out</button>
      </div>
      <div class="who">
        <strong>${active.label} · ${active.assignee.name}</strong>
        <p>${active.assignee.title || "Area leader"} · ${active.owns.join(" · ")}</p>
      </div>
      <section class="board">
        <h2 style="margin:0;font-family:'Archivo Black',sans-serif;font-size:18px">System board</h2>
        <div class="stats">
          <div class="stat"><b>${Never86Portal.money(board.system.cy_sales)}</b><span>CY sales</span></div>
          <div class="stat"><b>${Never86Portal.money(board.system.py_sales)}</b><span>PY sales</span></div>
          <div class="stat"><b>${Never86Portal.pct(board.system.cy_vs_py)}</b><span>CY vs PY</span></div>
          <div class="stat"><b>${board.system.cy_checks.toLocaleString()}</b><span>CY checks</span></div>
        </div>
      </section>
      <div class="regions">
        ${focus
          .map(
            (r) => `
          <article class="region ${active.login_id === r.area_leader.toLowerCase() ? "active" : ""}">
            <h3>${r.area_leader} · ${r.store_count} stores</h3>
            <div class="stat"><b>${Never86Portal.money(r.cy_sales)}</b><span>Region CY</span></div>
            <ul class="stores">
              ${r.stores
                .map(
                  (s) => `<li><span>${s.location}</span><span>${Never86Portal.money(s.cy_sales)} · ${Never86Portal.pct(s.cy_vs_py)}</span></li>`
                )
                .join("")}
            </ul>
          </article>`
          )
          .join("")}
      </div>
      <p class="lock">Bamba server boundary only — Community and Grill stay out.</p>
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
      errEl().textContent = "Pick a seat first.";
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
