import { useState, useRef, useEffect } from "react";
import { StatusBar } from "./StatusBar";
import imgIcici from "figma:asset/bc908a434fafc4e5c82fc0c1fb140ab9c4a90af1.png";

interface Props {
  planId: string;
  onBack: () => void;
}

const NCB_OPTIONS = ["0%", "20%", "25%", "35%", "45%", "50%"];

// ─── Cover Slider ─────────────────────────────────────────────────────────────
function CoverSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ min, max, onChange });

  useEffect(() => {
    stateRef.current = { min, max, onChange };
  });

  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  const startDrag = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const onMove = (ev: PointerEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      const { min: mn, max: mx, onChange: cb } = stateRef.current;
      cb(Math.round(mn + p * (mx - mn)));
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div style={{ position: "relative", height: 36, width: "100%" }}>
      {/* Grey base track */}
      <div
        ref={trackRef}
        style={{
          position: "absolute",
          top: 17,
          left: 0,
          right: 0,
          height: 2,
          background: "#E0E0E0",
          borderRadius: 2,
        }}
      >
        {/* Blue fill */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: `${100 - pct}%`,
            height: "100%",
            background: "#1576DB",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Handle */}
      <div
        onPointerDown={startDrag}
        style={{
          position: "absolute",
          left: `calc(${pct}% - 18px)`,
          top: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "#ECF2F8",
          border: "2px solid #1576DB",
          boxShadow: "0 4px 8px rgba(16,16,16,0.27)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        {/* Three decorative vertical lines */}
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <div style={{ width: 1.5, height: 14, background: "rgba(50,102,145,0.15)", borderRadius: 1 }} />
          <div style={{ width: 1.5, height: 22, background: "rgba(50,102,145,0.15)", borderRadius: 1 }} />
          <div style={{ width: 1.5, height: 14, background: "rgba(50,102,145,0.15)", borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Change Cover Value Sheet ─────────────────────────────────────────────────
function ChangeCoverValueSheet({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (v: number) => void;
}) {
  const MIN = 1078000;
  const MAX = 1930000;
  const DEFAULT = 1438450;

  const [localVal, setLocalVal] = useState(DEFAULT);
  const [inputStr, setInputStr] = useState("");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const lakhStr = (localVal / 100000).toFixed(1);

  const formatted = "₹" + localVal.toLocaleString("en-IN");

  const handleInputBlur = () => {
    setEditing(false);
    const raw = inputStr.replace(/[^0-9]/g, "");
    const n = parseInt(raw, 10);
    if (!isNaN(n)) {
      setLocalVal(Math.max(MIN, Math.min(MAX, n)));
    }
  };

  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 50 }}
    >
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#f5f5f5",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, paddingBottom: 6 }}>
          <div style={{ width: 40, height: 4, borderRadius: 4, background: "#cacaca" }} />
        </div>

        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px 16px",
          }}
        >
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#282828",
            }}
          >
            Change Cover Value
          </p>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#e8e8e8",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="#7e7e7e"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* White card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 16px",
            background: "white",
            borderRadius: 24,
            padding: "24px 16px",
            gap: 24,
          }}
        >
          {/* Badge + Input field */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              width: "100%",
            }}
          >
            {/* Green badge */}
            <div
              style={{
                background: "#dbf0e2",
                borderRadius: 64,
                padding: "2px 6px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  color: "#158939",
                  whiteSpace: "nowrap",
                }}
              >
                20 Insurers Available
              </p>
            </div>

            {/* Value pill input */}
            <div
              onClick={() => {
                setEditing(true);
                setInputStr(String(localVal));
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
              style={{
                background: "#f5f5f5",
                borderRadius: 24,
                width: 190,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "text",
              }}
            >
              {editing ? (
                <input
                  ref={inputRef}
                  style={{
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#282828",
                    textAlign: "center",
                    width: "100%",
                    padding: "0 16px",
                  }}
                  value={inputStr}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/[^0-9]/g, "");
                    setInputStr(raw);
                    const n = parseInt(raw, 10);
                    if (!isNaN(n) && n >= MIN && n <= MAX) {
                      setLocalVal(n);
                    }
                  }}
                  onBlur={handleInputBlur}
                  inputMode="numeric"
                />
              ) : (
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: 20,
                    color: "#282828",
                  }}
                >
                  {formatted}
                </p>
              )}
            </div>
          </div>

          {/* Slider */}
          <CoverSlider
            min={MIN}
            max={MAX}
            value={localVal}
            onChange={(v) => {
              setLocalVal(v);
              setInputStr(String(v));
            }}
          />

          {/* Min / Max labels */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: -16,
            }}
          >
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#7e7e7e" }}>
              ₹10.78 Lakh
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#7e7e7e" }}>
              ₹19.3 Lakh
            </p>
          </div>
        </div>

        {/* Alert box */}
        <div
          style={{
            margin: "12px 16px",
            background: "#dfedff",
            borderRadius: 24,
            padding: "8px 16px",
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          {/* Info icon */}
          <div style={{ flexShrink: 0, marginTop: 1 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 7C7.45 7 7 7.45 7 8V12C7 12.55 7.45 13 8 13C8.55 13 9 12.55 9 12V8C9 7.45 8.55 7 8 7ZM8 6C8.55 6 9 5.55 9 5C9 4.45 8.55 4 8 4C7.45 4 7 4.45 7 5C7 5.55 7.45 6 8 6Z"
                fill="#1576DB"
              />
            </svg>
          </div>
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              color: "#282828",
              lineHeight: "16px",
              flex: 1,
            }}
          >
            Please note that adjusting your covered value will also affect your
            premium.
          </p>
        </div>

        {/* Save button */}
        <div style={{ padding: "0 16px 16px" }}>
          <button
            onClick={() => {
              onSave(localVal);
              onClose();
            }}
            style={{
              width: "100%",
              height: 52,
              borderRadius: 40,
              background: "#004299",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "white",
              }}
            >
              Save ₹{lakhStr} Lakh Cover
            </span>
          </button>
        </div>

        {/* Home indicator */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
          <div style={{ width: 134, height: 5, borderRadius: 100, background: "#101010" }} />
        </div>
      </div>
    </div>
  );
}

// ─── View Breakup Sheet ───────────────────────────────────────────────────────
function ViewBreakupSheet({ onClose }: { onClose: () => void }) {
  const [addonOpen, setAddonOpen] = useState(true);
  const [discountOpen, setDiscountOpen] = useState(true);

  const Row = ({
    label,
    amount,
    bold,
    green,
    sub,
    indent,
  }: {
    label: string;
    amount: string;
    bold?: boolean;
    green?: boolean;
    sub?: string;
    indent?: boolean;
  }) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: sub ? "flex-start" : "center",
        padding: indent ? "4px 0 4px 16px" : "13px 0",
        borderBottom: indent ? "none" : "1px solid #f0f0f0",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: bold ? 700 : 500,
            fontSize: indent ? 12 : 14,
            color: green ? "#158939" : "#282828",
          }}
        >
          {label}
        </p>
        {sub && (
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#7e7e7e", marginTop: 2 }}>
            {sub}
          </p>
        )}
      </div>
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: bold ? 700 : 600,
          fontSize: indent ? 12 : bold ? 16 : 14,
          color: green ? "#158939" : "#282828",
        }}
      >
        {amount}
      </p>
    </div>
  );

  const CollapseRow = ({
    label,
    amount,
    green,
    open,
    onToggle,
    children,
  }: {
    label: string;
    amount: string;
    green?: boolean;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div style={{ borderBottom: "1px solid #f0f0f0" }}>
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "13px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: green ? "#158939" : "#282828",
            }}
          >
            {label}
          </span>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          ></svg>
        </div>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            color: green ? "#158939" : "#282828",
          }}
        >
          {amount}
        </span>
      </button>
      {open && <div style={{ paddingBottom: 8 }}>{children}</div>}
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50 }}>
      {/* Backdrop */}
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#f5f5f5",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: "90%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Handle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 10,
            paddingBottom: 4,
            flexShrink: 0,
          }}
        >
          <div style={{ width: 40, height: 4, borderRadius: 4, background: "#cacaca" }} />
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "12px 16px 8px",
            flexShrink: 0,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: "#282828",
              }}
            >
              Price Breakdown
            </p>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#414244",
                marginTop: 2,
              }}
            >
              ICICI Lombard Motor Insurance
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#e8e8e8",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="#7e7e7e"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 16px 16px" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "0 16px" }}>
            <Row label="Base Premium" amount="₹12,765" />

            <CollapseRow
              label="Add-on (Bundle Price)"
              amount="₹2,380"
              open={addonOpen}
              onToggle={() => setAddonOpen(!addonOpen)}
            >
              {[
                ["Zero Depreciation", "₹200"],
                ["Engine Cover", "₹500"],
                ["NCB Protection", "₹300"],
              ].map(([n, p]) => (
                <div
                  key={n}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0 4px 16px",
                  }}
                >
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#414244" }}>
                    {n}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#414244" }}>
                    {p}
                  </p>
                </div>
              ))}
            </CollapseRow>

            <CollapseRow
              label="Total Discount"
              amount="-₹7,947"
              green
              open={discountOpen}
              onToggle={() => setDiscountOpen(!discountOpen)}
            >
              {[
                ["GLD05 code applied", "-₹500"],
                ["No Claim Bonus (25%)", "-₹1,500"],
                ["Member Exclusive Discount", "-₹100"],
              ].map(([n, p]) => (
                <div
                  key={n}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "4px 0 4px 16px",
                  }}
                >
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#414244" }}>
                    {n}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#414244" }}>
                    {p}
                  </p>
                </div>
              ))}
            </CollapseRow>

            <Row label="GST (18%)" amount="₹1,296" sub="Mandatory by Govt" />

            {/* Total - no border bottom */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#282828",
                }}
              >
                Total Premium
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#282828",
                }}
              >
                ₹19,000
              </p>
            </div>
          </div>
        </div>

        {/* Pay Now button */}
        <div style={{ padding: "8px 16px 16px", flexShrink: 0 }}>
          <button
            style={{
              width: "100%",
              height: 52,
              borderRadius: 40,
              background: "#004299",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "white",
              }}
            >
              Pay Now
            </span>
          </button>
        </div>

        {/* Home indicator */}
        <div
          style={{ display: "flex", justifyContent: "center", paddingBottom: 8, flexShrink: 0 }}
        >
          <div style={{ width: 134, height: 5, borderRadius: 100, background: "#101010" }} />
        </div>
      </div>
    </div>
  );
}

