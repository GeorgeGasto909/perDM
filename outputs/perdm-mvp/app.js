const state = {
  receiptAttached: false,
  cashModalOpen: false,
  cashAdded: false,
  reportGenerated: false,
  allReviewed: false,
};

const company = {
  name: "Demo Company LLC",
  id: "GE-204889321",
  accountant: "Tamar Finance",
  email: "finance@demo-company.ge",
};

const trips = [
  {
    id: "nino-batumi",
    employee: "Nino Beridze",
    position: "Sales Manager",
    department: "Sales",
    destination: "Batumi",
    period: "June 1-June 30",
    purpose: "Regional sales meetings and partner visits",
    budget: 3000,
    card: 2340,
    cash: 410,
    total: 2750,
    attached: 18,
    totalReceipts: 20,
    missing: 2,
    pending: 3,
    status: "Needs review",
    report: "Not ready",
  },
  {
    id: "giorgi-kutaisi",
    employee: "Giorgi Kapanadze",
    position: "Field Specialist",
    department: "Field Team",
    destination: "Kutaisi",
    period: "June 10-June 14",
    purpose: "Field operations visit",
    budget: 900,
    card: 620,
    cash: 95,
    total: 715,
    attached: 12,
    totalReceipts: 12,
    missing: 0,
    pending: 0,
    status: "Ready",
    report: "Ready to export",
  },
  {
    id: "mariam-telavi",
    employee: "Mariam Lomidze",
    position: "Operations Lead",
    department: "Operations",
    destination: "Telavi",
    period: "June 18-June 20",
    purpose: "Partner meeting",
    budget: 600,
    card: 380,
    cash: 40,
    total: 420,
    attached: 7,
    totalReceipts: 8,
    missing: 1,
    pending: 1,
    status: "Missing receipt",
    report: "Not ready",
  },
];

const baseExpenses = [
  ["June 1", "Perdiemi Card", "Hotel Batumi", "Hotel", 720, "Attached", "Approved", "Invoice and receipt matched"],
  ["June 2", "Perdiemi Card", "Restaurant", "Meals", 85, "Attached", "Approved", "Client dinner"],
  ["June 3", "Cash", "Taxi", "Transport", 35, "Missing", "Needs receipt", "Receipt requested from employee"],
  ["June 5", "Perdiemi Card", "Fuel Station", "Fuel", 160, "Attached", "Approved", "Sales route fuel"],
  ["June 8", "Cash", "Parking", "Transport", 15, "Missing", "Needs receipt", "Small cash payment"],
  ["June 12", "Perdiemi Card", "Hotel Batumi", "Hotel", 720, "Attached", "Pending review", "Second hotel invoice"],
  ["June 18", "Perdiemi Card", "Restaurant", "Meals", 95, "Attached", "Pending review", "Partner lunch"],
  ["June 25", "Cash", "Local transport", "Transport", 80, "Attached", "Approved", "Airport transfer"],
];

const employees = [
  ["Nino Beridze", "Sales Manager", "Sales", 1, 4, 2750, state.receiptAttached ? 1 : 2],
  ["Giorgi Kapanadze", "Field Specialist", "Field Team", 0, 3, 715, 0],
  ["Mariam Lomidze", "Operations Lead", "Operations", 0, 2, 420, 1],
  ["Irakli Tsereteli", "Regional Manager", "Management", 1, 5, 1280, 0],
  ["Ana Maisuradze", "Marketing Coordinator", "Marketing", 0, 1, 340, 1],
];

const app = document.getElementById("app");

function money(value) {
  return `${value.toLocaleString()} GEL`;
}

function nino() {
  const missing = state.receiptAttached ? 1 : 2;
  const attached = state.receiptAttached ? 19 : 18;
  return { ...trips[0], missing, attached, pending: state.allReviewed ? 0 : 3, report: missing === 0 ? "Ready to export" : "Almost ready" };
}

