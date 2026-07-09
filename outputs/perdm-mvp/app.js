const state = {
  receiptAttached: false,
  cashModalOpen: false,
  cashAdded: false,
  reportGenerated: false,
  allReviewed: false,
  signupCreated: false,
  employeeReceiptUploaded: false,
  missionFormSubmitted: false,
  lang: "ka",
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
  ["June 1", "perDM Card", "Hotel Batumi", "Hotel", 720, "Attached", "Approved", "Invoice and receipt matched"],
  ["June 2", "perDM Card", "Restaurant", "Meals", 85, "Attached", "Approved", "Client dinner"],
  ["June 3", "Cash", "Taxi", "Transport", 35, "Missing", "Needs receipt", "Receipt requested from employee"],
  ["June 5", "perDM Card", "Fuel Station", "Fuel", 160, "Attached", "Approved", "Sales route fuel"],
  ["June 8", "Cash", "Parking", "Transport", 15, "Missing", "Needs receipt", "Small cash payment"],
  ["June 12", "perDM Card", "Hotel Batumi", "Hotel", 720, "Attached", "Pending review", "Second hotel invoice"],
  ["June 18", "perDM Card", "Restaurant", "Meals", 95, "Attached", "Pending review", "Partner lunch"],
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
  return `<a class="brand" href="#/"><span class="brand-mark"></span><span class="brand-word">perDM</span></a>`;
}

function setRoute(route) {
  window.location.hash = route;
}

function isKa() {
  return state.lang === "ka";
}

