import { useState, useRef } from "react";
import { StatusBar } from "./StatusBar";
import imgLogoHdfc from "figma:asset/b8f710549ef046145b39e2377ec0564d4f0e6bb3.png";
import imgSbi from "figma:asset/ab943ec66eb647fab289231ff7f1fdcfa4850474.png";
import imgIcici from "figma:asset/bc908a434fafc4e5c82fc0c1fb140ab9c4a90af1.png";
import imgBirla from "figma:asset/fc15609515cac02179656fa200477753fd512db8.png";
import imgKotak from "figma:asset/325629dab2680ba32118d10b9fa81ee652a9f71b.png";

interface Props {
  planIds: string[];
  onBack: () => void;
}

const logoMap: Record<string, string> = {
  hdfc: imgLogoHdfc,
  sbi: imgSbi,
  icici: imgIcici,
  birla: imgBirla,
  kotak: imgKotak,
};

const planData: Record<string, {
  name: string;
  logoImg: string;
  cover: string;
  premium: string;
  planType: string;
  discountOwnDamage: string;
  damageHighlighted?: boolean;
  hasDamageCar: boolean;
  hasThirdParty: boolean;
  hasZeroDep: boolean;
  hasPersonalAccident: boolean;
  hasRoadsideAssistance: boolean;
  cashlessSettled: string;
  cashlessSettledHighlighted?: boolean;
  cashlessGarages: string;
  cashlessGaragesHighlighted?: boolean;
  hasUnlimitedZeroDep: boolean;
  hasRepairWarranty: boolean;
  hasZeroPaperClaims: boolean;
}> = {
  hdfc: {
    name: "HDFC Ergo",
    logoImg: "hdfc",
    cover: "₹4.75 Lakh",
    premium: "₹5,424",
    planType: "Comprehensive",
    discountOwnDamage: "₹754",
    hasDamageCar: true,
    hasThirdParty: true,
    hasZeroDep: true,
    hasPersonalAccident: true,
    hasRoadsideAssistance: false,
    cashlessSettled: "94%",
    cashlessGarages: "4,000",
    hasUnlimitedZeroDep: true,
    hasRepairWarranty: true,
    hasZeroPaperClaims: true,
  },
  sbi: {
    name: "SBI Motor Insurance",
    logoImg: "sbi",
    cover: "₹6.75 Lakh",
    premium: "₹7,162",
    planType: "Comprehensive",
    discountOwnDamage: "₹852",
    damageHighlighted: true,
    hasDamageCar: true,
    hasThirdParty: true,
    hasZeroDep: true,
    hasPersonalAccident: true,
    hasRoadsideAssistance: true,
    cashlessSettled: "92%",
    cashlessGarages: "4,500",
    cashlessGaragesHighlighted: true,
    hasUnlimitedZeroDep: false,
    hasRepairWarranty: true,
    hasZeroPaperClaims: true,
  },
  icici: {
    name: "ICICI Lombard",
    logoImg: "icici",
    cover: "₹12.4 Lakh",
    premium: "₹12,400",
    planType: "Pay as you drive",
    discountOwnDamage: "₹852",
    damageHighlighted: true,
    hasDamageCar: true,
    hasThirdParty: true,
    hasZeroDep: true,
    hasPersonalAccident: true,
    hasRoadsideAssistance: true,
    cashlessSettled: "93%",
    cashlessGarages: "4,500",
    cashlessGaragesHighlighted: true,
    hasUnlimitedZeroDep: false,
    hasRepairWarranty: true,
    hasZeroPaperClaims: true,
  },
  birla: {
    name: "Aditya Birla",
    logoImg: "birla",
    cover: "₹10.2 Lakh",
    premium: "₹10,194",
    planType: "Comprehensive",
    discountOwnDamage: "₹754",
    hasDamageCar: true,
    hasThirdParty: true,
    hasZeroDep: false,
    hasPersonalAccident: true,
    hasRoadsideAssistance: false,
    cashlessSettled: "96%",
    cashlessSettledHighlighted: true,
    cashlessGarages: "4,000",
    hasUnlimitedZeroDep: true,
    hasRepairWarranty: true,
    hasZeroPaperClaims: true,
  },
  kotak: {
    name: "Kotak Mahindra",
    logoImg: "kotak",
    cover: "₹9.5 Lakh",
    premium: "₹14,756",
    planType: "Comprehensive",
    discountOwnDamage: "₹620",
    hasDamageCar: true,
    hasThirdParty: true,
    hasZeroDep: false,
    hasPersonalAccident: false,
    hasRoadsideAssistance: false,
    cashlessSettled: "91%",
    cashlessGarages: "3,200",
    hasUnlimitedZeroDep: false,
    hasRepairWarranty: false,
    hasZeroPaperClaims: true,
  },
};

