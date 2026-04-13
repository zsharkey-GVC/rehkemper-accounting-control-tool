
import React, { useMemo, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const reviewLabel = "Jessica - Director of Finance";

const seedData = [
  {
    id: 1,
    term: "Capital Equipment Purchase",
    category: "Capital Expenditures",
    subcategory: "Machinery & Equipment",
    approvalLevel: reviewLabel,
    riskLevel: "HIGH RISK",
    escalationRequired: reviewLabel,
    quickBooksMapping: "Fixed Assets → Machinery & Equipment",
    commonMistake: "Expensing large equipment purchases through shop supplies, repairs, or miscellaneous expense.",
    whyItMatters: "Improper classification affects EBITDA, depreciation, tax treatment, fixed asset schedules, and valuation metrics.",
    description: "New machinery, forklifts, saws, presses, trailers, office equipment, or other items that may meet the capitalization policy for Rehkemper & Son, Inc.",
    classifyAs: "Machinery & Equipment or another fixed asset account if the item exceeds the capitalization threshold and has a useful life greater than one year.",
    doNotClassifyAs: "Repairs & Maintenance, Shop Supplies, or Cost of Goods Sold.",
    keywords: ["equipment", "forklift", "saw", "machine", "capital", "asset", "compressor", "trailer", "fixed asset"],
    examples: [
      "Forklift purchase for yard or plant",
      "New saw system for truss production",
      "Office server or computer package above capitalization threshold"
    ],
    journalEntry: "Dr Machinery & Equipment\nCr Cash or Accounts Payable",
    notes: "Use the capitalization policy consistently. Capitalize when the purchase is for a new asset or major addition with a useful life beyond one year.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 2,
    term: "Repair vs Improvement",
    category: "Judgment Area",
    subcategory: "Facilities / Equipment",
    approvalLevel: reviewLabel,
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: reviewLabel,
    quickBooksMapping: "Repairs & Maintenance or Fixed Assets depending on the determination",
    commonMistake: "Automatically expensing all large machine-related invoices or capitalizing all repair invoices without evaluating substance.",
    whyItMatters: "This is a common financial reporting control failure in manufacturing and construction-related businesses.",
    description: "Costs incurred to maintain existing assets versus costs that materially improve capacity, efficiency, or useful life.",
    classifyAs: "Repairs & Maintenance if routine and restorative. Capitalize if the cost materially extends useful life, increases output, or improves performance.",
    doNotClassifyAs: "Automatically expense all large invoices or automatically capitalize all machine-related invoices.",
    keywords: ["repair", "improvement", "maintenance", "rebuild", "overhaul", "upgrade"],
    examples: [
      "Routine motor replacement to keep machine operating = expense unless major improvement",
      "Major system upgrade increasing line capacity = capitalize"
    ],
    journalEntry: "Dr Repairs & Maintenance or Dr Machinery & Equipment\nCr Cash or Accounts Payable",
    notes: "If there is judgment involved, escalate before posting. Keep documentation explaining why the item was expensed or capitalized.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 3,
    term: "Work-in-Process (WIP)",
    category: "WIP / Production",
    subcategory: "Production Not Completed",
    approvalLevel: "Manager",
    riskLevel: "HIGH RISK",
    escalationRequired: "Manager",
    quickBooksMapping: "Inventory → Work-in-Process",
    commonMistake: "Expensing production costs to COGS too early or moving incomplete units to finished goods.",
    whyItMatters: "Incorrect WIP treatment can materially distort gross margin, inventory, revenue timing, and month-end financial statements.",
    description: "Costs incurred for trusses, panels, or package components that are not yet complete at period end.",
    classifyAs: "Work-in-Process Inventory.",
    doNotClassifyAs: "COGS or Finished Goods prematurely.",
    keywords: ["wip", "production", "partial", "unfinished", "in process"],
    examples: [
      "Cut lumber not yet assembled",
      "Partially built trusses in plant",
      "Open production orders not yet complete"
    ],
    journalEntry: "Dr Work-in-Process Inventory\nCr Raw Materials / Labor / Applied Overhead",
    notes: "This is a major manufacturing accounting control point. Wrong treatment can distort margins, inventory, and earnings.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 4,
    term: "Finished Goods Not Yet Delivered",
    category: "WIP / Production",
    subcategory: "Finished Goods",
    approvalLevel: "Manager",
    riskLevel: "HIGH RISK",
    escalationRequired: "Manager",
    quickBooksMapping: "Inventory → Finished Goods",
    commonMistake: "Recognizing revenue or COGS before delivery or other earning event has occurred.",
    whyItMatters: "This directly affects revenue recognition, inventory balances, and period-end profitability.",
    description: "Completed trusses, wall panels, lumber packages, windows, doors, or related components that are finished but not yet delivered or installed.",
    classifyAs: "Finished Goods Inventory.",
    doNotClassifyAs: "Revenue or COGS before delivery/earning event.",
    keywords: ["finished goods", "completed", "staged", "yard", "delivered"],
    examples: [
      "Completed truss package staged for next-day delivery",
      "Finished wall panels waiting in yard",
      "Completed package not yet shipped"
    ],
    journalEntry: "Dr Finished Goods Inventory\nCr Work-in-Process Inventory",
    notes: "This helps prevent early revenue recognition and inventory understatement.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 5,
    term: "Vendor Bill - Inventory Purchase",
    category: "Accounts Payable",
    subcategory: "Inventory Bills",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "None unless unusual",
    quickBooksMapping: "Accounts Payable with offset to Inventory / Raw Materials / Job Materials",
    commonMistake: "Expensing inventory purchases simply because the invoice came through AP.",
    whyItMatters: "Bad AP coding drives bad inventory, margin, and job-cost reporting.",
    description: "Vendor bills for lumber, connector plates, hardware, steel, windows, doors, or other items purchased for resale or production.",
    classifyAs: "Accounts Payable with offset to Inventory or direct materials under company policy.",
    doNotClassifyAs: "Office expense, shop supplies, or miscellaneous expense.",
    keywords: ["vendor bill", "inventory bill", "ap", "lumber invoice", "supplier invoice"],
    examples: [
      "Lumber vendor invoice",
      "Connector plate supplier bill",
      "Window and door vendor payable"
    ],
    journalEntry: "Dr Inventory / Raw Materials / Job Materials\nCr Accounts Payable",
    notes: "Do not expense inventory purchases simply because the invoice came through AP.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 6,
    term: "AP Hold for Missing Support",
    category: "Accounts Payable",
    subcategory: "Exception Handling",
    approvalLevel: "Manager",
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: "Manager",
    quickBooksMapping: "Temporary AP hold / no final account until resolved",
    commonMistake: "Posting unsupported invoices to miscellaneous expense to clear the queue.",
    whyItMatters: "This reduces coding errors and forces proper support before posting or paying.",
    description: "Invoices lacking support, coding clarity, or approval should be held rather than forced into a miscoding bucket.",
    classifyAs: "Hold in AP pending support or approval.",
    doNotClassifyAs: "Miscellaneous expense simply to clear the invoice.",
    keywords: ["missing support", "hold", "pending approval", "unclear invoice"],
    examples: [
      "Invoice with no PO or receiving support",
      "Credit card backup missing receipt",
      "Vendor bill without explanation of services"
    ],
    journalEntry: "No final entry until support and coding are resolved.",
    notes: "A clean hold process is better than burying unresolved items in the wrong account.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 7,
    term: "AP - Received Not Yet Invoiced",
    category: "Accounts Payable",
    subcategory: "Accrued Payables",
    approvalLevel: "Manager",
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: "Manager",
    quickBooksMapping: "Accrued Liabilities / Accrued Payables",
    commonMistake: "Waiting for the invoice and missing the proper accounting period.",
    whyItMatters: "This is one of the most common month-end close problems in growing operations.",
    description: "Goods or services have been received before period end, but the vendor invoice has not arrived.",
    classifyAs: "Accrued payable or received-not-invoiced liability.",
    doNotClassifyAs: "Wait until the bill arrives if it causes period misstatement.",
    keywords: ["received not invoiced", "uninvoiced receipt", "accrued payable"],
    examples: [
      "Materials received before month-end, invoice arrives next month",
      "Outside labor completed before month-end without bill"
    ],
    journalEntry: "Dr Inventory / Expense / Asset\nCr Accrued Payables",
    notes: "Use this when the obligation exists before the bill arrives.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 8,
    term: "Restaurant / McDonald's Charges",
    category: "Meals / Travel",
    subcategory: "Employee Meals",
    approvalLevel: "Manager",
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: "Manager if unsupported; Jessica if potentially personal",
    quickBooksMapping: "Meals Expense or Due from Employee/Owner depending on facts",
    commonMistake: "Coding restaurant charges to 1099 vendors, office expense, or leaving unsupported personal charges in operating expenses.",
    whyItMatters: "This affects tax treatment, employee accountability, and internal control credibility.",
    description: "Restaurant, fast-food, or meal purchases made on the company card.",
    classifyAs: "Meals Expense, Travel Meals, or potentially employee receivable/personal charge depending on business purpose.",
    doNotClassifyAs: "1099 vendor payment or general office expense without support.",
    keywords: ["mcdonalds", "restaurant", "food", "meal", "lunch", "dinner"],
    examples: [
      "Employee meal while traveling",
      "Business meal with documented business purpose",
      "Fast-food charge with no support requiring follow-up"
    ],
    journalEntry: "Dr Meals Expense or Due from Employee/Owner\nCr Credit Card Payable or Cash",
    notes: "Restaurant purchases generally do not belong in 1099 review logic. Require support for business purpose and attendees where applicable.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 9,
    term: "1099 Vendor Determination",
    category: "1099 / Vendor Setup",
    subcategory: "Compliance",
    approvalLevel: "Manager",
    riskLevel: "HIGH RISK",
    escalationRequired: "Manager",
    quickBooksMapping: "Vendor setup / 1099 tracking flag; no direct JE",
    commonMistake: "Assuming all vendors or all card merchants should receive 1099s, including restaurants like McDonald’s.",
    whyItMatters: "Incorrect 1099 treatment creates avoidable compliance errors and signals weak AP controls.",
    description: "Initial review of whether a vendor should be tracked for 1099 reporting.",
    classifyAs: "Vendor subject to 1099 review only if the payment type, payee type, and payment method support 1099 reporting under company policy.",
    doNotClassifyAs: "Assume all vendors or all credit card vendors should receive a 1099.",
    keywords: ["1099", "vendor", "w9", "compliance", "service provider"],
    examples: [
      "Independent contractor paid by ACH for services = review for 1099",
      "Restaurant or retail store charge on company card = generally not a 1099 item",
      "Goods-only vendor = generally not 1099 service treatment"
    ],
    journalEntry: "No journal entry. This is a vendor setup and compliance classification decision.",
    notes: "Do not send 1099s to merchants like McDonald's for routine food purchases.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 10,
    term: "Payroll Allocation - Shop vs Admin",
    category: "Payroll / Labor",
    subcategory: "Classification",
    approvalLevel: "Manager",
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: "Manager",
    quickBooksMapping: "Payroll by function → Direct Labor / Plant Labor / Admin Payroll / Delivery Labor",
    commonMistake: "Recording all payroll to one account for convenience.",
    whyItMatters: "Incorrect payroll classification distorts margins, overhead, and operational reporting.",
    description: "Allocation of payroll costs between production labor, administrative labor, delivery labor, and other categories.",
    classifyAs: "Charge payroll based on actual employee function and approved allocation method.",
    doNotClassifyAs: "Record all payroll to one expense account for convenience.",
    keywords: ["payroll", "labor", "shop labor", "admin labor", "allocation", "delivery labor"],
    examples: [
      "Production wages to direct labor or plant labor",
      "Office wages to admin payroll",
      "Mixed-role employee allocated under approved policy"
    ],
    journalEntry: "Dr Direct Labor / Plant Labor / Admin Payroll / Delivery Labor\nCr Wages Payable or Cash",
    notes: "Use the approved role-to-account mapping consistently.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 11,
    term: "Customer Deposit Before Delivery",
    category: "Customer Deposits",
    subcategory: "Pre-Delivery Deposits",
    approvalLevel: "Manager",
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: "Manager",
    quickBooksMapping: "Current Liabilities → Customer Deposits / Deferred Revenue",
    commonMistake: "Recording deposits to revenue when goods have not been delivered or earned.",
    whyItMatters: "Premature revenue recognition is a high-visibility financial reporting issue.",
    description: "Customer payment received before inventory is delivered or services are earned.",
    classifyAs: "Customer Deposits / Deferred Revenue.",
    doNotClassifyAs: "Immediate revenue.",
    keywords: ["deposit", "advance from customer", "pre-delivery cash"],
    examples: [
      "Deposit on custom order",
      "Advance received before manufacturing completion",
      "Prepayment on a future-delivery package"
    ],
    journalEntry: "Dr Cash\nCr Customer Deposits / Deferred Revenue",
    notes: "This category exists separately so bookkeepers can search it directly.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 12,
    term: "Freight In / Inbound Delivery",
    category: "Freight & Logistics",
    subcategory: "Inbound Freight",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "None unless unusual",
    quickBooksMapping: "Inventory / Freight-In / Purchasing Burden depending on policy",
    commonMistake: "Mixing inbound freight with outbound delivery or general miscellaneous expense.",
    whyItMatters: "Freight coding affects inventory costing and gross margin analysis.",
    description: "Freight paid to bring raw materials or inventory to the company.",
    classifyAs: "Inventory cost, freight-in, or the approved purchasing burden account under company policy.",
    doNotClassifyAs: "Outbound delivery expense if it relates to inbound materials.",
    keywords: ["freight in", "inbound freight", "shipping in", "delivery on purchases"],
    examples: [
      "Freight on lumber purchase",
      "Inbound shipping for metal plates",
      "Delivery charge from supplier to plant"
    ],
    journalEntry: "Dr Inventory / Freight-In\nCr Cash or Accounts Payable",
    notes: "Use a consistent policy for whether inbound freight is capitalized into inventory or tracked separately.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 13,
    term: "Freight Out / Customer Delivery",
    category: "Freight & Logistics",
    subcategory: "Outbound Delivery",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "None unless unusual",
    quickBooksMapping: "Delivery Expense / Freight Out / Direct Job Cost",
    commonMistake: "Mixing outbound delivery with inbound freight or inventory cost.",
    whyItMatters: "Delivery-related coding impacts margin reporting and service-line analysis.",
    description: "Costs to deliver finished products to customers using company fleet or outside carriers.",
    classifyAs: "Delivery Expense, Freight Out, or direct job cost based on company policy.",
    doNotClassifyAs: "Inbound freight or raw materials cost.",
    keywords: ["freight out", "delivery", "outbound freight", "shipping to customer"],
    examples: [
      "Third-party freight to customer site",
      "Delivery-related charge for completed order",
      "Carrier bill for outbound shipment"
    ],
    journalEntry: "Dr Delivery Expense / Freight Out\nCr Cash or Accounts Payable",
    notes: "Delivery-related coding should be standardized.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 14,
    term: "Owner / Personal Charges",
    category: "Owner / Related Party",
    subcategory: "Nonbusiness",
    approvalLevel: reviewLabel,
    riskLevel: "HIGH RISK",
    escalationRequired: reviewLabel,
    quickBooksMapping: "Due from Owner / Due from Employee / Distributions",
    commonMistake: "Leaving personal charges in meals, travel, office expense, or miscellaneous operating accounts.",
    whyItMatters: "Personal charges buried in operating expenses damage financial statement reliability and can create tax issues.",
    description: "Charges that are personal in nature or otherwise not ordinary and necessary business expenses.",
    classifyAs: "Due from Owner, Due from Employee, or Distribution per company policy.",
    doNotClassifyAs: "Meals, travel, office expense, or general operating expense.",
    keywords: ["personal", "owner", "related party", "distribution", "nonbusiness"],
    examples: [
      "Personal retail purchases on company card",
      "Family meal with no business purpose",
      "Nonbusiness travel charged to company"
    ],
    journalEntry: "Dr Due from Owner / Due from Employee / Distributions\nCr Credit Card Payable or Cash",
    notes: "Escalate immediately. These items should not remain in operating expenses.",
    lastReviewed: "2026-04-11"
  }
];

const emptyForm = {
  term: "",
  category: "Operating Expense",
  subcategory: "",
  approvalLevel: "Staff",
  riskLevel: "STANDARD",
  escalationRequired: "None unless unusual",
  quickBooksMapping: "",
  commonMistake: "",
  whyItMatters: "",
  description: "",
  classifyAs: "",
  doNotClassifyAs: "",
  keywords: "",
  examples: "",
  journalEntry: "",
  notes: "",
  lastReviewed: new Date().toISOString().slice(0, 10)
};

const allCategoryOptions = [
  "All",
  "1099 / Vendor Setup",
  "Accounts Payable",
  "Accounts Receivable",
  "Advertising & Marketing",
  "Banking & Treasury",
  "Capital Expenditures",
  "Credit Cards",
  "Customer Deposits",
  "Depreciation & Amortization",
  "Design / Engineering",
  "Equity / Distributions",
  "Fixed Assets",
  "Freight & Logistics",
  "Insurance",
  "Intercompany / Related Party",
  "Inventory Adjustments",
  "Job Costs & Contract Costs",
  "Judgment Area",
  "Leases / Rent",
  "Meals / Travel",
  "Office & Administrative",
  "Owner / Related Party",
  "Payroll / Labor",
  "Prepaids / Accruals",
  "Raw Materials & Inventory",
  "Repairs & Maintenance",
  "Revenue & Customer Deposits",
  "Safety & Compliance",
  "Sales Tax / Use Tax",
  "Software & Technology",
  "Tax & Compliance",
  "Telecom & Utilities",
  "Tools & Consumables",
  "Vehicles / Fleet",
  "Warehousing / Yard",
  "WIP / Production"
];

const styles = {
  page: { minHeight: "100vh", background: "#f4f7fb", fontFamily: "Inter, Arial, sans-serif", color: "#142033", padding: 24 },
  shell: { maxWidth: 1450, margin: "0 auto" },
  hero: { background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)", color: "white", borderRadius: 24, padding: 28, boxShadow: "0 20px 60px rgba(15, 23, 42, 0.18)" },
  heroTitle: { margin: 0, fontSize: 40, lineHeight: 1.1, letterSpacing: "-0.02em" },
  heroSub: { marginTop: 10, maxWidth: 1000, color: "rgba(255,255,255,0.86)", fontSize: 16 },
  heroRow: { display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 },
  button: { border: 0, borderRadius: 14, padding: "12px 16px", fontWeight: 700, cursor: "pointer" },
  buttonPrimary: { background: "white", color: "#0f172a" },
  buttonSecondary: { background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.22)" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 20 },
  statCard: { background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: 16 },
  statLabel: { fontSize: 13, opacity: 0.8 },
  statValue: { fontSize: 28, fontWeight: 800, marginTop: 6 },
  mainGrid: { display: "grid", gridTemplateColumns: "390px 1fr", gap: 20, marginTop: 22 },
  card: { background: "white", borderRadius: 22, padding: 18, boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)", border: "1px solid #e6ecf5" },
  sectionTitle: { margin: 0, fontSize: 20 },
  input: { width: "100%", boxSizing: "border-box", border: "1px solid #d6deea", borderRadius: 14, padding: "12px 14px", fontSize: 15, outline: "none", background: "#fbfcfe" },
  select: { width: "100%", boxSizing: "border-box", border: "1px solid #d6deea", borderRadius: 14, padding: "12px 14px", fontSize: 15, outline: "none", background: "#fbfcfe" },
  textarea: { width: "100%", minHeight: 90, boxSizing: "border-box", border: "1px solid #d6deea", borderRadius: 14, padding: "12px 14px", fontSize: 15, outline: "none", resize: "vertical", background: "#fbfcfe" },
  field: { marginTop: 14 },
  label: { display: "block", fontWeight: 700, fontSize: 13, marginBottom: 7, color: "#334155" },
  badge: { display: "inline-block", borderRadius: 999, padding: "7px 11px", fontWeight: 700, fontSize: 12 },
  list: { marginTop: 16, maxHeight: 720, overflowY: "auto", paddingRight: 6 },
  listItem: (active) => ({ border: active ? "1px solid #2563eb" : "1px solid #e6ecf5", background: active ? "#eff6ff" : "white", borderRadius: 18, padding: 14, cursor: "pointer", marginBottom: 10, boxShadow: active ? "0 8px 20px rgba(37, 99, 235, 0.12)" : "none" }),
  listTitle: { fontWeight: 800, fontSize: 16, marginBottom: 6 },
  rowBetween: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" },
  detailHeader: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" },
  detailTitle: { margin: 0, fontSize: 30, letterSpacing: "-0.02em" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 18 },
  infoPanel: { borderRadius: 18, padding: 16, border: "1px solid #e6ecf5", background: "#fbfcfe" },
  okPanel: { borderRadius: 18, padding: 16, border: "1px solid #b7e2c1", background: "#ecfdf3" },
  warnPanel: { borderRadius: 18, padding: 16, border: "1px solid #f2d08b", background: "#fff8e8" },
  riskPanel: (level) => ({
    borderRadius: 18,
    padding: 16,
    border: level === "HIGH RISK" ? "1px solid #fecaca" : level === "REVIEW REQUIRED" ? "1px solid #fde68a" : "1px solid #bbf7d0",
    background: level === "HIGH RISK" ? "#fef2f2" : level === "REVIEW REQUIRED" ? "#fff7ed" : "#f0fdf4"
  }),
  tabRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 },
  tabButton: (active) => ({ borderRadius: 999, border: active ? "1px solid #2563eb" : "1px solid #d6deea", background: active ? "#eff6ff" : "white", color: active ? "#1d4ed8" : "#334155", padding: "10px 16px", fontWeight: 800, cursor: "pointer" }),
  pre: { whiteSpace: "pre-wrap", background: "#0f172a", color: "#f8fafc", borderRadius: 18, padding: 18, fontSize: 14, overflowX: "auto" },
  chips: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 },
  chip: { background: "#eef2ff", border: "1px solid #c7d2fe", color: "#3730a3", padding: "7px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
  ul: { paddingLeft: 18, margin: "10px 0 0 0" },
  overlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 18, zIndex: 20 },
  modal: { width: "min(940px, 100%)", maxHeight: "90vh", overflowY: "auto", background: "white", borderRadius: 24, padding: 22, boxShadow: "0 24px 80px rgba(15, 23, 42, 0.28)" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  helperGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 18 },
  helperCard: { background: "#f8fafc", border: "1px solid #e6ecf5", borderRadius: 18, padding: 16 }
};