function langToggle() {
  return `<button class="btn small lang-toggle" onclick="state.lang=state.lang==='ka'?'en':'ka';render()">${state.lang === "ka" ? "EN" : "KA"}</button>`;
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
      <a href="#problem">${isKa() ? "პრობლემა" : "Problem"}</a>
      <a href="#workflow">${isKa() ? "როგორ მუშაობს" : "Workflow"}</a>
      <a href="#benefits">${isKa() ? "სარგებელი" : "Benefits"}</a>
      <button class="btn small" onclick="setRoute('#/demo')">${isKa() ? "დემო" : "Demo"}</button>
      <button class="btn small" onclick="setRoute('#/login')">${isKa() ? "შესვლა" : "Log in"}</button>
      <button class="btn small primary" onclick="setRoute('#/signup')">${isKa() ? "რეგისტრაცია" : "Sign up"}</button>
      ${langToggle()}
    </nav>
  </div></header>`;
}

function landing() {
  const ka = isKa();
  return `<div class="page">${topNav()}
    <main>
      <section class="hero">
        <div>
          <div class="eyebrow">${ka ? "მივლინების დოკუმენტაცია და ხარჯების კონტროლი" : "Business travel expense documentation"}</div>
          <h1>${ka ? "მივლინების ფორმები და ხარჯები ერთ სივრცეში" : "Business trip expenses, organized in one place"}</h1>
          <p>${ka ? "perDM ეხმარება კომპანიებს თანამშრომლების მივლინების ფორმების, ხელმოწერების, ქვითრების, ხარჯებისა და ანგარიშების ერთ სისტემაში მართვაში." : "perDM helps companies collect, verify, and export business travel expenses without manual receipt chaos, Excel work, and scattered documents."}</p>
          <div class="hero-actions">
            <button class="btn primary" onclick="setRoute('#/demo')">${ka ? "დემოს ნახვა" : "View demo"}</button>
            <button class="btn" onclick="setRoute('#/signup')">${ka ? "კომპანიის რეგისტრაცია" : "Register company"}</button>
            <button class="btn" onclick="setRoute('#/login')">${ka ? "შესვლა" : "Log in"}</button>
          </div>
        </div>
        <div class="hero-visual light-preview">
          <div class="preview-header">
            <strong>${ka ? "კომპანიის და თანამშრომლის სამუშაო სივრცე" : "Company and employee workspace"}</strong>
            <button class="btn small primary" onclick="setRoute('#/mission-form')">${ka ? "ფორმის ლინკი" : "Form link"}</button>
          </div>
          <div class="mini-grid">
            ${mini(ka ? "კომპანიის ანგარიში" : "Company account", "Demo Company LLC")}
            ${mini(ka ? "თანამშრომლები" : "Employees", "5 active users")}
            ${mini(ka ? "მივლინების ბიუჯეტი" : "Assigned budget", "3,000 GEL")}
            ${mini(ka ? "მივლინების ფორმა" : "Mission form", state.missionFormSubmitted ? (ka ? "დადასტურებულია" : "Confirmed") : (ka ? "გასაგზავნია" : "To send"))}
          </div>
          <div class="preview-table">
            ${previewRow(ka ? "დამსაქმებელი" : "Company admin", ka ? "ხედავს თანამშრომლებს, ფორმებს, ხარჯებს და ანგარიშებს" : "Sees every employee, trip, budget, and report", ka ? "ყველა მონაცემი" : "All data", ka ? "აქტიური" : "Active")}
            ${previewRow("Nino Beridze", ka ? "თანამშრომლის პორტალი" : "Employee portal", "250 GEL left", ka ? "ფორმა შესავსებია" : "Form pending")}
            ${previewRow(ka ? "მივლინების ფორმა" : "Mission form", ka ? "ლინკით ივსება და ხელმოწერით დასტურდება" : "Shared by link, signed and confirmed", ka ? "ლინკი" : "Link", state.missionFormSubmitted ? (ka ? "ჩაბარებულია" : "Submitted") : (ka ? "გასაგზავნია" : "Pending"))}
            ${previewRow(ka ? "ბუღალტერი" : "Accountant", ka ? "ამოწმებს და აგენერირებს ანგარიშს" : "Approves expenses and exports reports", ka ? "ანგარიშები" : "Reports", ka ? "აქტიური" : "Active")}
          </div>
        </div>
      </section>
      <section class="band"><div class="section">
        <h2>${ka ? "ერთი სისტემა კომპანიისთვის და თითოეული მივლინებული თანამშრომლისთვის" : "One system for the company and every travelling employee"}</h2>
        <p class="section-lead">${ka ? "კომპანია რეგისტრირდება, ამატებს თანამშრომლებს, უგზავნის მივლინების ფორმის ლინკს, ხოლო თანამშრომელი ავსებს ფორმას, აწერს ხელს და ადასტურებს. დამსაქმებელი ყველაფერს ხედავს თავის პანელში." : "The company signs up, adds employees, assigns trips and budgets, and gives each employee a login. Employees see their own budget, expenses, missing receipts, and upload actions. The company sees the full picture across everyone."}</p>
        <div class="grid-3">
          ${card(1, ka ? "კომპანია რეგისტრირდება" : "Company registers", ka ? "დამსაქმებელი ქმნის perDM-ის კომპანიის ანგარიშს და ამატებს თანამშრომლებს." : "The employer creates a perDM company account and sets basic accounting rules.")}
          ${card(2, ka ? "თანამშრომელი იღებს ლინკს" : "Employees receive login", ka ? "თანამშრომელი ავსებს მივლინების ფორმას, აწერს ხელს და ადასტურებს." : "Each employee gets access to their own trip, budget, receipt upload, and report status.")}
          ${card(3, ka ? "დამსაქმებელი ხედავს ყველაფერს" : "Company sees everything", ka ? "დამსაქმებელი ხედავს ფორმის სტატუსს, ხარჯებს, ქვითრებს და ანგარიშებს." : "Finance managers monitor all employees, expenses, receipts, approvals, and exports.")}
        </div>
      </div></section>
      <section class="section mission-highlight">
        <h2>${ka ? "მთავარი ფუნქცია: მივლინების ფორმა ლინკით" : "Core feature: shareable business trip form"}</h2>
        <p class="section-lead">${ka ? "კომპანია თანამშრომელს უგზავნის უნიკალურ ლინკს. თანამშრომელი ავსებს ფორმას, ადასტურებს ხელმოწერით და ფორმა ავტომატურად ჩანს დამსაქმებლის dashboard-ში." : "The company sends a unique link to the employee. The employee fills the form, signs and confirms it, and the employer sees it inside the company dashboard."}</p>
        <div class="hero-actions">
          <button class="btn primary" onclick="setRoute('#/mission-form')">${ka ? "ფორმის გახსნა" : "Open form link"}</button>
          <button class="btn" onclick="setRoute('#/dashboard/mission-forms')">${ka ? "დამსაქმებლის ხედვა" : "Employer view"}</button>
        </div>
      </section>
      <section class="section" id="problem">
        <h2>Business trip reporting is still too manual</h2>
        <p class="section-lead">One completed trip can leave finance teams with card statements, paper receipts, cash notes, email attachments, and Excel files to reconcile by hand.</p>
        <div class="grid-3">
          ${["Receipts are collected manually", "Expenses are scattered across card, cash, email, and paper", "Accountants spend hours checking documents", "Missing receipts create confusion", "Excel reports take too much time", "One trip can take days to document"].map((x, i) => card(i + 1, x, "perDM brings the trip file, expense list, receipts, and report status into one clear workspace.")).join("")}
        </div>
      </section>
      <section class="band"><div class="section" id="workflow">
        <h2>perDM turns every business trip into a ready-to-export expense file</h2>
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
        <p class="section-lead">Later versions may add perDM card integration, partner discounts, cashback, geolocation confirmation, and accounting software integrations. The first MVP focuses on documentation, verification, and report export.</p>
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
  const ka = isKa();
  return `<div class="page">${topNav()}<section class="section">
    <div class="title-row"><div><h1>perDM demo</h1><p>${ka ? "აირჩიე რომელი ხედვა გინდა აჩვენო: კომპანიის თუ თანამშრომლის." : "Choose the perspective you want to show: what the company sees, or what the employee sees."}</p></div></div>
    <div class="grid-2 demo-choice-grid">
      ${demoCard(ka ? "კომპანიის ხედვა" : "Company view", ka ? "კომპანია ხედავს თანამშრომლებს, მივლინების ფორმებს, ბიუჯეტებს, ხარჯებს, ქვითრებს და ანგარიშებს." : "The company sees all employees, trips, budgets, card and cash expenses, missing receipts, approvals, and export-ready reports.", "#/dashboard", ka ? "კომპანიის დემო" : "Open company demo")}
      ${demoCard(ka ? "თანამშრომლის ხედვა" : "Employee view", ka ? "თანამშრომელი ხედავს საკუთარ მივლინებას, ფორმას, ბიუჯეტს, ხარჯებს, ასატვირთ ქვითრებს და დადასტურების სტატუსს." : "The employee sees only their assigned trip, remaining budget, personal expenses, missing receipt tasks, and report submission status.", "#/employee", ka ? "თანამშრომლის დემო" : "Open employee demo")}
    </div>
    <section class="panel demo-compare">
      <h3>${ka ? "როგორ უკავშირდება ორი დემო ერთმანეთს" : "How the two demos connect"}</h3>
      <div class="grid-2">
        <div>
          <h4>${ka ? "კომპანია / ფინანსისტი" : "Company / Finance Manager"}</h4>
          <p class="section-lead">${ka ? "ამატებს თანამშრომლებს, უგზავნის ფორმის ლინკს, აკონტროლებს ხარჯებს, ამოწმებს ქვითრებს და ტვირთავს ანგარიშებს." : "Adds employees, assigns budgets, monitors every business trip, checks receipts, approves expenses, and downloads reports."}</p>
        </div>
        <div>
          <h4>${ka ? "თანამშრომელი" : "Employee"}</h4>
          <p class="section-lead">${ka ? "შედის თავის პორტალში, ავსებს მივლინების ფორმას, აწერს ხელს, ტვირთავს ქვითრებს და აბარებს ინფორმაციას კომპანიას." : "Logs in separately, sees their own trip and budget, uploads missing receipts, and submits the trip file back to the company."}</p>
        </div>
      </div>
    </section>
    <div class="grid-3">
      ${card(1, ka ? "კომპანია რეგისტრირდება" : "Company registers", ka ? "დამსაქმებელი ქმნის სამუშაო სივრცეს და ამატებს თანამშრომლებს." : "The employer creates the workspace and adds employees.")}
      ${card(2, ka ? "თანამშრომელი იღებს ლინკს" : "Employee gets login", ka ? "თანამშრომელი იღებს პორტალს და მივლინების ფორმის ლინკს." : "Each employee gets their own limited portal.")}
      ${card(3, ka ? "ფინანსები ხედავს ყველაფერს" : "Finance sees everything", ka ? "კომპანიის dashboard რჩება ყველა ფორმის და ანგარიშის წყაროდ." : "The company dashboard stays the source of truth for all reports.")}
    </div>
  </section></div>`;
}

