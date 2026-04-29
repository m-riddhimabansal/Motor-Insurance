import { useState, useRef, useEffect, useCallback } from "react";
import { StatusBar } from "./StatusBar";
import svgPathsKBYB from "../../imports/Frame2147224800-1/svg-binywg4rkz";
import svgPathsBenefits from "../../imports/Benefits/svg-i4fppw2ntp";
import svgPathsCoverage from "../../imports/Frame2147224800-1-1/svg-o420ulz2ez";
import imgAIAvatar from "figma:asset/069b64999d23eb873b439c27a58fd96870826219.png";
import imgLogoHdfc from "figma:asset/b8f710549ef046145b39e2377ec0564d4f0e6bb3.png";
import imgSbi from "figma:asset/ab943ec66eb647fab289231ff7f1fdcfa4850474.png";
import imgIcici from "figma:asset/bc908a434fafc4e5c82fc0c1fb140ab9c4a90af1.png";
import imgBirla from "figma:asset/fc15609515cac02179656fa200477753fd512db8.png";
import imgKotak from "figma:asset/325629dab2680ba32118d10b9fa81ee652a9f71b.png";
// Coverage category icons from Figma
import imgIconDent from "figma:asset/80e324dd90db7005b0dc6204daf01af97a245780.png";
import imgIconDamage from "figma:asset/baa68c97065a3a4db46437fae41245cedac34f58.png";
import imgIconPA from "figma:asset/4084fd3bcdc1cf985f165ecdad89d535cf1995f5.png";
import imgIconTowing from "figma:asset/5a44d91bd832f5529e8d4473391753f129339f5d.png";
import imgIconNatural from "figma:asset/2a90b7756f132b871b38672d37902437ebdaaf95.png";
import imgIconManmade from "figma:asset/5d570ffe19f7608378aea304fc431731505f46ee.png";

interface Props {
  planId: string;
  onBack: () => void;
  onReviewPay?: () => void;
}

const logoMap: Record<string, string> = {
  hdfc: imgLogoHdfc,
  sbi: imgSbi,
  icici: imgIcici,
  birla: imgBirla,
  kotak: imgKotak,
};

type GarageEntry = {
  name: string;
  address: string;
  distance: string;
  badge?: "Dealer" | "Network";
};