function expenses() {
  const rows = baseExpenses.map((row) => [...row]);
  if (state.receiptAttached) {
    rows[2][5] = "Attached";
    rows[2][6] = "Pending review";
    rows[2][7] = "Receipt attached successfully";
  }
  if (state.allReviewed) {
    rows.forEach((row) => {
      if (row[6] === "Pending review") row[6] = "Approved";
    });
  }
  if (state.cashAdded) {
    rows.push(["June 28", "Cash", "Office supplies", "Other", 42, "Attached", "Pending review", "Added and linked to Batumi trip"]);
  }
  return rows;
}

function brand() {
  return `<a class="brand" href="#/"><span class="brand-mark"></span><span class="brand-word">Perdiemi</span></a>`;
}

function setRoute(route) {
  window.location.hash = route;
}

function badge(text) {
  const klass = text.includes("Ready") || text.includes("Approved") || text.includes("Attached") ? "green"
    : text.includes("Missing") || text.includes("Needs") || text.includes("Not ready") ? "red"
    : text.includes("Pending") || text.includes("Almost") || text.includes("review") ? "amber"
    : "gray";
  return `<span class="badge ${klass}">${text}</span>`;
}

function paymentBadge(text) {
  return `<span class="badge ${text === "Cash" ? "violet" : "blue"}">${text}</span>`;
}

function topNav() {
  return `<header class="topnav"><div class="topnav-inner">
    ${brand()}
    <nav class="navlinks">
      <a href="#problem">Problem</a>
      <a href="#workflow">Workflow</a>
      <a href="#benefits">Benefits</a>
      <button class="btn small primary" onclick="setRoute('#/dashboard')">Open Demo Dashboard</button>
    </nav>
  </div></header>`;
}

function landing() {
  return `<div class="page">${topNav()}
    <main>
      <section class="hero">
        <div>
          <div class="eyebrow">Business travel expense documentation</div>
          <h1>Business trip expenses, organized in one place</h1>
          <p>Perdiemi helps companies collect, verify, and export business travel expenses without manual receipt chaos, Excel work, and scattered documents.</p>
          <div class="hero-actions">
            <button class="btn primary" onclick="setRoute('#/dashboard')">Open Demo Dashboard</button>
            <a class="btn" href="#workflow">See How It Works</a>
          </div>
        </div>
        <div class="hero-visual light-preview">
          <div class="preview-header">
            <strong>Nino Beridze - Batumi trip</strong>
            <button class="btn small primary">Download report</button>
          </div>
          <div class="mini-grid">
            ${mini("Trip period", "June 1-June 30")}
            ${mini("Card expenses", "2,340 GEL")}
            ${mini("Cash expenses", "410 GEL")}
            ${mini("Receipt status", "18/20 attached")}
          </div>
          <div class="preview-table">
            ${previewRow("Hotel Batumi", "Perdiemi Card", "720 GEL", "Attached")}
            ${previewRow("Taxi", "Cash", "35 GEL", "Missing")}
            ${previewRow("Fuel Station", "Perdiemi Card", "160 GEL", "Attached")}
            ${previewRow("Parking", "Cash", "15 GEL", "Missing")}
          </div>
        </div>
      </section>
      <section class="section" id="problem">
        <h2>Business trip reporting is still too manual</h2>
        <p class="section-lead">One completed trip can leave finance teams with card statements, paper receipts, cash notes, email attachments, and Excel files to reconcile by hand.</p>
        <div class="grid-3">
          ${["Receipts are collected manually", "Expenses are scattered across card, cash, email, and paper", "Accountants spend hours checking documents", "Missing receipts create confusion", "Excel reports take too much time", "One trip can take days to document"].map((x, i) => card(i + 1, x, "Perdiemi brings the trip file, expense list, receipts, and report status into one clear workspace.")).join("")}
        </div>
      </section>
      <section class="band"><div class="section" id="workflow">
        <h2>Perdiemi turns every business trip into a ready-to-export expense file</h2>
        <p class="section-lead">The company creates a trip, expenses are collected under that trip, receipts are attached, missing documents are flagged, and the accountant downloads the full report with one click.</p>
        <div class="grid-5">${["Create business trip", "Assign employee and budget", "Collect card and cash expenses", "Attach receipts and verify documents", "Export full report"].map((x, i) => step(i + 1, x)).join("")}</div>
      </div></section>
      <section class="section" id="benefits">
        <h2>Built for accountants and finance teams</h2>
        <div class="grid-3">
          ${["Save accounting time", "Reduce manual Excel work", "Keep all trip expenses in one place", "Track missing receipts", "Export reports instantly", "Prepare documentation faster"].map((x, i) => card(i + 1, x, "Clear statuses and one-click reporting make the workflow easy to audit.")).join("")}
        </div>
      </section>
      <section class="section future-strip">
        <h2>Future modules</h2>
        <p class="section-lead">Later versions may add Perdiemi card integration, partner discounts, cashback, geolocation confirmation, and accounting software integrations. The first MVP focuses on documentation, verification, and report export.</p>
      </section>
    </main>
  </div>`;
}