function loginPage() {
  const ka = isKa();
  return `<div class="page">${topNav()}<section class="section auth-section">
    <div class="auth-card">
      <div>
        <div class="eyebrow">${ka ? "დემო შესვლა" : "Demo login"}</div>
        <h1>${ka ? "perDM-ში შესვლა" : "Log in to perDM"}</h1>
        <p class="section-lead">${ka ? "აირჩიე როგორ შედიხარ პროტოტიპში. რეალურ პროდუქტში კომპანია რეგისტრაციის შემდეგ ქმნის თანამშრომლების წვდომებს." : "Choose how to enter the prototype. In the real product, companies create employee logins after registration."}</p>
      </div>
      <div class="grid-2">
        ${portalCard(ka ? "კომპანია / ფინანსისტი" : "Company / Finance Manager", ka ? "მართავს თანამშრომლებს, მივლინებებს, ფორმებს, ბიუჯეტებს, ხარჯებს, ქვითრებს და ანგარიშებს." : "Manage employees, trips, budgets, expenses, receipts, approvals, and reports.", "#/dashboard", ka ? "კომპანიის პანელი" : "Open company dashboard")}
        ${portalCard(ka ? "თანამშრომელი" : "Employee", ka ? "ხედავს საკუთარ მივლინებას, ბიუჯეტს, ფორმას, ხარჯებს და ასატვირთ დოკუმენტებს." : "View assigned budget, trip expenses, missing receipts, and upload documents.", "#/employee", ka ? "თანამშრომლის პორტალი" : "Open employee portal")}
      </div>
      <p class="auth-note">${ka ? "დემო წვდომები mock-ია. რეალური ავტორიზაცია ჯერ არ არის ჩართული." : "Demo credentials are mocked for the prototype. No real authentication is connected yet."}</p>
    </div>
  </section></div>`;
}

