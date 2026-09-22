"use client";

import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  BookOpen,
  Building2,
  Check,
  ChevronRight,
  CircleCheck,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Database,
  ExternalLink,
  FileCheck2,
  FileText,
  Gauge,
  Landmark,
  Layers3,
  List,
  LockKeyhole,
  Mail,
  Maximize2,
  Menu,
  Network,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Users,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type PaymentMethod = "card" | "bank" | "transfer";
type Scenario = "brisk" | "refund" | "duplicate";
type Panel = "notes" | "overview" | "sources" | null;

const slideMeta = [
  { section: "Vision", title: "Complete the booking journey" },
  { section: "Problem", title: "Booking is digital. Money operations are fragmented." },
  { section: "Outcomes", title: "Design for three outcomes through one financial truth." },
  { section: "Customer", title: "Let the customer finish the job in one page." },
  { section: "Operations", title: "Give operations one place to act." },
  { section: "Financial model", title: "Separate the records that answer different questions." },
  { section: "Reliability", title: "Trust provider evidence, not the browser return." },
  { section: "Integration", title: "Keep Brisk useful without making it the point of failure." },
  { section: "Exceptions", title: "Control the cases that create financial risk." },
  { section: "Compliance", title: "Turn compliance into product behaviour." },
  { section: "Delivery", title: "Deliver in six controlled milestones." },
  { section: "Decisions", title: "Resolve five decisions before build." },
  { section: "Close", title: "Move from booking confirmed to money reconciled." },
];

const speakerNotes = [
  "Open with the outcome. Baysports already has the booking engine. The next step is to complete the journey so customers can pay with confidence and the office can see exactly what happened.",
  "Explain the hand-offs that exist after a booking is agreed. The pain is not only payment collection. It is the repeated checking, invoice chasing, manual matching, and uncertainty about the current balance.",
  "Frame the investment for both owners and operations. Owners need control and visibility. Operations need fewer manual touches. Customers need a clear, trusted path. All three depend on one backend financial truth.",
  "Walk through the customer view. The page is deliberately simple: what was booked, what is due now, what will be due later, how to pay, and which documents are available. The backend decides every allowed amount and action.",
  "Show how the booking Payments tab handles one booking while the Finance workspace handles work across bookings. The interface is action-led, with exceptions and overdue items ahead of decorative reporting.",
  "Explain why one payment field is not enough. Booking value, invoices, cash received, allocations, refunds, settlement, and Brisk synchronisation answer different questions. Keeping them separate prevents double counting and supports audit.",
  "A browser success page is only a message to the customer. The provider callback or verified status check is the financial evidence. This rule avoids false paid states, duplicate attempts, and errors after a delayed response.",
  "Brisk remains the invoice record, but customer payment success must survive a Brisk outage. The platform records the payment first and synchronises accounting in the background. Brisk API support remains a decision gate.",
  "Use the three buttons to demonstrate failure handling. Each case has a controlled response, an auditable state, and a clear next action. Unknown outcomes are reconciled before any retry.",
  "Connect compliance to visible product choices: hosted checkout, server-side access control, immutable history, approved invoice rules, and a retention schedule. These are design requirements, not paperwork after launch.",
  "The plan starts with policy and integration proof, then builds the financial foundation, customer page, finance workspace, open banking, and a controlled pilot. The range is a planning estimate until the decision gates are resolved.",
  "Do not treat these as late implementation questions. Each decision changes scope, accounting behaviour, or operational risk. The first milestone exists to close them with evidence.",
  "Close on the before and after. Baysports keeps the booking platform it already owns and adds the missing financial control layer. Ask for approval to complete the integration and finance design milestone.",
];

const sources = [
  {
    label: "Baysports payments and invoice management design",
    detail: "Primary source document and repository findings",
    href: "#",
  },
  {
    label: "Fracto",
    detail: "Published visual identity and solution framework",
    href: "https://www.fracto.ie/",
  },
  {
    label: "Stripe Ireland pricing",
    detail: "Standard EEA card price used in the planning example",
    href: "https://stripe.com/ie/pricing",
  },
  {
    label: "Brisk pricing",
    detail: "Published Plus and additional-user prices",
    href: "https://www.briskinvoicing.com/de/pricing/index.html",
  },
  {
    label: "Irish Revenue",
    detail: "Invoice, credit note, VAT, and record-retention guidance",
    href: "https://www.revenue.ie/en/vat/vat-records-invoices-credit-notes/invoices/information-required-vat-invoice.aspx",
  },
  {
    label: "Data Protection Commission",
    detail: "Organisational data-protection guidance",
    href: "https://dataprotection.ie/en/organisations/resources-organisations/self-assessment-checklist",
  },
  {
    label: "PCI Security Standards Council",
    detail: "Merchant scope guidance for hosted payment pages",
    href: "https://www.pcisecuritystandards.org/faqs/is-a-merchant-website-still-in-scope-for-pci-dss-if-it-meets-all-the-criteria-for-saq-a/",
  },
];

