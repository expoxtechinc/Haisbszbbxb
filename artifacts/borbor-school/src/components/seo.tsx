import { useEffect } from "react";

const SITE_URL = "https://dasbmsoe-official.vercel.app";
const DEFAULT_DESCRIPTION =
  "Dr. Abraham S. Borbor Memorial School Of Excellence (DASBMSE) — DR. ABRAHAM S. BORBOR SCHOOL in Mount Barclay, Lower Johnsonville, Monrovia, Liberia. We Don't Just Teach, We Inspire.";

type SeoProps = {
  title: string;
  description?: string;
  path: string;
};

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function Seo({ title, description, path }: SeoProps) {
  useEffect(() => {
    const desc = description ?? DEFAULT_DESCRIPTION;
    const url = SITE_URL + path;
    document.title = title;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", desc);
    setLink("canonical", url);
  }, [title, description, path]);

  return null;
}
