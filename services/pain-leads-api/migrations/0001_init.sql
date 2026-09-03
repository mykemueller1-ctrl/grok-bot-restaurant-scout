-- Never86 pain-leads schema for Cloudflare D1 (SQLite)
CREATE TABLE IF NOT EXISTS PainLead (
  id TEXT PRIMARY KEY,
  painId TEXT NOT NULL,
  vendorId TEXT,
  category TEXT,
  complaintSummary TEXT NOT NULL,
  quotes TEXT NOT NULL DEFAULT '[]',
  vendorsMentioned TEXT NOT NULL DEFAULT '[]',
  stackGuess TEXT NOT NULL DEFAULT '[]',
  rawContext TEXT,
  status TEXT NOT NULL DEFAULT 'NEEDS_TEACH',
  teachLabel TEXT,
  teachNotes TEXT,
  score REAL,
  identity TEXT,
  venue TEXT,
  sources TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS SalesLead (
  id TEXT PRIMARY KEY,
  painLeadId TEXT,
  painId TEXT NOT NULL,
  vendorId TEXT,
  category TEXT,
  accountName TEXT NOT NULL,
  complaintThesis TEXT NOT NULL,
  whyNever86Now TEXT NOT NULL,
  vendorsToDisplace TEXT NOT NULL DEFAULT '[]',
  stackGuess TEXT NOT NULL DEFAULT '[]',
  suggestedAngle TEXT,
  confidence REAL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  contact TEXT,
  sources TEXT NOT NULL DEFAULT '[]',
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS TeachFeedback (
  id TEXT PRIMARY KEY,
  painLeadId TEXT NOT NULL,
  painId TEXT,
  label TEXT NOT NULL,
  correctedPainId TEXT,
  notes TEXT,
  goodLooksLike TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS VendorLearnedBank (
  id TEXT PRIMARY KEY,
  vendorId TEXT NOT NULL UNIQUE,
  painId TEXT,
  data TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ApprovalRequest (
  id TEXT PRIMARY KEY,
  agentId TEXT,
  action TEXT NOT NULL,
  payload TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_painlead_painId ON PainLead(painId);
CREATE INDEX IF NOT EXISTS idx_painlead_createdAt ON PainLead(createdAt);
CREATE INDEX IF NOT EXISTS idx_saleslead_createdAt ON SalesLead(createdAt);
