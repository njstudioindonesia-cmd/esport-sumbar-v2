/**
 * Facade Layanan Core Modular ESPORT SUMBAR V3 (Sub-langkah 7.6)
 * Mengekspos 4 subdomain independen dengan batas modul yang ditegakkan:
 * - Identity (accounts, roles, authentication)
 * - Profile (7 entity profiles, 1-account-1-profile, UU PDP compliance)
 * - Ecosystem (relation_rules, multi-entity connections, cascade termination)
 * - Catalog (dynamic games, roles, ranks, Honor of Kings)
 */

export * as IdentityModule from "./identity";
export * as ProfileModule from "./profile";
export * as EcosystemModule from "./ecosystem";
export * as CatalogModule from "./catalog";
