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
  cardFrozen: false,
  paymentSimulated: false,
  geoActive: true,
  budgetDistributed: false,
  locationShared: true,
  distanceKm: 18.4,
  limitAlert: false,
  bankLinked: true,
  employeeBankLinked: false,
  aiAnswered: false,
};

const company = {
  name: "Demo Company LLC",
  id: "GE-204889321",
  accountant: "Tamar Finance",
  email: "finance@demo-company.ge",
  workplace: "Tbilisi HQ, 12 Rustaveli Ave",
  workplaceCoords: "41.7151, 44.8271",
};

const legalRules = {
  domesticDailyAllowance: 30,
  domesticDistanceThreshold: 30,
  companyActivationThreshold: 12,
  longTermDays: 30,
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
  ["June 1", "TBC Card", "Hotel Batumi", "Hotel", 720, "Attached", "Approved", "Invoice and receipt matched"],
  ["June 2", "BOG Card", "Restaurant", "Meals", 85, "Attached", "Approved", "Client dinner"],
  ["June 3", "Cash", "Taxi", "Transport", 35, "Missing", "Needs receipt", "Receipt requested from employee"],
  ["June 5", "TBC Card", "Fuel Station", "Fuel", 160, "Attached", "Approved", "Sales route fuel"],
  ["June 8", "Cash", "Parking", "Transport", 15, "Missing", "Needs receipt", "Small cash payment"],
  ["June 12", "BOG Card", "Hotel Batumi", "Hotel", 720, "Attached", "Pending review", "Second hotel invoice"],
  ["June 18", "TBC Card", "Restaurant", "Meals", 95, "Attached", "Pending review", "Partner lunch"],
  ["June 25", "Cash", "Local transport", "Transport", 80, "Attached", "Approved", "Airport transfer"],
];

const employees = [
  ["Nino Beridze", "Sales Manager", "Sales", 1, 4, 2750, state.receiptAttached ? 1 : 2],
  ["Giorgi Kapanadze", "Field Specialist", "Field Team", 0, 3, 715, 0],
  ["Mariam Lomidze", "Operations Lead", "Operations", 0, 2, 420, 1],
  ["Irakli Tsereteli", "Regional Manager", "Management", 1, 5, 1280, 0],
  ["Ana Maisuradze", "Marketing Coordinator", "Marketing", 0, 1, 340, 1],
];

const cardTransactions = [
  ["June 1", "Hotel Batumi", "Hotel", 720, "Approved"],
  ["June 2", "Restaurant", "Meals", 85, "Approved"],
  ["June 5", "Fuel Station", "Fuel", 160, "Approved"],
  ["June 12", "Hotel Batumi", "Hotel", 720, "Pending review"],
  ["June 18", "Restaurant", "Meals", 95, "Pending review"],
];

const bankSources = [
  ["TBC Bank", "Business Visa", "**** 2048", "Connected"],
  ["Bank of Georgia", "Corporate Mastercard", "**** 7710", "Connected"],
  ["Liberty Bank", "Employee Visa", "**** 9182", "Ready"],
];

