import { MetadataRoute } from "next";
import { initialProperties } from "../data/properties";
import { propertyCategories } from "../data/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://propertyengine.in";

  // Static routes
  const staticRoutes = [
    "",
    "/properties",
    "/map",
    "/saved",
    "/post-property",
    "/about",
    "/contact",
    "/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Category routes
  const categoryRoutes = propertyCategories.map((cat) => ({
    url: `${baseUrl}/properties/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Property detail routes
  const propertyRoutes = initialProperties.map((p) => ({
    url: `${baseUrl}/property/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...propertyRoutes];
}
