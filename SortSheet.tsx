import { useState } from "react";

export interface SortState {
  field: "price" | "cover" | "claims" | "garages";
  priceDir: "cheapest" | "highest";
  coverDir: "minCover" | "maxCover";
}

interface Props {
  onClose: () => void;
  onApply: (sort: SortState) => void;
  currentSort: SortState;
}

const sortOptions = [
  { id: "price", label: "Price" },
  { id: "cover", label: "Cover" },
  { id: "claims", label: "Claim Settlement Rate" },
  { id: "garages", label: "Number of Garages" },
];

export function SortSheet({ onClose, onApply, currentSort }: Props) {
  const [selected, setSelected] = useState<SortState["field"]>(currentSort.field);
  const [priceDir, setPriceDir] = useState<SortState["priceDir"]>(currentSort.priceDir);
  const [coverDir, setCoverDir] = useState<SortState["coverDir"]>(currentSort.coverDir);

  const handleApply = () => {
    onApply({ field: selected, priceDir, coverDir });
  };

  return (
    <div className="absolute inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#f5f5f5] rounded-t-[24px]">
        {/* Handle */}
        <div className="flex justify-center pt-[10px] pb-[4px]">
          <div className="w-[40px] h-[4px] bg-[#cacaca] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-[16px] py-[12px]">
          <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 20, color: "#282828" }}>Sort By</p>
          <button
            onClick={onClose}
            className="size-[28px] rounded-full bg-[#f5f5f5] flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="#282828" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className="mx-[16px] bg-white rounded-[16px] overflow-hidden mb-[16px]">
          {sortOptions.map((opt, i) => (
            <div key={opt.id}>
              {i > 0 && <div className="h-[1px] bg-[#ebebeb] mx-[16px]" />}
              <button
                onClick={() => setSelected(opt.id as SortState["field"])}
                className="w-full flex items-center justify-between px-[16px] py-[16px]"
              >
                <div className="flex items-center gap-[12px]">
                  {/* Radio */}
                  <div
                    className="size-[20px] rounded-full flex items-center justify-center shrink-0"
                    style={{ border: `2px solid ${selected === opt.id ? "#1576db" : "#cacaca"}` }}
                  >
                    {selected === opt.id && (
                      <div className="size-[10px] rounded-full bg-[#1576db]" />
                    )}
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: 15, color: "#282828" }}>
                    {opt.label}
                  </span>
                </div>

                {/* Direction toggle for Price */}
                {opt.id === "price" && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected("price");
                      setPriceDir(prev => prev === "cheapest" ? "highest" : "cheapest");
                    }}
                    className="flex items-center gap-[4px] cursor-pointer"
                  >
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1576db", fontWeight: 600 }}>
                      {priceDir === "cheapest" ? "Cheapest" : "Highest"}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: "rotate(180deg)" }}>
                      {priceDir === "cheapest" ? (
                        <path d="M5 8L5 2M5 2L2 5M5 2L8 5" stroke="#1576db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      ) : (
                        <path d="M5 2L5 8M5 8L2 5M5 8L8 5" stroke="#1576db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </svg>
                  </div>
                )}

                {/* Direction toggle for Cover */}
                {opt.id === "cover" && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected("cover");
                      setCoverDir(prev => prev === "minCover" ? "maxCover" : "minCover");
                    }}
                    className="flex items-center gap-[4px] cursor-pointer"
                  >
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#1576db", fontWeight: 600 }}>
                      {coverDir === "minCover" ? "Min Cover" : "Max Cover"}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform: "rotate(180deg)" }}>
                      {coverDir === "minCover" ? (
                        <path d="M5 8L5 2M5 2L2 5M5 2L8 5" stroke="#1576db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      ) : (
                        <path d="M5 2L5 8M5 8L2 5M5 8L8 5" stroke="#1576db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      )}
                    </svg>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Apply Button */}
        <div className="px-[16px] pb-[16px]">
          <button
            onClick={handleApply}
            className="w-full h-[52px] rounded-[40px] bg-[#004299] flex items-center justify-center"
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 16, color: "white" }}>Apply</span>
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
