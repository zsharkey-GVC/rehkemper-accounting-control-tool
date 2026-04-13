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
  },
  {
    id: 15,
    term: "Customer Invoice - Delivered Product",
    category: "Accounts Receivable",
    subcategory: "Billing",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "None unless unusual",
    quickBooksMapping: "Accounts Receivable → Product Revenue",
    commonMistake: "Recording revenue without creating a customer receivable or invoicing before delivery.",
    whyItMatters: "Bad AR timing affects collections, revenue recognition, and month-end reporting.",
    description: "Invoice issued to a customer for trusses, wall panels, windows, doors, lumber packages, or related products after the earning event has occurred.",
    classifyAs: "Accounts Receivable with offset to the appropriate revenue account.",
    doNotClassifyAs: "Cash receipt or customer deposit.",
    keywords: ["ar", "invoice", "billing", "customer invoice", "receivable"],
    examples: [
      "Invoice for delivered truss package",
      "Invoice for completed wall panel shipment",
      "Invoice for delivered materials package"
    ],
    journalEntry: "Dr Accounts Receivable\nCr Revenue",
    notes: "Use only when delivery or the applicable earning event has occurred under company policy.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 16,
    term: "Marketing Sponsorship / Advertising Spend",
    category: "Advertising & Marketing",
    subcategory: "Sponsorships / Promotion",
    approvalLevel: "Manager",
    riskLevel: "STANDARD",
    escalationRequired: "Manager if unusual or large",
    quickBooksMapping: "Advertising & Marketing Expense",
    commonMistake: "Coding marketing spend to charitable donations, office expense, or miscellaneous expense.",
    whyItMatters: "Clear marketing classification improves budget tracking and visibility into business development spend.",
    description: "Advertising, promotion, sponsorships, and brand visibility costs intended to generate or support sales.",
    classifyAs: "Advertising & Marketing Expense.",
    doNotClassifyAs: "Office expense or owner draw.",
    keywords: ["advertising", "marketing", "promotion", "sponsorship", "branding"],
    examples: [
      "Local sponsorship tied to company promotion",
      "Digital advertising invoice",
      "Printed promotional materials"
    ],
    journalEntry: "Dr Advertising & Marketing Expense\nCr Cash or Accounts Payable",
    notes: "Support should indicate the business purpose and promotional nature of the expenditure.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 17,
    term: "Bank Transfer Between Accounts",
    category: "Banking & Treasury",
    subcategory: "Transfers",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "None unless unusual",
    quickBooksMapping: "Cash Transfer Between Bank Accounts",
    commonMistake: "Recording inter-account bank transfers as revenue or expense.",
    whyItMatters: "Cash transfer miscoding creates false revenue, false expenses, and reconciliation problems.",
    description: "Movement of cash between company bank accounts, including operating, payroll, or savings accounts.",
    classifyAs: "Transfer between cash accounts.",
    doNotClassifyAs: "Revenue, expense, or loan unless the substance supports that treatment.",
    keywords: ["bank transfer", "transfer", "move cash", "treasury"],
    examples: [
      "Transfer from operating account to payroll account",
      "Move funds to a reserve account",
      "Inter-account online banking transfer"
    ],
    journalEntry: "Dr Cash - Receiving Account\nCr Cash - Sending Account",
    notes: "Use transfer treatment consistently to avoid distortion in the income statement.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 18,
    term: "Company Credit Card Purchase Review",
    category: "Credit Cards",
    subcategory: "Card Coding",
    approvalLevel: "Manager",
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: "Manager if merchant name alone is unclear",
    quickBooksMapping: "Varies based on underlying purchase",
    commonMistake: "Coding credit card transactions solely based on the merchant name without reviewing what was actually purchased.",
    whyItMatters: "A single merchant can sell fixed assets, supplies, repairs, meals, or personal items. Substance controls classification.",
    description: "Review of credit card transactions where the merchant name alone does not determine the proper account.",
    classifyAs: "Classify based on the actual goods or services purchased.",
    doNotClassifyAs: "Default to miscellaneous expense or a generic merchant-based rule.",
    keywords: ["credit card", "merchant", "visa", "mastercard", "amex", "card charge"],
    examples: [
      "Amazon purchase that could be office supplies, tools, or fixed assets",
      "Home improvement store purchase that could be repairs or capital",
      "Restaurant charge that may be business meal or personal"
    ],
    journalEntry: "Varies based on the actual nature of the transaction.",
    notes: "Require receipts and supporting detail for card transactions with ambiguous merchant names.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 19,
    term: "Depreciation Expense",
    category: "Depreciation & Amortization",
    subcategory: "Depreciation",
    approvalLevel: reviewLabel,
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: reviewLabel,
    quickBooksMapping: "Depreciation Expense / Accumulated Depreciation",
    commonMistake: "Ignoring depreciation entries or recording them inconsistently outside the fixed asset schedule.",
    whyItMatters: "Depreciation affects EBITDA adjustments, tax reporting, fixed asset schedules, and accurate net income.",
    description: "Periodic recognition of depreciation on fixed assets based on the approved depreciation schedule.",
    classifyAs: "Depreciation Expense with offset to Accumulated Depreciation.",
    doNotClassifyAs: "Repairs expense or one-time write-off unless specifically approved.",
    keywords: ["depreciation", "amortization", "accumulated depreciation"],
    examples: [
      "Monthly depreciation on plant equipment",
      "Quarterly depreciation on delivery trucks",
      "Year-end depreciation true-up"
    ],
    journalEntry: "Dr Depreciation Expense\nCr Accumulated Depreciation",
    notes: "Use the approved fixed asset schedule and book depreciation consistently.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 20,
    term: "Design Software Subscription",
    category: "Design / Engineering",
    subcategory: "Software",
    approvalLevel: "Manager",
    riskLevel: "STANDARD",
    escalationRequired: "Manager if multi-year or unusual",
    quickBooksMapping: "Software Expense or Prepaid Software",
    commonMistake: "Coding design software to office supplies or failing to defer multi-period subscriptions.",
    whyItMatters: "Engineering and design tools are core to operations and should be tracked separately from generic admin costs.",
    description: "Software used by design or engineering personnel for trusses, panels, drafting, modeling, or component planning.",
    classifyAs: "Software Expense or Prepaid Software depending on term and company policy.",
    doNotClassifyAs: "Office supplies or general misc. expense.",
    keywords: ["design", "engineering", "software", "subscription", "drafting"],
    examples: [
      "Annual truss design software subscription",
      "Monthly engineering platform invoice",
      "Drafting software renewal"
    ],
    journalEntry: "Dr Software Expense or Prepaid Software\nCr Cash or Accounts Payable",
    notes: "Consider contract length and capitalization/deferment policy for longer terms.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 21,
    term: "Owner Distribution",
    category: "Equity / Distributions",
    subcategory: "Owner Withdrawals",
    approvalLevel: reviewLabel,
    riskLevel: "HIGH RISK",
    escalationRequired: reviewLabel,
    quickBooksMapping: "Equity → Distributions",
    commonMistake: "Recording owner draws as payroll, office expense, or loans without support.",
    whyItMatters: "Improper owner distribution coding affects tax treatment, retained earnings, and financial statement integrity.",
    description: "Cash or non-cash distributions to owners outside of normal payroll or reimbursable business expenses.",
    classifyAs: "Owner Distribution / Equity Draw.",
    doNotClassifyAs: "Operating expense or payroll unless the facts support those treatments.",
    keywords: ["distribution", "draw", "owner withdrawal", "equity"],
    examples: [
      "Cash draw to owner",
      "Owner-paid expense reclassified as distribution",
      "Nonbusiness withdrawal from operating account"
    ],
    journalEntry: "Dr Distributions / Equity\nCr Cash",
    notes: "Escalate all owner distribution questions to Jessica - Director of Finance.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 22,
    term: "Fixed Asset Purchase - Office Furniture / Computers",
    category: "Fixed Assets",
    subcategory: "Furniture & Equipment",
    approvalLevel: reviewLabel,
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: reviewLabel,
    quickBooksMapping: "Fixed Assets → Furniture & Equipment / Computer Equipment",
    commonMistake: "Expensing longer-lived office equipment or furniture that should be capitalized under policy.",
    whyItMatters: "Consistent capitalization improves balance sheet accuracy and fixed asset tracking.",
    description: "Furniture, computers, office equipment, or similar assets with useful lives beyond one year that meet capitalization policy.",
    classifyAs: "Fixed Assets if capitalization criteria are met.",
    doNotClassifyAs: "Office supplies or miscellaneous expense when capitalization is required.",
    keywords: ["fixed assets", "computer", "furniture", "office equipment", "desk"],
    examples: [
      "New office workstation purchase",
      "Computer package above threshold",
      "Conference room furniture purchase"
    ],
    journalEntry: "Dr Fixed Assets\nCr Cash or Accounts Payable",
    notes: "Use company capitalization thresholds and fixed asset classes consistently.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 23,
    term: "Insurance Premium",
    category: "Insurance",
    subcategory: "Coverage Premiums",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "Manager if multi-period allocation is unclear",
    quickBooksMapping: "Insurance Expense or Prepaid Insurance",
    commonMistake: "Expensing full annual premiums immediately when a prepaid allocation is required.",
    whyItMatters: "Insurance expense timing affects monthly reporting and period comparability.",
    description: "Payments for general liability, property, auto, workers compensation, or other company insurance coverage.",
    classifyAs: "Insurance Expense or Prepaid Insurance based on the coverage period and company policy.",
    doNotClassifyAs: "Miscellaneous expense.",
    keywords: ["insurance", "premium", "coverage", "workers comp", "liability"],
    examples: [
      "Annual general liability premium",
      "Monthly fleet insurance bill",
      "Workers compensation premium"
    ],
    journalEntry: "Dr Insurance Expense or Prepaid Insurance\nCr Cash or Accounts Payable",
    notes: "Use prepaid treatment when the benefit extends beyond the current period.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 24,
    term: "Intercompany Charge / Reimbursement",
    category: "Intercompany / Related Party",
    subcategory: "Affiliate Activity",
    approvalLevel: reviewLabel,
    riskLevel: "HIGH RISK",
    escalationRequired: reviewLabel,
    quickBooksMapping: "Due To / Due From Affiliate or Intercompany Expense Reimbursement",
    commonMistake: "Leaving intercompany items in ordinary expenses or revenue without identifying the related party nature.",
    whyItMatters: "Related-party activity affects financial statement presentation, due to/from schedules, and valuation analysis.",
    description: "Amounts billed to or from an affiliate, related entity, or parent organization.",
    classifyAs: "Due To / Due From Affiliate or the approved intercompany account.",
    doNotClassifyAs: "Regular AP, AR, or operating expense without noting the related-party nature.",
    keywords: ["intercompany", "affiliate", "related party", "due from affiliate", "due to affiliate"],
    examples: [
      "Shared cost charged by related entity",
      "Expense reimbursement due from affiliate",
      "Management charge from parent or affiliate"
    ],
    journalEntry: "Dr Due From Affiliate or Expense\nCr Due To Affiliate / Intercompany Payable",
    notes: "Escalate all intercompany questions to Jessica - Director of Finance.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 25,
    term: "Inventory Shrinkage / Damage",
    category: "Inventory Adjustments",
    subcategory: "Shrinkage / Damage",
    approvalLevel: "Manager",
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: "Manager",
    quickBooksMapping: "Inventory Adjustment / Shrinkage Expense",
    commonMistake: "Hiding damaged or missing inventory in COGS, supplies, or write-offs without documentation.",
    whyItMatters: "Inventory adjustments directly affect balance sheet accuracy, margins, and control credibility.",
    description: "Losses from damaged, obsolete, missing, or scrapped inventory items.",
    classifyAs: "Inventory adjustment, shrinkage, damage, or scrap account under company policy.",
    doNotClassifyAs: "Routine materials usage or shop supplies.",
    keywords: ["shrinkage", "damage", "inventory adjustment", "scrap", "obsolete"],
    examples: [
      "Damaged lumber in yard",
      "Scrapped finished components",
      "Missing inventory identified during count"
    ],
    journalEntry: "Dr Inventory Shrinkage / Scrap Expense\nCr Inventory",
    notes: "Require documentation and approval for material adjustments.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 26,
    term: "Subcontract Labor",
    category: "Job Costs & Contract Costs",
    subcategory: "Outside Labor",
    approvalLevel: "Manager",
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: "Manager",
    quickBooksMapping: "Subcontract Labor / Direct Job Costs",
    commonMistake: "Recording outside job labor as payroll or office expense.",
    whyItMatters: "Subcontract labor affects job costing, 1099 compliance, and margin analysis.",
    description: "Amounts paid to outside parties performing labor or services tied to jobs, installs, or project support.",
    classifyAs: "Subcontract Labor or the approved direct job-cost account.",
    doNotClassifyAs: "Payroll expense or administrative expense.",
    keywords: ["subcontract", "outside labor", "job cost", "install labor"],
    examples: [
      "Outside install crew invoice",
      "Independent labor tied to a project",
      "Subcontracted field support"
    ],
    journalEntry: "Dr Subcontract Labor / Job Costs\nCr Accounts Payable or Cash",
    notes: "Review vendor setup and 1099 classification separately.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 27,
    term: "Lease Payment - Facility or Equipment",
    category: "Leases / Rent",
    subcategory: "Lease / Rent Expense",
    approvalLevel: reviewLabel,
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: reviewLabel,
    quickBooksMapping: "Rent Expense or Lease Liability / Lease Expense based on policy",
    commonMistake: "Recording all lease payments as straight rent without reviewing lease accounting treatment.",
    whyItMatters: "Lease classification affects liabilities, expense timing, and financial presentation.",
    description: "Payments related to building rent, yard leases, office leases, or leased equipment.",
    classifyAs: "Rent expense or lease accounting treatment consistent with company policy and reporting requirements.",
    doNotClassifyAs: "Repairs or fixed assets unless the transaction substance supports that treatment.",
    keywords: ["lease", "rent", "building rent", "equipment lease"],
    examples: [
      "Monthly building rent payment",
      "Equipment lease installment",
      "Yard or warehouse lease expense"
    ],
    journalEntry: "Varies based on lease treatment policy.",
    notes: "Escalate lease questions to Jessica - Director of Finance.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 28,
    term: "Office Supplies",
    category: "Office & Administrative",
    subcategory: "Supplies",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "None unless unusual",
    quickBooksMapping: "Office Supplies Expense",
    commonMistake: "Mixing office supplies with shop supplies or capitalizing low-dollar admin purchases.",
    whyItMatters: "Separate office/admin costs from production costs for cleaner reporting.",
    description: "Routine office and administrative supplies used by non-production personnel.",
    classifyAs: "Office Supplies Expense.",
    doNotClassifyAs: "Shop supplies, fixed assets, or raw materials.",
    keywords: ["office supplies", "paper", "ink", "admin supplies", "pens"],
    examples: [
      "Printer paper purchase",
      "Ink cartridges for office printer",
      "Desk supply restock"
    ],
    journalEntry: "Dr Office Supplies Expense\nCr Cash or Accounts Payable",
    notes: "Use a separate admin category so production and office costs do not get blended.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 29,
    term: "Prepaid Insurance / Annual Coverage",
    category: "Prepaids / Accruals",
    subcategory: "Prepaids",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "Manager if allocation is unclear",
    quickBooksMapping: "Other Current Assets → Prepaid Insurance",
    commonMistake: "Expensing the full amount of a multi-month or annual prepaid item in one period.",
    whyItMatters: "Prepaid treatment improves period matching and month-end accuracy.",
    description: "Insurance or other operating payments that cover future periods beyond the current month.",
    classifyAs: "Prepaid Insurance or other prepaid asset, then amortize over the benefit period.",
    doNotClassifyAs: "Immediate full-period expense if coverage extends beyond the current reporting period.",
    keywords: ["prepaid", "insurance", "annual premium", "deferred expense"],
    examples: [
      "Annual property insurance payment",
      "Annual liability insurance premium",
      "Multi-month prepaid service contract"
    ],
    journalEntry: "At payment:\nDr Prepaid Insurance\nCr Cash\n\nPeriodic amortization:\nDr Insurance Expense\nCr Prepaid Insurance",
    notes: "Document the start and end dates and amortize systematically.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 30,
    term: "Raw Materials - Lumber and Plates",
    category: "Raw Materials & Inventory",
    subcategory: "Direct Materials",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "None unless unusual",
    quickBooksMapping: "Inventory → Raw Materials",
    commonMistake: "Coding direct production materials to shop supplies or miscellaneous expense.",
    whyItMatters: "Direct materials classification affects inventory, WIP, and gross margin.",
    description: "Lumber, connector plates, hardware, and similar materials purchased for direct use in manufacturing finished products.",
    classifyAs: "Raw Materials Inventory.",
    doNotClassifyAs: "Shop supplies or office expense.",
    keywords: ["raw materials", "lumber", "plates", "hardware", "inventory"],
    examples: [
      "Lumber purchased for truss production",
      "Connector plates for manufacturing",
      "Direct hardware used in finished components"
    ],
    journalEntry: "Dr Raw Materials Inventory\nCr Cash or Accounts Payable",
    notes: "Use this for materials that become part of the finished product sold to the customer.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 31,
    term: "Routine Equipment Repair",
    category: "Repairs & Maintenance",
    subcategory: "Equipment Repairs",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "Manager if unusually large or judgmental",
    quickBooksMapping: "Repairs & Maintenance Expense",
    commonMistake: "Capitalizing ordinary repair costs that merely keep an asset in working condition.",
    whyItMatters: "Proper distinction between repair and capital spending improves fixed asset and expense accuracy.",
    description: "Routine repairs that maintain existing machinery, vehicles, or facilities in ordinary operating condition.",
    classifyAs: "Repairs & Maintenance Expense.",
    doNotClassifyAs: "Fixed Assets unless the work materially improves or extends useful life.",
    keywords: ["repair", "maintenance", "service", "equipment repair"],
    examples: [
      "Routine saw repair",
      "Conveyor maintenance service",
      "Minor motor replacement to restore existing function"
    ],
    journalEntry: "Dr Repairs & Maintenance Expense\nCr Cash or Accounts Payable",
    notes: "Escalate only when the repair may actually be a capital improvement.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 32,
    term: "Revenue - Product Delivery Completed",
    category: "Revenue & Customer Deposits",
    subcategory: "Revenue Recognition",
    approvalLevel: "Manager",
    riskLevel: "HIGH RISK",
    escalationRequired: "Manager",
    quickBooksMapping: "Revenue",
    commonMistake: "Recognizing revenue when an order is booked or when a deposit is received rather than when the earning event occurs.",
    whyItMatters: "Revenue timing is one of the most sensitive financial reporting areas.",
    description: "Recognition of revenue once product delivery or the relevant earning event has occurred under company policy.",
    classifyAs: "Revenue when delivery or earning criteria are satisfied.",
    doNotClassifyAs: "Customer deposit or deferred revenue once the product has been earned and delivered.",
    keywords: ["revenue", "recognition", "delivery", "earned", "sale"],
    examples: [
      "Revenue recognized upon delivery of truss package",
      "Sale recognized when customer receives completed order",
      "Delivery-driven revenue recognition"
    ],
    journalEntry: "Dr Accounts Receivable or Cash\nCr Revenue",
    notes: "Tie revenue recognition to the company’s formal policy and evidence of delivery or performance.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 33,
    term: "Safety Equipment / PPE",
    category: "Safety & Compliance",
    subcategory: "PPE / Safety Supplies",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "None unless unusual",
    quickBooksMapping: "Safety Supplies Expense",
    commonMistake: "Mixing safety purchases with raw materials or office supplies.",
    whyItMatters: "Separating safety spend supports compliance tracking and operational visibility.",
    description: "Protective equipment and safety-related supplies used in production, warehouse, yard, or delivery operations.",
    classifyAs: "Safety Supplies Expense.",
    doNotClassifyAs: "Inventory or office supplies.",
    keywords: ["safety", "ppe", "osha", "vest", "hard hat", "glasses"],
    examples: [
      "Safety glasses purchase",
      "High-visibility vests",
      "Hard hats and PPE restock"
    ],
    journalEntry: "Dr Safety Supplies Expense\nCr Cash or Accounts Payable",
    notes: "Use a dedicated safety account when possible.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 34,
    term: "Sales Tax on Customer Invoice",
    category: "Sales Tax / Use Tax",
    subcategory: "Sales Tax Collected",
    approvalLevel: "Manager",
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: "Manager",
    quickBooksMapping: "Sales Tax Payable",
    commonMistake: "Recording sales tax collected as revenue.",
    whyItMatters: "Sales tax is a liability, not income, and errors can create compliance problems.",
    description: "Sales tax charged to customers on taxable sales or related use tax matters.",
    classifyAs: "Sales Tax Payable or the company’s approved tax liability account.",
    doNotClassifyAs: "Revenue.",
    keywords: ["sales tax", "use tax", "tax payable", "customer tax"],
    examples: [
      "Sales tax on taxable customer invoice",
      "Collected tax on product delivery",
      "Use tax review item"
    ],
    journalEntry: "Dr Accounts Receivable or Cash\nCr Revenue\nCr Sales Tax Payable",
    notes: "Coordinate with the company’s tax compliance procedures.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 35,
    term: "Software Subscription - General Business Use",
    category: "Software & Technology",
    subcategory: "Subscriptions",
    approvalLevel: "Manager",
    riskLevel: "STANDARD",
    escalationRequired: "Manager if multi-year or bundled with hardware",
    quickBooksMapping: "Software Expense or Prepaid Software",
    commonMistake: "Posting subscriptions to office supplies or capitalizing short-term recurring software costs.",
    whyItMatters: "Separating software costs improves budgeting and technology cost visibility.",
    description: "Recurring software, SaaS, and business system subscriptions used across operations or administration.",
    classifyAs: "Software Expense or Prepaid Software depending on term and company policy.",
    doNotClassifyAs: "Office supplies or fixed assets unless software capitalization rules apply.",
    keywords: ["software", "subscription", "saas", "technology", "license"],
    examples: [
      "Monthly business software subscription",
      "Annual SaaS renewal",
      "Cloud platform invoice"
    ],
    journalEntry: "Dr Software Expense or Prepaid Software\nCr Cash or Accounts Payable",
    notes: "Review term length and policy if the subscription spans multiple periods.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 36,
    term: "Income Tax / Franchise Tax Payment",
    category: "Tax & Compliance",
    subcategory: "Tax Payments",
    approvalLevel: reviewLabel,
    riskLevel: "REVIEW REQUIRED",
    escalationRequired: reviewLabel,
    quickBooksMapping: "Income Tax Expense / Tax Liability / Owner Distribution depending on entity structure",
    commonMistake: "Recording tax-related payments to miscellaneous expense without understanding the entity-level treatment.",
    whyItMatters: "Tax classification may differ depending on entity type and how the company handles tax obligations.",
    description: "Payments or accruals related to income taxes, franchise taxes, or similar compliance-related tax obligations.",
    classifyAs: "Tax expense, tax liability reduction, or other approved tax-related account consistent with the company’s tax structure.",
    doNotClassifyAs: "General operating expense without review.",
    keywords: ["tax", "franchise tax", "income tax", "compliance"],
    examples: [
      "Franchise tax payment",
      "State tax compliance payment",
      "Year-end tax accrual adjustment"
    ],
    journalEntry: "Varies based on entity structure and tax treatment.",
    notes: "Escalate tax classification questions to Jessica - Director of Finance.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 37,
    term: "Telephone / Internet / Mobile Service",
    category: "Telecom & Utilities",
    subcategory: "Communications",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "Manager if bundled device purchase is included",
    quickBooksMapping: "Telephone / Internet Expense",
    commonMistake: "Combining telecom service with fixed asset purchases or miscoding service plans to office supplies.",
    whyItMatters: "Separating recurring service from device purchases improves telecom cost tracking.",
    description: "Monthly telephone, mobile, internet, or other communications service charges.",
    classifyAs: "Telephone, Internet, or Telecom Expense.",
    doNotClassifyAs: "Fixed assets unless a separate device purchase qualifies.",
    keywords: ["phone", "internet", "telecom", "wireless", "mobile", "cell"],
    examples: [
      "Monthly mobile service bill",
      "Office internet service invoice",
      "Company phone plan"
    ],
    journalEntry: "Dr Telephone / Internet Expense\nCr Cash or Accounts Payable",
    notes: "If the invoice includes a significant device purchase, split the charges appropriately.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 38,
    term: "Shop Supplies / Small Consumables",
    category: "Tools & Consumables",
    subcategory: "Consumables",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "None unless unusual",
    quickBooksMapping: "Shop Supplies Expense",
    commonMistake: "Charging consumables used in operations to raw materials or capital equipment.",
    whyItMatters: "Separating shop consumables from direct materials improves inventory and production reporting.",
    description: "Consumable items used in the shop, yard, or plant that do not become part of the finished product.",
    classifyAs: "Shop Supplies Expense.",
    doNotClassifyAs: "Raw Materials Inventory or Fixed Assets.",
    keywords: ["shop supplies", "consumables", "gloves", "rags", "tape", "small tools"],
    examples: [
      "Cleaning rags and lubricants",
      "Tape and minor consumables",
      "Low-cost shop-use supplies"
    ],
    journalEntry: "Dr Shop Supplies Expense\nCr Cash or Accounts Payable",
    notes: "Use this for indirect consumables only, not direct materials incorporated into the finished product.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 39,
    term: "Vehicle Fuel and Routine Fleet Costs",
    category: "Vehicles / Fleet",
    subcategory: "Fuel / Routine Fleet",
    approvalLevel: "Staff",
    riskLevel: "STANDARD",
    escalationRequired: "Manager if unusual or capital in nature",
    quickBooksMapping: "Vehicle Fuel Expense / Fleet Expense",
    commonMistake: "Coding routine fleet costs to 1099, inventory, or fixed assets.",
    whyItMatters: "Fleet spend is recurring and should be consistently tracked for operational visibility.",
    description: "Routine costs for company vehicles and fleet operations, including fuel and similar ordinary-use charges.",
    classifyAs: "Vehicle Fuel Expense, Fleet Expense, or Vehicle Repairs depending on the nature of the cost.",
    doNotClassifyAs: "1099 vendor payment review item or fixed asset unless the spend creates a qualifying long-lived asset.",
    keywords: ["vehicle", "fleet", "fuel", "diesel", "truck", "gas"],
    examples: [
      "Diesel fuel for delivery truck",
      "Gasoline for estimator vehicle",
      "Routine fleet operating charge"
    ],
    journalEntry: "Dr Vehicle Fuel / Fleet Expense\nCr Cash, Credit Card Payable, or Accounts Payable",
    notes: "Keep routine fleet costs separate from capital vehicle purchases or major rebuilds.",
    lastReviewed: "2026-04-11"
  },
  {
    id: 40,
    term: "Warehouse / Yard Storage and Handling",
    category: "Warehousing / Yard",
    subcategory: "Yard Operations",
    approvalLevel: "Manager",
    riskLevel: "STANDARD",
    escalationRequired: "Manager if unusual or project-specific",
    quickBooksMapping: "Warehouse / Yard Expense",
    commonMistake: "Mixing yard handling costs with direct materials or office administrative expense.",
    whyItMatters: "Warehouse and yard costs can be meaningful in building component operations and should be tracked separately when possible.",
    description: "Costs related to warehouse, storage yard, yard operations, handling, and general storage support.",
    classifyAs: "Warehouse / Yard Expense or the approved operating account.",
    doNotClassifyAs: "Direct materials unless the cost is specifically assigned under company policy.",
    keywords: ["warehouse", "yard", "storage", "handling", "yard operations"],
    examples: [
      "Storage yard support expense",
      "Warehouse handling charge",
      "General yard operations cost"
    ],
    journalEntry: "Dr Warehouse / Yard Expense\nCr Cash or Accounts Payable",
    notes: "Use a consistent warehouse/yard classification to improve operational cost visibility.",
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

  useEffect(() => {
    saveToBrowser(entries);
  }, [entries]);

  const categories = useMemo(() => {
    const dynamic = Array.from(new Set(entries.map((item) => item.category))).sort();
    return ["All", ...Array.from(new Set([...allCategoryOptions.filter(x => x !== "All"), ...dynamic]))];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const haystack = [
        item.term,
        item.category,
        item.subcategory,
        item.description,
        item.classifyAs,
        item.doNotClassifyAs,
        item.notes,
        item.journalEntry,
        item.riskLevel,
        item.escalationRequired,
        item.quickBooksMapping,
        item.commonMistake,
        item.whyItMatters,
        ...(item.keywords || []),
        ...(item.examples || [])
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
