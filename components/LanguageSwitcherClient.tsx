"use client";
import dynamic from "next/dynamic";
const LanguageSwitcher = dynamic(() => import("./language-switcher").then(mod => mod.LanguageSwitcher), { ssr: false });
export default LanguageSwitcher;
