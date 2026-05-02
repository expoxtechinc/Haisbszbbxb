import { useEffect } from "react";

const SITE_URL = "https://dasbmsoe-official.vercel.app";
const DEFAULT_DESCRIPTION =
  "Dr. Abraham S. Borbor Memorial School Of Excellence (DASBMSE) — DR. ABRAHAM S. BORBOR SCHOOL in Mount Barclay, Lower Johnsonville, Monrovia, Liberia. We Don't Just Teach, We Inspire.";

const SCHOOL_DEFAULTS = {
  name: "Dr. Abraham S. Borbor Memorial School Of Excellence",
  alternateName: "DASBMSE",
  slogan: "We Don't Just Teach, We Inspire.",
  email: "info@dasbmse.edu.lr",
  phone: "+231 88 663 3880",
  facebookUrl: "https://www.facebook.com/DASBMSE",
  address: "Mount Barclay, Lower Johnsonville, Monrovia, Liberia",
  established: "2019",
};

export type SeoSchoolInfo = {
  name?: string;
  slogan?: string;
  email?: string;
  phones?: string[];
  facebookUrl?: string;
  address?: string;
  established?: string;
};

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type PersonData = {
  name: string;
  jobTitle: string;
  image?: string;
  description?: string;
};

type SeoProps = {
  title: string;
  description?: string;
  path: string;
  schoolInfo?: SeoSchoolInfo;
  breadcrumbs?: BreadcrumbItem[];
  persons?: PersonData[];
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

function setJsonLd(id: string, data: object) {
  let el = document.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-jsonld", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  const el = document.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${id}"]`);
  if (el) el.remove();
}

export function Seo({ title, description, path, schoolInfo, breadcrumbs, persons }: SeoProps) {
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

    const name = schoolInfo?.name ?? SCHOOL_DEFAULTS.name;
    const email = schoolInfo?.email ?? SCHOOL_DEFAULTS.email;
    const phone = schoolInfo?.phones?.[0] ?? SCHOOL_DEFAULTS.phone;
    const facebookUrl = schoolInfo?.facebookUrl ?? SCHOOL_DEFAULTS.facebookUrl;
    const address = schoolInfo?.address ?? SCHOOL_DEFAULTS.address;
    const established = schoolInfo?.established ?? SCHOOL_DEFAULTS.established;

    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": SITE_URL + "/#school",
      name,
      alternateName: SCHOOL_DEFAULTS.alternateName,
      description: desc,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: SITE_URL + "/images/school-logo.jpg",
        width: 400,
        height: 400,
      },
      image: SITE_URL + "/images/school-logo.jpg",
      address: {
        "@type": "PostalAddress",
        name: address,
        streetAddress: "Mount Barclay",
        addressLocality: "Lower Johnsonville",
        addressRegion: "Montserrado",
        addressCountry: "LR",
      },
      telephone: phone,
      email,
      sameAs: [facebookUrl],
      foundingDate: established,
      knowsAbout: ["Primary Education", "Junior High School", "Senior High School", "Faith-Based Education"],
    };

    setJsonLd("org", orgSchema);

    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };
      setJsonLd("breadcrumb", breadcrumbSchema);
    } else {
      removeJsonLd("breadcrumb");
    }

    if (persons && persons.length > 0) {
      const personSchemas = persons.map((person) => {
        const schema: Record<string, unknown> = {
          "@context": "https://schema.org",
          "@type": "Person",
          name: person.name,
          jobTitle: person.jobTitle,
          worksFor: {
            "@type": "EducationalOrganization",
            "@id": SITE_URL + "/#school",
            name,
          },
        };
        if (person.image) schema.image = person.image.startsWith("http") ? person.image : SITE_URL + person.image;
        if (person.description) schema.description = person.description;
        return schema;
      });

      setJsonLd("persons", {
        "@context": "https://schema.org",
        "@graph": personSchemas,
      });
    } else {
      removeJsonLd("persons");
    }

    return () => {
      removeJsonLd("breadcrumb");
      removeJsonLd("persons");
    };
  }, [title, description, path, schoolInfo, breadcrumbs, persons]);

  return null;
}