function signupPage() {
  const ka = isKa();
  return `<div class="page">${topNav()}<section class="section auth-section">
    <div class="auth-card">
      <div class="title-row">
        <div>
          <div class="eyebrow">${ka ? "კომპანიის რეგისტრაცია" : "Company sign up"}</div>
          <h1>${ka ? "დაარეგისტრირე კომპანია" : "Register your company"}</h1>
          <p>${ka ? "შექმენი დამსაქმებლის ანგარიში, დაამატე თანამშრომლები და მოამზადე მივლინების ფორმის ლინკები." : "Set up the employer account, add employees, and prepare employee logins for the travel expense workflow."}</p>
        </div>
        <button class="btn" onclick="setRoute('#/login')">${ka ? "უკვე რეგისტრირებული ხარ?" : "Already registered?"}</button>
      </div>
      ${state.signupCreated ? `<div class="trip-banner"><span>${ka ? "კომპანიის ანგარიში შეიქმნა. თანამშრომლების demo წვდომები მზადაა." : "Company account created. Employee logins are ready for demo use."}</span>${badge(ka ? "აქტიური" : "Active")}</div>` : ""}
      <div class="dash-grid">
        <section class="panel">
          <h3>${ka ? "კომპანიის მონაცემები" : "Company details"}</h3>
          <div class="form-grid">
            ${field("Company name", company.name)}
            ${field("Company identification number", company.id)}
            ${field("Finance manager", company.accountant)}
            ${field("Finance email", company.email)}
            ${field("Default currency", "GEL", "select")}
            ${field("Receipt required above", "40 GEL")}
          </div>
          <br><button class="btn primary" onclick="state.signupCreated=true;render()">${ka ? "კომპანიის ანგარიშის შექმნა" : "Create company account"}</button>
        </section>
        <section class="panel">
          <h3>${ka ? "თანამშრომლების დამატება" : "Add employees"}</h3>
          <div class="employee-invite-list">
            ${inviteRow("Nino Beridze", "Sales Manager", "nino@demo-company.ge", "Login ready")}
            ${inviteRow("Giorgi Kapanadze", "Field Specialist", "giorgi@demo-company.ge", "Login ready")}
            ${inviteRow("Mariam Lomidze", "Operations Lead", "mariam@demo-company.ge", "Invite sent")}
          </div>
          <br>
          <div class="form-grid">
            ${field("Employee name", "Ana Maisuradze")}
            ${field("Work email", "ana@demo-company.ge")}
            ${field("Position", "Marketing Coordinator")}
            ${field("Monthly travel budget", "700 GEL")}
          </div>
          <br><button class="btn">${ka ? "თანამშრომლის დამატება" : "Add employee"}</button>
        </section>
      </div>
      <div class="signup-flow">
        ${step(1, "Company creates account")}
        ${step(2, "Company adds employees")}
        ${step(3, "Employees get login")}
        ${step(4, "Company tracks every trip")}
      </div>
    </div>
  </section></div>`;
}

function portalCard(title, copy, route, action) {
  return `<article class="role-card portal-card"><div class="icon">${title[0]}</div><h3>${title}</h3><p>${copy}</p><br><button class="btn primary" onclick="setRoute('${route}')">${action}</button></article>`;
}

function inviteRow(name, role, email, status) {
  return `<div class="invite-row"><span><strong>${name}</strong><small>${role} · ${email}</small></span>${badge(status)}</div>`;
}

function demoCard(title, copy, route, action = "Open demo") {
  return `<article class="role-card demo-card"><div class="icon">${title[0]}</div><h3>${title}</h3><p>${copy}</p><br><button class="btn primary" onclick="setRoute('${route}')">${action}</button></article>`;
}

