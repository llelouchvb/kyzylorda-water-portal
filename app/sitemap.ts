import type { MetadataRoute } from "next";
import {sections} from "@/lib/content";
export default function sitemap():MetadataRoute.Sitemap { const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"; return (["kz","ru"] as const).flatMap(lang=>[{url:`${base}/${lang}`,lastModified:new Date("2026-09-23")},...sections.map(s=>({url:`${base}/${lang}/${s}`,lastModified:new Date("2026-09-23")}))]); }