function FractoBrand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "brand brand-compact" : "brand"}>
      <img src="/fracto-icon.png" alt="" />
      <span>FRACTO</span>
    </div>
  );
}

function SlideHeader({
  index,
  eyebrow,
  title,
  summary,
  inverse = false,
}: {
  index: number;
  eyebrow: string;
  title: string;
  summary?: string;
  inverse?: boolean;
}) {
  return (
    <header className={inverse ? "slide-header inverse" : "slide-header"}>
      <div className="eyebrow">
        <span>{String(index).padStart(2, "0")}</span>
        {eyebrow}
      </div>
      <h2>{title}</h2>
      {summary ? <p>{summary}</p> : null}
    </header>
  );
}

function Pill({ children, tone = "purple" }: { children: React.ReactNode; tone?: "purple" | "green" | "amber" | "slate" }) {
  return <span className={"pill pill-" + tone}>{children}</span>;
}

function IconPoint({
  icon: Icon,
  title,
  copy,
  delay,
}: {
  icon: LucideIcon;
  title: string;
  copy: string;
  delay: number;
}) {
  return (
    <div className="icon-point animate-up" style={{ animationDelay: delay + "ms" }}>
      <span className="icon-point-mark"><Icon size={22} strokeWidth={1.8} /></span>
      <div>
        <strong>{title}</strong>
        <p>{copy}</p>
      </div>
    </div>
  );
}