// ─── Review & Pay Screen ──────────────────────────────────────────────────────
export function ReviewPayScreen({ planId, onBack }: Props) {
  const [claimed, setClaimed] = useState<"yes" | "no">("no");
  const [ncb, setNcb] = useState("50%");
  const [coverValue, setCoverValue] = useState(482000);
  const [showCoverSheet, setShowCoverSheet] = useState(false);
  const [showBreakup, setShowBreakup] = useState(false);

  const coverDisplay = "₹" + coverValue.toLocaleString("en-IN");

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#f5f5f5",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, background: "#f5f5f5" }}>
        <StatusBar />
        {/* Nav bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 12px",
            height: 56,
          }}
        >
          {/* Back button */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "stretch",
              flexShrink: 0,
            }}
          >
            <button
              onClick={onBack}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "16px 0",
              }}
            >
              <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
                <path
                  d="M1 7.5H19M1 7.5L7 1M1 7.5L7 14"
                  stroke="#282828"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Title */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: "#282828",
                whiteSpace: "nowrap",
                lineHeight: "24px",
              }}
            >
              Review &amp; Pay
            </p>
          </div>

          {/* Help */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "stretch",
              flexShrink: 0,
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "16px 0",
              }}
            >
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: 12,
                  color: "#1576db",
                  lineHeight: "16px",
                }}
              >
                Help
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable Content ───────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: "0 12px 16px",
          }}
        >
          {/* ── Policy Card ──────────────────────────���──────────── */}
          <div
            style={{
              background: "white",
              borderRadius: 24,
              overflow: "hidden",
              padding: "16px 0",
            }}
          >
            {/* Logo + name */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 16px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 4.875,
                  background: "white",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 4,
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={imgIcici}
                    alt="ICICI"
                    style={{ width: 25.178, height: 27.3, objectFit: "cover" }}
                  />
                </div>
              </div>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#282828",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}
              >
                ICICI Lombard Motor Insurance Policy
              </p>
            </div>

            {/* Plan / Coverage row */}
            <div style={{ display: "flex", padding: "0 16px", marginBottom: 16 }}>
              {/* Plan */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    color: "#7e7e7e",
                    lineHeight: "16px",
                    marginBottom: 4,
                  }}
                >
                  Plan
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    color: "#282828",
                    lineHeight: "16px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Comprehensive
                </p>
              </div>

              {/* Coverage */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    color: "#7e7e7e",
                    lineHeight: "16px",
                    marginBottom: 4,
                  }}
                >
                  Coverage
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: 12,
                      color: "#282828",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    All Inclusive Plan
                  </p>
                  <svg width="2" height="2" viewBox="0 0 2 2" fill="none">
                    <circle cx="1" cy="1" r="1" fill="#7E7E7E" />
                  </svg>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: 12,
                        color: "#1576db",
                        lineHeight: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Edit
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Cover / Duration row */}
            <div style={{ display: "flex", padding: "0 16px" }}>
              {/* Cover */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    color: "#7e7e7e",
                    lineHeight: "16px",
                    marginBottom: 4,
                  }}
                >
                  Cover
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 600,
                      fontSize: 12,
                      color: "#282828",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {coverDisplay}
                  </p>
                  <svg width="2" height="2" viewBox="0 0 2 2" fill="none">
                    <circle cx="1" cy="1" r="1" fill="#7E7E7E" />
                  </svg>
                  <button
                    onClick={() => setShowCoverSheet(true)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: 12,
                        color: "#1576db",
                        lineHeight: "16px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Edit
                    </p>
                  </button>
                </div>
              </div>

              {/* Policy Duration */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    color: "#7e7e7e",
                    lineHeight: "16px",
                    marginBottom: 4,
                  }}
                >
                  Policy Duration
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    color: "#282828",
                    lineHeight: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  24 Jan 26 - 9 May 27
                </p>
              </div>
            </div>
          </div>

          {/* ── Confirm Details Card ─────────────────────────────── */}
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflow: "hidden",
            }}
          >
            {/* Section header */}
            <div style={{ padding: "8px 0px" }}>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#282828",
                  lineHeight: "20px",
                }}
              >
                Confirm Details
              </p>
            </div>

            {/* Card content (320px centered) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                width: "100%",
              }}
            >
              {/* Claim question + Yes/No */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 12,
                    color: "#282828",
                    lineHeight: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Have you claimed your policy in last 12 months?
                </p>

                {/* Yes / No chips */}
                <div style={{ display: "flex", gap: 8 }}>
                  {/* Yes */}
                  <button
                    onClick={() => setClaimed("yes")}
                    style={{
                      width: 56,
                      minHeight: 32,
                      borderRadius: 64,
                      background: claimed === "yes" ? "#ecf2f8" : "white",
                      border: `1px solid ${claimed === "yes" ? "#d8e7f7" : "#e8e1e1"}`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "6px 12px",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: claimed === "yes" ? 600 : 500,
                        fontSize: 12,
                        color: claimed === "yes" ? "#1576db" : "#414244",
                        lineHeight: "16px",
                      }}
                    >
                      Yes
                    </span>
                  </button>

                  {/* No */}
                  <button
                    onClick={() => setClaimed("no")}
                    style={{
                      width: 56,
                      minHeight: 32,
                      borderRadius: 64,
                      background: claimed === "no" ? "#ecf2f8" : "white",
                      border: `1px solid ${claimed === "no" ? "#d8e7f7" : "#e8e1e1"}`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "6px 12px",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: claimed === "no" ? 600 : 500,
                        fontSize: 12,
                        color: claimed === "no" ? "#1576db" : "#414244",
                        lineHeight: "16px",
                      }}
                    >
                      No
                    </span>
                  </button>
                </div>
              </div>

              {/* NCB section — only when No is selected */}
              {claimed === "no" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 12,
                      color: "#282828",
                      lineHeight: "16px",
                    }}
                  >
                    Select NCB% of previous policy
                  </p>

                  {/* NCB chips — scrollable row, justify-end */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      overflowX: "auto",
                      width: "100%",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {NCB_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setNcb(opt)}
                        style={{
                          minWidth: 56,
                          width: 56,
                          minHeight: 32,
                          borderRadius: 64,
                          background: ncb === opt ? "#ecf2f8" : "white",
                          border: `1px solid ${ncb === opt ? "#d8e7f7" : "#e8e1e1"}`,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "6px 12px",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: ncb === opt ? 600 : 500,
                            fontSize: 12,
                            color: ncb === opt ? "#1576db" : "#414244",
                            lineHeight: "16px",
                          }}
                        >
                          {opt}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Terms ───────────────────────────────────────────── */}
          <div style={{ padding: "0 8px 4px" }}>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                color: "#7e7e7e",
                lineHeight: "12px",
              }}
            >
              By proceeding, I hereby agree to the{" "}
              <span style={{ color: "#1576db" }}>Terms &amp; Conditions</span>{" "}
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          boxShadow: "0px 0px 11px 0px rgba(0,0,0,0.12)",
        }}
      >
        {/* Gradient banner — overlapping with white section by 24px */}
        <div
          style={{
            background:
              "linear-gradient(90deg, rgb(223, 237, 255) 0%, rgb(219, 240, 226) 100%)",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: "8px 16px 32px",
            marginBottom: -24,
          }}
        >
          <p className="text-center"
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12,
              color: "#414244",
              lineHeight: "16px",
            }}
          >
            Saving{" "}
            <strong
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                color: "#158939",
              }}
            >
              ₹7,947
            </strong>{" "}
            with member-exclusive discounts
          </p>
        </div>

        {/* White section (rounded top, z-1, overlaps gradient) */}
       <div
          style={{
            background: "white",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Price row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 12px 0",
            }}
          >
            {/* Price info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12,
                  color: "#7e7e7e",
                  lineHeight: "16px",
                  marginBottom: 2,
                  whiteSpace: "nowrap",
                }}
              >
                Price (including GST)
              </p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#282828",
                    lineHeight: "24px",
                    whiteSpace: "nowrap",
                  }}
                >
                  ₹1,28,494
                </p>
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    color: "#7e7e7e",
                    lineHeight: "20px",
                    textDecoration: "line-through",
                    textDecorationSkipInk: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  ₹2,16,366
                </p>
              </div>
              <button
                onClick={() => setShowBreakup(true)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: 12,
                    color: "#1576db",
                    lineHeight: "16px",
                    marginTop: 4,
                  }}
                >
                  View Breakup
                </p>
              </button>
            </div>

            {/* Pay Now button */}
            <button
              style={{
                width: 172,
                height: 52,
                borderRadius: 40,
                background: "#004299",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: 16,
                  color: "white",
                  lineHeight: "20px",
                }}
              >
                Pay Now
              </span>
            </button>
          </div>

          {/* Home indicator */}
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
            <div
              style={{
                width: 134,
                height: 5,
                borderRadius: 100,
                background: "#101010",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Overlays ────────────────────────────────────────────── */}
      {showCoverSheet && (
        <ChangeCoverValueSheet
          onClose={() => setShowCoverSheet(false)}
          onSave={(v) => setCoverValue(v)}
        />
      )}
      {showBreakup && <ViewBreakupSheet onClose={() => setShowBreakup(false)} />}
    </div>
  );
}
