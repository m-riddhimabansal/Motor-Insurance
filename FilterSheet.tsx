import { useState, useRef, useEffect } from "react";

export interface FilterState {
  selectedInsurers: string[];
  selectedAddons: string[];
  selectedDiscount: string;
  minCover: number;
  maxCover: number;
  selectedDrive: string[];
  noInspection: boolean;
}

interface Props {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  current: FilterState;
}

const insurers = [
  "ICICI Lombard", "Acko", "Bajaj", "TATA AIG", "IFFCO Tokio", "SBI",
  "Go Digit", "National", "IndusInd", "Zurich Kotak", "The New India",
  "United India", "Zuno", "Royal Sundaram", "HDFC ERGO",
];
const addons = ["Zero Depreciation", "Engine Protection", "Road Side Assistance", "Personal Accident Cover"];
const discounts = ["Any", "10%+", "20%+", "30%+", "40%+", "50%+", "60%+", "70%+", "80%+", "90%+"];
const payDriveOptions = [
  "< 2,500 km", "< 3,000 km", "< 5,000 km", "< 7,500 km",
  "< 10,000 km", "< 12,500 km", "< 15,000 km",
];

const COVER_MIN = 5;
const COVER_MAX = 20;

// ── Fixed DualRangeSlider with ref-based handlers (no stale closures) ────────
function DualRangeSlider({
  min,
  max,
  low,
  high,
  onChange,
}: {
  min: number;
  max: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ low, high, onChange, min, max });
  useEffect(() => {
    stateRef.current = { low, high, onChange, min, max };
  });

  const getPercent = (val: number) => ((val - min) / (max - min)) * 100;
  const lowPct = getPercent(low);
  const highPct = getPercent(high);

  const computeValue = (clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const { min: mn, max: mx } = stateRef.current;
    return Math.round(mn + pct * (mx - mn));
  };

  const startDrag = (which: "low" | "high") => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const move = (ev: PointerEvent) => {
      const val = computeValue(ev.clientX);
      const { low: curLow, high: curHigh, onChange: cb } = stateRef.current;
      if (which === "low") {
        cb(Math.min(val, curHigh - 1), curHigh);
      } else {
        cb(curLow, Math.max(val, curLow + 1));
      }
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  // Thumb handle — solid blue circle with two white drag lines (matching Figma)
  const Thumb = ({ pct, which }: { pct: number; which: "low" | "high" }) => (
    <div
      className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing"
      style={{
        left: `calc(${pct}% - 12px)`,
        top: -9,
        width: 24,
        height: 24,
        borderRadius: "120px",
        background: "#1576db",
        zIndex: 3,
        touchAction: "none",
        userSelect: "none",
        flexShrink: 0,
      }}
      onPointerDown={startDrag(which)}
    >
      {/* Two vertical white lines (drag indicator) */}
      <div style={{ display: "flex", gap: 3, flexDirection: "row" }}>
        <div style={{ width: 1.8, height: 10.8, background: "rgba(255,255,255,0.6)", borderRadius: 12 }} />
        <div style={{ width: 1.8, height: 10.8, background: "rgba(255,255,255,0.6)", borderRadius: 12 }} />
      </div>
    </div>
  );

  return (
    <div>
      {/* Track */}
      <div className="relative mx-[0px] mb-[0px]" style={{ height: 24 }}>
        <div
          ref={trackRef}
          className="absolute left-0 right-0"
          style={{ top: 6, height: 6 }}
        >
          {/* Left inactive track */}
          <div
            className="absolute h-full"
            style={{
              left: 0,
              width: `${lowPct}%`,
              background: "#d8e7f7",
              borderRadius: "4px 0 0 4px",
            }}
          />
          {/* Active range */}
          <div
            className="absolute h-full"
            style={{
              left: `${lowPct}%`,
              width: `${highPct - lowPct}%`,
              background: "#1576db",
            }}
          />
          {/* Right inactive track */}
          <div
            className="absolute h-full"
            style={{
              left: `${highPct}%`,
              right: 0,
              background: "#d8e7f7",
              borderRadius: "0 4px 4px 0",
            }}
          />

          {/* Thumb handles */}
          <Thumb pct={lowPct} which="low" />
          <Thumb pct={highPct} which="high" />
        </div>
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between pt-[10px]">
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#7e7e7e" }}>
          ₹{min} Lakh
        </span>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#7e7e7e" }}>
          ₹{max} Lakh
        </span>
      </div>
    </div>
  );
}