function exportJson(entries) {
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "rehkemper-elite-accounting-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function saveToBrowser(entries) {
  localStorage.setItem("rehkemperEliteAccountingToolData", JSON.stringify(entries));
}

function loadFromBrowser() {
  try {
    const raw = localStorage.getItem("rehkemperEliteAccountingToolData");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function riskBadge(level) {
  if (level === "HIGH RISK") return { background: "#fee2e2", color: "#991b1b" };
  if (level === "REVIEW REQUIRED") return { background: "#fef3c7", color: "#92400e" };
  return { background: "#dcfce7", color: "#166534" };
}

function App() {
  const initialData = loadFromBrowser() || seedData;
  const [entries, setEntries] = useState(initialData);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(initialData[0]?.id || null);
  const [tab, setTab] = useState("guidance");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { saveToBrowser(entries); }, [entries]);

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(entries.map((item) => item.category))).sort();
    return ["All", ...Array.from(new Set([...allCategoryOptions.filter(x => x !== "All"), ...dynamic]))];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const haystack = [
        item.term, item.category, item.subcategory, item.description, item.classifyAs, item.doNotClassifyAs,
        item.notes, item.journalEntry, item.riskLevel, item.escalationRequired, item.quickBooksMapping,
        item.commonMistake, item.whyItMatters, ...(item.keywords || []), ...(item.examples || [])
      ].join(" ").toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
  }, [entries, search, category]);

  const selected = filtered.find((x) => x.id === selectedId) || filtered[0] || null;

  function resetForm() {
    setForm({ ...emptyForm, lastReviewed: new Date().toISOString().slice(0, 10) });
  }

  function addGuideline() {
    if (!form.term.trim()) return;
    const newEntry = {
      id: Date.now(),
      term: form.term.trim(),
      category: form.category.trim(),
      subcategory: form.subcategory.trim(),
      approvalLevel: form.approvalLevel.trim(),
      riskLevel: form.riskLevel.trim(),
      escalationRequired: form.escalationRequired.trim(),
      quickBooksMapping: form.quickBooksMapping.trim(),
      commonMistake: form.commonMistake.trim(),
      whyItMatters: form.whyItMatters.trim(),
      description: form.description.trim(),
      classifyAs: form.classifyAs.trim(),
      doNotClassifyAs: form.doNotClassifyAs.trim(),
      keywords: form.keywords.split(",").map((x) => x.trim()).filter(Boolean),
      examples: form.examples.split("\n").map((x) => x.trim()).filter(Boolean),
      journalEntry: form.journalEntry.trim(),
      notes: form.notes.trim(),
      lastReviewed: form.lastReviewed
    };
    const next = [newEntry, ...entries];
    setEntries(next);
    setSelectedId(newEntry.id);
    setShowModal(false);
    resetForm();
  }

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (Array.isArray(parsed) && parsed.length) {
          setEntries(parsed);
          setSelectedId(parsed[0].id);
        }
      } catch {
        alert("That file could not be imported. Please use a valid JSON export.");
      }
    };
    reader.readAsText(file);
  }

  function resetToDefaults() {
    if (window.confirm("Reset the tool back to the original Rehkemper elite sample data?")) {
      setEntries(seedData);
      setSelectedId(seedData[0].id);
      localStorage.removeItem("rehkemperEliteAccountingToolData");
    }
  }

  const statCards = [
    { label: "Guidelines", value: String(entries.length) },
    { label: "Categories", value: String(categories.length - 1) },
    { label: "High Risk Items", value: String(entries.filter((x) => x.riskLevel === "HIGH RISK").length) },
    { label: reviewLabel + " Review", value: String(entries.filter((x) => x.approvalLevel === reviewLabel).length) }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Rehkemper & Son, Inc. Accounting Control Tool</h1>
          <div style={styles.heroSub}>
            Customized for Rehkemper’s truss and building component operations. This elite version adds risk flags, escalation controls, QuickBooks mapping, common mistakes, and financial reporting rationale so bookkeepers can classify transactions consistently and leadership can reinforce stronger accounting controls.
          </div>

          <div style={styles.heroRow}>
            <button style={{ ...styles.button, ...styles.buttonPrimary }} onClick={() => setShowModal(true)}>+ Add Guideline</button>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={() => exportJson(entries)}>Export Data</button>
            <label style={{ ...styles.button, ...styles.buttonSecondary, display: "inline-flex", alignItems: "center" }}>
              Import Data
              <input type="file" accept="application/json" style={{ display: "none" }} onChange={importJson} />
            </label>
            <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={resetToDefaults}>Reset Sample Data</button>
          </div>

          <div style={styles.statsGrid}>
            {statCards.map((card) => (
              <div key={card.label} style={styles.statCard}>
                <div style={styles.statLabel}>{card.label}</div>
                <div style={styles.statValue}>{card.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.card}>
            <div style={styles.rowBetween}>
              <h2 style={styles.sectionTitle}>Search and Filter</h2>
              <span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>
                {filtered.length} match{filtered.length === 1 ? "" : "es"}
              </span>
            </div>

            <div style={{ ...styles.field, marginTop: 14 }}>
              <label style={styles.label}>Search</label>
              <input
                style={styles.input}
                placeholder="Search by term, vendor type, product line, keyword, or journal entry"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Category</label>
              <select style={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div style={styles.list}>
              {filtered.map((item) => (
                <div key={item.id} style={styles.listItem(selected?.id === item.id)} onClick={() => { setSelectedId(item.id); setTab("guidance"); }}>
                  <div style={styles.rowBetween}>
                    <div>
                      <div style={styles.listTitle}>{item.term}</div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>{item.subcategory || item.category}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                      <span style={{ ...styles.badge, ...riskBadge(item.riskLevel) }}>{item.riskLevel}</span>
                      <span
                        style={{
                          ...styles.badge,
                          background: item.approvalLevel === reviewLabel ? "#ede9fe" : item.approvalLevel === "Manager" ? "#e0f2fe" : "#ecfdf3",
                          color: item.approvalLevel === reviewLabel ? "#6d28d9" : item.approvalLevel === "Manager" ? "#075985" : "#166534"
                        }}
                      >
                        {item.approvalLevel}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {!filtered.length && <div style={{ ...styles.infoPanel, textAlign: "center", color: "#64748b" }}>No matching guidelines found.</div>}
            </div>
          </div>

          <div style={styles.card}>
            {!selected ? (
              <div style={{ color: "#64748b" }}>Select a guideline to view details.</div>
            ) : (
              <>
                <div style={styles.detailHeader}>
                  <div>
                    <h2 style={styles.detailTitle}>{selected.term}</h2>
                    <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <span style={{ ...styles.badge, background: "#dbeafe", color: "#1d4ed8" }}>{selected.category}</span>
                      <span style={{ ...styles.badge, background: "#f8fafc", color: "#334155", border: "1px solid #e2e8f0" }}>{selected.subcategory}</span>
                      <span style={{ ...styles.badge, ...riskBadge(selected.riskLevel) }}>{selected.riskLevel}</span>
                      <span style={{ ...styles.badge, background: "#ede9fe", color: "#6d28d9" }}>{selected.approvalLevel}</span>
                    </div>
                  </div>
                  <div style={{ color: "#64748b", fontWeight: 700, marginTop: 6 }}>Last Reviewed: {selected.lastReviewed}</div>
                </div>

                <div style={styles.infoGrid}>
                  <div style={styles.riskPanel(selected.riskLevel)}>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>Escalation Required</div>
                    <div>{selected.escalationRequired}</div>
                  </div>
                  <div style={styles.infoPanel}>
                    <div style={{ fontWeight: 800, marginBottom: 8 }}>QuickBooks Mapping</div>
                    <div>{selected.quickBooksMapping}</div>
                  </div>
                </div>

                <div style={styles.tabRow}>
                  {["guidance", "journal entry", "examples / controls"].map((name) => (
                    <button key={name} style={styles.tabButton(tab === name)} onClick={() => setTab(name)}>
                      {name[0].toUpperCase() + name.slice(1)}
                    </button>
                  ))}
                </div>

                {tab === "guidance" && (
                  <>
                    <div style={styles.infoGrid}>
                      <div style={styles.okPanel}>
                        <div style={{ fontWeight: 800, marginBottom: 8 }}>Classify As</div>
                        <div>{selected.classifyAs}</div>
                      </div>
                      <div style={styles.warnPanel}>
                        <div style={{ fontWeight: 800, marginBottom: 8 }}>Do Not Classify As</div>
                        <div>{selected.doNotClassifyAs}</div>
                      </div>
                    </div>

                    <div style={{ ...styles.infoPanel, marginTop: 16 }}>
                      <div style={{ fontWeight: 800 }}>Description</div>
                      <div style={{ marginTop: 8 }}>{selected.description}</div>
                    </div>

                    <div style={{ ...styles.infoPanel, marginTop: 16 }}>
                      <div style={{ fontWeight: 800 }}>Common Mistake</div>
                      <div style={{ marginTop: 8 }}>{selected.commonMistake}</div>
                    </div>

                    <div style={{ ...styles.infoPanel, marginTop: 16 }}>
                      <div style={{ fontWeight: 800 }}>Why This Matters</div>
                      <div style={{ marginTop: 8 }}>{selected.whyItMatters}</div>
                    </div>

                    <div style={{ ...styles.infoPanel, marginTop: 16 }}>
                      <div style={{ fontWeight: 800 }}>Keywords</div>
                      <div style={styles.chips}>
                        {selected.keywords.map((kw) => <span key={kw} style={styles.chip}>{kw}</span>)}
                      </div>
                    </div>

                    <div style={{ ...styles.infoPanel, marginTop: 16 }}>
                      <div style={{ fontWeight: 800 }}>Notes / Policy Guidance</div>
                      <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{selected.notes}</div>
                    </div>
                  </>
                )}

                {tab === "journal entry" && (
                  <div style={{ marginTop: 18 }}>
                    <div style={{ ...styles.infoPanel, marginBottom: 16 }}>
                      <div style={{ fontWeight: 800 }}>Suggested Journal Entry</div>
                      <div style={{ marginTop: 8, color: "#64748b" }}>
                        Use this as the standard treatment unless a documented exception applies.
                      </div>
                    </div>
                    <div style={styles.pre}>{selected.journalEntry}</div>
                  </div>
                )}

                {tab === "examples / controls" && (
                  <div style={{ marginTop: 18 }}>
                    <div style={styles.helperGrid}>
                      <div style={styles.helperCard}>
                        <div style={{ fontWeight: 800 }}>Examples</div>
                        <ul style={styles.ul}>
                          {selected.examples.map((example, index) => <li key={index} style={{ marginBottom: 8 }}>{example}</li>)}
                        </ul>
                      </div>
                      <div style={styles.helperCard}>
                        <div style={{ fontWeight: 800 }}>Approval Level</div>
                        <div style={{ marginTop: 10 }}>{selected.approvalLevel}</div>
                      </div>
                      <div style={styles.helperCard}>
                        <div style={{ fontWeight: 800 }}>Control Reminder</div>
                        <div style={{ marginTop: 10 }}>
                          If the item is unusual, large, related-party, period-sensitive, or judgment-heavy, escalate before posting.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ ...styles.card, marginTop: 20 }}>
          <h2 style={styles.sectionTitle}>How to Update This Tool</h2>
          <div style={styles.helperGrid}>
            <div style={styles.helperCard}>
              <div style={{ fontWeight: 800 }}>Add New Rules</div>
              <div style={{ marginTop: 10 }}>
                Click <b>Add Guideline</b> to create new Rehkemper-specific rules for recurring accounting questions.
              </div>
            </div>
            <div style={styles.helperCard}>
              <div style={{ fontWeight: 800 }}>Save to Browser</div>
              <div style={{ marginTop: 10 }}>
                Changes save automatically in the browser on that computer. For backup, export the data to JSON.
              </div>
            </div>
            <div style={styles.helperCard}>
              <div style={{ fontWeight: 800 }}>Move Between Computers</div>
              <div style={{ marginTop: 10 }}>
                Use <b>Export Data</b> on one computer and <b>Import Data</b> on another computer to carry your custom library with you.
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div style={styles.overlay} onClick={() => setShowModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.rowBetween}>
                <h2 style={{ margin: 0, fontSize: 28 }}>Add Accounting Guideline</h2>
                <button style={{ ...styles.button, background: "#eef2ff", color: "#3730a3" }} onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>

              <div style={{ ...styles.formGrid, marginTop: 16 }}>
                <div>
                  <label style={styles.label}>Term</label>
                  <input style={styles.input} value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} placeholder="Example: New forklift purchase" />
                </div>
                <div>
                  <label style={styles.label}>Category</label>
                  <select style={styles.select} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {allCategoryOptions.filter(x => x !== "All").map((cat) => <option key={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Subcategory</label>
                  <input style={styles.input} value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} placeholder="Example: Machinery & Equipment" />
                </div>
                <div>
                  <label style={styles.label}>Approval Level</label>
                  <select style={styles.select} value={form.approvalLevel} onChange={(e) => setForm({ ...form, approvalLevel: e.target.value })}>
                    <option>Staff</option>
                    <option>Manager</option>
                    <option>{reviewLabel}</option>
                  </select>
                </div>
              </div>

              <div style={{ ...styles.formGrid, marginTop: 14 }}>
                <div>
                  <label style={styles.label}>Risk Level</label>
                  <select style={styles.select} value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value })}>
                    <option>STANDARD</option>
                    <option>REVIEW REQUIRED</option>
                    <option>HIGH RISK</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Escalation Required</label>
                  <input style={styles.input} value={form.escalationRequired} onChange={(e) => setForm({ ...form, escalationRequired: e.target.value })} placeholder="Example: Jessica - Director of Finance" />
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>QuickBooks Mapping</label>
                <input style={styles.input} value={form.quickBooksMapping} onChange={(e) => setForm({ ...form, quickBooksMapping: e.target.value })} placeholder="Example: Fixed Assets → Machinery & Equipment" />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Common Mistake</label>
                <textarea style={styles.textarea} value={form.commonMistake} onChange={(e) => setForm({ ...form, commonMistake: e.target.value })} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Why This Matters</label>
                <textarea style={styles.textarea} value={form.whyItMatters} onChange={(e) => setForm({ ...form, whyItMatters: e.target.value })} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <textarea style={styles.textarea} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Classify As</label>
                <textarea style={styles.textarea} value={form.classifyAs} onChange={(e) => setForm({ ...form, classifyAs: e.target.value })} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Do Not Classify As</label>
                <textarea style={styles.textarea} value={form.doNotClassifyAs} onChange={(e) => setForm({ ...form, doNotClassifyAs: e.target.value })} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Keywords (comma-separated)</label>
                <input style={styles.input} value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="forklift, capital, fixed asset" />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Examples (one per line)</label>
                <textarea style={styles.textarea} value={form.examples} onChange={(e) => setForm({ ...form, examples: e.target.value })} placeholder={"Forklift purchase\nNew saw system"} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Suggested Journal Entry</label>
                <textarea style={styles.textarea} value={form.journalEntry} onChange={(e) => setForm({ ...form, journalEntry: e.target.value })} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Notes / Policy Guidance</label>
                <textarea style={styles.textarea} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Last Reviewed</label>
                <input type="date" style={styles.input} value={form.lastReviewed} onChange={(e) => setForm({ ...form, lastReviewed: e.target.value })} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 18 }}>
                <button style={{ ...styles.button, background: "#f1f5f9", color: "#0f172a" }} onClick={resetForm}>Reset</button>
                <button style={{ ...styles.button, background: "#2563eb", color: "white" }} onClick={addGuideline}>Save Guideline</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