const partnerOffers = [
  ["Rooms Hotel", "Hotel", "10% discount", "18 GEL saved", "Active"],
  ["Wissol", "Fuel", "5% cashback", "8 GEL cashback", "Active"],
  ["Stamba Cafe", "Meals", "15% discount", "14 GEL saved", "Active"],
  ["Terminal", "Coworking", "Corporate rate", "22 GEL saved", "Scheduled"],
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

function brandIcon() {
  return `<svg class="brand-mark" viewBox="0 0 64 72" aria-hidden="true" focusable="false">
    <path class="logo-pin" d="M32 2C16.5 2 4 14.5 4 30c0 20.7 28 40 28 40s28-19.3 28-40C60 14.5 47.5 2 32 2Z"/>
    <circle class="logo-pin-center" cx="32" cy="30" r="18"/>
    <rect class="logo-card" x="19" y="24" width="25" height="15" rx="3"/>
    <rect class="logo-card-line" x="22" y="29" width="18" height="4" rx="1.5"/>
  </svg>`;
}

function brand() {
  return `<a class="brand" href="#/">${brandIcon()}<span class="brand-word">PerDM</span></a>`;
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
          <div class="eyebrow">${ka ? "AI, გეოლოკაცია და კანონთან შესაბამისი მივლინებები" : "AI, geolocation, and compliant business travel"}</div>
          <h1>${ka ? "PerDM არის ჭკვიანი პლატფორმა მივლინების სამართავად" : "PerDM is the smart platform for business travel"}</h1>
          <p>${ka ? "PerDM ხელოვნური ინტელექტით, გეოლოკაციით და შიდა კანონმდებლობის წესებით ამარტივებს მივლინებას, აოპტიმიზებს მარშრუტებსა და ხარჯებს, ავტომატურად ამზადებს ანგარიშებს და აკავშირებს კომპანიებს, თანამშრომლებსა და სამივლინებო სერვისის მიმწოდებლებს." : "PerDM uses AI, geolocation, and local travel rules to simplify business trips, optimize routes and costs, automate reports, and connect companies, employees, and travel service providers."}</p>
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
            ${mini(ka ? "AI რეკომენდაცია" : "AI recommendation", ka ? "მარშრუტი + ბიუჯეტი" : "Route + budget")}
            ${mini(ka ? "ლოკაცია" : "Location", `${state.distanceKm} km`)}
            ${mini(ka ? "ბანკის ბარათები" : "Bank cards", "TBC / BOG")}
            ${mini(ka ? "კანონის შემოწმება" : "Legal check", ka ? "30კმ წესი" : "30 km rule")}
          </div>
          <div class="preview-table">
            ${previewRow(ka ? "AI ასისტენტი" : "AI assistant", ka ? "არჩევს ოპტიმალურ მარშრუტს, ბიუჯეტს და წესებს" : "Suggests route, budget, and relevant rules", ka ? "რეკომენდაცია" : "Recommendation", ka ? "მზადაა" : "Ready")}
            ${previewRow("Nino Beridze", ka ? "ლოკაცია და ბარათი თანამშრომლის აპში" : "Location and card in employee app", "250 GEL left", state.cardFrozen ? (ka ? "გაყინულია" : "Frozen") : (ka ? "აქტიური" : "Active"))}
            ${previewRow(ka ? "მივლინების ფორმა" : "Mission form", ka ? "ლინკით ივსება, ხელმოწერით დასტურდება" : "Shared by link, signed and confirmed", ka ? "ლინკი" : "Link", state.missionFormSubmitted ? (ka ? "ჩაბარებულია" : "Submitted") : (ka ? "გასაგზავნია" : "Pending"))}
            ${previewRow(ka ? "პარტნიორი სერვისი" : "Travel service partner", ka ? "სასტუმრო, საწვავი, კვება და შეთავაზებები" : "Hotels, fuel, meals, and offers", ka ? "ქსელი" : "Network", ka ? "აქტიური" : "Active")}
          </div>
        </div>
      </section>
      <section class="band"><div class="section">
        <h2>${ka ? "ერთი ეკოსისტემა კომპანიისთვის, თანამშრომლისთვის და სერვისის მიმწოდებლისთვის" : "One ecosystem for companies, employees, and service providers"}</h2>
        <p class="section-lead">${ka ? "კომპანია გეგმავს და აკონტროლებს მივლინებებს, თანამშრომელი იღებს აპში ლოკაციას, ბარათს, ფორმას და გაფრთხილებებს, პარტნიორი ბიზნესები კი ქმნიან შეთავაზებებს PerDM მომხმარებლებისთვის." : "Companies plan and control trips, employees get location, card, forms, and alerts in their app, and travel service providers create offers for PerDM users."}</p>
        <div class="grid-3">
          ${card(1, ka ? "კომპანია რეგისტრირდება" : "Company registers", ka ? "დამსაქმებელი ქმნის perDM-ის კომპანიის ანგარიშს და ამატებს თანამშრომლებს." : "The employer creates a perDM company account and sets basic accounting rules.")}
          ${card(2, ka ? "AI გეგმავს მარშრუტს და ხარჯს" : "AI plans route and cost", ka ? "სისტემა ითვლის ლოკაციას, მანძილს, სავარაუდო ხარჯს და შესაბამის წესებს." : "The system reads location, distance, estimated cost, and relevant policy rules.")}
          ${card(3, ka ? "თანამშრომელი იღებს ლინკს და აბამს ბარათს" : "Employees receive login and link cards", ka ? "თანამშრომელი ავსებს ფორმას, აბამს თავის არსებულ საბანკო ბარათს და ტვირთავს ქვითრებს." : "Employees complete the form, connect their existing bank card, and upload receipts.")}
          ${card(4, ka ? "გეოლოკაცია ააქტიურებს მივლინებას" : "Geolocation activates the trip", ka ? "თუ თანამშრომელი ოფისიდან 12კმ-ზე მეტ მანძილზეა, სისტემა აჩვენებს აქტიურ მივლინებას." : "If the employee is more than 12 km from the office, the trip becomes active in the interface.")}
          ${card(5, ka ? "პარტნიორები ქმნიან შეთავაზებებს" : "Partners create offers", ka ? "სასტუმროები, საწვავი და კვების ობიექტები ქმნიან ფასდაკლებებს PerDM-ში მიბმული ბარათებით გადახდაზე." : "Hotels, fuel stations, and restaurants can create discounts for PerDM users paying with linked cards.")}
          ${card(6, ka ? "ქეშბექი და ბონუსი" : "Cashback and bonus tracking", ka ? "თანამშრომელი ხედავს მიღებულ ქეშბექს, კომპანია კი ჯამურ დაზოგვას." : "Employees see earned cashback, while the company sees total savings.")}
          ${card(7, ka ? "კანონთან შესაბამისობა" : "Legal rule checks", ka ? "სისტემა ითვლის მანძილს მუდმივი სამუშაო ადგილიდან და აჩვენებს 30კმ წესს, დღიურ ნორმას და დოკუმენტაციის სტატუსს." : "The system calculates distance from the permanent workplace and shows 30 km rules, daily allowance, and documentation status.")}
          ${card(8, ka ? "ავტომატური ანგარიშგება" : "Automated reporting", ka ? "მივლინების დასრულებისას ანგარიში გენერირდება ფორმებით, ქვითრებით, ბარათის მოძრაობით და კანონის შემოწმებით." : "At trip completion, reports are generated with forms, receipts, card activity, and compliance checks.")}
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
        <h2>${ka ? "მივლინება დღეს ბევრ სისტემაში იფანტება" : "Business travel is still split across too many systems"}</h2>
        <p class="section-lead">${ka ? "ლოკაცია, მარშრუტი, კანონით განსაზღვრული წესები, ბარათები, ქვითრები, პარტნიორი სერვისები და ანგარიშგება ხშირად ცალ-ცალკეა. PerDM ამ პროცესს ერთ სამუშაო სივრცეში აერთიანებს." : "Location, routes, legal rules, cards, receipts, service providers, and reporting often live apart. PerDM brings the full travel workflow into one workspace."}</p>
        <div class="grid-3">
          ${(ka ? ["მარშრუტი და ხარჯი წინასწარ არ ითვლება", "კანონის წესები ხელით მოწმდება", "ქვითრები და ბარათები ცალკეა", "თანამშრომელი გვიან იგებს ლიმიტებს", "ბუღალტერი ბევრ ფაილს აერთიანებს", "პარტნიორი სერვისები პროცესს გარეთ რჩება"] : ["Routes and costs are not planned upfront", "Legal rules are checked manually", "Receipts and cards are separate", "Employees learn limits too late", "Finance reconciles too many files", "Service providers stay outside the workflow"]).map((x, i) => card(i + 1, x, ka ? "PerDM ამ ყველაფერს AI-ით, ლოკაციით, საბანკო ბარათების სინქით და ავტომატური ანგარიშგებით აერთიანებს." : "PerDM combines this with AI, location, bank-card sync, and automated reporting.")).join("")}
        </div>
      </section>
      <section class="band"><div class="section" id="workflow">
        <h2>${ka ? "PerDM მივლინებას გეგმავს, აკონტროლებს და ანგარიშად აქცევს" : "PerDM plans, controls, and reports each business trip"}</h2>
        <p class="section-lead">${ka ? "კომპანია ქმნის მივლინებას, AI ეხმარება მარშრუტისა და ხარჯის ოპტიმიზაციაში, გეოლოკაცია ააქტიურებს სტატუსს, არსებული ბანკების ბარათები სინქდება, ხოლო სისტემა ბოლოს ანგარიშს ავტომატურად ამზადებს." : "The company creates a trip, AI helps optimize route and cost, geolocation activates status, existing bank cards sync transactions, and the system automatically prepares the final report."}</p>
        <div class="grid-5">${(ka ? ["მივლინების შექმნა", "AI მარშრუტი და ხარჯი", "გეოლოკაცია და კანონის წესი", "ბანკის ბარათები და ქვითრები", "ავტომატური ანგარიში"] : ["Create trip", "AI route and cost", "Geolocation and legal rules", "Bank cards and receipts", "Automated report"]).map((x, i) => step(i + 1, x)).join("")}</div>
      </div></section>
      <section class="section" id="benefits">
        <h2>${ka ? "სარგებელი სამივე მხარისთვის" : "Value for all three sides"}</h2>
        <div class="grid-3">
          ${(ka ? ["კომპანია ამცირებს ქაოსს და ხარჯს", "თანამშრომელი ხედავს ბიუჯეტს, ლიმიტს და ლოკაციის სტატუსს", "ბუღალტერი იღებს მზად ანგარიშს", "პარტნიორი ბიზნესი პოულობს სამივლინებო კლიენტებს", "AI ამცირებს არასწორ ხარჯვას", "კანონის წესები ჩანს პროცესში"] : ["Companies reduce operational chaos and cost", "Employees see budget, limits, and location status", "Finance receives ready reports", "Partners reach business travel customers", "AI reduces inefficient spending", "Legal rules are visible in the workflow"]).map((x, i) => card(i + 1, x, ka ? "PerDM ქმნის მოქნილ და კონტროლირებად მივლინების გამოცდილებას." : "PerDM creates a flexible and controlled business travel experience.")).join("")}
        </div>
      </section>
      <section class="section future-strip">
        <h2>${ka ? "პლატფორმის ძირითადი მოდულები" : "Core platform modules"}</h2>
        <p class="section-lead">${ka ? "AI ასისტენტი, გეოლოკაცია, საქართველოს კანონმდებლობის წესები, არსებული საბანკო ბარათების მიბმა, პარტნიორი შეთავაზებები, ქვითრები და ავტომატური ანგარიშგება ერთიან პროდუქტად იკვრება." : "AI assistant, geolocation, Georgian legal rules, existing bank-card linking, partner offers, receipts, and automated reports come together as one product."}</p>
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
  return `<article class="step"><div class="icon">${icon}</div><h3>${title}</h3><p>${isKa() ? "მივლინების ყველა ნაწილი შექმნიდან ანგარიშამდე ერთმანეთთან დაკავშირებულია." : "Everything related to the trip stays connected from creation to report export."}</p></article>`;
}

function demo() {
  const ka = isKa();
  return `<div class="page">${topNav()}<section class="section">
    <div class="title-row"><div><h1>perDM demo</h1><p>${ka ? "აირჩიე რომელი ხედვა გინდა აჩვენო: კომპანიის თუ თანამშრომლის." : "Choose the perspective you want to show: what the company sees, or what the employee sees."}</p></div></div>
    <div class="grid-2 demo-choice-grid">
      ${demoCard(ka ? "კომპანიის ხედვა" : "Company view", ka ? "კომპანია ხედავს თანამშრომლებს, მივლინების ფორმებს, ბიუჯეტებს, ხარჯებს, ქვითრებს და ანგარიშებს." : "The company sees all employees, trips, budgets, card and cash expenses, missing receipts, approvals, and export-ready reports.", "#/dashboard", ka ? "კომპანიის დემო" : "Open company demo")}
      ${demoCard(ka ? "თანამშრომლის ხედვა" : "Employee view", ka ? "თანამშრომელი ხედავს საკუთარ მივლინებას, ფორმას, ბიუჯეტს, ხარჯებს, ასატვირთ ქვითრებს და დადასტურების სტატუსს." : "The employee sees only their assigned trip, remaining budget, personal expenses, missing receipt tasks, and report submission status.", "#/employee", ka ? "თანამშრომლის დემო" : "Open employee demo")}
      ${demoCard(ka ? "პარტნიორი ბიზნესის ხედვა" : "Partner business view", ka ? "პარტნიორი ქმნის შეთავაზებებს PerDM მომხმარებლებისთვის და ხედავს მიბმული საბანკო ბარათებით შესრულებულ ტრანზაქციებს." : "The partner creates offers for PerDM users and sees transactions made with linked bank cards.", "#/partner", ka ? "პარტნიორის დემო" : "Open partner demo")}
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
        <div>
          <h4>${ka ? "პარტნიორი ბიზნესი" : "Partner business"}</h4>
          <p class="section-lead">${ka ? "ქმნის ფასდაკლებებს, ხედავს დღიურ/თვიურ ტრანზაქციებს და გადახდის სტატუსს." : "Creates discounts, sees daily/monthly transactions, and tracks payment status."}</p>
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
        ${portalCard(ka ? "პარტნიორი ბიზნესი" : "Partner Business", ka ? "ქმნის შეთავაზებებს, ხედავს perDM ტრანზაქციებს და გადახდის სტატუსს." : "Create offers, view perDM transactions, and track payout status.", "#/partner", ka ? "პარტნიორის პანელი" : "Open partner dashboard")}
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
            ${field(ka ? "მუდმივი სამუშაო ადგილის მისამართი" : "Permanent workplace address", company.workplace)}
            ${field(ka ? "სამუშაო ადგილის GPS კოორდინატები" : "Workplace GPS coordinates", company.workplaceCoords)}
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
  ["ai", "AI Assistant", "#/dashboard/ai"],
  ["missionForms", "Mission Forms", "#/dashboard/mission-forms"],
  ["payments", "Linked Cards", "#/dashboard/payments"],
  ["policies", "Travel Policies", "#/dashboard/policies"],
  ["legal", "Legal Rules", "#/dashboard/legal"],
  ["locations", "Live Location", "#/dashboard/locations"],
  ["budgets", "Budgets", "#/dashboard/budgets"],
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
  const map = { Overview: "⌂", "AI Assistant": "✦", "Mission Forms": "✎", "Linked Cards": "◈", "Travel Policies": "◇", "Legal Rules": "§", "Live Location": "⌖", Budgets: "▣", "Business Trips": "▤", Employees: "◎", Expenses: "≡", Receipts: "□", Reports: "↧", Settings: "⚙", "Future Modules": "+" };
  return map[label] || "•";
}

function dashboard() {
  const t = nino();
  return shell("overview", `${title(isKa() ? "მიმოხილვა" : "Overview", isKa() ? "მივლინების ფორმები, ხარჯები და ანგარიშები ერთ სივრცეშია." : "Everything related to a business trip is collected in one place.", `<button class="btn primary" onclick="setRoute('#/dashboard/mission-forms')">${isKa() ? "მივლინების ფორმები" : "Mission forms"}</button>`)}
    <div class="stats">
      ${stat(isKa() ? "მივლინების ფორმები" : "Mission forms", state.missionFormSubmitted ? "1" : "0", state.missionFormSubmitted ? (isKa() ? "დადასტურებული" : "Confirmed") : (isKa() ? "ელოდება შევსებას" : "Waiting for employee"))}
      ${stat(isKa() ? "ლოკაცია" : "Location", state.locationShared ? (isKa() ? "გაზიარებულია" : "Shared") : (isKa() ? "გამორთულია" : "Off"), `${state.distanceKm} km`)}
      ${stat(isKa() ? "მიბმული ბარათები" : "Linked cards", "3", "TBC / BOG / Liberty")}
      ${stat(isKa() ? "ბარათის სინქი" : "Card sync", state.cardFrozen ? (isKa() ? "შეჩერებულია" : "Paused") : (isKa() ? "აქტიურია" : "Active"), state.cardFrozen ? (isKa() ? "1 კავშირი გაჩერებულია" : "1 link paused") : (isKa() ? "ყველა კავშირი აქტიურია" : "All links active"))}
      ${stat("Active business trips", "4", "2 end this week")}
      ${stat("Completed trips waiting for report", "3", "Nino needs review")}
      ${stat("Expenses this month", money(8420), "Card and cash combined")}
    </div>
    <div class="dash-grid">
      <section class="panel"><h3>${isKa() ? "ყურადღებას საჭიროებს" : "Items requiring attention"}</h3>${attention("Nino Beridze", isKa() ? "მივლინების ფორმა" : "Mission form", state.missionFormSubmitted ? (isKa() ? "დადასტურებულია" : "Confirmed") : (isKa() ? "გასაგზავნია / შესავსებია" : "Pending employee confirmation"), "#/dashboard/mission-forms")}${attention("Nino Beridze", "Batumi business trip", `${t.missing} missing receipts`, "#/dashboard/trips/nino-batumi")}${attention("Giorgi Kapanadze", "Kutaisi field visit", "Ready for export", "#/dashboard/trips")}</section>
      <section class="panel"><h3>Expenses by category</h3><div class="donut"></div><p class="section-lead">Hotel, meals, fuel, transport, and other expenses grouped for finance review.</p></section>
    </div>
    <section class="panel" style="margin-top:16px"><h3>Monthly business trip expenses</h3><div class="bar-chart">${[38, 54, 42, 71, 63, 84].map((h, i) => `<div class="bar" style="height:${h}%"><span>${["Jan","Feb","Mar","Apr","May","Jun"][i]}</span></div>`).join("")}</div></section>`);
}

function aiAssistantPage() {
  const ka = isKa();
  const answer = ka
    ? "ნინო ბერიძის Batumi მივლინება კომპანიის 12კმ წესით აქტიურია, რადგან ოფისიდან 18.4კმ-ზეა. საქართველოს 30კმ დღიური ნორმა ამ მაგალითში ჯერ არ ირთვება, ამიტომ სისტემამ უნდა აჩვენოს მგზავრობის ხარჯის დოკუმენტირება, ქვითრების მოთხოვნა და ბარათის დღიური ლიმიტის კონტროლი. რეკომენდაცია: მარშრუტი დარჩეს მიმდინარე გზაზე, hotel/meal/fuel კატეგორიები დარჩეს ნებადართული, ხოლო 35 GEL ტაქსის ქვითარი მოითხოვოს ანგარიშის გენერაციამდე."
    : "Nino Beridze's Batumi trip is active under the company 12 km rule because she is 18.4 km from the office. The Georgian 30 km daily allowance rule is not triggered yet in this example, so the system should document travel cost, request receipts, and monitor the card daily limit. Recommendation: keep the current route, allow hotel/meal/fuel categories, and request the 35 GEL taxi receipt before report generation.";
  return shell("ai", `${title(ka ? "PerDM AI ასისტენტი" : "PerDM AI assistant", ka ? "ChatGPT API-ზე დაფუძნებული ასისტენტი ეხმარება კომპანიას მივლინების წესების, მარშრუტის, ხარჯების და ანგარიშის ტექსტის მომზადებაში." : "A ChatGPT API-powered assistant helps the company reason through travel rules, route choices, expenses, and report text.", `<button class="btn primary" onclick="state.aiAnswered=true;render()">${ka ? "AI პასუხის გენერაცია" : "Generate AI answer"}</button>`)}
    <div class="dash-grid">
      <section class="panel">
        <h3>${ka ? "კითხვა ასისტენტს" : "Ask the assistant"}</h3>
        <div class="field wide">
          <label>${ka ? "კომპანიის შეკითხვა" : "Company prompt"}</label>
          <textarea>${ka ? "შეამოწმე ნინოს მივლინება: 18.4კმ ოფისიდან, ბიუჯეტი 3,000 GEL, ქვითრები 18/20, ტაქსის ქვითარი აკლია. მითხარი რომელი წესები ირთვება და რა უნდა გავაკეთო ანგარიშამდე." : "Check Nino's trip: 18.4 km from office, 3,000 GEL budget, receipts 18/20, taxi receipt missing. Tell me which rules apply and what to do before reporting."}</textarea>
        </div>
        <div class="action-row">
          <button class="btn primary" onclick="state.aiAnswered=true;render()">${ka ? "პასუხის მიღება" : "Get answer"}</button>
          <button class="btn" onclick="setRoute('#/dashboard/legal')">${ka ? "კანონის წესების ნახვა" : "View legal rules"}</button>
        </div>
      </section>
      <section class="panel">
        <h3>${ka ? "AI პასუხი" : "AI response"}</h3>
        <div class="ai-response">
          <strong>${ka ? "PerDM AI" : "PerDM AI"}</strong>
          <p>${state.aiAnswered ? answer : (ka ? "დააჭირე “პასუხის მიღება”-ს, რომ prototype-ში გენერირებული რეკომენდაცია გამოჩნდეს." : "Click “Get answer” to show the generated recommendation in this prototype.")}</p>
        </div>
        ${state.aiAnswered ? `<div class="grid-3 ai-cards">
          ${stat(ka ? "წესი" : "Rule", "12 km", ka ? "მივლინება აქტიურია" : "Trip active")}
          ${stat(ka ? "კანონი" : "Legal", "30 km", ka ? "ჯერ არ ირთვება" : "Not triggered yet")}
          ${stat(ka ? "ქვითარი" : "Receipt", "1 missing", ka ? "ანგარიშამდე საჭიროა" : "Needed before report")}
        </div>` : ""}
      </section>
    </div>
    <section class="panel" style="margin-top:16px">
      <h3>${ka ? "რეალური API ინტეგრაციის არქიტექტურა" : "Real API integration architecture"}</h3>
      <div class="grid-4">
        ${card(1, ka ? "Frontend" : "Frontend", ka ? "მომხმარებელი წერს კითხვას PerDM-ში." : "User writes a prompt inside PerDM.")}
        ${card(2, ka ? "Backend" : "Backend", ka ? "სერვერი ინახავს OpenAI API key-ს უსაფრთხოდ." : "Server securely stores the OpenAI API key.")}
        ${card(3, ka ? "OpenAI API" : "OpenAI API", ka ? "აგენერირებს რეკომენდაციას კონტექსტით." : "Generates an answer using trip context.")}
        ${card(4, ka ? "PerDM პასუხი" : "PerDM output", ka ? "აჩვენებს წესებს, რისკებს, ხარჯებს და ანგარიშის ტექსტს." : "Shows rules, risks, costs, and report text.")}
      </div>
      <p class="section-lead">${ka ? "მნიშვნელოვანი: API key არ უნდა ჩაიწეროს GitHub Pages-ის JavaScript-ში. რეალურ ვერსიაში საჭიროა backend ან serverless endpoint." : "Important: the API key must not be placed in GitHub Pages JavaScript. The real version needs a backend or serverless endpoint."}</p>
    </section>`);
}

function missionFormsPage() {
  return shell("missionForms", `${title(isKa() ? "მივლინების ფორმები" : "Mission forms", isKa() ? "დამსაქმებელი ხედავს თანამშრომლის მიერ ლინკით შევსებულ და ხელმოწერით დადასტურებულ ფორმებს." : "The employer sees business trip forms submitted and signed by employees through a shared link.", `<button class="btn primary" onclick="setRoute('#/mission-form')">${isKa() ? "თანამშრომლის ლინკის გახსნა" : "Open employee link"}</button>`)}
    <section class="panel form-share-panel">
      <div>
        <h3>${isKa() ? "გასაზიარებელი ლინკი თანამშრომლისთვის" : "Shareable employee form link"}</h3>
        <p class="section-lead">${isKa() ? "ეს ლინკი ეგზავნება თანამშრომელს. თანამშრომელი ავსებს, ხელს აწერს და ადასტურებს." : "Send this link to the employee. They fill it, sign it, and confirm the form."}</p>
      </div>
      <div class="share-box">https://perdm.ge/#/mission-form</div>
    </section>
    <section class="panel table-wrap" style="margin-top:16px">
      <table><thead><tr><th>${isKa() ? "თანამშრომელი" : "Employee"}</th><th>${isKa() ? "ფორმა" : "Form"}</th><th>${isKa() ? "დანიშნულება" : "Destination"}</th><th>${isKa() ? "სტატუსი" : "Status"}</th><th>${isKa() ? "ხელმოწერა" : "Signature"}</th><th>${isKa() ? "ქმედება" : "Action"}</th></tr></thead><tbody>
        <tr><td><strong>ნინო ბერიძე</strong><small class="table-sub">nino@demo-company.ge</small></td><td>${isKa() ? "მივლინების ფორმა" : "Business trip form"}</td><td>Batumi</td><td>${badge(state.missionFormSubmitted ? (isKa() ? "დადასტურებულია" : "Confirmed") : (isKa() ? "ელოდება თანამშრომელს" : "Waiting for employee"))}</td><td>${state.missionFormSubmitted ? "Nino Beridze" : "-"}</td><td><button class="btn small" onclick="setRoute('#/mission-form')">${isKa() ? "ფორმის ნახვა" : "View form"}</button></td></tr>
      </tbody></table>
    </section>
    ${state.missionFormSubmitted ? missionFormPreview() : `<section class="empty" style="margin-top:16px">${isKa() ? "ფორმა ჯერ არ არის დადასტურებული. თანამშრომლის დადასტურების შემდეგ აქ გამოჩნდება შევსებული ვერსია." : "The form is not confirmed yet. Once the employee submits it, the completed version appears here."}</section>`}`);
}

function paymentsPage() {
  const ka = isKa();
  const simulated = state.paymentSimulated ? [["June 29", "Pharmacy", "Other", 28, "Pending review"]] : [];
  const rows = [...cardTransactions, ...simulated];
  return shell("payments", `${title(ka ? "ბანკის ბარათების მიბმა" : "Linked bank cards", ka ? "PerDM არ ინახავს ფულს და არ უშვებს საკუთარ ბარათს. კომპანია და თანამშრომელი აბამენ უკვე არსებულ ქართულ საბანკო ბარათებს, სისტემა კი კითხულობს ტრანზაქციებს, აკონტროლებს ლიმიტებს და ამზადებს ანგარიშებს." : "PerDM does not hold money or issue its own card. Companies and employees connect existing Georgian bank cards, while the system reads transactions, checks limits, and prepares reports.", `<button class="btn primary" onclick="state.bankLinked=true;render()">${ka ? "ბარათის მიბმა" : "Connect card"}</button>`)}
    <div class="stats">
      ${stat(ka ? "მიბმული ბარათები" : "Linked cards", state.bankLinked ? "3" : "0", "TBC / BOG / Liberty")}
      ${stat(ka ? "თვიური ხარჯი" : "Monthly spend", money(8420), ka ? "სინქრონიზებული ტრანზაქციები" : "Synced transactions")}
      ${stat(ka ? "კომპანიის ლიმიტი" : "Company policy limit", "500 GEL", ka ? "დღიური კონტროლი" : "Daily control")}
      ${stat(ka ? "ქვითრები" : "Receipts", "18/20", ka ? "ტრანზაქციებზე მიბმული" : "Linked to transactions")}
    </div>
    <div class="dash-grid">
      <section class="panel">
        <h3>${ka ? "მიბმული ბანკები და ბარათები" : "Linked banks and cards"}</h3>
        <p class="section-lead">${ka ? "რეალურ პროდუქტში აქ იქნება ბანკის/Open Banking/გადახდის პროვაიდერის უსაფრთხო ავტორიზაცია. PerDM ინახავს მხოლოდ token-ს და არა სრულ ბარათის მონაცემებს." : "In the real product this uses secure bank/Open Banking/payment-provider authorization. PerDM stores only a token, not full card data."}</p>
        <div class="bank-source-list">
          ${bankSources.map((source) => bankSource(source, ka)).join("")}
        </div>
        <div class="action-row">
          <button class="btn primary" onclick="state.bankLinked=true;render()">${ka ? "TBC-ის მიბმა" : "Connect TBC"}</button>
          <button class="btn" onclick="state.bankLinked=true;render()">${ka ? "საქართველოს ბანკის მიბმა" : "Connect BOG"}</button>
          <button class="btn" onclick="state.bankLinked=true;render()">${ka ? "Liberty-ის მიბმა" : "Connect Liberty"}</button>
        </div>
      </section>
      <section class="panel">
        <h3>${ka ? "ტრანზაქციის სინქი" : "Transaction sync"}</h3>
        <div class="bank-sync-flow">
          <div><strong>${ka ? "არსებული ბანკი" : "Existing bank"}</strong><span>TBC, BOG, Liberty</span></div>
          <div><strong>${ka ? "PerDM sync" : "PerDM sync"}</strong><span>${ka ? "token + consent" : "token + consent"}</span></div>
          <div><strong>${ka ? "ანგარიშგება" : "Reporting"}</strong><span>${ka ? "ქვითრები + წესები" : "Receipts + rules"}</span></div>
        </div>
        <div class="form-grid">
          ${field(ka ? "ბარათი" : "Card", "TBC Business Visa", "select")}
          ${field(ka ? "სინქის რეჟიმი" : "Sync mode", ka ? "ტრანზაქციების წაკითხვა" : "Read transactions", "select")}
          ${field(ka ? "დანიშნულება" : "Purpose", ka ? "მივლინების ხარჯების კონტროლი" : "Business travel expense control")}
          ${field(ka ? "დადასტურება" : "Confirmation", ka ? "2FA / ბანკის თანხმობა" : "2FA / bank consent", "select")}
        </div>
      </section>
      <section class="panel">
        <h3>${ka ? "მიბმული ბარათის Preview" : "Linked card preview"}</h3>
        ${virtualCard()}
        <div class="action-row">
          <button class="btn" onclick="state.cardFrozen=!state.cardFrozen;render()">${state.cardFrozen ? (ka ? "სინქის ჩართვა" : "Resume sync") : (ka ? "სინქის შეჩერება" : "Pause sync")}</button>
          <button class="btn" onclick="state.paymentSimulated=true;render()">${ka ? "ტრანზაქციის დამატება" : "Add mock transaction"}</button>
        </div>
      </section>
      <section class="panel">
        <h3>${ka ? "ბარათის წესები და ლიმიტები" : "Card rules and limits"}</h3>
        <div class="form-grid">
          ${field(ka ? "დღიური ლიმიტი" : "Daily limit", "500 GEL")}
          ${field(ka ? "სასტუმრო" : "Hotel category", "Allowed", "select")}
          ${field(ka ? "საკვები" : "Meals category", "Allowed", "select")}
          ${field(ka ? "საწვავი" : "Fuel category", "Allowed", "select")}
          ${field(ka ? "ქვითარი სავალდებულოა ზემოთ" : "Receipt required above", "40 GEL")}
          ${field(ka ? "სინქის სტატუსი" : "Sync status", state.cardFrozen ? (ka ? "შეჩერებულია" : "Paused") : (ka ? "აქტიური" : "Active"), "select")}
        </div>
      </section>
    </div>
    <section class="panel table-wrap" style="margin-top:16px">
      <h3>${ka ? "ბარათის ტრანზაქციები" : "Card transactions"}</h3>
      ${paymentTable(rows)}
    </section>`);
}

function bankSource(source, ka) {
  return `<div class="bank-source">
    <div><strong>${source[0]}</strong><span>${source[1]} · ${source[2]}</span></div>
    <div><strong>${ka ? "სინქი" : "Sync"}</strong>${badge(ka ? (source[3] === "Connected" ? "მიბმულია" : "მზადაა") : source[3])}</div>
  </div>`;
}

function policiesPage() {
  const ka = isKa();
  return shell("policies", `${title(ka ? "სამივლინებო პოლიტიკა" : "Travel policies", ka ? "კომპანია განსაზღვრავს გეოლოკაციის, ბარათის ლიმიტების, კატეგორიების და ქვითრების წესებს." : "The company defines geolocation, card limits, categories, and receipt rules.", `<button class="btn primary">${ka ? "პოლიტიკის შენახვა" : "Save policy"}</button>`)}
    <div class="dash-grid">
      <section class="panel">
        <h3>${ka ? "გეოლოკაციის აქტივაცია" : "Geolocation activation"}</h3>
        <div class="geo-banner">
          <strong>${ka ? "მივლინება აქტიურია" : "Business trip active"}</strong>
          <span>${ka ? "თანამშრომელი ოფისიდან 18.4კმ-ზეა. კომპანიის activation ზღვარი: 12კმ. კანონის 30კმ წესი ცალკე მოწმდება." : "Employee is 18.4 km from office. Company activation threshold: 12 km. The legal 30 km rule is checked separately."}</span>
        </div>
        <div class="map-mock"><span class="route-line"></span><span class="pin office"></span><span class="pin dest"></span></div>
      </section>
      <section class="panel">
        <h3>${ka ? "წესები და ლიმიტები" : "Rules and limits"}</h3>
        <div class="form-grid">
          ${field(ka ? "მინ. მანძილი მივლინების აქტივაციისთვის" : "Minimum distance for trip activation", "12 km")}
          ${field(ka ? "კანონის 30კმ წესი" : "Legal 30 km rule", "30 km", "select")}
          ${field(ka ? "ქვეყნის შიგნით დღიური ნორმა" : "Domestic daily allowance", `${legalRules.domesticDailyAllowance} GEL`)}
          ${field(ka ? "დღიური ლიმიტი" : "Daily limit", "500 GEL")}
          ${field(ka ? "სასტუმროს ლიმიტი" : "Hotel limit", "250 GEL")}
          ${field(ka ? "საკვების ლიმიტი" : "Meals limit", "70 GEL")}
          ${field(ka ? "საწვავის ლიმიტი" : "Fuel limit", "90 GEL")}
          ${field(ka ? "ქვითარი სავალდებულოა ზემოთ" : "Receipt required above", "40 GEL")}
          ${field(ka ? "ავტორიზაციის დონეები" : "Approval roles", "Admin, Accountant, Employee", "select")}
          ${field("2FA", ka ? "ჩართული" : "Enabled", "select")}
        </div>
      </section>
    </div>`);
}

function legalRulesPage() {
  const ka = isKa();
  return shell("legal", `${title(ka ? "საქართველოს მივლინების წესები" : "Georgian travel expense rules", ka ? "ეს ეკრანი prototype-ში აჩვენებს, როგორ ითვალისწინებს perDM კანონით განსაზღვრულ მანძილს, დღიურ ნორმას და დოკუმენტაციას." : "This screen shows how perDM can reflect law-defined distance, daily allowance, and documentation rules in the prototype.")}
    <div class="stats">
      ${stat(ka ? "მუდმივი სამუშაო ადგილი" : "Permanent workplace", company.workplace, company.workplaceCoords)}
      ${stat(ka ? "ქვეყნის შიგნით დღიური ნორმა" : "Domestic daily allowance", `${legalRules.domesticDailyAllowance} GEL`, ka ? "ფაქტობრივად ყოფნის დღეებით" : "By actual trip days")}
      ${stat(ka ? "30კმ-მდე წესი" : "Under 30 km rule", "30 km", ka ? "იმავე დღეს დაბრუნებისას მხოლოდ მგზავრობა" : "Same-day return: travel costs only")}
      ${stat(ka ? "გრძელვადიანი საზღვარგარეთ" : "Long-term abroad", `${legalRules.longTermDays}+ days`, ka ? "30 დღის შემდეგ სხვა ნორმა" : "Different rate after 30 days")}
    </div>
    <div class="dash-grid">
      <section class="panel">
        <h3>${ka ? "მანძილის საფუძველზე კლასიფიკაცია" : "Distance-based classification"}</h3>
        ${legalRow(ka ? "18.4კმ ოფისიდან" : "18.4 km from office", ka ? "კომპანიის 12კმ წესით აქტიურია, მაგრამ 30კმ-მდე შემთხვევაში დღიური ნორმა არ ჩანს; დოკუმენტირდება მგზავრობის ხარჯი." : "Active by the company 12 km rule, but under the 30 km legal rule daily allowance is not shown; travel cost is documented.")}
        ${legalRow(ka ? "42კმ ოფისიდან" : "42 km from office", ka ? "ქვეყნის შიგნით მივლინებად კლასიფიცირდება და დღიური 30 GEL ნორმა შეიძლება დაითვალოს დღეების მიხედვით." : "Classifies as a domestic business trip and a 30 GEL daily allowance can be calculated by trip days.")}
        ${legalRow(ka ? "საზღვარგარეთ 30 დღეზე მეტი" : "Abroad for more than 30 days", ka ? "პირველი 30 დღე მოკლევადიანი ნორმით, შემდეგ გრძელვადიანი წესით." : "First 30 days use short-term rates, then long-term rules apply.")}
      </section>
      <section class="panel">
        <h3>${ka ? "დოკუმენტაციის შემოწმება" : "Documentation checks"}</h3>
        ${legalRow(ka ? "მგზავრობის ხარჯი" : "Travel cost", ka ? "ანაზღაურდება ფაქტობრივად გაწეული ხარჯის დამადასტურებელი საბუთით." : "Reimbursed based on actual cost with supporting documents.")}
        ${legalRow(ka ? "ბინის/სასტუმროს ხარჯი" : "Lodging cost", ka ? "დამადასტურებელი საბუთის წარმოდგენა საჭიროა." : "Supporting document is required.")}
        ${legalRow(ka ? "მივლინების ფორმა" : "Business trip form", ka ? "თანამშრომლის ხელმოწერა და დამსაქმებლის/მიმღები მხარის დადასტურებები ინახება." : "Employee signature plus employer/host confirmations are stored.")}
      </section>
    </div>
    <section class="panel" style="margin-top:16px">
      <p class="section-lead">${ka ? "შენიშვნა: ეს prototype აჩვენებს წესების სამუშაო ლოგიკას მოცემულ კანონმდებლობის ტექსტზე დაყრდნობით და არ არის იურიდიული დასკვნა." : "Note: this prototype demonstrates rule logic based on the provided legal text and is not legal advice."}</p>
    </section>`);
}

function legalRow(title, text) {
  return `<div class="legal-row"><strong>${title}</strong><p>${text}</p></div>`;
}

function locationsPage() {
  const ka = isKa();
  const overPolicy = state.distanceKm >= legalRules.companyActivationThreshold;
  const overLegal = state.distanceKm >= legalRules.domesticDistanceThreshold;
  return shell("locations", `${title(ka ? "ცოცხალი ლოკაცია და გაფრთხილებები" : "Live location and alerts", ka ? "კომპანია ხედავს თანამშრომლის გაზიარებულ ლოკაციას, მანძილს სამუშაო ადგილიდან და სისტემურ გაფრთხილებებს." : "The company sees shared employee location, distance from workplace, and system alerts.", `<button class="btn primary" onclick="state.limitAlert=true;render()">${ka ? "ლიმიტის გაფრთხილების სიმულაცია" : "Simulate limit alert"}</button>`)}
    <div class="trip-banner"><span>${state.locationShared ? (ka ? `ნინო ბერიძე ლოკაციას აზიარებს. სამუშაო ადგილიდან ${state.distanceKm}კმ.` : `Nino Beridze is sharing location. ${state.distanceKm} km from workplace.`) : (ka ? "ლოკაციის გაზიარება გამორთულია." : "Location sharing is off.")}</span>${badge(state.locationShared ? (ka ? "Live" : "Live") : (ka ? "Off" : "Off"))}</div>
    <div class="dash-grid">
      <section class="panel">
        <h3>${ka ? "ლოკაციის რუკა" : "Location map"}</h3>
        <div class="map-mock"><span class="route-line"></span><span class="pin office"></span><span class="pin dest"></span></div>
        <div class="grid-3">
          ${stat(ka ? "სამუშაო ადგილი" : "Workplace", company.workplace, company.workplaceCoords)}
          ${stat(ka ? "თანამშრომლის ლოკაცია" : "Employee location", "Batumi road checkpoint", "41.9200, 45.0010")}
          ${stat(ka ? "მანძილი" : "Distance", `${state.distanceKm} km`, ka ? "რუკის ალგორითმით" : "Route algorithm")}
        </div>
      </section>
      <section class="panel">
        <h3>${ka ? "გაფრთხილებები" : "Alerts"}</h3>
        ${alertBox(overPolicy ? (ka ? "12კმ ზღვარი გადალახულია: მივლინება აქტიურია." : "12 km threshold crossed: trip is active.") : (ka ? "12კმ ზღვარი ჯერ არ არის გადალახული." : "12 km threshold not crossed yet."), overPolicy ? "green" : "amber")}
        ${alertBox(overLegal ? (ka ? "30კმ კანონით დღიური ნორმის შემოწმება საჭიროა." : "30 km legal daily allowance check required.") : (ka ? "30კმ-მდეა: იმავე დღეს დაბრუნებისას მხოლოდ მგზავრობა." : "Under 30 km: same-day return means travel cost only."), overLegal ? "green" : "amber")}
        ${alertBox(state.limitAlert ? (ka ? "გაფრთხილება: ბარათის დღიური ლიმიტის 90% გამოყენებულია." : "Alert: 90% of daily card limit used.") : (ka ? "ბარათის ლიმიტი ნორმაშია." : "Card limit is within policy."), state.limitAlert ? "red" : "green")}
      </section>
    </div>`);
}

function alertBox(text, tone) {
  return `<div class="alert-box ${tone}">${text}</div>`;
}

function budgetsPage() {
  const ka = isKa();
  return shell("budgets", `${title(ka ? "ლიმიტები და ბიუჯეტის წესები" : "Limits and budget rules", ka ? "ორგანიზაცია ადგენს სამივლინებო ლიმიტებს. თანხა PerDM-ში არ ირიცხება; ხარჯები კონტროლდება მიბმული საბანკო ბარათებიდან." : "The organization defines travel limits. Money is not deposited into PerDM; spending is monitored from linked bank cards.", `<button class="btn primary" onclick="state.budgetDistributed=true;render()">${ka ? "ლიმიტების დამტკიცება" : "Approve limits"}</button>`)}
    <div class="stats">
      ${stat(ka ? "დამტკიცებული ლიმიტი" : "Approved limit", money(18400), ka ? "თვიური პოლიტიკა" : "Monthly policy")}
      ${stat(ka ? "აქტიური ლიმიტები" : "Active limits", state.budgetDistributed ? money(7200) : money(6400), ka ? "თანამშრომლებზე" : "By employee")}
      ${stat(ka ? "დარჩენილი კონტროლი" : "Remaining control", state.budgetDistributed ? money(11200) : money(12000), ka ? "პოლიტიკის ფარგლებში" : "Within policy")}
      ${stat(ka ? "ქეშბექი" : "Cashback", money(1260), ka ? "ამ თვეში" : "This month")}
    </div>
    <section class="panel table-wrap" style="margin-top:16px">
      <table><thead><tr><th>${ka ? "თანამშრომელი" : "Employee"}</th><th>${ka ? "დეპარტამენტი" : "Department"}</th><th>${ka ? "ლიმიტი" : "Limit"}</th><th>${ka ? "ბარათი" : "Card"}</th><th>${ka ? "დახარჯული" : "Spent"}</th><th>${ka ? "ქმედება" : "Action"}</th></tr></thead><tbody>
        ${employees.map((e, i) => `<tr><td><strong>${e[0]}</strong></td><td>${e[2]}</td><td>${money([3000, 900, 600, 1200, 700][i])}</td><td>${badge(i < 3 || state.budgetDistributed ? (ka ? "მიბმულია" : "Linked") : (ka ? "ელოდება" : "Pending"))}</td><td>${money(e[5])}</td><td><button class="btn small">${ka ? "ლიმიტი" : "Edit limit"}</button></td></tr>`).join("")}
      </tbody></table>
    </section>`);
}

function virtualCard() {
  return `<div class="virtual-card ${state.cardFrozen ? "frozen" : ""}">
    <div class="brand">${brandIcon()}<span class="brand-word">PerDM</span></div>
    <div>
      <div class="card-number">**** **** **** 4829</div>
      <div class="virtual-card-row"><span>${isKa() ? "მიბმული TBC Visa" : "Linked TBC Visa"}</span><span>${state.cardFrozen ? (isKa() ? "სინქი შეჩერებულია" : "Sync paused") : (isKa() ? "სინქი აქტიურია" : "Sync active")}</span></div>
      <div class="virtual-card-row"><span>Nino Beridze</span><span>${isKa() ? "tokenized" : "tokenized"}</span></div>
    </div>
  </div>`;
}

function paymentTable(rows) {
  return `<table><thead><tr><th>${isKa() ? "თარიღი" : "Date"}</th><th>${isKa() ? "მერჩანტი" : "Merchant"}</th><th>${isKa() ? "კატეგორია" : "Category"}</th><th>${isKa() ? "თანხა" : "Amount"}</th><th>${isKa() ? "სტატუსი" : "Status"}</th></tr></thead><tbody>
    ${rows.map((r) => `<tr><td>${r[0]}</td><td><strong>${r[1]}</strong></td><td>${r[2]}</td><td>${money(r[3])}</td><td>${badge(r[4])}</td></tr>`).join("")}
  </tbody></table>`;
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
  const ka = isKa();
  return shell("future", `${title(ka ? "სტრატეგიული მოდულები" : "Strategic modules", ka ? "ეს არის PerDM-ის მთავარი პროდუქტის ბირთვი: AI, გეოლოკაცია, კანონმდებლობა, საბანკო ბარათების მიბმა, პარტნიორები და ანგარიშგება." : "This is the core product vision for PerDM: AI, geolocation, legal rules, bank-card linking, partners, and reporting.")}
    <div class="grid-3">
      ${card(1, ka ? "AI ასისტენტი" : "AI assistant", ka ? "მარშრუტის, ხარჯის, ლიმიტის და დოკუმენტების რეკომენდაციები." : "Route, cost, limit, and document recommendations.")}
      ${card(2, ka ? "გეოლოკაცია" : "Geolocation", ka ? "სამუშაო ადგილიდან მანძილი, 12კმ აქტივაცია და 30კმ კანონის შემოწმება." : "Distance from workplace, 12 km activation, and 30 km legal checks.")}
      ${card(3, ka ? "არსებული ბანკების ბარათები" : "Existing bank cards", ka ? "TBC, საქართველოს ბანკის, Liberty-ის და სხვა ბარათების მიბმა tokenized კავშირით." : "Tokenized linking for TBC, Bank of Georgia, Liberty, and other existing cards.")}
      ${card(4, ka ? "პარტნიორი შეთავაზებები" : "Partner offers", ka ? "სასტუმრო, საწვავი, კვება, cashback და სამივლინებო სერვისები." : "Hotels, fuel, meals, cashback, and travel services.")}
      ${card(5, ka ? "ავტომატური ანგარიშგება" : "Automated reporting", ka ? "ფორმები, ქვითრები, ტრანზაქციები და საგადასახადო ფორმატები." : "Forms, receipts, transactions, and tax-ready formats.")}
    </div>`);
}

const employeeLinks = [
  ["overview", "My Overview", "#/employee"],
  ["missionForm", "Mission Form", "#/mission-form"],
  ["card", "My Card", "#/employee/card"],
  ["trip", "My Trip", "#/employee/trip"],
  ["expenses", "My Expenses", "#/employee/expenses"],
  ["receipts", "Upload Receipts", "#/employee/receipts"],
  ["offers", "Offers & Cashback", "#/employee/offers"],
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
    card: employeeCard,
    trip: employeeTrip,
    expenses: employeeExpenses,
    receipts: employeeReceipts,
    offers: employeeOffers,
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
      ${stat(isKa() ? "მიბმული ბარათი" : "Linked card", state.employeeBankLinked ? "TBC Visa" : (isKa() ? "საჭიროა მიბმა" : "To connect"), state.employeeBankLinked ? (isKa() ? "სინქი აქტიურია" : "Sync active") : (isKa() ? "დააკავშირე ბარათი" : "Connect card"))}
      ${stat("Spent", money(t.total), "Card + cash")}
      ${stat("Remaining", money(t.budget - t.total), "Available budget")}
      ${stat("Receipts to upload", String(t.missing), "Required before report")}
      ${stat("Pending review", String(t.pending), "Finance will approve")}
    </div>
    <div class="dash-grid">
      <section class="panel">
        <h3>${isKa() ? "შენი დავალებები" : "What you need to do"}</h3>
        ${attention(isKa() ? "მივლინების ფორმის შევსება" : "Complete mission form", isKa() ? "ფორმა უნდა შეივსოს და დადასტურდეს ხელმოწერით" : "Fill and confirm the form with signature", state.missionFormSubmitted ? (isKa() ? "შესრულებულია" : "Done") : (isKa() ? "სავალდებულო" : "Required"), "#/mission-form")}
        ${attention(isKa() ? "ბარათის მიბმა" : "Connect card", isKa() ? "TBC/საქართველოს ბანკის არსებული ბარათი" : "Existing TBC/Bank of Georgia card", state.employeeBankLinked ? (isKa() ? "მიბმულია" : "Connected") : (isKa() ? "სავალდებულო" : "Required"), "#/employee/card")}
        ${attention("Upload missing receipt", "Taxi - 35 GEL, June 3", state.receiptAttached ? "Done" : "Needs receipt", "#/employee/receipts")}
        ${attention("Check expense list", "Confirm card and cash payments are correct", "Open", "#/employee/expenses")}
        ${attention("Submit trip report", "Send completed trip file to finance", "Pending", "#/employee/report")}
      </section>
      <section class="panel">
        <h3>Employee view</h3>
        <p class="section-lead">${isKa() ? "თანამშრომელი ვერ ხედავს კომპანიის მთლიან მონაცემებს. ხედავს მხოლოდ საკუთარ ფორმას, ბიუჯეტს, ხარჯებს და ასატვირთ დოკუმენტებს." : "The employee does not see company-wide data. They only see their own budget, trip, expenses, missing documents, and report submission status."}</p>
        <button class="btn primary" onclick="setRoute('#/mission-form')">${isKa() ? "მივლინების ფორმის შევსება" : "Complete mission form"}</button>
        <button class="btn" onclick="setRoute('#/employee/card')">${isKa() ? "ბარათის ნახვა" : "View card"}</button>
      </section>
    </div>`;
}

function employeeCard() {
  const ka = isKa();
  const rows = [...cardTransactions, ...(state.paymentSimulated ? [["June 29", "Pharmacy", "Other", 28, "Pending review"]] : [])];
  return `${title(ka ? "ჩემი მიბმული საბანკო ბარათი" : "My linked bank card", ka ? "თანამშრომელი აბამს საკუთარ TBC/საქართველოს ბანკის/Liberty ბარათს tokenized კავშირით. PerDM არ ინახავს ფულს და არ უშვებს ბარათს." : "The employee connects their own TBC/Bank of Georgia/Liberty card through a tokenized link. PerDM does not hold money or issue cards.")}
    <div class="dash-grid">
      <section class="panel">
        ${virtualCard()}
        <div class="stats mini-stats">
          ${stat(ka ? "დამტკიცებული ლიმიტი" : "Approved limit", money(3000), ka ? "კომპანიის წესით" : "Company policy")}
          ${stat(ka ? "დახარჯულია" : "Spent", money(nino().total + (state.paymentSimulated ? 28 : 0)), ka ? "მიბმული ბარათიდან" : "From linked card")}
        </div>
        <div class="action-row">
          <button class="btn primary" onclick="state.paymentSimulated=true;render()">${ka ? "ტრანზაქციის სიმულაცია" : "Simulate transaction"}</button>
        </div>
      </section>
      <section class="panel">
        <h3>${ka ? "თანამშრომლის პირადი ბარათის მიბმა" : "Connect employee personal card"}</h3>
        <p class="section-lead">${ka ? "პირადი ბარათი შეიძლება გამოიყენოს ანაზღაურებადი ხარჯებისთვის, backup გადახდისთვის ან cashback/შეთავაზებების მისაღებად. სრული ბარათის მონაცემები PerDM-ში არ ინახება." : "A personal card can be used for reimbursable expenses, backup payment, or cashback/offers. Full card details are not stored in PerDM."}</p>
        <div class="bank-source-list">
          <div class="bank-source">
            <div><strong>${ka ? "პირადი TBC Visa" : "Personal TBC Visa"}</strong><span>**** 9182 · ${ka ? "თანამშრომლის ბარათი" : "Employee-owned card"}</span></div>
            <div><strong>${state.employeeBankLinked ? (ka ? "მიბმულია" : "Connected") : (ka ? "არ არის მიბმული" : "Not connected")}</strong>${badge(state.employeeBankLinked ? (ka ? "აქტიური" : "Active") : (ka ? "სურვილისამებრ" : "Optional"))}</div>
          </div>
        </div>
        <div class="form-grid">
          ${field(ka ? "ბანკი" : "Bank", "TBC Bank", "select")}
          ${field(ka ? "ბარათის ტიპი" : "Card type", "Visa / Mastercard", "select")}
          ${field(ka ? "გამოყენება" : "Use case", ka ? "backup / ანაზღაურება" : "Backup / reimbursement", "select")}
          ${field(ka ? "დადასტურება" : "Confirmation", ka ? "3DS / ბანკის თანხმობა" : "3DS / bank consent", "select")}
        </div>
        <div class="action-row">
          <button class="btn primary" onclick="state.employeeBankLinked=true;render()">${ka ? "ჩემი ბარათის მიბმა" : "Connect my card"}</button>
          <button class="btn" onclick="setRoute('#/employee/receipts')">${ka ? "ქვითრის მიბმა" : "Attach receipt"}</button>
        </div>
      </section>
      <section class="panel">
        <h3>${ka ? "რა შეუძლია თანამშრომელს" : "Employee card actions"}</h3>
        <p class="section-lead">${ka ? "თანამშრომელს შეუძლია ბალანსის ნახვა, ტრანზაქციების შემოწმება, ქვითრის მიბმა, საკუთარი ბარათის დაკავშირება და ლიმიტების გაფრთხილების მიღება." : "The employee can view balance, check transactions, attach receipts, connect a personal card, and receive limit alerts."}</p>
        <button class="btn" onclick="setRoute('#/employee/receipts')">${ka ? "ქვითრის მიბმა" : "Attach receipt"}</button>
      </section>
    </div>
    <section class="panel table-wrap" style="margin-top:16px"><h3>${ka ? "ჩემი ტრანზაქციები" : "My transactions"}</h3>${paymentTable(rows)}</section>`;
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
  const ka = isKa();
  const overPolicy = state.distanceKm >= legalRules.companyActivationThreshold;
  const overLegal = state.distanceKm >= legalRules.domesticDistanceThreshold;
  return `${title(ka ? "ჩემი Batumi მივლინება" : "My Batumi trip", ka ? "მივლინების სტატუსი გეოლოკაციაზე დაყრდნობით ავტომატურად აქტიურდება." : "Trip status is automatically activated based on geolocation.")}
    <section class="panel trip-hero">
      <div>
        <h3>${t.destination} business trip</h3>
        <p>${t.period} · ${t.purpose}</p>
        <p><strong>Company:</strong> ${company.name} · <strong>Employee:</strong> ${t.employee}</p>
      </div>
      <div class="budget-box"><span>Remaining budget</span><strong>${money(t.budget - t.total)}</strong><small>${money(t.total)} spent</small></div>
    </section>
    <div class="trip-banner"><span>${state.locationShared ? (ka ? `ლოკაცია გაზიარებულია. ${state.distanceKm}კმ სამუშაო ადგილიდან.` : `Location shared. ${state.distanceKm} km from workplace.`) : (ka ? "ლოკაციის გაზიარება გამორთულია; კომპანია ვერ ხედავს რეალურ სტატუსს." : "Location sharing is off; company cannot see live status.")}</span>${badge(state.locationShared ? (ka ? "ლოკაცია ჩართულია" : "Location on") : (ka ? "ლოკაცია გამორთულია" : "Location off"))}</div>
    <div class="action-row">
      <button class="btn primary" onclick="state.locationShared=!state.locationShared;render()">${state.locationShared ? (ka ? "ლოკაციის გაზიარების გამორთვა" : "Stop sharing location") : (ka ? "ლოკაციის გაზიარება" : "Share location")}</button>
      <button class="btn" onclick="state.distanceKm=32;state.limitAlert=true;render()">${ka ? "ლიმიტის გადაჭარბების სიმულაცია" : "Simulate threshold alert"}</button>
    </div>
    <div class="dash-grid">
      <section class="panel">
        <h3>${ka ? "გეოლოკაციის სიმულაცია" : "Geolocation simulation"}</h3>
        <div class="map-mock"><span class="route-line"></span><span class="pin office"></span><span class="pin dest"></span></div>
      </section>
      <section class="panel">
        <h3>${ka ? "სტატუსის წესები" : "Status rules"}</h3>
        ${stat(ka ? "ოფისი" : "Office", "Tbilisi HQ", ka ? "საწყისი წერტილი" : "Start point")}
        ${stat(ka ? "მიმდინარე მანძილი" : "Current distance", `${state.distanceKm} km`, ka ? "კომპანიის წესი: 12კმ+" : "Company rule: 12 km+")}
        ${stat(ka ? "დღიური ნორმის წესი" : "Daily allowance rule", "30 km", overLegal ? (ka ? "დღიური ნორმა შესამოწმებელია" : "Daily allowance check") : (ka ? "30კმ-მდე მხოლოდ მგზავრობა" : "Under 30 km: travel only"))}
        ${stat(ka ? "ქვითრები" : "Receipts", `${t.missing}`, ka ? "დარჩენილი ასატვირთი" : "Still required")}
        ${alertBox(overPolicy ? (ka ? "გაფრთხილება: 12კმ ზღვარი გადალახულია, მივლინება აქტიურია." : "Alert: 12 km threshold crossed, trip is active.") : (ka ? "ჯერ 12კმ ზღვარს ქვემოთაა." : "Below 12 km threshold."), overPolicy ? "green" : "amber")}
        ${alertBox(state.limitAlert ? (ka ? "გაფრთხილება: ლიმიტს უახლოვდები ან გადააჭარბე." : "Warning: you are near or over a limit.") : (ka ? "ლიმიტები ნორმაშია." : "Limits are within policy."), state.limitAlert ? "red" : "green")}
      </section>
    </div>`;
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

function employeeOffers() {
  const ka = isKa();
  return `${title(ka ? "ჩემი ფასდაკლებები და ქეშბექი" : "My offers and cashback", ka ? "პარტნიორი ბიზნესების შეთავაზებები, რომლებიც PerDM-ში მიბმული საბანკო ბარათით გადახდისას მოქმედებს." : "Partner business offers available when paying with a bank card linked in PerDM.")}
    <div class="stats">
      ${stat(ka ? "მიღებული ქეშბექი" : "Cashback earned", "18 GEL", ka ? "ამ მივლინებაზე" : "This trip")}
      ${stat(ka ? "დაზოგვა" : "Savings", "62 GEL", ka ? "პარტნიორებისგან" : "From partners")}
      ${stat(ka ? "აქტიური შეთავაზებები" : "Active offers", "3", ka ? "ახლოს შენთან" : "Near you")}
    </div>
    <div class="grid-4">
      ${partnerOffers.map((o) => `<article class="feature"><div class="icon">%</div><h3>${o[0]}</h3><p>${o[1]} · ${o[2]} · ${o[3]}</p><br><button class="btn small">${ka ? "გამოყენება" : "Use offer"}</button></article>`).join("")}
    </div>`;
}

function partnerDashboard() {
  const ka = isKa();
  return `<div class="app-shell partner-shell">
    <aside class="sidebar">
      ${brand()}
      <nav class="side-nav">
        <button class="side-link active"><span>⌂</span>${ka ? "მიმოხილვა" : "Overview"}</button>
        <button class="side-link"><span>%</span>${ka ? "შეთავაზებები" : "Offers"}</button>
        <button class="side-link"><span>≡</span>${ka ? "ტრანზაქციები" : "Transactions"}</button>
        <button class="side-link"><span>↧</span>${ka ? "გადახდები" : "Payments"}</button>
        <button class="side-link"><span>□</span>${ka ? "პროფილი" : "Profile"}</button>
      </nav>
    </aside>
    <main class="main">
      <div class="dash-top"><strong>${ka ? "პარტნიორი ბიზნესის პანელი · Rooms Hotel" : "Partner dashboard · Rooms Hotel"}</strong><div>${langToggle()} <button class="btn small" onclick="setRoute('#/demo')">${ka ? "დემოები" : "Demo flows"}</button></div></div>
      <div class="dash-content">
        ${title(ka ? "პარტნიორი ბიზნესის მიმოხილვა" : "Partner business overview", ka ? "პარტნიორი ქმნის შეთავაზებებს PerDM მომხმარებლებისთვის და ხედავს მიბმული ბარათებით შესრულებულ ტრანზაქციებს." : "Partners create offers for PerDM users and track transactions made with linked bank cards.")}
        <div class="stats">
          ${stat(ka ? "აქტიური შეთავაზებები" : "Active offers", "3", ka ? "მიბმულ ბარათებზე" : "For linked cards")}
          ${stat(ka ? "დღიური ტრანზაქციები" : "Daily transactions", "38", ka ? "დღეს" : "Today")}
          ${stat(ka ? "თვიური ბრუნვა" : "Monthly revenue", money(18900), ka ? "perDM მომხმარებლები" : "perDM users")}
          ${stat(ka ? "შეთავაზების სტატუსი" : "Offer status", ka ? "აქტიურია" : "Active", ka ? "პარტნიორის კამპანია" : "Partner campaign")}
        </div>
        <div class="dash-grid">
          <section class="panel">
            <h3>${ka ? "შეთავაზების შექმნა" : "Create offer"}</h3>
            <div class="form-grid">
              ${field(ka ? "შეთავაზების სათაური" : "Offer title", "10% discount for PerDM linked-card users")}
              ${field(ka ? "კატეგორია" : "Category", "Hotel", "select")}
              ${field(ka ? "ფასდაკლების ტიპი" : "Discount type", "Percentage", "select")}
              ${field(ka ? "მნიშვნელობა" : "Value", "10%")}
              ${field(ka ? "მოქმედებს დან" : "Valid from", "2026-07-09")}
              ${field(ka ? "მოქმედებს მდე" : "Valid to", "2026-08-09")}
            </div>
            <br><button class="btn primary">${ka ? "შეთავაზების შენახვა" : "Save offer"}</button>
          </section>
          <section class="panel">
            <h3>${ka ? "ბიზნეს პროფილი" : "Business profile"}</h3>
            <div class="form-grid">
              ${field(ka ? "ბიზნესის სახელი" : "Business name", "Rooms Hotel")}
              ${field(ka ? "მისამართი" : "Address", "Tbilisi, Kostava 14")}
              ${field(ka ? "კატეგორია" : "Category", "Hotel", "select")}
              ${field(ka ? "სამუშაო საათები" : "Working hours", "24/7")}
            </div>
          </section>
        </div>
        <section class="panel table-wrap" style="margin-top:16px">
          <h3>${ka ? "perDM ტრანზაქციები პარტნიორთან" : "perDM partner transactions"}</h3>
          <table><thead><tr><th>${ka ? "თარიღი" : "Date"}</th><th>${ka ? "მომხმარებელი" : "User"}</th><th>${ka ? "კომპანია" : "Company"}</th><th>${ka ? "თანხა" : "Amount"}</th><th>${ka ? "ფასდაკლება" : "Discount"}</th><th>${ka ? "სტატუსი" : "Status"}</th></tr></thead><tbody>
            <tr><td>June 1</td><td>Nino Beridze</td><td>${company.name}</td><td>${money(720)}</td><td>72 GEL</td><td>${badge(ka ? "დადასტურებულია" : "Settled")}</td></tr>
            <tr><td>June 12</td><td>Nino Beridze</td><td>${company.name}</td><td>${money(720)}</td><td>72 GEL</td><td>${badge(ka ? "დასარიცხია" : "Pending")}</td></tr>
          </tbody></table>
        </section>
      </div>
    </main>
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
  if (hash === "#/dashboard/ai") html = aiAssistantPage();
  if (hash === "#/dashboard/mission-forms") html = missionFormsPage();
  if (hash === "#/dashboard/payments") html = paymentsPage();
  if (hash === "#/dashboard/policies") html = policiesPage();
  if (hash === "#/dashboard/legal") html = legalRulesPage();
  if (hash === "#/dashboard/locations") html = locationsPage();
  if (hash === "#/dashboard/budgets") html = budgetsPage();
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
  if (hash === "#/employee/card") html = employeePortal("card");
  if (hash === "#/employee/trip") html = employeePortal("trip");
  if (hash === "#/employee/expenses") html = employeePortal("expenses");
  if (hash === "#/employee/receipts") html = employeePortal("receipts");
  if (hash === "#/employee/offers") html = employeePortal("offers");
  if (hash === "#/employee/report") html = employeePortal("report");
  if (hash === "#/partner") html = partnerDashboard();
  app.innerHTML = html;
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