// ── Cover amount section — single pill display + dual range slider ──────────
function CoverAmountSection({
  minCover,
  maxCover,
  onChange,
}: {
  minCover: number;
  maxCover: number;
  onChange: (low: number, high: number) => void;
}) {
  const [editingMin, setEditingMin] = useState(false);
  const [editingMax, setEditingMax] = useState(false);
  const [minStr, setMinStr] = useState(String(minCover));
  const [maxStr, setMaxStr] = useState(String(maxCover));

  useEffect(() => {
    if (!editingMin) setMinStr(String(minCover));
  }, [minCover, editingMin]);

  useEffect(() => {
    if (!editingMax) setMaxStr(String(maxCover));
  }, [maxCover, editingMax]);

  const commitMin = () => {
    setEditingMin(false);
    const n = parseFloat(minStr);
    if (!isNaN(n)) {
      const clamped = Math.max(COVER_MIN, Math.min(n, maxCover - 1));
      onChange(clamped, maxCover);
    } else {
      setMinStr(String(minCover));
    }
  };

  const commitMax = () => {
    setEditingMax(false);
    const n = parseFloat(maxStr);
    if (!isNaN(n)) {
      const clamped = Math.min(COVER_MAX, Math.max(n, minCover + 1));
      onChange(minCover, clamped);
    } else {
      setMaxStr(String(maxCover));
    }
  };

  return (
    <div>
      {/* Single pill input — ₹X Lakh   -   ₹Y Lakh */}
      <div
        className="flex items-center justify-center mb-[16px]"
        style={{
          background: "#f5f5f5",
          borderRadius: 24,
          height: 52,
          width: "100%",
        }}
      >
        <div className="flex items-center justify-center gap-[6px]">
          {/* Min value */}
          {editingMin ? (
            <div className="flex items-center">
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#282828" }}>₹</span>
              <input
                autoFocus
                className="bg-transparent outline-none"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#282828",
                  width: 80,
                  textAlign: "center",
                }}
                value={minStr}
                onChange={(e) => setMinStr(e.target.value.replace(/[^0-9.]/g, ""))}
                onBlur={commitMin}
                onKeyDown={(e) => { if (e.key === "Enter") commitMin(); }}
                inputMode="decimal"
              />
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#282828" }}>Lakh</span>
            </div>
          ) : (
            <button onClick={() => setEditingMin(true)}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#282828" }}>
                ₹{minCover} Lakh
              </span>
            </button>
          )}

          {/* Dash separator */}
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#cacaca", margin: "0 4px" }}>-</span>

          {/* Max value */}
          {editingMax ? (
            <div className="flex items-center">
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#282828" }}>₹</span>
              <input
                autoFocus
                className="bg-transparent outline-none"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#282828",
                  width: 80,
                  textAlign: "center",
                }}
                value={maxStr}
                onChange={(e) => setMaxStr(e.target.value.replace(/[^0-9.]/g, ""))}
                onBlur={commitMax}
                onKeyDown={(e) => { if (e.key === "Enter") commitMax(); }}
                inputMode="decimal"
              />
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#282828" }}>Lakh</span>
            </div>
          ) : (
            <button onClick={() => setEditingMax(true)}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#282828" }}>
                ₹{maxCover} Lakh
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Dual range slider */}
      <DualRangeSlider
        min={COVER_MIN}
        max={COVER_MAX}
        low={minCover}
        high={maxCover}
        onChange={onChange}
      />
    </div>
  );
}

export const DEFAULT_FILTER: FilterState = {
  selectedInsurers: [],
  selectedAddons: [],
  selectedDiscount: "Any",
  minCover: 8,
  maxCover: 15,
  selectedDrive: [],
  noInspection: false,
};

