"use client";

import dynamic from "next/dynamic";

const StudioPage = dynamic(
  () => import("next-sanity/studio").then((mod) => {
    const { NextStudio } = mod;
    const config = require("../../../../sanity.config").default;
    return { default: () => <NextStudio config={config} /> };
  }),
  { ssr: false, loading: () => <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading Studio...</div> }
);

export default function Studio() {
  return <StudioPage />;
}