const planDetails: Record<string, {
  name: string;
  logoImg: string;
  claimRatio: string;
  garages: string;
  localGarages: string;
  city: string;
  price: string;
  coverLabel: string;
  planType: string;
  idv: string;
  coverOptions: { label: string; price: string }[];
  addons: { name: string; included: boolean; price?: string }[];
  coverageItems: { name: string; subtext: string; covered: boolean; icon: string; iconBg: string }[];
  notCovered: string[];
  marutiGarages: GarageEntry[];
  otherGarages: GarageEntry[];
  documents: { title: string; desc: string }[];
}> = {
  hdfc: {
    name: "HDFC Ergo",
    logoImg: "hdfc",
    claimRatio: "94%",
    garages: "4,000+",
    localGarages: "140",
    city: "Delhi",
    price: "₹5,424",
    coverLabel: "₹4.75 Lakh",
    planType: "Comprehensive",
    idv: "₹4.75 Lakh",
    coverOptions: [
      { label: "₹4.75 L", price: "₹5,424" },
      { label: "₹5.50 L", price: "₹6,140" },
      { label: "₹6.25 L", price: "₹7,012" },
    ],
    addons: [
      { name: "Zero Depreciation", included: true, price: "₹1,200" },
      { name: "Engine Protection", included: false, price: "₹800" },
      { name: "Roadside Assistance", included: true, price: "₹400" },
      { name: "Personal Accident Cover", included: true, price: "Included" },
      { name: "Return to Invoice", included: false, price: "₹1,500" },
      { name: "Tyre Protection", included: false, price: "₹600" },
    ],
    coverageItems: [
      { name: "Dent Damage", subtext: "Damage from fire, accidents, theft, natural disasters", covered: true, icon: imgIconDent, iconBg: "#FFF3E0" },
      { name: "Damage to other vehicles", subtext: "Damage to other vehicles, property, or injuries to third parties", covered: true, icon: imgIconDamage, iconBg: "#F5F5F5" },
      { name: "Personal Accident", subtext: "PA Cover – injuries to passengers or insured or third parties", covered: true, icon: imgIconPA, iconBg: "#E8F0FF" },
      { name: "Towing", subtext: "Without towing limit and assistance", covered: true, icon: imgIconTowing, iconBg: "#FFFDE7" },
      { name: "Natural Calamities", subtext: "Riots, storms, landslides, cyclones", covered: true, icon: imgIconNatural, iconBg: "#E0F7FA" },
      { name: "Man-made Calamities", subtext: "Riots, strikes, terror attacks, malicious acts", covered: true, icon: imgIconManmade, iconBg: "#FFE8E8" },
    ],
    notCovered: ["Wear & tear of your car", "Drunk driving", "Driving without valid license", "Electrical or mechanical breakdown"],
    marutiGarages: [
      { name: "ABC Motors", address: "Times Square, Delhi", distance: "0.3 km", badge: "Dealer" },
      { name: "XYZ Motors", address: "Sector 22, Delhi", distance: "1.4 km" },
      { name: "Quick Fix Motors", address: "Lajpat Nagar, Delhi", distance: "2.8 km" },
      { name: "Delhi Auto Hub", address: "Nehru Place, Delhi", distance: "4.1 km" },
      { name: "Speedy Repairs", address: "Dwarka, Delhi", distance: "6.8 km" },
    ],
    otherGarages: [
      { name: "Premium Auto", address: "Connaught Place, Delhi", distance: "1.2 km", badge: "Network" },
      { name: "Express Garage", address: "Saket, Delhi", distance: "3.5 km" },
      { name: "City Auto Works", address: "Rajouri Garden, Delhi", distance: "5.0 km" },
    ],
    documents: [
      { title: "Policy Wordings", desc: "File name and conditions of the case" },
      { title: "HDFC Ergo Brochure", desc: "Company branded brochure" },
      { title: "Claim Forms", desc: "Claim forms required for insurance" },
      { title: "Add-on Details", desc: "Data about add-ons, rates, plans" },
    ],
  },
  sbi: {
    name: "SBI Motor Insurance",
    logoImg: "sbi",
    claimRatio: "92%",
    garages: "3,500+",
    localGarages: "110",
    city: "Delhi",
    price: "₹7,162",
    coverLabel: "₹6.75 Lakh",
    planType: "Comprehensive",
    idv: "₹6.75 Lakh",
    coverOptions: [
      { label: "₹6.75 L", price: "₹7,162" },
      { label: "₹7.50 L", price: "₹8,024" },
      { label: "₹8.25 L", price: "₹9,102" },
    ],
    addons: [
      { name: "Zero Depreciation", included: true, price: "₹1,400" },
      { name: "Engine Protection", included: true, price: "₹900" },
      { name: "Roadside Assistance", included: true, price: "₹450" },
      { name: "Personal Accident Cover", included: true, price: "Included" },
      { name: "Return to Invoice", included: false, price: "₹1,800" },
      { name: "Tyre Protection", included: false, price: "₹700" },
    ],
    coverageItems: [
      { name: "Dent Damage", subtext: "Damage from fire, accidents, theft, natural disasters", covered: true, icon: imgIconDent, iconBg: "#FFF3E0" },
      { name: "Damage to other vehicles", subtext: "Damage to other vehicles, property, or injuries to third parties", covered: true, icon: imgIconDamage, iconBg: "#F5F5F5" },
      { name: "Personal Accident", subtext: "PA Cover – injuries to passengers or insured or third parties", covered: true, icon: imgIconPA, iconBg: "#E8F0FF" },
      { name: "Towing", subtext: "Without towing limit and assistance", covered: true, icon: imgIconTowing, iconBg: "#FFFDE7" },
      { name: "Natural Calamities", subtext: "Riots, storms, landslides, cyclones", covered: true, icon: imgIconNatural, iconBg: "#E0F7FA" },
      { name: "Man-made Calamities", subtext: "Riots, strikes, terror attacks, malicious acts", covered: true, icon: imgIconManmade, iconBg: "#FFE8E8" },
    ],
    notCovered: ["Wear & tear", "Drunk driving", "Driving without valid license"],
    marutiGarages: [
      { name: "SBI Authorised Service", address: "Connaught Place, Delhi", distance: "0.8 km", badge: "Dealer" },
      { name: "Metro Auto", address: "Rajouri Garden, Delhi", distance: "2.2 km" },
      { name: "Speedy Fix", address: "Saket, Delhi", distance: "4.5 km" },
    ],
    otherGarages: [
      { name: "Capital Garage", address: "Karol Bagh, Delhi", distance: "1.5 km", badge: "Network" },
      { name: "Delhi Service Hub", address: "Pitampura, Delhi", distance: "3.1 km" },
    ],
    documents: [
      { title: "Policy Wordings", desc: "File name and conditions of the case" },
      { title: "SBI Brochure", desc: "Company branded brochure" },
      { title: "Claim Forms", desc: "Claim forms required for insurance" },
      { title: "Add-on Details", desc: "Data about add-ons, rates, plans" },
    ],
  },
  icici: {
    name: "ICICI Lombard",
    logoImg: "icici",
    claimRatio: "81.5%",
    garages: "2,800+",
    localGarages: "140",
    city: "Delhi",
    price: "₹20,000",
    coverLabel: "₹4.2 Lakh",
    planType: "Comprehensive",
    idv: "₹4.2 Lakh",
    coverOptions: [
      { label: "₹4.2 L", price: "₹20,000" },
      { label: "₹6.0 L", price: "₹14,363" },
      { label: "₹8.0 L", price: "₹12,445" },
    ],
    addons: [
      { name: "Zero Depreciation", included: false, price: "₹1,300" },
      { name: "Consumable Cover", included: false, price: "₹850" },
      { name: "Depreciation Cover", included: false, price: "₹700" },
      { name: "Key & Lock Replace", included: false, price: "₹500" },
      { name: "Tyre Protection", included: false, price: "₹580" },
    ],
    coverageItems: [
      { name: "Dent Damage", subtext: "Damage from fire, accidents, theft, natural disasters", covered: true, icon: imgIconDent, iconBg: "#FFF3E0" },
      { name: "Damage to other vehicles", subtext: "Damage to other vehicles, property, or injuries to third parties", covered: true, icon: imgIconDamage, iconBg: "#F5F5F5" },
      { name: "Personal Accident", subtext: "PA Cover – injuries to passengers or insured or third parties", covered: true, icon: imgIconPA, iconBg: "#E8F0FF" },
      { name: "Towing", subtext: "Without towing limit and assistance", covered: true, icon: imgIconTowing, iconBg: "#FFFDE7" },
      { name: "Natural Calamities", subtext: "Floods, storms, landslides, cyclones", covered: true, icon: imgIconNatural, iconBg: "#E0F7FA" },
      { name: "Man-made Calamities", subtext: "Riots, strikes, terror attacks, malicious acts", covered: true, icon: imgIconManmade, iconBg: "#FFE8E8" },
    ],
    notCovered: ["Wear & tear", "Drunk driving", "Driving without valid license", "Electrical breakdown"],
    marutiGarages: [
      { name: "ABC Motors", address: "Times Square, Delhi", distance: "0.3 km", badge: "Dealer" },
      { name: "XYZ Motors", address: "Sector 22, Delhi", distance: "1.4 km", badge: "Network" },
      { name: "Quick Fix Motors", address: "Lajpat Nagar, Delhi", distance: "2.8 km" },
      { name: "Delhi Auto Hub", address: "Nehru Place, Delhi", distance: "4.1 km" },
    ],
    otherGarages: [
      { name: "ICICI Premium Garage", address: "Connaught Place, Delhi", distance: "1.0 km", badge: "Booked" },
      { name: "LG Auto Works", address: "Lajpat Nagar, Delhi", distance: "2.5 km" },
      { name: "Quick Fix Motors", address: "Delhi NCR", distance: "3.8 km" },
      { name: "Tata AIG Garage", address: "Saket, Delhi", distance: "5.2 km" },
    ],
    documents: [
      { title: "Policy Wordings", desc: "File name and conditions of the case" },
      { title: "ICICI Lombard Brochure", desc: "Company branded brochure" },
      { title: "Claim Forms", desc: "Claim forms required for insurance" },
      { title: "Add-on Details", desc: "Data about add-ons, rates, plans" },
    ],
  },
  birla: {
    name: "Aditya Birla",
    logoImg: "birla",
    claimRatio: "95%",
    garages: "5,000+",
    localGarages: "200",
    city: "Delhi",
    price: "₹10,194",
    coverLabel: "₹5.50 Lakh",
    planType: "Comprehensive",
    idv: "₹5.50 Lakh",
    coverOptions: [
      { label: "₹5.50 L", price: "₹10,194" },
      { label: "₹7.00 L", price: "₹12,450" },
      { label: "₹9.00 L", price: "₹15,200" },
    ],
    addons: [
      { name: "Zero Depreciation", included: false, price: "₹1,600" },
      { name: "Engine Protection", included: true, price: "₹950" },
      { name: "Roadside Assistance", included: true, price: "₹500" },
      { name: "Personal Accident Cover", included: true, price: "Included" },
      { name: "Return to Invoice", included: false, price: "₹2,000" },
    ],
    coverageItems: [
      { name: "Dent Damage", subtext: "Damage from fire, accidents, theft", covered: true, icon: imgIconDent, iconBg: "#FFF3E0" },
      { name: "Damage to other vehicles", subtext: "Damage to property or injuries to third parties", covered: true, icon: imgIconDamage, iconBg: "#F5F5F5" },
      { name: "Personal Accident", subtext: "PA Cover – injuries to passengers", covered: true, icon: imgIconPA, iconBg: "#E8F0FF" },
      { name: "Towing", subtext: "Without towing limit and assistance", covered: true, icon: imgIconTowing, iconBg: "#FFFDE7" },
      { name: "Natural Calamities", subtext: "Floods, storms, landslides, cyclones", covered: true, icon: imgIconNatural, iconBg: "#E0F7FA" },
      { name: "Man-made Calamities", subtext: "Riots, strikes, malicious acts", covered: true, icon: imgIconManmade, iconBg: "#FFE8E8" },
    ],
    notCovered: ["Wear & tear", "Drunk driving", "Driving without license"],
    marutiGarages: [
      { name: "Birla Authorised", address: "Connaught Place, Delhi", distance: "0.5 km", badge: "Dealer" },
      { name: "Phoenix Auto", address: "Rajouri Garden, Delhi", distance: "2.0 km" },
    ],
    otherGarages: [
      { name: "Capital Workshop", address: "Nehru Place, Delhi", distance: "1.8 km", badge: "Network" },
    ],
    documents: [
      { title: "Policy Wordings", desc: "File name and conditions of the case" },
      { title: "Aditya Birla Brochure", desc: "Company branded brochure" },
      { title: "Claim Forms", desc: "Claim forms required for insurance" },
      { title: "Add-on Details", desc: "Data about add-ons, rates, plans" },
    ],
  },
  kotak: {
    name: "Kotak Mahindra",
    logoImg: "kotak",
    claimRatio: "94%",
    garages: "3,800+",
    localGarages: "125",
    city: "Delhi",
    price: "₹14,756",
    coverLabel: "₹4.25 Lakh",
    planType: "Comprehensive",
    idv: "₹4.25 Lakh",
    coverOptions: [
      { label: "₹4.25 L", price: "₹14,756" },
      { label: "₹5.50 L", price: "₹18,200" },
      { label: "₹7.00 L", price: "₹22,400" },
    ],
    addons: [
      { name: "Zero Depreciation", included: false, price: "₹2,000" },
      { name: "Engine Protection", included: false, price: "₹1,200" },
      { name: "Roadside Assistance", included: false, price: "₹600" },
      { name: "Personal Accident Cover", included: true, price: "Included" },
    ],
    coverageItems: [
      { name: "Dent Damage", subtext: "Damage from fire, accidents, theft", covered: true, icon: imgIconDent, iconBg: "#FFF3E0" },
      { name: "Damage to other vehicles", subtext: "Damage to property or injuries to third parties", covered: true, icon: imgIconDamage, iconBg: "#F5F5F5" },
      { name: "Personal Accident", subtext: "PA Cover – injuries to passengers", covered: true, icon: imgIconPA, iconBg: "#E8F0FF" },
      { name: "Towing", subtext: "Without towing limit and assistance", covered: false, icon: imgIconTowing, iconBg: "#FFFDE7" },
      { name: "Natural Calamities", subtext: "Floods, storms, landslides, cyclones", covered: true, icon: imgIconNatural, iconBg: "#E0F7FA" },
      { name: "Man-made Calamities", subtext: "Riots, strikes, malicious acts", covered: false, icon: imgIconManmade, iconBg: "#FFE8E8" },
    ],
    notCovered: ["Wear & tear", "Drunk driving"],
    marutiGarages: [
      { name: "Kotak Auto Hub", address: "Connaught Place, Delhi", distance: "1.0 km", badge: "Booked" },
      { name: "City Garage", address: "Lajpat Nagar, Delhi", distance: "3.2 km" },
    ],
    otherGarages: [
      { name: "Metro Garage", address: "Karol Bagh, Delhi", distance: "2.0 km", badge: "Network" },
    ],
    documents: [
      { title: "Policy Wordings", desc: "File name and conditions of the case" },
      { title: "Kotak Brochure", desc: "Company branded brochure" },
      { title: "Claim Forms", desc: "Claim forms required for insurance" },
    ],
  },
};

