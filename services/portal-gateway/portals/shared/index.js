(function () {
  const statusLabel = (s) =>
    s === "live_demo" ? ["Live · secure", "live"] : ["Ready after Community", "ready"];

  fetch("./tenants.json")
    .then((r) => r.json())
    .then((doc) => {
      const list = document.getElementById("list");
      const ordered = [...doc.tenants].sort((a, b) => a.priority - b.priority);
      list.innerHTML = ordered
        .map((t) => {
          const [label, cls] = statusLabel(t.status);
          const pending = t.status !== "live_demo" ? "pending" : "";
          return `<a class="tenant ${pending}" href="./${t.slug}/login.html">
            <div class="row">
              <h2 class="name">${t.name}</h2>
              <span class="badge ${cls}">${label}</span>
            </div>
            <p class="meta">${t.icp} · ${t.note}</p>
          </a>`;
        })
        .join("");
    })
    .catch((err) => {
      document.getElementById("list").textContent = String(err.message || err);
    });
})();