function mini(label, value) {
  return `<div class="mini-panel light"><span>${label}</span><strong>${value}</strong></div>`;
}

function previewRow(merchant, type, amount, receipt) {
  return `<div class="preview-row"><span><strong>${merchant}</strong><small>${type}</small></span><span>${amount}</span>${badge(receipt)}</div>`;
}

function card(icon, title, copy) {
  return `<article class="feature"><div class="icon">${icon}</div><h3>${title}</h3><p>${copy}</p></article>`;
}

function step(icon, title) {
  return `<article class="step"><div class="icon">${icon}</div><h3>${title}</h3><p>Everything related to the trip stays connected from creation to report export.</p></article>`;
}

function demo() {
  return `<div class="page">${topNav()}<section class="section">
    <div class="title-row"><div><h1>Perdiemi demo</h1><p>Follow the accountant workflow from trip review to report download.</p></div></div>
    <div class="grid-3">
      ${demoCard("Accountant / Finance Manager", "Main demo: review Nino's Batumi trip, resolve receipts, and generate the report.", "#/dashboard")}
      ${demoCard("Employee Receipt Upload", "Mock view for attaching a missing receipt to a trip expense.", "#/dashboard/receipts")}
      ${demoCard("Company Admin", "Basic company settings, receipt rules, and finance defaults.", "#/dashboard/settings")}
    </div>
  </section></div>`;
}

function demoCard(title, copy, route) {
  return `<article class="role-card"><div class="icon">${title[0]}</div><h3>${title}</h3><p>${copy}</p><br><button class="btn primary" onclick="setRoute('${route}')">Open demo</button></article>`;
}

const links = [
  ["overview", "Overview", "#/dashboard"],
  ["trips", "Business Trips", "#/dashboard/trips"],
  ["employees", "Employees", "#/dashboard/employees"],
  ["expenses", "Expenses", "#/dashboard/expenses"],
  ["receipts", "Receipts", "#/dashboard/receipts"],
  ["reports", "Reports", "#/dashboard/reports"],
  ["settings", "Settings", "#/dashboard/settings"],
  ["future", "Future Modules", "#/dashboard/future-modules"],
];

function shell(active, content) {
  return `<div class="app-shell">
    <aside class="sidebar">
      ${brand()}
      <nav class="side-nav">${links.map(([key, label, route]) => `<button class="side-link ${active === key ? "active" : ""}" onclick="setRoute('${route}')"><span>${sideIcon(label)}</span>${label}</button>`).join("")}</nav>
    </aside>
    <main class="main">
      <div class="dash-top"><strong>Accountant dashboard</strong><div><button class="btn small" onclick="setRoute('#/demo')">Demo flows</button></div></div>
      <div class="mobile-tabs">${links.map(([key, label, route]) => `<button class="side-link ${active === key ? "active" : ""}" onclick="setRoute('${route}')">${label}</button>`).join("")}</div>
      <div class="dash-content">${content}</div>
    </main>
  </div>${state.cashModalOpen ? cashModal() : ""}`;
}