const TABS = ["Overview", "Add-ons", "Coverage", "Cashless Garages", "Documents"];

// ── Small reusable components ───────────────────────────────────────────────

const GreenCheck = () => (
  <div
    style={{
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "#e6f5ec",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
      <path d="M1 4.5L4 7.5L10 1" stroke="#158939" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const GrayX = () => (
  <div
    style={{
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "#f0f0f0",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path d="M1.5 1.5L7.5 7.5M7.5 1.5L1.5 7.5" stroke="#9e9e9e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

// ── Main Screen ─────────────────────────────────────────────────────────────
export function PlanDetailScreen({ planId, onBack, onReviewPay }: Props) {
  const plan = planDetails[planId] || planDetails["icici"];
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedCoverIdx, setSelectedCoverIdx] = useState(0);
  const [coveredExpanded, setCoveredExpanded] = useState(true);
  const [notCoveredExpanded, setnotCoveredExpanded] = useState(false);
  const [tabsSticky, setTabsSticky] = useState(false);
  const [garageTab, setGarageTab] = useState<"all" | "maruti" | "other">("all");
  const [garageSearch, setGarageSearch] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsTriggerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const addonsRef = useRef<HTMLDivElement>(null);
  const coverageRef = useRef<HTMLDivElement>(null);
  const garagesRef = useRef<HTMLDivElement>(null);
  const documentsRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    Overview: overviewRef,
    "Add-ons": addonsRef,
    Coverage: coverageRef,
    "Cashless Garages": garagesRef,
    Documents: documentsRef,
  };

  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    const ref = sectionRefs[tab];
    if (ref?.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = ref.current;
      const stickyOffset = 44;
      const top = el.offsetTop - stickyOffset;
      container.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !tabsTriggerRef.current) return;
    const scrollTop = scrollRef.current.scrollTop;
    const triggerTop = tabsTriggerRef.current.offsetTop;
    setTabsSticky(scrollTop >= triggerTop);

    const stickyOffset = 60;
    let current = "Overview";
    for (const tab of TABS) {
      const ref = sectionRefs[tab];
      if (ref?.current) {
        const top = ref.current.offsetTop - stickyOffset;
        if (scrollTop >= top) current = tab;
      }
    }
    setActiveTab(current);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Filter garages
  const garageList =
    garageTab === "all"
      ? [...plan.marutiGarages, ...plan.otherGarages]
      : garageTab === "maruti"
      ? plan.marutiGarages
      : plan.otherGarages;
  const filteredGarages = garageSearch.trim()
    ? garageList.filter(
        (g) =>
          g.name.toLowerCase().includes(garageSearch.toLowerCase()) ||
          g.address.toLowerCase().includes(garageSearch.toLowerCase())
      )
    : garageList;

  const currentPrice = plan.coverOptions[selectedCoverIdx]?.price || plan.price;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#f5f5f5",
        overflow: "hidden",
      }}
    >
      <StatusBar />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 52,
          padding: "0 16px",
          background: "#f5f5f5",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onBack}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 0", display: "flex", alignItems: "center" }}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
              <path d="M1 7H19M1 7L7 1M1 7L7 13" stroke="#282828" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 4,
              background: "white",
              border: "1px solid #f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img src={logoMap[plan.logoImg]} alt={plan.name} style={{ width: 25, height: 27, objectFit: "contain" }} />
          </div>
          <div>
            <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#282828", lineHeight: "20px" }}>
              {plan.name}
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#7e7e7e", lineHeight: "14px" }}>
              {plan.planType} · ₹{plan.idv}
            </p>
          </div>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, color: "#1576db" }}>Help</span>
        </button>
      </div>

      {/* ── Scrollable body ──────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", paddingBottom: 0 }}
      >
        {/* ── Know before you buy ─────────────────────────────────────── */}
        <div style={{ margin: "8px 12px 0" }}>
          {/* Outer gradient container */}
          <div style={{
            borderRadius: 24,
            overflow: "hidden",
            padding: 16,
            background: "linear-gradient(138.842deg, rgb(236, 242, 248) 4.5012%, rgb(216, 231, 247) 97.633%)",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            alignItems: "center",
            position: "relative",
          }}>
            {/* Background SVG grid pattern */}
            <div style={{ position: "absolute", top: -270, left: "-32.67%", right: "-29.3%", height: 671.753, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "visible" }}>
              <div style={{ flexShrink: 0, transform: "rotate(29.9deg) skewX(17.05deg)", width: 554.353, height: 406.178, opacity: 0.07 }}>
                <svg width="100%" height="100%" viewBox="0 0 554.353 406.178" fill="none" preserveAspectRatio="none">
                  <path d={svgPathsKBYB.p5955900} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p3db42b00} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p23c72400} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p4779e00} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.pb7de480} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p196331c0} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p31ff8100} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p38e3e00} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p29db24c0} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p14a76500} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p3a7d8d00} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p3082ff00} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p2d24b100} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p1e294b20} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p27458280} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p3935ab00} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p82e2340} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p27190000} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p1b5a0b00} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p591f000} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p36624900} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                  <path d={svgPathsKBYB.p13bf8100} stroke="#4D49B8" strokeMiterlimit="10" strokeWidth="1.15343" />
                </svg>
              </div>
            </div>

            {/* GrowthBadges — white card */}
            <div style={{ background: "white", borderRadius: 24, padding: 16, width: "100%", position: "relative", zIndex: 1 }}>
              {/* Header: Gemini logo + title + AI Suggested badge */}
              <div style={{ display: "flex", gap: 4, alignItems: "center", width: "100%", marginBottom: 16 }}>
                <div style={{ width: 16, height: 16, flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <g clipPath="url(#kbybClip)">
                      <path d={svgPathsKBYB.p4d2d580} fill="url(#kbybGrad)" />
                    </g>
                    <defs>
                      <radialGradient id="kbybGrad" cx="0" cy="0" gradientTransform="translate(1.588 6.503) rotate(18.6832) scale(17.03 136.421)" gradientUnits="userSpaceOnUse" r="1">
                        <stop offset="0.067" stopColor="#004299" />
                        <stop offset="0.343" stopColor="#1576DB" />
                        <stop offset="0.672" stopColor="#7649B8" />
                      </radialGradient>
                      <clipPath id="kbybClip">
                        <rect fill="white" height="16" width="16" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, paddingBottom: 8 }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 16, color: "#282828", lineHeight: "20px", whiteSpace: "nowrap" }}>Know before you buy</p>
                  <div style={{ background: "#ecf2f8", padding: "2px 6px", borderRadius: 64, flexShrink: 0 }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 10, color: "#1576db", lineHeight: "12px", whiteSpace: "nowrap" }}>AI Suggested</p>
                  </div>
                </div>
              </div>

              {/* Bullet list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
                  <div style={{ width: 16, height: 16, flexShrink: 0, position: "relative" }}>
                    <div style={{ position: "absolute", top: "23.13%", left: "17.29%", right: "16.87%", bottom: "28.54%" }}>
                      <svg width="100%" height="100%" viewBox="0 0 10.5332 7.73343" fill="none"><path d={svgPathsKBYB.p12adbfc0} fill="#158939" /></svg>
                    </div>
                  </div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#414244", lineHeight: "20px", flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 700 }}>{plan.claimRatio}</span>
                    <span>{` claim settlement above industry average of `}</span>
                    <span style={{ fontWeight: 700 }}>87%</span>
                  </p>
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
                  <div style={{ width: 16, height: 16, flexShrink: 0, position: "relative" }}>
                    <div style={{ position: "absolute", top: "23.13%", left: "17.29%", right: "16.87%", bottom: "28.54%" }}>
                      <svg width="100%" height="100%" viewBox="0 0 10.5332 7.73343" fill="none"><path d={svgPathsKBYB.p12adbfc0} fill="#158939" /></svg>
                    </div>
                  </div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#414244", lineHeight: "20px", flex: 1, minWidth: 0 }}>
                    <span>Zero Dep add-on recommended for cars older than </span>
                    <span style={{ fontWeight: 600 }}>3 years</span>
                  </p>
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
                  <div style={{ width: 16, height: 16, flexShrink: 0, position: "relative" }}>
                    <div style={{ position: "absolute", top: "23.13%", left: "17.29%", right: "16.87%", bottom: "28.54%" }}>
                      <svg width="100%" height="100%" viewBox="0 0 10.5332 7.73343" fill="none"><path d={svgPathsKBYB.p12adbfc0} fill="#158939" /></svg>
                    </div>
                  </div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#414244", lineHeight: "20px", flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 700 }}>{plan.garages}</span>
                    <span>{` cashless garages, `}</span>
                    <span style={{ fontWeight: 700 }}>{plan.localGarages}</span>
                    <span>{` in ${plan.city}`}</span>
                  </p>
                </div>
                <div style={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
                  <div style={{ width: 16, height: 16, flexShrink: 0, position: "relative" }}>
                    <div style={{ position: "absolute", top: "23.13%", left: "17.29%", right: "16.87%", bottom: "28.54%" }}>
                      <svg width="100%" height="100%" viewBox="0 0 10.5332 7.73343" fill="none"><path d={svgPathsKBYB.p12adbfc0} fill="#158939" /></svg>
                    </div>
                  </div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#414244", lineHeight: "20px", flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 700 }}>No hidden charges</span>
                    <span> in this plan</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Chips + Ask AI */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", position: "relative", zIndex: 1 }}>
              {/* Scrollable chips */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
                {["Suggest Add on", "What if my car gets flooded?", "Do I need Zero Dep for a 4yr old car?"].map((chip, i) => (
                  <div key={i} style={{ background: "white", borderRadius: 64, padding: "6px 12px", flexShrink: 0, border: "1px solid #ebebeb", cursor: "pointer" }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 12, color: "#414244", lineHeight: "16px", whiteSpace: "nowrap" }}>{chip}</p>
                  </div>
                ))}
              </div>
              {/* Ask AI input */}
              <div style={{ background: "white", borderRadius: 24, width: "100%" }}>
                <div style={{ height: 48, maxHeight: 48, borderRadius: 12, position: "relative", display: "flex", alignItems: "center", padding: "0 12px", gap: 8 }}>
                  {/* AI avatar */}
                  <div style={{ width: 31, height: 32, flexShrink: 0, position: "relative", borderRadius: 101, boxShadow: "0px 3px 10px 0px #89a3e3, 0px 8px 20px 4px #f8e0f9" }}>
                    <img src={imgAIAvatar} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", borderRadius: 101, pointerEvents: "none" }} />
                  </div>
                  {/* "Ask AI" label */}
                  <div style={{ flex: 1, minWidth: 0, fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#282828", lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Ask AI
                  </div>
                  {/* Microphone icon */}
                  <div style={{ width: 24, height: 24, flexShrink: 0, position: "relative" }}>
                    <div style={{ position: "absolute", top: "8.38%", left: "20.83%", right: "20.83%", bottom: "8.37%" }}>
                      <svg width="100%" height="100%" viewBox="0 0 14 19.9805" fill="none">
                        <path d={svgPathsKBYB.p2efed400} fill="#004299" />
                        <path clipRule="evenodd" d={svgPathsKBYB.p2477cb00} fill="#004299" fillRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  {/* Gradient border overlay */}
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} fill="none" preserveAspectRatio="none" viewBox="0 0 320 48">
                    <path d={svgPathsKBYB.p1077300} fill="url(#kbybBorderGrad)" />
                    <defs>
                      <linearGradient id="kbybBorderGrad" gradientUnits="userSpaceOnUse" x1="7.27273" x2="320.589" y1="7.5" y2="37.3081">
                        <stop stopColor="#D8E7F7" />
                        <stop offset="0.269231" stopColor="#FFC327" />
                        <stop offset="0.548077" stopColor="#FFB9A0" />
                        <stop offset="0.778846" stopColor="#89A3E3" />
                        <stop offset="0.932692" stopColor="#F3C2C2" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs trigger point */}
        <div ref={tabsTriggerRef} />

        {/* ── Tabs strip ─────────────────────────────────────────────── */}
        <div
          style={{
            position: tabsSticky ? "sticky" : "relative",
            top: tabsSticky ? 0 : undefined,
            zIndex: 10,
            background: "#f5f5f5",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ overflowX: "auto", scrollbarWidth: "none" }}>
            <div style={{ display: "flex", minWidth: "max-content" }}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => scrollToSection(tab)}
                  style={{
                    padding: "12px 14px",
                    flexShrink: 0,
                    background: "none",
                    border: "none",
                    borderBottom: `2px solid ${activeTab === tab ? "#1576db" : "transparent"}`,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13,
                      color: activeTab === tab ? "#1576db" : "#7e7e7e",
                      fontWeight: activeTab === tab ? 600 : 400,
                    }}
                  >
                    {tab}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── OVERVIEW SECTION ────────────────────────────────────────── */}
        <div ref={overviewRef}>
          {/* Why [Plan] section */}
          <div style={{ margin: "16px 12px 0", background: "white", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 16, color: "#282828" }}>
                  Why {plan.name}
                </p>
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: 64,
                    background: "#e6f5ec",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 10,
                    color: "#158939",
                    fontWeight: 600,
                  }}
                >
                  ✓ Verified
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* Stat 1 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}> 
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
<circle cx="20" cy="20" r="20" fill="#ECF2F8"/>
<path d="M19.998 7.68018C21.7457 8.87366 23.6967 9.73306 25.7549 10.2134C26.0424 10.2843 26.3298 10.3475 26.6152 10.4009V10.3999C27.7351 10.6226 28.8733 10.7373 30.0146 10.7407H30.0176C30.2972 10.7407 30.57 10.7307 30.8369 10.7173V15.2739C30.8394 17.3924 30.4887 19.4958 29.7998 21.4956C28.1254 26.3406 24.5834 30.2787 19.998 32.4214C15.4132 30.2786 11.8715 26.3403 10.1973 21.4956C9.56669 19.67 9.21948 17.7569 9.16699 15.8247L9.16016 15.438V10.7173C9.42772 10.7307 9.70246 10.7407 9.98047 10.7407H9.98145C11.1267 10.7385 12.2692 10.6242 13.3926 10.3989L13.3916 10.3979C13.6735 10.345 13.9573 10.2834 14.2412 10.2134L14.2422 10.2144C16.3002 9.73414 18.2504 8.87344 19.998 7.68018Z" fill="url(#paint0_linear_5865_137644)" stroke="#158939" stroke-width="1.65658" stroke-linejoin="round"/>
<path d="M15.832 18.8576L18.1672 21.4725L24.1589 15.5371" stroke="white" stroke-width="2.33454" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_5865_137644" x1="10.0494" y1="-7.96139" x2="23.3958" y2="32.2044" gradientUnits="userSpaceOnUse">
<stop stop-color="#B5FFDA"/>
<stop offset="0.745" stop-color="#34C77D"/>
<stop offset="1" stop-color="#34C77D"/>
</linearGradient>
</defs>
</svg>
                  <p className="text-[12px]" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 12, color: "#282828", lineHeight: "20px" , marginTop: "8px"}}>
                    {plan.claimRatio}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#282828", textAlign: "center", lineHeight: "14px" }}>
                    claim ratio
                  </p>
                </div>
                <div style={{ width: 1, height: 32, background: "#f0f0f0", flexShrink: 0 }} />
                {/* Stat 2 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
<circle cx="20" cy="20" r="20" fill="#ECF2F8"/>
</svg>
                  <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, color: "#282828", lineHeight: "20px" , marginTop: "8px"}}>
                    {plan.garages}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#282828", textAlign: "center", lineHeight: "14px" }}>
                    garages
                  </p>
                </div>
                <div style={{ width: 1, height: 32, background: "#f0f0f0", flexShrink: 0 }} />
                {/* Stat 3 */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
<path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#ECF2F8" />
</svg>
                  <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, color: "#282828", lineHeight: "20px" , marginTop: "8px"}}>
                    {plan.localGarages}
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#282828", textAlign: "center", lineHeight: "14px" }}>
                    garages in {plan.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ADD-ONS & BENEFITS SECTION ──────────────────────────────── */}
        <div ref={addonsRef} style={{ marginTop: 16 }}>
          <div style={{ margin: "0 12px", background: "white", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", position: "relative", overflow: "hidden" }}>
              {/* Column highlight — moves with selectedCoverIdx */}
              <div style={{
                position: "absolute",
                background: "#f5f8fa",
                borderRadius: 12,
                width: 72,
                top: 56,
                bottom: 14,
                left: 130 + selectedCoverIdx * 69,
                pointerEvents: "none",
                zIndex: 0,
              }} />

              {/* Section header */}
              <div style={{ paddingTop: 8, paddingBottom: 8, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", position: "relative", zIndex: 1 }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 18, color: "#282828", lineHeight: "24px", paddingTop: 2, paddingBottom: 2, width: "100%" }}>
                  Add-ons &amp; Benefits
                </p>
              </div>

              {/* Coverage column headers */}
              <div style={{ display: "flex", alignItems: "flex-start", width: "100%", position: "relative", zIndex: 1, marginBottom: 4 }}>
                <div style={{ width: 120, flexShrink: 0 }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: "#282828", lineHeight: "20px" }}>Coverage</p>
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {/* Basic */}
                  <button onClick={() => setSelectedCoverIdx(0)} style={{ width: 60, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: "8.33%", left: "8.33%", right: "8.33%", bottom: "8.33%" }}>
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                          {selectedCoverIdx === 0 ? (
                            <g><path d={svgPathsBenefits.p9696640} fill="#1576DB" /><path clipRule="evenodd" d={svgPathsBenefits.p89cd640} fill="#1576DB" fillRule="evenodd" /></g>
                          ) : (
                            <path clipRule="evenodd" d={svgPathsBenefits.pb432000} fill="#414244" fillRule="evenodd" />
                          )}
                        </svg>
                      </div>
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#282828", textAlign: "center" }}>
                      <p style={{ lineHeight: "12px", margin: 0 }}>Basic</p>
                      <p style={{ lineHeight: "12px", margin: 0 }}>&#8203;</p>
                    </div>
                  </button>
                  {/* Zero Depreciation */}
                  <button onClick={() => setSelectedCoverIdx(1)} style={{ width: 60, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: "8.33%", left: "8.33%", right: "8.33%", bottom: "8.33%" }}>
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                          {selectedCoverIdx === 1 ? (
                            <g><path d={svgPathsBenefits.p9696640} fill="#1576DB" /><path clipRule="evenodd" d={svgPathsBenefits.p89cd640} fill="#1576DB" fillRule="evenodd" /></g>
                          ) : (
                            <path clipRule="evenodd" d={svgPathsBenefits.pb432000} fill="#282828" fillRule="evenodd" />
                          )}
                        </svg>
                      </div>
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#282828", lineHeight: "12px", textAlign: "center", margin: 0 }}>Zero Depreciation</p>
                  </button>
                  {/* All Inclusive */}
                  <button onClick={() => setSelectedCoverIdx(2)} style={{ width: 60, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
                      <div style={{ position: "absolute", top: "8.33%", left: "8.33%", right: "8.33%", bottom: "8.33%" }}>
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                          {selectedCoverIdx === 2 ? (
                            <g><path d={svgPathsBenefits.p9696640} fill="#1576DB" /><path clipRule="evenodd" d={svgPathsBenefits.p89cd640} fill="#1576DB" fillRule="evenodd" /></g>
                          ) : (
                            <path clipRule="evenodd" d={svgPathsBenefits.pb432000} fill="#282828" fillRule="evenodd" />
                          )}
                        </svg>
                      </div>
                    </div>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: 10, color: "#282828", textAlign: "center" }}>
                      <p style={{ lineHeight: "12px", margin: 0 }}>All </p>
                      <p style={{ lineHeight: "12px", margin: 0 }}>Inclusive </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Data rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%", position: "relative", zIndex: 1 }}>
                {/* Price row */}
                <div style={{ display: "flex", alignItems: "center", opacity: 0.8, paddingTop: 8, paddingBottom: 8, width: "100%" }}>
                  <div style={{ width: 120, flexShrink: 0, height: 24, display: "flex", alignItems: "center" }}>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#414244", lineHeight: "16px" }}>Price</p>
                  </div>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ width: 60, flexShrink: 0, display: "flex", justifyContent: "center" }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, color: "#282828", lineHeight: "16px", textAlign: "center" }}>₹4,593</p>
                    </div>
                    <div style={{ width: 60, flexShrink: 0, display: "flex", justifyContent: "center" }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, color: "#1576db", lineHeight: "16px", textAlign: "center" }}>₹9,947</p>
                    </div>
                    <div style={{ width: 60, flexShrink: 0, display: "flex", justifyContent: "center" }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, color: "#282828", lineHeight: "16px", textAlign: "center" }}>₹13,445</p>
                    </div>
                  </div>
                </div>
                <div style={{ height: 1, background: "#ebebeb", width: "100%" }} />

                {/* Feature rows */}
                {[
                  { name: "Zero Depreciation",   cols: [false, true,  true]  },
                  { name: "Consumable Cover",    cols: [false, true,  true]  },
                  { name: "NBC Protect",         cols: [false, true,  true]  },
                  { name: "Engine Protect",      cols: [false, false, true]  },
                  { name: "Roadside Assistance", cols: [false, false, true]  },
                  { name: "Return to Invoice",   cols: [false, false, true]  },
                  { name: "Key & Lock Replace",  cols: [false, false, true]  },
                  { name: "Tyre Protect",        cols: [false, false, true]  },
                ].map((feature, fi, arr) => (
                  <div key={feature.name}>
                    <div style={{ display: "flex", alignItems: "center", opacity: 0.8, paddingTop: 8, paddingBottom: 8, width: "100%" }}>
                      <div style={{ width: 120, flexShrink: 0, height: 24, display: "flex", alignItems: "center" }}>
                        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#414244", lineHeight: "16px" }}>{feature.name}</p>
                      </div>
                      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {feature.cols.map((included, ci) => (
                          <div key={ci} style={{ width: 60, flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
                            {included ? (
                              <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
                                <div style={{ position: "absolute", top: "8.33%", left: "8.33%", right: "8.33%", bottom: "8.33%" }}>
                                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                                    <path d={svgPathsBenefits.p1767f300} fill="#158939" />
                                  </svg>
                                </div>
                                <div style={{ position: "absolute", top: "36.46%", left: "33.12%", right: "29.38%", bottom: "36.04%" }}>
                                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 9 6.6">
                                    <path clipRule="evenodd" d={svgPathsBenefits.p21838800} fill="white" fillRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            ) : (
                              <div style={{ position: "relative", width: 24, height: 24, flexShrink: 0 }}>
                                <div style={{ position: "absolute", top: "8.33%", left: "8.33%", right: "8.33%", bottom: "8.33%" }}>
                                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                                    <path clipRule="evenodd" d={svgPathsBenefits.p107af7c0} fill="#7E7E7E" fillRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {fi < arr.length - 1 && <div style={{ height: 1, background: "#ebebeb", width: "100%" }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── COVERAGE SECTION -What's covered─────────────────────────────────────────── */}
        <div ref={coverageRef} style={{ marginTop: 16 }}>
          <div style={{ margin: "0 12px", background: "white", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>

              {/* ── "What's covered" white card ──────────────────────────── */}
              <div style={{ background: "white", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 24 }}>

                {/* Header — green tinted bg, clickable */}
                <button
                  onClick={() => setCoveredExpanded(!coveredExpanded)}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", width: "100%", textAlign: "left", flexShrink: 0 }}
                >
                  <div style={{
                    background: "linear-gradient(90deg, rgba(219,240,226,0.6) 0%, rgba(219,240,226,0.6) 100%), linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
                    position: "relative",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", height: 66, gap: 16, paddingLeft: 16, paddingRight: 16 }}>
                      {/* Avatar: white circle, doc+checkmark */}
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ paddingTop: 12, paddingBottom: 12 }}>
                          <div style={{ position: "relative", width: 48, height: 48 }}>
                            <div style={{ position: "absolute", inset: 0, background: "white", borderRadius: 96 }}>
                              <div style={{ position: "absolute", top: "16.67%", left: "16.67%", right: "16.67%", bottom: "16.67%" }}>
                                <div style={{ position: "absolute", left: 0, top: 0, width: 27.429, height: 27.429 }}>
                                  <div style={{ position: "absolute", top: "12.29%", right: "20.62%", bottom: "12.71%", left: "21.04%" }}>
                                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 16 20.5714">
                                      <path d={svgPathsCoverage.p9910130} fill="#282828" />
                                      <path d={svgPathsCoverage.p1509b380} fill="#282828" />
                                      <path clipRule="evenodd" d={svgPathsCoverage.p2cfd7b00} fill="#282828" fillRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                                <div style={{ position: "absolute", left: 12.57, top: 13.71, width: 18.286, height: 18.286 }}>
                                  <div style={{ position: "absolute", top: "8.33%", left: "8.33%", right: "8.33%", bottom: "8.33%" }}>
                                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 15.2381 15.2381">
                                      <path d={svgPathsCoverage.pd9caac0} fill="#158939" />
                                    </svg>
                                  </div>
                                  <div style={{ position: "absolute", top: "36.46%", left: "33.12%", right: "29.38%", bottom: "36.04%" }}>
                                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 6.85714 5.02857">
                                      <path clipRule="evenodd" d={svgPathsCoverage.p2612c400} fill="white" fillRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Title + 24×24 chevron */}
                      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, paddingTop: 12, paddingBottom: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#282828", lineHeight: "20px" }}>What's covered</p>
                        </div>
                        <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="14" height="8" viewBox="0 0 13.9998 7.73918" fill="none" style={{ display: "block" }}>
                            <path d={coveredExpanded ? svgPathsCoverage.p2eb1d200 : svgPathsCoverage.p59b3180} fill="#282828" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[0px]" aria-hidden="true" style={{ position: "absolute", inset: 0, border: "3px solid white", pointerEvents: "none" }} />
                  </div>
                </button>

                {/* Coverage items — shown when expanded */}
                {coveredExpanded && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", paddingTop: 8, paddingBottom: 8 }}>
                    {[
                      { name: "Own Damage",           subtext: "Vehicle damage from accidents, theft, natural disasters" },
                      { name: "Third Party Liability", subtext: "Damage to other vehicles, property, or injuries to third parties" },
                      { name: "Personal Accident",     subtext: "Owner-driver coverage up to ₹15 lakhs" },
                      { name: "Towing",                subtext: "Free roadside towing and assistance" },
                      { name: "Natural Calamities",    subtext: "Earthquakes, floods, hurricanes, landslides" },
                      { name: "Man-made Calamities",   subtext: "Riots, strikes, malicious acts, terrorism" },
                    ].map((item, i, arr) => (
                      <div key={i} style={{ position: "relative", width: "100%", flexShrink: 0 }}>
                        <div style={{ overflow: "hidden", width: "100%" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", paddingLeft: 16, paddingRight: 16 }}>
                            <div style={{ flex: 1, display: "flex", gap: 16, height: 66, alignItems: "center", minWidth: 0, position: "relative" }}>
                              <div style={{ flexShrink: 0, alignSelf: "flex-start", paddingTop: 12 }}>
                                <div style={{ position: "relative", width: 48, height: 48 }}>
                                  <div style={{ position: "absolute", inset: 0, background: "#ecf2f8", borderRadius: 96 }}>
                                    <div style={{ position: "absolute", top: "16.67%", left: "16.67%", right: "16.67%", bottom: "16.67%", overflow: "hidden" }}>
                                      <div style={{ position: "absolute", top: "10.42%", left: "8.33%", right: "8.33%", bottom: "11.65%" }}>
                                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 26.6662 24.9399">
                                          <path clipRule="evenodd" d={svgPathsCoverage.p2d074900} fill="#282828" fillRule="evenodd" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ flex: 1, minWidth: 0, height: "100%", position: "relative" }}>
                                <div style={{ display: "flex", alignItems: "center", paddingTop: 12, paddingBottom: 12, height: "100%" }}>
                                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", overflow: "hidden" }}>
                                    <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#282828", lineHeight: "20px", width: "100%" }}>{item.name}</p>
                                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#282828", lineHeight: "16px", width: "100%" }}>{item.subtext}</p>
                                  </div>
                                </div>
                                {i < arr.length - 1 && (
                                  <div style={{ position: "absolute", bottom: 0, left: 0, right: -16, height: 1, overflow: "hidden" }}>
                                    <div style={{ position: "absolute", top: 1, left: 0, right: 0, bottom: 0 }}>
                                      <div style={{ position: "absolute", top: -1, left: 0, right: 0, bottom: 0 }}>
                                        <svg style={{ display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 272 1">
                                          <line stroke="#EBEBEB" x2="272" y1="0.5" y2="0.5" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              
            </div>
          </div>
        </div>


        

         {/* ── COVERAGE SECTION- what's not covered ─────────────────────────────────────────── */}
        <div ref={coverageRef} style={{ marginTop: 16 }}>
          <div style={{ margin: "0 12px", background: "white", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: 0, display: "flex", flexDirection: "column", gap: 16 }}>

              {/* ── "What's not covered" white card ──────────────────────────── */}
              <div style={{ background: "white", width: "100%", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 24 }}>

                {/* Header — pink tinted bg, clickable */}
                <button
                  onClick={() => setnotCoveredExpanded(!notCoveredExpanded)}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", width: "100%", textAlign: "left", flexShrink: 0 }}
                >
                  <div style={{
                    background: "linear-gradient(90deg, rgba(255,219,219,0.4) 0%, rgba(255,219,219,0.4) 100%), linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
                    position: "relative",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", height: 66, gap: 16, paddingLeft: 16, paddingRight: 16 }}>
                      
                      {/* Avatar: white circle, doc+X */}
                      <div style={{ flexShrink: 0, display: "flex", alignItems: "center", height: "100%" }}>
                        <div style={{ paddingTop: 12, paddingBottom: 12 }}>
                          <div style={{ position: "relative", width: 48, height: 48 }}>
                            <div style={{ position: "absolute", inset: 0, background: "white", borderRadius: 96 }}>
                              <div style={{ position: "absolute", top: "16.67%", left: "16.67%", right: "16.67%", bottom: "16.67%" }}>
                                <div style={{ position: "absolute", left: 0, top: 0, width: 27.429, height: 27.429 }}>
                                  <div style={{ position: "absolute", top: "12.29%", right: "20.62%", bottom: "12.71%", left: "21.04%" }}>
                                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 16 20.5714">
                                      <path d={svgPathsCoverage.p9910130} fill="#282828" />
                                      <path d={svgPathsCoverage.p1509b380} fill="#282828" />
                                      <path clipRule="evenodd" d={svgPathsCoverage.p2cfd7b00} fill="#282828" fillRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                                <div style={{ position: "absolute", left: 19, top: 20, width: 6, height: 6, background: "white" }} />
                                <div style={{ position: "absolute", left: 12.57, top: 13.71, width: 18.286, height: 18.286 }}>
                                  <div style={{ position: "absolute", top: "8.33%", left: "8.33%", right: "8.33%", bottom: "8.33%" }}>
                                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 15.2381 15.2381">
                                      <path clipRule="evenodd" d={svgPathsCoverage.p18636900} fill="#E12E3A" fillRule="evenodd" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Title + 24×24 chevron */}
                      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 12, paddingTop: 12, paddingBottom: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#282828", lineHeight: "20px" }}>What's not covered</p>
                        </div>
                        <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <svg width="14" height="8" viewBox="0 0 13.9998 7.73918" fill="none" style={{ display: "block" }}>
                            <path d={notCoveredExpanded ? svgPathsCoverage.p2eb1d200 : svgPathsCoverage.p59b3180} fill="#282828" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-[0px]" aria-hidden="true" style={{ position: "absolute", inset: 0, border: "3px solid white", pointerEvents: "none" }} />
                  </div>
                </button>

                {/* Not Coverage items — shown when expanded */}
                {notCoveredExpanded && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", paddingTop: 8, paddingBottom: 8 }}>
                    {[
                      { name: "Zero Depreciation",           subtext: "Protects your car’s value from dropping" },
                      { name: "Lock and Key Protection", subtext: "It covers in case your keys get replaced" },
                      
                    ].map((item, i, arr) => (
                      <div key={i} style={{ position: "relative", width: "100%", flexShrink: 0 }}>
                        <div style={{ overflow: "hidden", width: "100%" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", paddingLeft: 16, paddingRight: 16 }}>
                            <div style={{ flex: 1, display: "flex", gap: 16, height: 66, alignItems: "center", minWidth: 0, position: "relative" }}>
                              <div style={{ flexShrink: 0, alignSelf: "flex-start", paddingTop: 12 }}>
                                <div style={{ position: "relative", width: 48, height: 48 }}>
                                  <div style={{ position: "absolute", inset: 0, background: "#ecf2f8", borderRadius: 96 }}>
                                    <div style={{ position: "absolute", top: "16.67%", left: "16.67%", right: "16.67%", bottom: "16.67%", overflow: "hidden" }}>
                                      <div style={{ position: "absolute", top: "10.42%", left: "8.33%", right: "8.33%", bottom: "11.65%" }}>
                                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 26.6662 24.9399">
                                          <path clipRule="evenodd" d={svgPathsCoverage.p2d074900} fill="#282828" fillRule="evenodd" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ flex: 1, minWidth: 0, height: "100%", position: "relative" }}>
                                <div style={{ display: "flex", alignItems: "center", paddingTop: 12, paddingBottom: 12, height: "100%" }}>
                                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4, justifyContent: "center", overflow: "hidden" }}>
                                    <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 14, color: "#282828", lineHeight: "20px", width: "100%" }}>{item.name}</p>
                                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "#282828", lineHeight: "16px", width: "100%" }}>{item.subtext}</p>
                                  </div>
                                </div>
                                {i < arr.length - 1 && (
                                  <div style={{ position: "absolute", bottom: 0, left: 0, right: -16, height: 1, overflow: "hidden" }}>
                                    <div style={{ position: "absolute", top: 1, left: 0, right: 0, bottom: 0 }}>
                                      <div style={{ position: "absolute", top: -1, left: 0, right: 0, bottom: 0 }}>
                                        <svg style={{ display: "block", width: "100%", height: "100%" }} fill="none" preserveAspectRatio="none" viewBox="0 0 272 1">
                                          <line stroke="#EBEBEB" x2="272" y1="0.5" y2="0.5" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

             

                
            </div>
          </div>
        </div>


        

        {/* ── CASHLESS GARAGES SECTION ─────────────────────────────────── */}
        <div ref={garagesRef} style={{ marginTop: 16 }}>
          <div style={{ margin: "0 12px", background: "white", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px" }}>
              {/* Header */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", marginBottom: 16 }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 18, color: "#282828", lineHeight: "20px", marginBottom: 2}}>
                  Cashless Garages
                </p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#7e7e7e" }}>
                  Showing {plan.localGarages} as per your location
                </p>
              </div>

              {/* Garage Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 12,
                  overflowX: "auto",
                  scrollbarWidth: "none",
                }}
              >
                {(["All", "Maruti Authorized", `Other ${plan.name} Network`] as const).map((label, idx) => {
                  const tab = idx === 0 ? "all" : idx === 1 ? "maruti" : "other";
                  const isActive = garageTab === tab;
                  return (
                    <button
                      key={idx}
                      onClick={() => { setGarageTab(tab as "all" | "maruti" | "other"); setGarageSearch(""); }}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 64,
                        background: isActive ? "#ecf2f8" : "#ffffff",
                        border: isActive ? "1px solid #D8E7F7" : "1px solid #E8E1E1",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    ><span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: 12,
                          color: isActive ? "#1576db" : "#7e7e7e",
                          fontWeight: isActive ? 600 : 400,
                          whiteSpace: "nowrap",
                        }}
                      >{label}</span></button>
                  );
                })}
              </div>

              {/* Search bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 56,
                  border: "1px solid #7E7E7E",
                  borderColor: "#7E7E7E",
                  background: "white",
                  marginBottom: 12,
                  height: "44px",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="5" stroke="#7e7e7e" strokeWidth="1.5" />
                  <path d="M11 11L14 14" stroke="#7e7e7e" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={garageSearch}
                  onChange={(e) => setGarageSearch(e.target.value)}
                  placeholder="Search garages"
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "Inter, sans-serif, 500",
                    fontWeight: "500",
                    fontSize: 12,
                    color: "#282828",
                    caretColor: "#1576db",
                  }}
                />
                {garageSearch && (
                  <button
                    onClick={() => setGarageSearch("")}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 2L12 12M12 2L2 12" stroke="#7e7e7e" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Garage list */}
              {filteredGarages.length === 0 ? (
                <div style={{ padding: "20px 0", textAlign: "center" }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#7e7e7e" }}>No garages found</p>
                </div>
              ) : (
                filteredGarages.map((garage, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: i < filteredGarages.length - 1 ? "1px solid #f5f5f5" : "none",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#282828", lineHeight: "16px" }}>
                        {garage.name}
                      </p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#7e7e7e", lineHeight: "14px", marginTop: 2 }}>
                        {garage.address}
                      </p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#7e7e7e", lineHeight: "14px" }}>
                        {garage.distance} away
                      </p>
                    </div>
                    {garage.badge && (
                      <span
                        style={{
                          padding: "3px 8px",
                          borderRadius: 64,
                          background: garage.badge === "Booked" ? "#FFF2CC" : "#FFF2CC",
                          fontFamily: "Inter, sans-serif",
                          fontSize: 10,
                          color: garage.badge === "Booked" ? "#382808" : "#382808",
                          fontWeight: 600,
                          flexShrink: 0,
                          marginLeft: 8,
                        }}
                      >
                        {garage.badge}
                      </span>
                    )}
                  </div>
                ))
              )}

              {/* View All button */}
              <button
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: "10px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1576db", fontWeight: 600, background: "#ecf2f8", borderRadius: 64, paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8 }}>
                  View All Garages
                </span>
                
              </button>
            </div>
          </div>
        </div>

        {/* ── DOCUMENTS SECTION ───────────────────────────────────────── */}
        <div ref={documentsRef} style={{ marginTop: 16 }}>
          <div style={{ margin: "0 12px", background: "white", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 18, color: "#282828", marginBottom: 8, lineHeight: "20px" }}>
                Documents
              </p>
              {plan.documents.map((doc, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 0",
                    borderBottom: i < plan.documents.length - 1 ? "1px solid #f5f5f5" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                    {/* File icon */}
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, color: "#282828", lineHeight: "16px" }}>
                        {doc.title}
                      </p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#7e7e7e", lineHeight: "14px", marginTop: 2 }}>
                        {doc.desc}
                      </p>
                    </div>
                  </div>
                  {/* Download icon */}
                  <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0, marginLeft: 8 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 3V13M6 9L10 13L14 9" stroke="#282828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 16H16" stroke="#282828" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: 16 }} />
      </div>

      {/* ── Bottom sticky bar ───────────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          background: "white",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px"
            
          }}
        >
          {/* Price */}
          <div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11, color: "#7e7e7e", lineHeight: "14px" }}>
              Total Payable
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 22, color: "#282828", lineHeight: "28px", marginTop: 2 }}>
              {currentPrice}
            </p>
          </div>
          {/* Continue button */}
          <button
            onClick={onReviewPay}
            style={{
              height: 52,
              paddingLeft: 40,
              paddingRight: 40,
              borderRadius: 40,
              background: "#004299",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 16, color: "white" }}>
              Continue
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