const links = [
  ["overview", "Overview", "#/dashboard"],
  ["missionForms", "Mission Forms", "#/dashboard/mission-forms"],
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
      <div class="dash-top"><strong>${isKa() ? "დამსაქმებლის პანელი" : "Accountant dashboard"}</strong><div>${langToggle()} <button class="btn small" onclick="setRoute('#/demo')">${isKa() ? "დემოები" : "Demo flows"}</button></div></div>
      <div class="mobile-tabs">${links.map(([key, label, route]) => `<button class="side-link ${active === key ? "active" : ""}" onclick="setRoute('${route}')">${label}</button>`).join("")}</div>
      <div class="dash-content">${content}</div>
    </main>
  </div>${state.cashModalOpen ? cashModal() : ""}`;
}

function sideIcon(label) {
  const map = { Overview: "⌂", "Mission Forms": "✎", "Business Trips": "▤", Employees: "◎", Expenses: "≡", Receipts: "□", Reports: "↧", Settings: "⚙", "Future Modules": "+" };
  return map[label] || "•";
}

function dashboard() {
  const t = nino();
  return shell("overview", `${title(isKa() ? "მიმოხილვა" : "Overview", isKa() ? "მივლინების ფორმები, ხარჯები და ანგარიშები ერთ სივრცეშია." : "Everything related to a business trip is collected in one place.", `<button class="btn primary" onclick="setRoute('#/dashboard/mission-forms')">${isKa() ? "მივლინების ფორმები" : "Mission forms"}</button>`)}
    <div class="stats">
      ${stat(isKa() ? "მივლინების ფორმები" : "Mission forms", state.missionFormSubmitted ? "1" : "0", state.missionFormSubmitted ? (isKa() ? "დადასტურებული" : "Confirmed") : (isKa() ? "ელოდება შევსებას" : "Waiting for employee"))}
      ${stat("Active business trips", "4", "2 end this week")}
      ${stat("Completed trips waiting for report", "3", "Nino needs review")}
      ${stat("Expenses this month", money(8420), "Card and cash combined")}
      ${stat("Missing receipts", `${t.missing + 1}`, "Across all trips")}
      ${stat("Pending approvals", `${t.pending + 3}`, "Need accountant review")}
    </div>
    <div class="dash-grid">
      <section class="panel"><h3>${isKa() ? "ყურადღებას საჭიროებს" : "Items requiring attention"}</h3>${attention("Nino Beridze", isKa() ? "მივლინების ფორმა" : "Mission form", state.missionFormSubmitted ? (isKa() ? "დადასტურებულია" : "Confirmed") : (isKa() ? "გასაგზავნია / შესავსებია" : "Pending employee confirmation"), "#/dashboard/mission-forms")}${attention("Nino Beridze", "Batumi business trip", `${t.missing} missing receipts`, "#/dashboard/trips/nino-batumi")}${attention("Giorgi Kapanadze", "Kutaisi field visit", "Ready for export", "#/dashboard/trips")}</section>
      <section class="panel"><h3>Expenses by category</h3><div class="donut"></div><p class="section-lead">Hotel, meals, fuel, transport, and other expenses grouped for finance review.</p></section>
    </div>
    <section class="panel" style="margin-top:16px"><h3>Monthly business trip expenses</h3><div class="bar-chart">${[38, 54, 42, 71, 63, 84].map((h, i) => `<div class="bar" style="height:${h}%"><span>${["Jan","Feb","Mar","Apr","May","Jun"][i]}</span></div>`).join("")}</div></section>`);
}

function missionFormsPage() {
  return shell("missionForms", `${title(isKa() ? "მივლინების ფორმები" : "Mission forms", isKa() ? "დამსაქმებელი ხედავს თანამშრომლის მიერ ლინკით შევსებულ და ხელმოწერით დადასტურებულ ფორმებს." : "The employer sees business trip forms submitted and signed by employees through a shared link.", `<button class="btn primary" onclick="setRoute('#/mission-form')">${isKa() ? "თანამშრომლის ლინკის გახსნა" : "Open employee link"}</button>`)}
    <section class="panel form-share-panel">
      <div>
        <h3>${isKa() ? "გასაზიარებელი ლინკი თანამშრომლისთვის" : "Shareable employee form link"}</h3>
        <p class="section-lead">${isKa() ? "ეს ლინკი ეგზავნება თანამშრომელს. თანამშრომელი ავსებს, ხელს აწერს და ადასტურებს." : "Send this link to the employee. They fill it, sign it, and confirm the form."}</p>
      </div>
      <div class="share-box">https://georgegasto909.github.io/perDM/outputs/perdm-mvp/#/mission-form</div>
    </section>
    <section class="panel table-wrap" style="margin-top:16px">
      <table><thead><tr><th>${isKa() ? "თანამშრომელი" : "Employee"}</th><th>${isKa() ? "ფორმა" : "Form"}</th><th>${isKa() ? "დანიშნულება" : "Destination"}</th><th>${isKa() ? "სტატუსი" : "Status"}</th><th>${isKa() ? "ხელმოწერა" : "Signature"}</th><th>${isKa() ? "ქმედება" : "Action"}</th></tr></thead><tbody>
        <tr><td><strong>ნინო ბერიძე</strong><small class="table-sub">nino@demo-company.ge</small></td><td>${isKa() ? "მივლინების ფორმა" : "Business trip form"}</td><td>Batumi</td><td>${badge(state.missionFormSubmitted ? (isKa() ? "დადასტურებულია" : "Confirmed") : (isKa() ? "ელოდება თანამშრომელს" : "Waiting for employee"))}</td><td>${state.missionFormSubmitted ? "Nino Beridze" : "-"}</td><td><button class="btn small" onclick="setRoute('#/mission-form')">${isKa() ? "ფორმის ნახვა" : "View form"}</button></td></tr>
      </tbody></table>
    </section>
    ${state.missionFormSubmitted ? missionFormPreview() : `<section class="empty" style="margin-top:16px">${isKa() ? "ფორმა ჯერ არ არის დადასტურებული. თანამშრომლის დადასტურების შემდეგ აქ გამოჩნდება შევსებული ვერსია." : "The form is not confirmed yet. Once the employee submits it, the completed version appears here."}</section>`}`);
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
  return shell("employees", `${title("Employees", "Company manages every employee login, assigned budget, trip status, expenses, and missing receipts.", `<button class="btn primary" onclick="setRoute('#/signup')">Add employee</button>`)}
    <section class="panel table-wrap"><table><thead><tr><th>Name</th><th>Position</th><th>Department</th><th>Login</th><th>Assigned budget</th><th>Current trip</th><th>Expenses this month</th><th>Missing receipts</th><th>Action</th></tr></thead><tbody>
    ${employees.map((e, index) => `<tr><td><strong>${e[0]}</strong><small class="table-sub">${employeeEmail(e[0])}</small></td><td>${e[1]}</td><td>${e[2]}</td><td>${badge(index < 3 ? "Login active" : "Invite pending")}</td><td>${money([3000, 900, 600, 1200, 700][index])}</td><td>${index === 0 ? "Batumi business trip" : index === 1 ? "Kutaisi field visit" : "No active trip"}</td><td>${money(e[5])}</td><td>${badge(String(e[6]))}</td><td><button class="btn small" onclick="setRoute('${index === 0 ? "#/dashboard/trips/nino-batumi" : "#/employee"}')">${index === 0 ? "Open trip" : "View employee"}</button></td></tr>`).join("")}
    </tbody></table></section>`);
}

function employeeEmail(name) {
  return `${name.split(" ")[0].toLowerCase()}@demo-company.ge`;
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
      ${card(1, "perDM card integration", "Automatic card transactions and bank/payment provider connection.")}
      ${card(2, "Geolocation confirmation", "Confirm business trip distance and office-area status.")}
      ${card(3, "Partner discounts", "Optional hotel, restaurant, and fuel discounts for perDM users.")}
      ${card(4, "Cashback system", "Optional cashback logic and savings reports.")}
      ${card(5, "Accounting software integrations", "Exports, APIs, and sync with external accounting systems.")}
    </div>`);
}

