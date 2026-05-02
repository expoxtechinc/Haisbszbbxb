#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const artifactRoot = resolve(__dirname, "..");

const SITE_URL = "https://dasbmsoe-official.vercel.app";
const SITE_TITLE = "Dr. Abraham S. Borbor Memorial School Of Excellence";
const SITE_DESCRIPTION =
  "News and announcements from Dr. Abraham S. Borbor Memorial School Of Excellence (DASBMSE), Mount Barclay, Lower Johnsonville, Monrovia, Liberia.";
const SITE_LANGUAGE = "en-LR";
const FEED_AUTHOR_EMAIL = "info@dasbmse.edu.lr";
const FEED_AUTHOR_NAME = "DASBMSE";
const LOGO_URL = `${SITE_URL}/images/school-logo.jpg`;

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeCdata(value) {
  return String(value).replace(/]]>/g, "]]]]><![CDATA[>");
}

function rfc822(date) {
  return new Date(date).toUTCString();
}

function loadItems() {
  const snapshotPath = resolve(__dirname, "news-snapshot.json");
  const raw = JSON.parse(readFileSync(snapshotPath, "utf8"));
  if (!Array.isArray(raw.items)) {
    throw new Error("news-snapshot.json must have an `items` array");
  }
  for (const item of raw.items) {
    if (!item.id || !item.title || !item.body || !item.date) {
      throw new Error(
        `news-snapshot.json item is missing required fields (id, title, body, date): ${JSON.stringify(item)}`,
      );
    }
    if (Number.isNaN(new Date(item.date).getTime())) {
      throw new Error(`Invalid date in news snapshot for item ${item.id}: ${item.date}`);
    }
  }
  return [...raw.items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

function buildRss(items) {
  const buildDate = rfc822(new Date());
  const latest = items[0]?.date ? rfc822(items[0].date) : buildDate;
  const itemsXml = items
    .map((item) => {
      const link = `${SITE_URL}/#news-${encodeURIComponent(item.id)}`;
      const guid = `${SITE_URL}/feed.xml#news-${encodeURIComponent(item.id)}`;
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(guid)}</guid>
      <pubDate>${rfc822(item.date)}</pubDate>
      <description><![CDATA[${escapeCdata(item.body)}]]></description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)} — News</title>
    <link>${escapeXml(SITE_URL + "/")}</link>
    <atom:link href="${escapeXml(SITE_URL + "/feed.xml")}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${escapeXml(SITE_LANGUAGE)}</language>
    <lastBuildDate>${latest}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <generator>DASBMSE feed builder</generator>
    <image>
      <url>${escapeXml(LOGO_URL)}</url>
      <title>${escapeXml(SITE_TITLE)}</title>
      <link>${escapeXml(SITE_URL + "/")}</link>
    </image>
${itemsXml}
  </channel>
</rss>
`;
}

function buildJsonFeed(items) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: `${SITE_TITLE} — News`,
    home_page_url: `${SITE_URL}/`,
    feed_url: `${SITE_URL}/feed.json`,
    description: SITE_DESCRIPTION,
    language: SITE_LANGUAGE,
    icon: LOGO_URL,
    favicon: LOGO_URL,
    authors: [{ name: FEED_AUTHOR_NAME, url: SITE_URL + "/" }],
    items: items.map((item) => ({
      id: `${SITE_URL}/feed.json#news-${item.id}`,
      url: `${SITE_URL}/#news-${encodeURIComponent(item.id)}`,
      title: item.title,
      content_text: item.body,
      date_published: new Date(item.date).toISOString(),
      authors: [{ name: FEED_AUTHOR_NAME, url: `mailto:${FEED_AUTHOR_EMAIL}` }],
    })),
  };
}

function writeOutputs(rss, jsonFeed) {
  const targets = [
    resolve(artifactRoot, "dist", "public"),
    resolve(artifactRoot, "public"),
  ];
  for (const dir of targets) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(resolve(dir, "feed.xml"), rss, "utf8");
    writeFileSync(
      resolve(dir, "feed.json"),
      JSON.stringify(jsonFeed, null, 2) + "\n",
      "utf8",
    );
    console.log(`[build-feed] wrote feed.xml and feed.json to ${dir}`);
  }
}

function main() {
  const items = loadItems();
  const rss = buildRss(items);
  const jsonFeed = buildJsonFeed(items);
  writeOutputs(rss, jsonFeed);
  console.log(`[build-feed] published ${items.length} item(s)`);
}

main();
