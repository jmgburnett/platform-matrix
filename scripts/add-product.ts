import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const client = new ConvexHttpClient("https://elegant-meerkat-935.convex.cloud");

async function main() {
  const existing = await client.query(api.orgData.get, { key: "default" });
  if (!existing?.data) { console.error("No org data"); return; }
  const org = JSON.parse(existing.data);

  // Check if already exists
  if (org.products.some((p: any) => p.name === "Platform Team")) {
    console.log("Platform Team already exists");
    return;
  }

  // Create product with empty cells for all layers
  const id = "platform_team_" + Date.now();
  const cells: Record<string, any[]> = {};
  org.layers.forEach((l: any) => { cells[l.id] = []; });

  org.products.push({
    id,
    name: "Platform Team",
    type: "gloo",
    productLead: "",
    cells,
  });

  await client.mutation(api.orgData.save, {
    key: "default",
    data: JSON.stringify(org),
  });

  console.log("Added Platform Team to products");
}

main().catch(console.error);