const employeeLinks = [
  ["overview", "My Overview", "#/employee"],
  ["missionForm", "Mission Form", "#/mission-form"],
  ["trip", "My Trip", "#/employee/trip"],
  ["expenses", "My Expenses", "#/employee/expenses"],
  ["receipts", "Upload Receipts", "#/employee/receipts"],
  ["report", "Submit Report", "#/employee/report"],
];

function employeeShell(active, content) {
  return `<div class="app-shell employee-shell">
    <aside class="sidebar">
      ${brand()}
      <nav class="side-nav">${employeeLinks.map(([key, label, route]) => `<button class="side-link ${active === key ? "active" : ""}" onclick="setRoute('${route}')"><span>${sideIcon(label)}</span>${label}</button>`).join("")}</nav>
    </aside>
    <main class="main">
      <div class="dash-top"><strong>${isKa() ? "თანამშრომლის პორტალი · ნინო ბერიძე" : "Employee portal · Nino Beridze"}</strong><div>${langToggle()} <button class="btn small" onclick="setRoute('#/login')">${isKa() ? "შესვლის შეცვლა" : "Switch login"}</button></div></div>
      <div class="mobile-tabs">${employeeLinks.map(([key, label, route]) => `<button class="side-link ${active === key ? "active" : ""}" onclick="setRoute('${route}')">${label}</button>`).join("")}</div>
      <div class="dash-content">${content}</div>
    </main>
  </div>`;
}

function employeePortal(view = "overview") {
  const pages = {
    overview: employeeOverview,
    trip: employeeTrip,
    expenses: employeeExpenses,
    receipts: employeeReceipts,
    report: employeeReport,
  };
  return employeeShell(view, pages[view]());
}

function employeeOverview() {
  const t = nino();
  return `${title(isKa() ? "ჩემი მივლინების სივრცე" : "My travel workspace", isKa() ? "კომპანიამ ამ ანგარიშზე მოგანიჭა მივლინების ფორმა, ბიუჯეტი, ხარჯები და ქვითრების დავალებები." : "Your company assigned this trip, budget, expenses, and receipt tasks to your employee account.")}
    <div class="stats">
      ${stat(isKa() ? "ფორმის სტატუსი" : "Form status", state.missionFormSubmitted ? (isKa() ? "დადასტურებულია" : "Confirmed") : (isKa() ? "შესავსებია" : "To complete"), isKa() ? "ხელმოწერა სავალდებულოა" : "Signature required")}
      ${stat("Assigned budget", money(t.budget), "Batumi business trip")}
      ${stat("Spent", money(t.total), "Card + cash")}
      ${stat("Remaining", money(t.budget - t.total), "Available budget")}
      ${stat("Receipts to upload", String(t.missing), "Required before report")}
      ${stat("Pending review", String(t.pending), "Finance will approve")}
    </div>
    <div class="dash-grid">
      <section class="panel">
        <h3>${isKa() ? "შენი დავალებები" : "What you need to do"}</h3>
        ${attention(isKa() ? "მივლინების ფორმის შევსება" : "Complete mission form", isKa() ? "ფორმა უნდა შეივსოს და დადასტურდეს ხელმოწერით" : "Fill and confirm the form with signature", state.missionFormSubmitted ? (isKa() ? "შესრულებულია" : "Done") : (isKa() ? "სავალდებულო" : "Required"), "#/mission-form")}
        ${attention("Upload missing receipt", "Taxi - 35 GEL, June 3", state.receiptAttached ? "Done" : "Needs receipt", "#/employee/receipts")}
        ${attention("Check expense list", "Confirm card and cash payments are correct", "Open", "#/employee/expenses")}
        ${attention("Submit trip report", "Send completed trip file to finance", "Pending", "#/employee/report")}
      </section>
      <section class="panel">
        <h3>Employee view</h3>
        <p class="section-lead">${isKa() ? "თანამშრომელი ვერ ხედავს კომპანიის მთლიან მონაცემებს. ხედავს მხოლოდ საკუთარ ფორმას, ბიუჯეტს, ხარჯებს და ასატვირთ დოკუმენტებს." : "The employee does not see company-wide data. They only see their own budget, trip, expenses, missing documents, and report submission status."}</p>
        <button class="btn primary" onclick="setRoute('#/mission-form')">${isKa() ? "მივლინების ფორმის შევსება" : "Complete mission form"}</button>
      </section>
    </div>`;
}