// Fallback to hdfc/icici if planIds don't map correctly
function getPlans(planIds: string[]) {
  const ids = planIds.length >= 2 ? planIds.slice(0, 2) : ["hdfc", "icici"];
  return ids.map((id) => planData[id] || planData["hdfc"]);
}

const CheckIcon = ({ green = true }: { green?: boolean }) => (
  <div
    className="size-[20px] rounded-full flex items-center justify-center"
    style={{ background: green ? "#e6f5ec" : "#f5f5f5" }}
  >
    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
      <path d="M1 5L4.5 8.5L11 1" stroke={green ? "#158939" : "#9e9e9e"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const CrossIcon = () => (
  <div className="size-[20px] rounded-full flex items-center justify-center" style={{ background: "#f5f5f5" }}>
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M2 2L8 8M8 2L2 8" stroke="#7e7e7e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

function SectionHeader({ title, expanded, onToggle }: { title: string; expanded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full py-[16px] px-[16px]"
    >
      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 16, color: "#282828" }}>{title}</p>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
      >
        <path d="M5 8L10 13L15 8" stroke="#282828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function CompareRow({
  label,
  val1,
  val2,
  isCheck = false,
  highlight1 = false,
  highlight2 = false,
}: {
  label: string;
  val1: string | boolean;
  val2: string | boolean;
  isCheck?: boolean;
  highlight1?: boolean;
  highlight2?: boolean;
}) {
  return (
    <div className="flex items-center py-[12px] px-[16px] border-b border-[#f5f5f5]">
      <div style={{ width: 88, marginRight: 8 }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#7e7e7e", lineHeight: "16px" }}>{label}</p>
      </div>
      <div className="flex gap-[8px]" style={{ flex: 1 }}>
        <div style={{ width: 100, display: "flex", alignItems: "center" }}>
          {isCheck ? (
            typeof val1 === "boolean" ? (val1 ? <CheckIcon /> : <CrossIcon />) : null
          ) : (
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: highlight1 ? "#158939" : "#282828",
                fontWeight: highlight1 ? 600 : 400,
              }}
            >
              {val1 as string}
            </p>
          )}
        </div>
        <div style={{ width: 100, display: "flex", alignItems: "center" }}>
          {isCheck ? (
            typeof val2 === "boolean" ? (val2 ? <CheckIcon /> : <CrossIcon />) : null
          ) : (
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                color: highlight2 ? "#158939" : "#282828",
                fontWeight: highlight2 ? 600 : 400,
              }}
            >
              {val2 as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function CompareScreen({ planIds, onBack }: Props) {
  const plans = getPlans(planIds);
  const [p1, p2] = plans;

  const [coverageExpanded, setCoverageExpanded] = useState(true);
  const [addonsExpanded, setAddonsExpanded] = useState(true);
  const [claimsExpanded, setClaimsExpanded] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col w-full h-full bg-[#f5f5f5]">
      <StatusBar />

      {/* Header */}
      <div className="flex items-center justify-between h-[52px] px-[16px] bg-white shrink-0 bg-[#f5f5f5]">
        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 17, color: "#282828" }}>
          Compare Policies
        </p>
        <button
          onClick={onBack}
          className="size-[28px] rounded-full bg-[#f5f5f5] flex items-center justify-center"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1L11 11M11 1L1 11" stroke="#282828" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Sticky plan cards header */}
      <div className="bg-[#f5f5f5] pt-[12px] px-[12px] pb-[8px] shrink-0">
        <div className="flex gap-[8px]">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="flex-1 bg-white rounded-[20px] px-[16px] py-[16px] flex flex-col gap-[8px]"
            >
              <div className="flex items-center gap-[8px]">
                <div
                  className="size-[32px] rounded-[4px] bg-white flex items-center justify-center"
                  style={{ border: "1px solid #f0f0f0" }}
                >
                  <img src={logoMap[plan.logoImg]} alt={plan.name} className="size-[27px] object-contain" />
                </div>
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "#282828" }}>
                  {plan.name}
                </p>
              </div>
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#7e7e7e" }}>Cover</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, color: "#282828" }}>
                    {plan.cover}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#7e7e7e" }}>Premium</span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 11, color: "#282828" }}>
                    {plan.premium}
                  </span>
                </div>
                <div className="h-[1px] bg-[#f0f0f0] my-[2px]" />
                <button
                  className="w-full h-[32px] rounded-[40px] flex items-center justify-center"
                  style={{ background: "#004299" }}
                >
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "white" }}>
                    Select
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable comparison */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {/* Coverage Details */}
        <div className="mx-[12px] mb-[8px] bg-white rounded-[20px] overflow-hidden">
          <SectionHeader title="Coverage Details" expanded={coverageExpanded} onToggle={() => setCoverageExpanded(!coverageExpanded)} />
          {coverageExpanded && (
            <div>
              <CompareRow label="Plan Type" val1={p1.planType} val2={p2.planType} />
              <CompareRow
                label="Discount on Own Damage"
                val1={p1.discountOwnDamage}
                val2={p2.discountOwnDamage}
                highlight1={!p1.damageHighlighted && p2.damageHighlighted}
                highlight2={p2.damageHighlighted || false}
              />
              <CompareRow label="Damage to your car" val1={p1.hasDamageCar} val2={p2.hasDamageCar} isCheck />
              <CompareRow label="Third Party Liabilities" val1={p1.hasThirdParty} val2={p2.hasThirdParty} isCheck />
            </div>
          )}
        </div>

        {/* Add-on Inclusions */}
        <div className="mx-[12px] mb-[8px] bg-white rounded-[20px] overflow-hidden">
          <SectionHeader title="Add-on Inclusions" expanded={addonsExpanded} onToggle={() => setAddonsExpanded(!addonsExpanded)} />
          {addonsExpanded && (
            <div>
              <CompareRow label="Zero Depreciation" val1={p1.hasZeroDep} val2={p2.hasZeroDep} isCheck />
              <CompareRow label="Personal Accident Cover" val1={p1.hasPersonalAccident} val2={p2.hasPersonalAccident} isCheck />
              <CompareRow label="Roadside Assistance" val1={p1.hasRoadsideAssistance} val2={p2.hasRoadsideAssistance} isCheck />
            </div>
          )}
        </div>

        {/* Claim Benefits */}
        <div className="mx-[12px] mb-[8px] bg-white rounded-[20px] overflow-hidden">
          <SectionHeader title="Claim Benefits" expanded={claimsExpanded} onToggle={() => setClaimsExpanded(!claimsExpanded)} />
          {claimsExpanded && (
            <div>
              <CompareRow
                label="Cashless Settled"
                val1={p1.cashlessSettled}
                val2={p2.cashlessSettled}
                highlight1={p1.cashlessSettledHighlighted}
                highlight2={p2.cashlessSettledHighlighted}
              />
              <CompareRow
                label="Cashless Garages"
                val1={p1.cashlessGarages}
                val2={p2.cashlessGarages}
                highlight1={p1.cashlessGaragesHighlighted}
                highlight2={p2.cashlessGaragesHighlighted}
              />
              <CompareRow label="Unlimited Zero Dep Claims" val1={p1.hasUnlimitedZeroDep} val2={p2.hasUnlimitedZeroDep} isCheck />
              <CompareRow label="6 Month Repair Warranty" val1={p1.hasRepairWarranty} val2={p2.hasRepairWarranty} isCheck />
              <CompareRow label="Zero Paper Claims" val1={p1.hasZeroPaperClaims} val2={p2.hasZeroPaperClaims} isCheck />
            </div>
          )}
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center py-[16px]">
          <div className="w-[134px] h-[5px] bg-[#101010] rounded-full" />
        </div>
      </div>
    </div>
  );
}
