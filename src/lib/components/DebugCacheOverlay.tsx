"use client";

import { useEffect, useState } from "react";

type DebugData = {
  pageCache: string;
  pageType: string;
  dbCache: boolean;
  dbFetchTime: number; // ms
};

export default function DebugCacheOverlay() {
  const [data, setData] = useState<DebugData | null>(null);

  async function fetchDebugInfo() {
    const start = performance.now();
    const res = await fetch("/api/debug-cache");
    // const json = await res.json();
    const end = performance.now();
    const jsonObj = (await res.json()) as Omit<DebugData, "dbFetchTime">;

    setData({
      ...jsonObj,
      dbFetchTime: Math.round(end - start),
    });
  }

  useEffect(() => {
    fetchDebugInfo();
  }, []);

  if (!data) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: 12,
        background: "rgba(0,0,0,0.8)",
        color: "#fff",
        fontSize: 12,
        borderRadius: 6,
        zIndex: 9999,
        fontFamily: "monospace",
        maxWidth: 220,
      }}
    >
      <div>
        <strong>Page type:</strong> {data.pageType}
      </div>
      <div>
        <strong>Page cache:</strong> {data.pageCache}
      </div>
      <div>
        <strong>DB cache:</strong> {data.dbCache ? "כן" : "לא"}
      </div>
      <div>
        <strong>DB fetch time:</strong> {data.dbFetchTime} ms
      </div>
      <button
        style={{
          marginTop: 6,
          fontSize: 11,
          padding: "2px 6px",
          cursor: "pointer",
        }}
        onClick={fetchDebugInfo}
      >
        רענן
      </button>
    </div>
  );
}