export function FilterSheet({ onClose, onApply, current }: Props) {
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>(current.selectedInsurers);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(current.selectedAddons);
  const [selectedDiscount, setSelectedDiscount] = useState(current.selectedDiscount);
  const [minCover, setMinCover] = useState(current.minCover);
  const [maxCover, setMaxCover] = useState(current.maxCover);
  const [selectedDrive, setSelectedDrive] = useState<string[]>(current.selectedDrive);
  const [noInspection, setNoInspection] = useState(current.noInspection);

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    if (arr.includes(val)) setter(arr.filter((x) => x !== val));
    else setter([...arr, val]);
  };

  const handleCoverChange = (low: number, high: number) => {
    setMinCover(low);
    setMaxCover(high);
  };

  const Chip = ({
    label,
    active,
    onToggle,
    small = false,
  }: {
    label: string;
    active: boolean;
    onToggle: () => void;
    small?: boolean;
  }) => (
    <button
      onClick={onToggle}
      className="rounded-[64px] px-[10px] py-[5px]"
      style={{
        border: `1px solid ${active ? "#1576db" : "#ebebeb"}`,
        background: active ? "#ecf2f8" : "white",
        fontFamily: "Inter, sans-serif",
        fontSize: small ? 11 : 12,
        color: active ? "#1576db" : "#414244",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-[20px]">
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: 14,
          color: "#282828",
          marginBottom: 10,
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );

  const handleClear = () => {
    setSelectedInsurers([]);
    setSelectedAddons([]);
    setSelectedDiscount("Any");
    setMinCover(8);
    setMaxCover(15);
    setSelectedDrive([]);
    setNoInspection(false);
  };

  const handleApply = () => {
    onApply({ selectedInsurers, selectedAddons, selectedDiscount, minCover, maxCover, selectedDrive, noInspection });
  };

  return (
    <div className="absolute inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] max-h-[90%] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-[10px] pb-[4px] shrink-0">
          <div className="w-[40px] h-[4px] bg-[#cacaca] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-[16px] py-[12px] shrink-0">
          <p
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#282828",
            }}
          >
            Filters
          </p>
          <button
            onClick={onClose}
            className="size-[28px] rounded-full bg-[#f5f5f5] flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke="#282828"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-[16px]">
          {/* Insurer */}
          <Section title="Insurer">
            <div className="flex flex-wrap gap-[8px]">
              {insurers.map((ins) => (
                <Chip
                  key={ins}
                  label={ins}
                  active={selectedInsurers.includes(ins)}
                  onToggle={() => toggle(selectedInsurers, ins, setSelectedInsurers)}
                  small
                />
              ))}
            </div>
          </Section>

          <div className="h-[1px] bg-[#ebebeb] mb-[20px]" />

          {/* Add-on Covers */}
          <Section title="Add-on Covers">
            <div className="flex flex-wrap gap-[8px]">
              {addons.map((a) => (
                <Chip
                  key={a}
                  label={a}
                  active={selectedAddons.includes(a)}
                  onToggle={() => toggle(selectedAddons, a, setSelectedAddons)}
                />
              ))}
            </div>
          </Section>

          <div className="h-[1px] bg-[#ebebeb] mb-[20px]" />

          {/* Discount */}
          <Section title="Discount">
            <div className="flex flex-wrap gap-[8px]">
              {discounts.map((d) => (
                <Chip
                  key={d}
                  label={d}
                  active={selectedDiscount === d}
                  onToggle={() => setSelectedDiscount(d)}
                />
              ))}
            </div>
          </Section>

          <div className="h-[1px] bg-[#ebebeb] mb-[20px]" />

          {/* Cover Amount */}
          <Section title="Cover Amount">
            <CoverAmountSection
              minCover={minCover}
              maxCover={maxCover}
              onChange={handleCoverChange}
            />
          </Section>

          <div className="h-[1px] bg-[#ebebeb] mb-[20px]" />

          {/* Pay as You Drive */}
          <Section title="Pay as You Drive">
            <div className="flex flex-wrap gap-[8px]">
              {payDriveOptions.map((d) => (
                <Chip
                  key={d}
                  label={d}
                  active={selectedDrive.includes(d)}
                  onToggle={() => toggle(selectedDrive, d, setSelectedDrive)}
                  small
                />
              ))}
            </div>
          </Section>

          <div className="h-[1px] bg-[#ebebeb] mb-[20px]" />

          {/* No Inspection */}
          <div className="flex items-center justify-between mb-[24px]">
            <p className="font-[Inter] font-bold"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                color: "#282828",
              }}
            >
              No Inspection Needed
            </p>
            <button
              onClick={() => setNoInspection(!noInspection)}
              className="size-[20px] rounded-[4px] flex items-center justify-center"
              style={{
                border: `1.5px solid ${noInspection ? "#1576db" : "#cacaca"}`,
                background: noInspection ? "#1576db" : "white",
              }}
            >
              {noInspection && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path
                    d="M1 5L4.5 8.5L11 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="shrink-0 flex gap-[12px] px-[16px] py-[16px] border-t border-[#ebebeb]">
          <button
            onClick={handleClear}
            className="flex-1 h-[52px] rounded-[40px] flex items-center justify-center"
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "#cacaca",
              }}
            >
              Clear All
            </span>
          </button>
          <button
            onClick={handleApply}
            className="flex-1 h-[52px] rounded-[40px] bg-[#004299] flex items-center justify-center"
          >
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "white",
              }}
            >
              Apply
            </span>
          </button>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center pb-[8px]">
          <div className="w-[134px] h-[5px] bg-[#101010] rounded-full" />
        </div>
      </div>
    </div>
  );
}