function missionFormPage() {
  return `<div class="page">${topNav()}
    <section class="section mission-form-page">
      ${title(isKa() ? "მივლინების ფორმა" : "Business trip form", isKa() ? "თანამშრომელი ავსებს ფორმას, აწერს ხელს და ადასტურებს. დადასტურების შემდეგ ფორმა ჩანს დამსაქმებლის dashboard-ში." : "The employee fills this shared form, signs it, and confirms it. After submission, the employer sees it in the dashboard.", `<button class="btn" onclick="setRoute('#/employee')">${isKa() ? "თანამშრომლის პორტალი" : "Employee portal"}</button>`)}
      ${state.missionFormSubmitted ? `<div class="trip-banner"><span>${isKa() ? "ფორმა დადასტურებულია და ჩანს დამსაქმებლის პანელში." : "Form confirmed and visible to the employer."}</span>${badge(isKa() ? "დადასტურებულია" : "Confirmed")}</div>` : ""}
      <div class="dash-grid">
        <section class="panel">
          <h3>${isKa() ? "შესავსები ველები" : "Required fields"}</h3>
          <div class="form-grid">
            ${field(isKa() ? "მივლინებულის სახელი და გვარი" : "Employee full name", "ნინო ბერიძე")}
            ${field(isKa() ? "საკონტაქტო მაილი" : "Contact email", "nino@demo-company.ge")}
            ${field(isKa() ? "პოზიცია/თანამდებობა" : "Position", "Sales Manager")}
            ${field(isKa() ? "დამსაქმებელი პირის საიდენტიფიკაციო" : "Employer identification number", company.id)}
            ${field(isKa() ? "დამსაქმებელი პირის დასახელება" : "Employer name", company.name)}
            ${field(isKa() ? "დანიშნულების პუნქტი / ორგანიზაცია" : "Destination / host organization", "Batumi regional partner office")}
            ${field(isKa() ? "გავიდა: დღე, თვე, წელი" : "Departure: day, month, year", "June 1, 2026")}
            ${field(isKa() ? "გამოცხადდა: დღე, თვე, წელი" : "Arrived: day, month, year", "June 1, 2026")}
            ${field(isKa() ? "დაბრუნდა / გავიდა: დღე, თვე, წელი" : "Return departure: day, month, year", "June 30, 2026")}
            ${field(isKa() ? "დამსაქმებელთან გამოცხადდა: დღე, თვე, წელი" : "Returned to employer: day, month, year", "June 30, 2026")}
            <div class="field wide"><label>${isKa() ? "მოხსენებითი ბარათი (არასავალდებულო)" : "Trip note / memo (optional)"}</label><textarea>${isKa() ? "რეგიონული გაყიდვების შეხვედრები და პარტნიორებთან ვიზიტები." : "Regional sales meetings and partner visits."}</textarea></div>
            ${field(isKa() ? "მივლინებული პირის ხელმოწერა" : "Employee signature", "Nino Beridze")}
          </div>
          <div class="signature-box">
            <span>${isKa() ? "ელექტრონული ხელმოწერა" : "Electronic signature"}</span>
            <strong>Nino Beridze</strong>
          </div>
          <br>
          <button class="btn primary" onclick="state.missionFormSubmitted=true;render()">${isKa() ? "ხელმოწერა და დადასტურება" : "Sign and confirm"}</button>
          <button class="btn" onclick="setRoute('#/dashboard/mission-forms')">${isKa() ? "დამსაქმებლის ხედვა" : "Employer view"}</button>
        </section>
        <section class="panel">
          <h3>${isKa() ? "Jotform ინტეგრაციის მაგალითი" : "Jotform integration example"}</h3>
          <p class="section-lead">${isKa() ? "ეს არის იგივე ფორმის ჩასმის ადგილი. რეალურ ვერსიაში აქ შეიძლება ჩაიტვირთოს Jotform ან perDM-ის native ფორმა." : "This is where the shared Jotform or native perDM form can be embedded in the real product."}</p>
          <iframe class="jotform-frame" title="Mission form" src="https://form.jotform.com/252885161056056"></iframe>
        </section>
      </div>
    </section>
  </div>`;
}

