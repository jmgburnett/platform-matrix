import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const client = new ConvexHttpClient("https://elegant-meerkat-935.convex.cloud");

const PLACEHOLDERS = [
  "PSE 1", "PSE 2", "PSE 3", "PSE 4", "PSE 5", "PSE 6", "PSE 7", "PSE 8", "PSE 9",
  "Infra Eng 1", "Infra Eng 2", "Infra Eng 3",
  "Data Analyst 1",
  "Help Desk 1",
  "Security Eng 1",
  "Enterprise Sys Eng 1",
  "Shared Solutions Eng 1", "Shared Solutions Eng 2",
  "Experience Systems Designer",
  "Outcome Product Lead",
  "Bryce",
];

async function main() {
  // Remove from org data (matrix)
  const orgRow = await client.query(api.orgData.get, { key: "default" });
  if (orgRow?.data) {
    const org = JSON.parse(orgRow.data);
    let removed = 0;
    org.products = org.products.map((p: any) => {
      const newCells: any = {};
      Object.entries(p.cells || {}).forEach(([layerId, items]: [string, any]) => {
        const filtered = (items || []).filter((item: any) => {
          if (PLACEHOLDERS.includes(item.name)) { removed++; return false; }
          return true;
        });
        newCells[layerId] = filtered;
      });
      return { ...p, cells: newCells };
    });
    await client.mutation(api.orgData.save, { key: "default", data: JSON.stringify(org) });
    console.log(`Removed ${removed} placeholder entries from matrix`);
  }

  // Remove from roster metadata
  const rosterRow = await client.query(api.rosterData.get, { key: "default" });
  if (rosterRow?.data) {
    const roster = JSON.parse(rosterRow.data);
    let removedRoster = 0;
    for (const name of PLACEHOLDERS) {
      if (roster[name]) { delete roster[name]; removedRoster++; }
    }
    await client.mutation(api.rosterData.save, { key: "default", data: JSON.stringify(roster) });
    console.log(`Removed ${removedRoster} placeholder entries from roster metadata`);
  }
}

main().catch(console.error);