function MoneyLine({
  label,
  amount,
  muted = false,
  accent = false,
}: {
  label: string;
  amount: string;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={"money-line" + (muted ? " is-muted" : "") + (accent ? " is-accent" : "")}>
      <span>{label}</span>
      <strong>{amount}</strong>
    </div>
  );
}

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [scenario, setScenario] = useState<Scenario>("brisk");

  const go = useCallback((delta: number) => {
    setCurrent((value) => Math.min(slideMeta.length - 1, Math.max(0, value + delta)));
    setPanel(null);
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setPanel(null);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const requestedSlide = Number(new URLSearchParams(window.location.search).get("slide"));
    if (Number.isInteger(requestedSlide) && requestedSlide >= 1 && requestedSlide <= slideMeta.length) {
      setCurrent(requestedSlide - 1);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      const isInteractive = tag === "BUTTON" || tag === "A" || tag === "INPUT" || tag === "TEXTAREA";

      if (event.key === "Escape" && panel) {
        setPanel(null);
        return;
      }
      if (event.key.toLowerCase() === "n") {
        setPanel((value) => (value === "notes" ? null : "notes"));
        return;
      }
      if (event.key.toLowerCase() === "o") {
        setPanel((value) => (value === "overview" ? null : "overview"));
        return;
      }
      if (event.key.toLowerCase() === "s") {
        setPanel((value) => (value === "sources" ? null : "sources"));
        return;
      }
      if (event.key.toLowerCase() === "f") {
        void toggleFullscreen();
        return;
      }
      if (isInteractive && event.key === " ") return;

      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        go(1);
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(-1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      }
      if (event.key === "End") {
        event.preventDefault();
        goTo(slideMeta.length - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go, goTo, panel, toggleFullscreen]);

  const progress = ((current + 1) / slideMeta.length) * 100;

  const methodDetail = useMemo(() => {
    if (paymentMethod === "card") return { label: "Secure card checkout", note: "Hosted by the payment provider", icon: CreditCard };
    if (paymentMethod === "bank") return { label: "Pay by Bank", note: "Connect to a supported Irish bank", icon: Landmark };
    return { label: "Bank transfer", note: "Use a unique booking reference", icon: Banknote };
  }, [paymentMethod]);

  const scenarioDetail = useMemo(() => {
    if (scenario === "brisk") {
      return {
        eyebrow: "Provider paid. Brisk unavailable.",
        result: "Credit the customer immediately",
        detail: "Store the confirmed payment, queue the accounting sync, and show a finance exception. Never ask the customer to pay again.",
        state: "Payment received",
        accent: "green",
        icon: CircleCheck,
      };
    }
    if (scenario === "refund") {
      return {
        eyebrow: "€400 credit. €250 returned.",
        result: "Keep exactly €150 as customer credit",
        detail: "Issue the approved correction, reserve the refundable amount, submit against the original payment, then recalculate the balance.",
        state: "€150 credit remains",
        accent: "purple",
        icon: RotateCcw,
      };
    }
    return {
      eyebrow: "Two payment attempts succeed.",
      result: "Record both receipts and raise an exception",
      detail: "Do not hide or discard the second receipt. Allocate the valid obligation, then route the excess through the approved refund or credit policy.",
      state: "Excess payment review",
      accent: "amber",
      icon: TriangleAlert,
    };
  }, [scenario]);

  const ScenarioIcon = scenarioDetail.icon;
  const MethodIcon = methodDetail.icon;

  const slides = [
    <div className="cover-layout" key="cover">
      <div className="cover-copy">
        <div className="cover-kicker animate-up">
          <FractoBrand />
          <span className="cover-divider" />
          <span>Baysports</span>
        </div>
        <h1 className="animate-up delay-1">
          Complete the
          <span>booking journey.</span>
        </h1>
        <p className="cover-summary animate-up delay-2">
          A customer payment experience and finance control layer built around the booking platform Baysports already owns.
        </p>
        <div className="cover-tags animate-up delay-3">
          <Pill>Customer portal</Pill>
          <Pill tone="slate">Payments</Pill>
          <Pill tone="slate">Invoices</Pill>
          <Pill tone="slate">Reconciliation</Pill>
        </div>
      </div>
      <div className="cover-visual" aria-hidden="true">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit orbit-three" />
        <div className="core-mark">
          <span>BOOK</span>
          <ChevronRight />
          <strong>PAID</strong>
        </div>
        <div className="float-label label-customer">Customer clarity</div>
        <div className="float-label label-control">Financial control</div>
        <div className="float-label label-speed">Less admin</div>
      </div>
      <div className="cover-hint animate-up delay-4">
        <span>Use arrow keys to present</span>
        <ArrowRight size={18} />
      </div>
    </div>,

    <div className="problem-layout" key="problem">
      <SlideHeader
        index={2}
        eyebrow="The operational gap"
        title="Booking is digital. Money operations are fragmented."
        summary="The system captures the booking, then staff and customers cross several disconnected steps to finish the financial work."
      />
      <div className="journey-strip">
        {[
          ["01", "Enquiry", "Captured"],
          ["02", "Quote", "Agreed"],
          ["03", "Booking", "Confirmed"],
          ["04", "Invoice", "Manual hand-off"],
          ["05", "Payment", "Chased and checked"],
          ["06", "Reconcile", "Matched later"],
        ].map(([number, label, state], index) => (
          <div className={"journey-step animate-up " + (index > 2 ? "journey-step-gap" : "journey-step-done")} style={{ animationDelay: 110 * index + "ms" }} key={label}>
            <span>{number}</span>
            <strong>{label}</strong>
            <small>{state}</small>
          </div>
        ))}
        <div className="journey-line"><span /></div>
      </div>
      <div className="problem-consequences">
        <IconPoint icon={Mail} title="Customers ask what is due" copy="No single view of deposits, balances, documents, and payment status." delay={720} />
        <IconPoint icon={RefreshCw} title="Operations repeat checks" copy="Receipts, invoices, and bank entries need manual follow-up and matching." delay={820} />
        <IconPoint icon={Gauge} title="Owners see the position late" copy="Outstanding money and unresolved exceptions are difficult to read at a glance." delay={920} />
      </div>
      <div className="statement-line animate-up delay-5">
        The missing product is the financial layer between <strong>booking confirmed</strong> and <strong>money reconciled</strong>.
      </div>
    </div>,

    <div className="outcome-layout" key="outcomes">
      <SlideHeader
        index={3}
        eyebrow="The design target"
        title="Design for three outcomes through one financial truth."
        summary="Each audience sees a simpler experience because the backend owns the balance, allowed actions, and audit history."
      />
      <div className="outcome-columns">
        <div className="outcome-column animate-up">
          <span className="outcome-number">01</span>
          <Users size={34} />
          <h3>Customer confidence</h3>
          <p>See the booking, pay the right amount, download the right document, and understand what happens next.</p>
          <b>Fewer payment questions</b>
        </div>
        <div className="outcome-column animate-up delay-1">
          <span className="outcome-number">02</span>
          <WalletCards size={34} />
          <h3>Operational speed</h3>
          <p>Request, inspect, match, correct, refund, and follow up from one controlled workspace.</p>
          <b>Fewer manual touches</b>
        </div>
        <div className="outcome-column outcome-column-dark animate-up delay-2">
          <span className="outcome-number">03</span>
          <CircleDollarSign size={34} />
          <h3>Owner control</h3>
          <p>Know what is due, what arrived, what reached the bank, and what still needs attention.</p>
          <b>Clear financial position</b>
        </div>
      </div>
      <div className="truth-band animate-up delay-4">
        <Database size={26} />
        <span>One backend-calculated source of truth</span>
        <div className="truth-items">
          <span>obligation</span><span>invoice</span><span>payment</span><span>settlement</span>
        </div>
      </div>
    </div>,

    <div className="customer-layout" key="customer">
      <div className="customer-copy">
        <SlideHeader
          index={4}
          eyebrow="Customer experience"
          title="Let the customer finish the job in one page."
          summary="Keep the page focused on the next financial action. The backend supplies every total, status, and available method."
        />
        <div className="customer-principles">
          <IconPoint icon={Check} title="Answer the next question" copy="What is due now, what comes later, and what has already been received." delay={280} />
          <IconPoint icon={LockKeyhole} title="Keep access booking-scoped" copy="A secure invitation opens only the booking and documents the customer is allowed to see." delay={380} />
          <IconPoint icon={Clock3} title="Explain uncertain states" copy="If confirmation is delayed, show processing and check the provider before offering a retry." delay={480} />
        </div>
      </div>
      <div className="portal-window animate-scale">
        <div className="window-bar">
          <span className="window-dot" /><span className="window-dot" /><span className="window-dot" />
          <span className="window-address">secure.baysports.ie/booking/BY-2048</span>
        </div>
        <div className="portal-body">
          <div className="portal-topline">
            <div>
              <small>Your Baysports booking</small>
              <h3>St. Brigid&apos;s School</h3>
            </div>
            <Pill tone="green">Booking confirmed</Pill>
          </div>
          <div className="portal-summary">
            <div><span>Visit</span><strong>18 May 2027</strong></div>
            <div><span>Participants</span><strong>42 students</strong></div>
            <div><span>Booking total</span><strong>€2,000.00</strong></div>
          </div>
          <div className="amount-panel">
            <div>
              <small>Amount due now</small>
              <strong>€500.00</strong>
              <span>Deposit due 30 September</span>
            </div>
            <div className="balance-ring"><span>25%</span><small>of total</small></div>
          </div>
          <div className="method-row" role="group" aria-label="Payment method example">
            {([
              ["card", CreditCard, "Card"],
              ["bank", Landmark, "Pay by Bank"],
              ["transfer", Banknote, "Transfer"],
            ] as const).map(([id, Icon, label]) => (
              <button className={paymentMethod === id ? "method active" : "method"} onClick={() => setPaymentMethod(id)} key={id}>
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <button className="primary-action">
            <MethodIcon size={19} />
            <span>{methodDetail.label}</span>
            <ChevronRight size={18} />
          </button>
          <div className="provider-note"><ShieldCheck size={15} /> {methodDetail.note}</div>
          <div className="document-row">
            <FileText size={18} />
            <div><strong>Invoice BY-2048-01</strong><small>PDF · issued 22 September 2026</small></div>
            <button aria-label="Open invoice"><ExternalLink size={17} /></button>
          </div>
        </div>
      </div>
    </div>,

    <div className="operations-layout" key="operations">
      <SlideHeader
        index={5}
        eyebrow="Operations experience"
        title="Give operations one place to act."
        summary="Add a Payments tab to each booking and a Finance workspace for work across bookings."
      />
      <div className="finance-window animate-scale">
        <div className="finance-sidebar">
          <FractoBrand compact />
          {[
            [Building2, "Bookings"],
            [ReceiptText, "Invoices"],
            [WalletCards, "Payments"],
            [RefreshCw, "Reconciliation"],
            [RotateCcw, "Refunds"],
          ].map(([Icon, label], index) => {
            const MenuIcon = Icon as LucideIcon;
            return <div className={index === 2 ? "finance-nav active" : "finance-nav"} key={label as string}><MenuIcon size={18} /><span>{label as string}</span></div>;
          })}
        </div>
        <div className="finance-content">
          <div className="finance-titlebar">
            <div><small>Finance workspace</small><h3>Payments requiring attention</h3></div>
            <button><RefreshCw size={16} /> Sync status</button>
          </div>
          <div className="finance-kpis">
            <div><small>Due this week</small><strong>€18,450</strong><span>14 bookings</span></div>
            <div><small>Received today</small><strong>€6,720</strong><span>9 payments</span></div>
            <div className="kpi-alert"><small>Exceptions</small><strong>7</strong><span>2 need approval</span></div>
          </div>
          <div className="finance-table">
            <div className="finance-row finance-head"><span>Booking</span><span>Status</span><span>Method</span><span>Amount</span><span>Next action</span></div>
            {[
              ["BY-2048 · St. Brigid's", "Paid", "Card", "€500.00", "Sync queued", "green"],
              ["BY-2061 · Coláiste Mhuire", "Due", "Pay by Bank", "€750.00", "Send reminder", "purple"],
              ["BY-1997 · St. Joseph's", "Unmatched", "Transfer", "€1,200.00", "Review reference", "amber"],
              ["BY-1988 · Scoil Eoin", "Refund", "Card", "€250.00", "Approve", "slate"],
            ].map(([booking, status, method, amount, action, tone], index) => (
              <div className="finance-row animate-row" style={{ animationDelay: 300 + index * 120 + "ms" }} key={booking}>
                <span><strong>{booking}</strong><small>School tour</small></span>
                <span><Pill tone={tone as "purple" | "green" | "amber" | "slate"}>{status}</Pill></span>
                <span>{method}</span>
                <span><strong>{amount}</strong></span>
                <span><button>{action}<ChevronRight size={14} /></button></span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ops-caption">
        <span><Check /> Every action previews its effect</span>
        <span><ShieldCheck /> Permissions enforced in the backend</span>
        <span><FileCheck2 /> Full history for corrections and refunds</span>
      </div>
    </div>,

    <div className="model-layout" key="model">
      <SlideHeader
        index={6}
        eyebrow="Financial model"
        title="Separate the records that answer different questions."
        summary="A single paid field cannot explain the obligation, the document, the money, and the bank settlement."
      />
      <div className="ledger-stack">
        {[
          { icon: Building2, label: "Booking value", question: "What did Baysports agree to sell?", value: "€2,000", tone: "tone-one" },
          { icon: ReceiptText, label: "Invoice", question: "What has been formally billed?", value: "€2,000", tone: "tone-two" },
          { icon: CreditCard, label: "Payment", question: "What did the customer actually pay?", value: "€500", tone: "tone-three" },
          { icon: Layers3, label: "Allocation", question: "Which obligation did the payment settle?", value: "Deposit", tone: "tone-four" },
          { icon: Landmark, label: "Settlement", question: "What reached the Baysports bank?", value: "€492.25", tone: "tone-five" },
          { icon: RefreshCw, label: "Brisk sync", question: "What has reached the accounting system?", value: "Queued", tone: "tone-six" },
        ].map(({ icon: Icon, label, question, value, tone }, index) => (
          <div className={"ledger-layer " + tone + " animate-layer"} style={{ animationDelay: index * 100 + "ms" }} key={label}>
            <span className="ledger-icon"><Icon size={22} /></span>
            <strong>{label}</strong>
            <p>{question}</p>
            <b>{value}</b>
          </div>
        ))}
      </div>
      <div className="model-example animate-up delay-5">
        <div><span>Customer paid</span><strong>€500.00</strong></div>
        <span className="math-sign">−</span>
        <div><span>Stripe fee example</span><strong>€7.75</strong></div>
        <span className="math-sign">=</span>
        <div><span>Expected payout</span><strong>€492.25</strong></div>
        <p>The customer still receives <b>€500 credit</b>. Processing cost never becomes customer debt.</p>
      </div>
    </div>,

    <div className="evidence-layout" key="evidence">
      <SlideHeader
        index={7}
        eyebrow="Payment reliability"
        title="Trust provider evidence, not the browser return."
        summary="The customer can close a tab, lose a connection, or return before the provider sends confirmation."
      />
      <div className="evidence-compare">
        <div className="evidence-side evidence-weak animate-left">
          <div className="evidence-label"><X size={18} /> Fragile signal</div>
          <div className="browser-mini">
            <span>Customer browser</span>
            <strong>“Payment complete”</strong>
          </div>
          <div className="down-arrow">↓</div>
          <div className="state-mini state-danger">Mark booking paid</div>
          <p>A redirect can be missing, repeated, or forged. It is not financial proof.</p>
        </div>
        <div className="evidence-side evidence-strong animate-right">
          <div className="evidence-label"><Check size={18} /> Authoritative evidence</div>
          <div className="reliable-flow">
            <div><CreditCard /><span>Provider</span></div>
            <ChevronRight />
            <div><ShieldCheck /><span>Verified callback</span></div>
            <ChevronRight />
            <div><Database /><span>Idempotent record</span></div>
          </div>
          <div className="state-mini state-success">Payment received once</div>
          <p>Repeated notifications have one effect. Unknown outcomes are checked before a new attempt.</p>
        </div>
      </div>
      <div className="evidence-rules">
        {[
          ["Return before callback", "Show processing"],
          ["Provider times out", "Check status"],
          ["Callback repeats", "Apply once"],
          ["Brisk is offline", "Queue sync"],
        ].map(([trigger, action], index) => (
          <div className="rule-pair animate-up" style={{ animationDelay: 650 + index * 100 + "ms" }} key={trigger}>
            <span>{trigger}</span><ChevronRight size={15} /><strong>{action}</strong>
          </div>
        ))}
      </div>
    </div>,

    <div className="architecture-layout" key="architecture">
      <SlideHeader
        index={8}
        eyebrow="Integration architecture"
        title="Keep Brisk useful without making it the point of failure."
        summary="The NestJS backend owns every rule and financial state. Providers perform specialist tasks at controlled boundaries."
      />
      <div className="architecture-map">
        <div className="arch-left">
          <div className="arch-node customer-node animate-left"><Users /><span>Customer portal</span><small>View · pay · download</small></div>
          <div className="arch-node staff-node animate-left delay-1"><Building2 /><span>Operations workspace</span><small>Request · reconcile · correct</small></div>
        </div>
        <div className="arch-arrow"><span /></div>
        <div className="arch-core animate-scale">
          <Network size={34} />
          <strong>NestJS financial core</strong>
          <small>Rules · access · audit · orchestration</small>
          <div className="core-database"><Database size={18} /> Supabase Postgres via Prisma</div>
        </div>
        <div className="arch-arrow arch-arrow-right"><span /></div>
        <div className="arch-providers">
          <div className="provider-card animate-right"><CreditCard /><div><strong>Stripe</strong><small>Card collection</small></div><Pill tone="green">Known</Pill></div>
          <div className="provider-card animate-right delay-1"><Landmark /><div><strong>TrueLayer</strong><small>Pay by Bank</small></div><Pill>Validate</Pill></div>
          <div className="provider-card provider-risk animate-right delay-2"><ReceiptText /><div><strong>Brisk</strong><small>Invoice record</small></div><Pill tone="amber">API gate</Pill></div>
          <div className="provider-card animate-right delay-3"><Mail /><div><strong>Postmark</strong><small>Notifications</small></div><Pill tone="green">Existing</Pill></div>
        </div>
      </div>
      <div className="architecture-rule animate-up delay-5">
        <ShieldCheck size={23} />
        <p><strong>A payment remains received when accounting sync fails.</strong> The system keeps the confirmed money, exposes the exception, and retries safely.</p>
      </div>
    </div>,

    <div className="exception-layout" key="exceptions">
      <div className="exception-copy">
        <SlideHeader
          index={9}
          eyebrow="Exception handling"
          title="Control the cases that create financial risk."
          summary="Explore three cases. Each one produces an explicit state and a controlled next action."
        />
        <div className="scenario-tabs" role="tablist" aria-label="Financial exception examples">
          <button className={scenario === "brisk" ? "active" : ""} onClick={() => setScenario("brisk")}><RefreshCw /> Brisk outage</button>
          <button className={scenario === "refund" ? "active" : ""} onClick={() => setScenario("refund")}><RotateCcw /> Partial refund</button>
          <button className={scenario === "duplicate" ? "active" : ""} onClick={() => setScenario("duplicate")}><WalletCards /> Double payment</button>
        </div>
        <div className="scenario-prompt">
          <small>Operating rule</small>
          <p>Never infer, overwrite, or retry a financial outcome without provider evidence and an auditable decision.</p>
        </div>
      </div>
      <div className={"scenario-stage scenario-" + scenario}>
        <div className="scenario-icon"><ScenarioIcon size={44} /></div>
        <span className="scenario-eyebrow">{scenarioDetail.eyebrow}</span>
        <h3>{scenarioDetail.result}</h3>
        <p>{scenarioDetail.detail}</p>
        <div className={"scenario-state state-" + scenarioDetail.accent}>
          <span>Resulting state</span><strong>{scenarioDetail.state}</strong>
        </div>
        <div className="scenario-audit">
          <FileCheck2 size={18} />
          <span>Actor, evidence, amount, timestamp, and next action recorded</span>
        </div>
      </div>
    </div>,

    <div className="compliance-layout" key="compliance">
      <SlideHeader
        index={10}
        eyebrow="Security and compliance"
        title="Turn compliance into product behaviour."
        summary="The controls should be visible in how the product works, how people gain access, and how financial changes are recorded."
      />
      <div className="control-grid">
        <div className="control-item control-feature animate-up">
          <div className="control-icon"><CreditCard /></div>
          <span>01</span>
          <h3>Hosted collection</h3>
          <p>Card data stays with the payment provider. No card numbers or CVC values enter Baysports logs or records.</p>
          <b>Reduced PCI exposure</b>
        </div>
        <div className="control-item animate-up delay-1">
          <div className="control-icon"><LockKeyhole /></div>
          <span>02</span>
          <h3>Scoped access</h3>
          <p>Backend authorization limits staff by role and customers by booking. Invitations can expire or be revoked.</p>
          <b>Least privilege</b>
        </div>
        <div className="control-item animate-up delay-2">
          <div className="control-icon"><FileCheck2 /></div>
          <span>03</span>
          <h3>Recorded corrections</h3>
          <p>Invoices, credit notes, refunds, and write-offs keep their history. Financial records are corrected, never silently replaced.</p>
          <b>Audit-ready workflow</b>
        </div>
        <div className="control-item animate-up delay-3">
          <div className="control-icon"><ShieldCheck /></div>
          <span>04</span>
          <h3>Approved policies</h3>
          <p>Revenue, VAT, retention, consumer terms, accessibility, and provider roles are confirmed before launch.</p>
          <b>Accountant and legal review</b>
        </div>
      </div>
      <div className="compliance-footer">
        <TriangleAlert size={19} />
        <span>Move database, Supabase service-role, Postmark, and new payment secrets to secure runtime injection before payment launch.</span>
      </div>
    </div>,

    <div className="delivery-layout" key="delivery">
      <SlideHeader
        index={11}
        eyebrow="Delivery plan"
        title="Deliver in six controlled milestones."
        summary="Close the policy and integration questions first, then build toward a reviewed pilot."
      />
      <div className="roadmap">
        {[
          ["01", "Design proof", "Policy, providers, access, migration"],
          ["02", "Foundation", "Records, permissions, audit, secrets"],
          ["03", "Customer + cards", "Portal, checkout, history, receipts"],
          ["04", "Finance + Brisk", "Invoices, matching, refunds, sync"],
          ["05", "Pay by Bank", "Coverage, delayed states, fallback"],
          ["06", "Pilot + rollout", "Opening balances, training, recovery"],
        ].map(([number, title, copy], index) => (
          <div className="roadmap-step animate-up" style={{ animationDelay: 90 * index + "ms" }} key={number}>
            <span>{number}</span>
            <strong>{title}</strong>
            <p>{copy}</p>
          </div>
        ))}
        <div className="roadmap-track"><span /></div>
      </div>
      <div className="commercial-band">
        <div className="commercial-primary">
          <small>Initial delivery timeline</small>
          <strong>6–8 <span>months</span></strong>
          <p>Reuses the current booking platform and assumes workable integrations.</p>
        </div>
        <div className="commercial-metric">
          <small>Illustrative delivery</small>
          <strong>x–y</strong>
          <span>at z per day</span>
        </div>
        <div className="commercial-metric">
          <small>With 20% contingency</small>
          <strong>1.2x–1.2y</strong>
          <span>planning range</span>
        </div>
        <div className="commercial-note">
          <TriangleAlert size={18} />
          <span>Provider fees, VAT, substantial migration, and unsupported custom Brisk work are excluded.</span>
        </div>
      </div>
    </div>,

    <div className="decision-layout" key="decisions">
      <SlideHeader
        index={12}
        eyebrow="Decision gates"
        title="Resolve five decisions before build."
        summary="These choices change the accounting model, scope, customer promise, and operational controls."
      />
      <div className="decision-list">
        {[
          ["01", "Brisk integration", "Confirm supported API, webhooks, payment records, and Irish account behaviour.", "Vendor evidence"],
          ["02", "Invoice model", "Approve full-invoice instalments or staged invoices. Never run both for the same obligation.", "Accountant approval"],
          ["03", "Pay by Bank", "Pilot representative school accounts, including business and multi-signatory journeys.", "Coverage proof"],
          ["04", "Historical balances", "Establish what deposit, amount-paid, dates, and notes mean before migration.", "Data review"],
          ["05", "Policies and roles", "Set deposit timing, refunds, cancellation terms, approval limits, and support ownership.", "Business decision"],
        ].map(([number, title, copy, owner], index) => (
          <div className="decision-row animate-left" style={{ animationDelay: index * 100 + "ms" }} key={number}>
            <span className="decision-number">{number}</span>
            <div><strong>{title}</strong><p>{copy}</p></div>
            <Pill tone={index === 1 ? "amber" : "slate"}>{owner}</Pill>
          </div>
        ))}
      </div>
      <div className="decision-next animate-up delay-5">
        <Sparkles size={24} />
        <div><small>Recommended next step</small><strong>Approve the financial and integration design milestone.</strong></div>
        <ChevronRight size={24} />
      </div>
    </div>,

    <div className="close-layout" key="close">
      <div className="close-brand animate-up"><FractoBrand /></div>
      <h2 className="animate-up delay-1">
        Move from booking confirmed
        <span>to money reconciled.</span>
      </h2>
      <div className="close-flow animate-up delay-2">
        <div><Building2 /><strong>Booking</strong><small>Already working</small></div>
        <ChevronRight />
        <div><ReceiptText /><strong>Invoice</strong><small>Controlled</small></div>
        <ChevronRight />
        <div><CreditCard /><strong>Payment</strong><small>Customer-led</small></div>
        <ChevronRight />
        <div><Landmark /><strong>Settlement</strong><small>Reconciled</small></div>
      </div>
      <div className="close-outcomes animate-up delay-3">
        <span><Check /> Clearer for customers</span>
        <span><Check /> Faster for operations</span>
        <span><Check /> Safer for owners</span>
      </div>
      <div className="close-cta animate-up delay-4">
        <span>Next</span>
        <strong>Prove the integrations. Approve the finance rules. Build the pilot.</strong>
      </div>
      <p className="close-signoff">Think Tech, Think Fracto.</p>
    </div>,
  ];

  return (
    <main className="presentation-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="deck" aria-live="polite">
        <div className="deck-topbar">
          <button className="logo-button" onClick={() => goTo(0)} aria-label="Go to title slide">
            <FractoBrand compact />
          </button>
          <div className="deck-context">
            <span>{slideMeta[current].section}</span>
            <b>Baysports payments</b>
          </div>
          <div className="deck-actions">
            <button onClick={() => setPanel(panel === "sources" ? null : "sources")} aria-label="Sources and assumptions" title="Sources (S)"><BookOpen size={17} /></button>
            <button onClick={() => setPanel(panel === "overview" ? null : "overview")} aria-label="Slide navigator" title="Overview (O)"><List size={18} /></button>
            <button onClick={() => setPanel(panel === "notes" ? null : "notes")} aria-label="Speaker notes" title="Speaker notes (N)"><Menu size={18} /></button>
            <button onClick={() => void toggleFullscreen()} aria-label="Full screen" title="Full screen (F)"><Maximize2 size={17} /></button>
          </div>
        </div>

        <section className={"slide slide-" + (current + 1)} key={current}>
          {slides[current]}
        </section>

        <div className="deck-bottom">
          <div className="progress-track"><span style={{ width: progress + "%" }} /></div>
          <span className="slide-count">{String(current + 1).padStart(2, "0")} / {String(slideMeta.length).padStart(2, "0")}</span>
          <div className="nav-buttons">
            <button onClick={() => go(-1)} disabled={current === 0} aria-label="Previous slide"><ArrowLeft size={18} /></button>
            <button onClick={() => go(1)} disabled={current === slideMeta.length - 1} aria-label="Next slide"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>

      {panel ? (
        <div className="panel-backdrop" onMouseDown={() => setPanel(null)}>
          <aside className={"side-panel side-panel-" + panel} onMouseDown={(event) => event.stopPropagation()}>
            <button className="panel-close" onClick={() => setPanel(null)} aria-label="Close panel"><X size={20} /></button>
            {panel === "notes" ? (
              <>
                <span className="panel-kicker">Speaker note · {String(current + 1).padStart(2, "0")}</span>
                <h3>{slideMeta[current].title}</h3>
                <p className="speaker-copy">{speakerNotes[current]}</p>
                <div className="speaker-tip"><span>TIP</span> Use N to hide notes while presenting.</div>
              </>
            ) : null}
            {panel === "overview" ? (
              <>
                <span className="panel-kicker">Slide navigator</span>
                <h3>Presentation overview</h3>
                <div className="overview-list">
                  {slideMeta.map((slide, index) => (
                    <button className={index === current ? "active" : ""} onClick={() => goTo(index)} key={slide.title}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <div><small>{slide.section}</small><strong>{slide.title}</strong></div>
                    </button>
                  ))}
                </div>
              </>
            ) : null}
            {panel === "sources" ? (
              <>
                <span className="panel-kicker">Evidence</span>
                <h3>Sources and assumptions</h3>
                <p className="panel-intro">Commercial figures are planning inputs. Provider capability, tax treatment, policies, and scope remain subject to the decision gates in this deck.</p>
                <div className="source-list">
                  {sources.map((source) => (
                    source.href === "#" ? (
                      <div className="source-item" key={source.label}>
                        <div><strong>{source.label}</strong><span>{source.detail}</span></div>
                        <FileText size={17} />
                      </div>
                    ) : (
                      <a className="source-item" href={source.href} target="_blank" rel="noreferrer" key={source.label}>
                        <div><strong>{source.label}</strong><span>{source.detail}</span></div>
                        <ExternalLink size={17} />
                      </a>
                    )
                  ))}
                </div>
              </>
            ) : null}
          </aside>
        </div>
      ) : null}
    </main>
  );
}