function sideIcon(label) {
  const map = { Overview: "⌂", "Business Trips": "▤", Employees: "◎", Expenses: "≡", Receipts: "□", Reports: "↧", Settings: "⚙", "Future Modules": "+" };
  return map[label] || "•";
}

function dashboard() {
  const t = nino();
  return shell("overview", `${title("Overview", "Everything related to a business trip is collected in one place.", `<button class="btn primary" onclick="setRoute('#/dashboard/trips/nino-batumi')">Open Nino's trip</button>`)}
    <div class="stats">
      ${stat("Active business trips", "4", "2 end this week")}
      ${stat("Completed trips waiting for report", "3", "Nino needs review")}
      ${stat("Expenses this month", money(8420), "Card and cash combined")}
      ${stat("Missing receipts", `${t.missing + 1}`, "Across all trips")}
      ${stat("Pending approvals", `${t.pending + 3}`, "Need accountant review")}
      ${stat("Reports ready to export", "1", "Kutaisi field visit")}
    </div>
    <div class="dash-grid">
      <section class="panel"><h3>Trips requiring attention</h3>${attention("Nino Beridze", "Batumi business trip", `${t.missing} missing receipts`, "#/dashboard/trips/nino-batumi")}${attention("Giorgi Kapanadze", "Kutaisi field visit", "Ready for export", "#/dashboard/trips")}${attention("Mariam Lomidze", "Telavi partner meeting", "3 pending approvals", "#/dashboard/trips")}</section>
      <section class="panel"><h3>Expenses by category</h3><div class="donut"></div><p class="section-lead">Hotel, meals, fuel, transport, and other expenses grouped for finance review.</p></section>
    </div>
    <section class="panel" style="margin-top:16px"><h3>Monthly business trip expenses</h3><div class="bar-chart">${[38, 54, 42, 71, 63, 84].map((h, i) => `<div class="bar" style="height:${h}%"><span>${["Jan","Feb","Mar","Apr","May","Jun"][i]}</span></div>`).join("")}</div></section>`);
}

function attention(name, trip, note, route) {
  return `<div class="attention-row"><span><strong>${name}</strong><small>${trip}</small></span>${badge(note)}<button class="btn small" onclick="setRoute('${route}')">Open</button></div>`;
}

function tripsPage() {
  return shell("trips", `${title("Business trips", "Review trip files, receipt completeness, and report readiness.", `<button class="btn primary" onclick="setRoute('#/dashboard/trips/nino-batumi')">Open main demo trip</button>`)}
    <section class="panel table-wrap">${tripTable()}</section>`);
}

function tripTable() {
  const rows = [nino(), trips[1], trips[2]];
  return `<table><thead><tr><th>Employee</th><th>Destination</th><th>Trip period</th><th>Purpose</th><th>Budget</th><th>Card</th><th>Cash</th><th>Total</th><th>Receipt status</th><th>Report</th><th>Action</th></tr></thead><tbody>
    ${rows.map((t) => `<tr><td><strong>${t.employee}</strong></td><td>${t.destination}</td><td>${t.period}</td><td>${t.purpose}</td><td>${money(t.budget)}</td><td>${money(t.card)}</td><td>${money(t.cash)}</td><td>${money(t.total)}</td><td>${badge(`${t.attached}/${t.totalReceipts} attached`)}</td><td>${badge(t.report)}</td><td><button class="btn small" onclick="setRoute('#/dashboard/trips/${t.id}')">Open trip</button></td></tr>`).join("")}
  </tbody></table>`;
}

function tripDetail() {
  const t = nino();
  const missing = expenses().filter((row) => row[5] === "Missing");
  return shell("trips", `${title(`${t.employee} - ${t.destination} business trip`, "Card expenses and cash expenses are linked to this trip.", `<button class="btn" onclick="setRoute('#/dashboard/trips')">Back to trips</button>`)}
    <section class="panel trip-hero">
      <div>
        <h3>${t.employee}</h3>
        <p>${t.position} · ${company.name}</p>
        <p><strong>${t.destination}</strong> · ${t.period} · ${t.purpose}</p>
      </div>
      <div class="budget-box">
        <span>Budget</span><strong>${money(t.budget)}</strong><small>${money(t.budget - t.total)} remaining</small>
      </div>
    </section>
    <div class="stats">
      ${stat("Total expenses", money(t.total), "All linked to this trip")}
      ${stat("Card expenses", money(t.card), "Mock card transactions")}
      ${stat("Cash expenses", money(t.cash + (state.cashAdded ? 42 : 0)), "Manual receipt flow")}
      ${stat("Receipts attached", `${t.attached}/${t.totalReceipts}`, `${t.missing} missing`)}
      ${stat("Missing receipts", `${t.missing}`, "Must be resolved")}
      ${stat("Pending review", `${t.pending}`, "Approval queue")}
    </div>
    <div class="trip-banner"><span>${t.missing === 0 ? "This trip is ready to export." : `This trip is almost ready for export. ${t.missing} receipt${t.missing > 1 ? "s are" : " is"} missing.`}</span><strong>${badge(t.report)}</strong></div>
    <div class="action-row">
      <button class="btn" onclick="state.cashModalOpen=true;render()">Add cash expense</button>
      <button class="btn" onclick="setRoute('#/dashboard/receipts')">Upload receipt</button>
      <button class="btn" onclick="state.allReviewed=true;render()">Mark all reviewed</button>
      <button class="btn primary" onclick="state.reportGenerated=true;render()">Generate report</button>
      <button class="btn">Export PDF</button>
      <button class="btn">Export Excel</button>
    </div>
    <div class="dash-grid">
      <section class="panel"><h3>Expenses linked to this trip</h3>${expenseTable(expenses(), true)}</section>
      <section class="panel"><h3>Missing receipts</h3>${missing.length ? missing.map((row) => missingCard(row)).join("") : `<div class="empty">No missing receipts. This trip file is complete.</div>`}</section>
    </div>
    ${state.reportGenerated ? reportPreview(t) : ""}`);
}

function missingCard(row) {
  return `<div class="missing-card"><strong>${row[2]} - ${money(row[4])}</strong><p>${row[0]} · ${row[3]} · ${row[7]}</p><button class="btn small primary" onclick="state.receiptAttached=true;render()">Upload receipt</button><button class="btn small" onclick="state.receiptAttached=true;render()">Mark as not required</button></div>`;
}

function expenseTable(rows, compact = false) {
  return `<div class="table-wrap"><table class="${compact ? "compact-table" : ""}"><thead><tr><th>Date</th><th>Payment type</th><th>Merchant</th><th>Category</th><th>Amount</th><th>Receipt</th><th>Status</th><th>Notes</th><th>Action</th></tr></thead><tbody>
    ${rows.map((r) => `<tr class="${r[5] === "Missing" ? "needs-attention" : ""}"><td>${r[0]}</td><td>${paymentBadge(r[1])}</td><td><strong>${r[2]}</strong></td><td>${r[3]}</td><td>${money(r[4])}</td><td>${badge(r[5])}</td><td>${badge(r[6])}</td><td>${r[7]}</td><td><button class="btn small" onclick="${r[5] === "Missing" ? "state.receiptAttached=true;render()" : "state.allReviewed=true;render()"}">${r[5] === "Missing" ? "Attach" : "Review"}</button></td></tr>`).join("")}
  </tbody></table></div>`;
}

function cashModal() {
  return `<div class="modal-backdrop"><section class="modal">
    <div class="title-row"><div><h2>Add cash expense</h2><p>Cash expense added here will be linked to Nino Beridze's Batumi trip.</p></div><button class="btn small" onclick="state.cashModalOpen=false;render()">Close</button></div>
    <div class="form-grid">
      ${field("Date", "June 28")}
      ${field("Merchant", "Office supplies")}
      ${field("Category", "Other", "select")}
      ${field("Amount", "42 GEL")}
      ${field("Upload receipt", "receipt_0628.jpg")}
      ${field("Link to trip", "Nino Beridze - Batumi", "select")}
      <div class="field wide"><label>Comment</label><textarea>Cash payment during regional sales visit.</textarea></div>
    </div>
    <br><button class="btn primary" onclick="state.cashAdded=true;state.cashModalOpen=false;render()">Submit cash expense</button>
  </section></div>`;
}

function receiptsPage() {
  const missing = expenses().filter((row) => row[5] === "Missing");
  return shell("receipts", `${title("Receipts", "Find missing documents, upload receipt files, and approve uploaded receipts.")}
    ${state.receiptAttached ? `<div class="trip-banner"><span>Receipt attached successfully.</span>${badge("Attached")}</div>` : ""}
    <div class="dash-grid">
      <section class="panel"><h3>Missing receipts</h3>${missing.length ? missing.map((row) => missingCard(row)).join("") : `<div class="empty">No missing receipts for Nino's taxi expense.</div>`}</section>
      <section class="panel"><h3>Receipt upload mock</h3><div class="upload"><strong>${state.receiptAttached ? "Receipt attached" : "Drop receipt file here"}</strong><p>${state.receiptAttached ? "Taxi receipt is now linked to Nino Beridze's Batumi trip." : "No real file upload is required for this prototype."}</p></div><br><div class="form-grid">${field("Expense", "Taxi - 35 GEL", "select")}${field("Comment", "Employee sent receipt through chat")}</div><br><button class="btn primary" onclick="state.receiptAttached=true;render()">Mark receipt as attached</button></section>
    </div>
    <section class="panel" style="margin-top:16px"><h3>Recently uploaded receipts</h3>${expenseTable(expenses().filter((row) => row[5] === "Attached").slice(0,5))}</section>`);
}

function reportsPage() {
  const t = nino();
  return shell("reports", `${title("Reports", "Generate and download complete business trip reports with receipt status included.")}
    <section class="panel">
      <div class="form-grid">
        ${field("Employee", "Nino Beridze", "select")}
        ${field("Trip", "Batumi business trip", "select")}
        ${field("Date range", "June 1-June 30")}
        ${field("Status", "Almost ready", "select")}
        ${check("Include card expenses", true)}
        ${check("Include cash expenses", true)}
        ${check("Include receipt list", true)}
        ${check("Include missing receipt notes", true)}
      </div>
      <br><button class="btn primary" onclick="state.reportGenerated=true;render()">Generate Report</button>
      <button class="btn">Download PDF</button>
      <button class="btn">Download Excel</button>
    </section>
    ${state.reportGenerated ? reportPreview(t) : ""}`);
}

function reportPreview(t) {
  return `<section class="panel report-preview">
    <h3>Report generated for ${t.employee} - ${t.destination} business trip</h3>
    <p>${t.missing > 0 ? `Ready to download after ${t.missing} missing receipt${t.missing > 1 ? "s are" : " is"} resolved.` : "Ready to download."}</p>
    <div class="grid-3">
      ${stat("Company", company.name, company.id)}
      ${stat("Employee", t.employee, t.position)}
      ${stat("Trip period", t.period, t.purpose)}
      ${stat("Total budget", money(t.budget), `${money(t.budget - t.total)} remaining`)}
      ${stat("Total expenses", money(t.total), `${money(t.card)} card / ${money(t.cash)} cash`)}
      ${stat("Receipt summary", `${t.attached}/${t.totalReceipts}`, `${t.missing} missing`)}
    </div>
    <h4>Missing receipt list</h4>
    ${expenses().filter((row) => row[5] === "Missing").map((row) => `<p>${row[2]} - ${money(row[4])} - ${row[0]}</p>`).join("") || "<p>No missing receipts.</p>"}
    <button class="btn primary">Download PDF</button> <button class="btn">Download Excel</button>
  </section>`;
}

function employeesPage() {
  return shell("employees", `${title("Employees", "Employee trip history, expenses, missing receipts, and generated reports.")}
    <section class="panel table-wrap"><table><thead><tr><th>Name</th><th>Position</th><th>Department</th><th>Active trips</th><th>Completed trips</th><th>Expenses this month</th><th>Missing receipts</th><th>Action</th></tr></thead><tbody>
    ${employees.map((e) => `<tr><td><strong>${e[0]}</strong></td><td>${e[1]}</td><td>${e[2]}</td><td>${e[3]}</td><td>${e[4]}</td><td>${money(e[5])}</td><td>${badge(String(e[6]))}</td><td><button class="btn small" onclick="setRoute('#/dashboard/trips/nino-batumi')">View employee</button></td></tr>`).join("")}
    </tbody></table></section>`);
}

function expensesPage() {
  return shell("expenses", `${title("Expenses", "Search and review card and cash expenses across every business trip.")}
    ${filterBar(["Employee", "Trip", "Payment type", "Category", "Receipt status", "Approval status", "Date range"])}
    <section class="panel">${expenseTable(expenses())}</section>`);
}

function settingsPage() {
  return shell("settings", `${title("Settings", "Basic company and accounting rules for the MVP prototype.")}
    <section class="panel"><div class="form-grid">
      ${field("Company name", company.name)}
      ${field("Company identification number", company.id)}
      ${field("Default currency", "GEL", "select")}
      ${field("Receipt required above amount", "40 GEL")}
      ${field("Allowed expense categories", "Hotel, Meals, Fuel, Transport, Other")}
      ${field("Default report format", "PDF + Excel", "select")}
      ${field("Approval workflow", "Accountant review required", "select")}
      ${field("Accountant name", company.accountant)}
      ${field("Finance email", company.email)}
    </div></section>`);
}

function futurePage() {
  return shell("future", `${title("Future modules", "These modules are intentionally outside the first MVP.")}
    <div class="grid-3">
      ${card(1, "Perdiemi card integration", "Automatic card transactions and bank/payment provider connection.")}
      ${card(2, "Geolocation confirmation", "Confirm business trip distance and office-area status.")}
      ${card(3, "Partner discounts", "Optional hotel, restaurant, and fuel discounts for Perdiemi users.")}
      ${card(4, "Cashback system", "Optional cashback logic and savings reports.")}
      ${card(5, "Accounting software integrations", "Exports, APIs, and sync with external accounting systems.")}
    </div>`);
}

function filterBar(items) {
  return `<section class="panel filter-bar">${items.map((item) => `<div class="field"><label>${item}</label><select><option>All</option></select></div>`).join("")}</section>`;
}

function title(h, p, action = "") {
  return `<div class="title-row"><div><h1>${h}</h1><p>${p}</p></div><div>${action}</div></div>`;
}

function stat(label, value, note) {
  return `<article class="stat-card"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`;
}

function field(label, value, type = "input") {
  if (type === "select") return `<div class="field"><label>${label}</label><select><option>${value}</option></select></div>`;
  return `<div class="field"><label>${label}</label><input value="${value}" /></div>`;
}

function check(label, checked) {
  return `<label class="check"><input type="checkbox" ${checked ? "checked" : ""} /> <span>${label}</span></label>`;
}

function render() {
  const hash = window.location.hash || "#/";
  let html = landing();
  if (hash === "#/demo") html = demo();
  if (hash === "#/dashboard") html = dashboard();
  if (hash === "#/dashboard/trips") html = tripsPage();
  if (hash.startsWith("#/dashboard/trips/")) html = tripDetail();
  if (hash === "#/dashboard/employees") html = employeesPage();
  if (hash === "#/dashboard/expenses") html = expensesPage();
  if (hash === "#/dashboard/receipts") html = receiptsPage();
  if (hash === "#/dashboard/reports") html = reportsPage();
  if (hash === "#/dashboard/settings") html = settingsPage();
  if (hash === "#/dashboard/future-modules") html = futurePage();
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