function missionFormPreview() {
  return `<section class="panel mission-preview" style="margin-top:16px">
    <h3>${isKa() ? "დადასტურებული ფორმის Preview" : "Confirmed form preview"}</h3>
    <div class="grid-3">
      ${stat(isKa() ? "მივლინებული" : "Employee", "ნინო ბერიძე", "nino@demo-company.ge")}
      ${stat(isKa() ? "დამსაქმებელი" : "Employer", company.name, company.id)}
      ${stat(isKa() ? "დანიშნულება" : "Destination", "Batumi", isKa() ? "რეგიონული პარტნიორი" : "Regional partner")}
      ${stat(isKa() ? "გავიდა" : "Departure", "June 1, 2026", isKa() ? "ხელმოწერა: დამსაქმებელი" : "Employer signature")}
      ${stat(isKa() ? "გამოცხადდა" : "Arrived", "June 1, 2026", isKa() ? "მიმღები მხარის ხელმოწერა" : "Host signature")}
      ${stat(isKa() ? "ხელმოწერა" : "Signature", "Nino Beridze", isKa() ? "დადასტურებულია" : "Confirmed")}
    </div>
  </section>`;
}

function employeeTrip() {
  const t = nino();
  return `${title("My Batumi trip", "Trip details assigned by the company.")}
    <section class="panel trip-hero">
      <div>
        <h3>${t.destination} business trip</h3>
        <p>${t.period} · ${t.purpose}</p>
        <p><strong>Company:</strong> ${company.name} · <strong>Employee:</strong> ${t.employee}</p>
      </div>
      <div class="budget-box"><span>Remaining budget</span><strong>${money(t.budget - t.total)}</strong><small>${money(t.total)} spent</small></div>
    </section>
    <div class="trip-banner"><span>${t.missing} receipt${t.missing > 1 ? "s are" : " is"} still needed before finance can finalize the report.</span>${badge(t.report)}</div>`;
}

function employeeExpenses() {
  return `${title("My expenses", "Card payments and cash expenses linked to your assigned business trip.")}
    <section class="panel">${expenseTable(expenses(), true)}</section>`;
}

function employeeReceipts() {
  const missing = expenses().filter((row) => row[5] === "Missing");
  return `${title("Upload receipts", "Attach missing receipts so finance can complete the company report.")}
    ${state.employeeReceiptUploaded || state.receiptAttached ? `<div class="trip-banner"><span>Receipt uploaded and sent to finance for review.</span>${badge("Uploaded")}</div>` : ""}
    <div class="dash-grid">
      <section class="panel"><h3>Receipts still needed</h3>${missing.length ? missing.map((row) => missingCard(row)).join("") : `<div class="empty">All required receipts are attached.</div>`}</section>
      <section class="panel"><h3>Upload receipt</h3><div class="upload"><strong>${state.employeeReceiptUploaded ? "Receipt uploaded" : "Choose receipt image"}</strong><p>${state.employeeReceiptUploaded ? "Finance can now see this document in the company dashboard." : "Mock upload area for the employee account."}</p></div><br><div class="form-grid">${field("Select expense", "Taxi - 35 GEL", "select")}${field("Comment", "Taxi receipt from June 3")}</div><br><button class="btn primary" onclick="state.employeeReceiptUploaded=true;state.receiptAttached=true;render()">Upload and send to finance</button></section>
    </div>`;
}

function employeeReport() {
  const t = nino();
  return `${title("Submit report", "Submit your completed trip file to the company finance manager.")}
    <section class="panel">
      <div class="grid-3">
        ${stat("Trip", `${t.destination}`, t.period)}
        ${stat("Total expenses", money(t.total), `${money(t.card)} card / ${money(t.cash)} cash`)}
        ${stat("Receipt status", `${t.attached}/${t.totalReceipts}`, `${t.missing} missing`)}
      </div>
      <p class="section-lead">After receipts are attached, the company can approve expenses and export the official finance report.</p>
      <button class="btn primary">Submit to company</button>
    </section>`;
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
  if (hash === "#/login") html = loginPage();
  if (hash === "#/signup") html = signupPage();
  if (hash === "#/mission-form") html = missionFormPage();
  if (hash === "#/dashboard") html = dashboard();
  if (hash === "#/dashboard/mission-forms") html = missionFormsPage();
  if (hash === "#/dashboard/trips") html = tripsPage();
  if (hash.startsWith("#/dashboard/trips/")) html = tripDetail();
  if (hash === "#/dashboard/employees") html = employeesPage();
  if (hash === "#/dashboard/expenses") html = expensesPage();
  if (hash === "#/dashboard/receipts") html = receiptsPage();
  if (hash === "#/dashboard/reports") html = reportsPage();
  if (hash === "#/dashboard/settings") html = settingsPage();
  if (hash === "#/dashboard/future-modules") html = futurePage();
  if (hash === "#/employee") html = employeePortal("overview");
  if (hash === "#/employee/mission-form") html = missionFormPage();
  if (hash === "#/employee/trip") html = employeePortal("trip");
  if (hash === "#/employee/expenses") html = employeePortal("expenses");
  if (hash === "#/employee/receipts") html = employeePortal("receipts");
  if (hash === "#/employee/report") html = employeePortal("report");
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
