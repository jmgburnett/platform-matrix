/* Import team roster into Convex rosterData */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const client = new ConvexHttpClient("https://little-toucan-481.convex.cloud");

const TEAM: [string, string][] = [
  // First block
  ["Christian Gentry", "Systems Manager"],
  ["Cody Fullinwider", "Systems Manager"],
  ["Austin Lawler", "Director, Systems Management"],
  ["Pamala Mullis", "Program Manager"],
  ["Jacob Rohr", "Associate Support Specialist - IT & Support"],
  ["Peter Reilly", "Senior Systems Administrator"],
  ["Dan Cawley", "Associate Support Specialist - IT & Networking"],
  ["Jessica Alvarez", "System Support Engineer, Workday"],
  ["Carmen Torres", "System Support Engineer, Workday"],
  ["Leo Hurtado", "Technical Account Manager"],
  ["Tameka Robinson", "Program Manager"],
  ["Myriam Weiler", "Associate Support Specialist - IT & Support"],
  ["Ryan Hunziker", "IT Director"],
  ["Jen Garces", "Systems Manager"],
  ["Timothy Lung", "Director, Help Desk & IT Support"],
  ["Sierra Wagner", "HR Coordinator"],
  ["Connie Goss", "Enrollment Marketing Project Coordinator"],
  ["Justin Carter", "IT Tech 1"],
  ["Anne Foster", "IT Manager"],
  ["Linda Giusti", "AVP for HR"],
  ["Logan Seidel", "IT Tech 1"],
  ["Rob Ryan", "Director of Web"],
  ["Ben Huffman", "Chief Information Officer"],
  ["Dawn Wessale", "Marketing Technology Manager"],
  ["Mike Oei", "Controller"],
  ["Josh Maestas", "Business Analyst"],
  ["Justin Halverson", "Data Analyst"],
  ["Jesse Umeh", "Director of Brand & Marketing Development"],
  ["Lee Muzzy", "Senior Infrastructure Engineer"],
  ["Dan Lautenschleger", "Program Manager"],
  ["Collins Fonjie", "IT Asset & Procurement Associate"],
  ["Paul Kulp", "Principal, CIO Advisory"],
  ["Rachel Lance", "Program Manager"],
  ["Hannah Kim", "Program Manager"],
  ["Megan Wallace", "Web Development Technical Architect"],
  ["Justin Butler", "Software Engineering Manager"],
  ["Bill Kingham", "Account Services Specialist"],
  ["Brion Lamar", "Software Engineer Lead"],
  ["Kelly Rhea", "System Administrator III"],
  ["John Ivaska", "Network Services Manager"],
  ["Ethan Clark", "Office Technology Analyst"],
  ["Zack Anderson", "Network Engineer IV"],
  ["Darren Yarbrough", "Software Engineer III"],
  ["Scott Keltner", "Software Engineer Lead"],
  ["Donavon Hedlun", "Customer Care Center Manager"],
  ["Jack Campbell", "Software Engineer II"],
  ["Jay Klika", "Computer Support Technician IV"],
  ["Mark Alvarez", "Cloud Collaboration Analyst"],
  ["Richard Amsler", "Software Engineer III"],
  ["Stephen Boone", "Senior IT Support Associate"],
  ["Sean Byers", "Senior IT Asset & Procurement Associate"],
  ["Wesley Jeanty", "IT Escalations Associate"],
  ["Joel Medina", "Software Engineer II"],
  ["Nadia Ighile", "Support Associate, Help Desk"],
  ["Toni Erwin", "Accounts Payable Assistant"],
  ["Ralph Hassbaum Jr.", "Software Engineer IV"],
  ["Sheila Haut", "Advancement Publications Editor"],
  ["Joshua Witzenburger", "Senior Support Engineer"],
  ["Jeffrey Livingston", "Director, Program Integration"],
  ["Garrett Anderson", "Systems Engineer - Workday"],
  ["Robin Arroyo", "Program Manager - Workday"],
  ["Myra Bowen-Johnson", "Procurement & Licensing Coordinator"],
  ["Dennis Choing", "Associate Support Specialist - IT & Support"],
  ["Ed Guizar", "Security Analyst"],
  ["Susan Santello", "Accountant"],
  ["Leah Walker", "IT Tech 1"],
  ["Kevin Cancilla", "Director of Marketing Technology, Operations & Performance"],
  ["Ray DeGracia", "IT Tech 2"],
  ["Bryan Byrne", "Marketing Project Coordinator"],
  ["Billy Ratliff II", "Budget Analyst"],
  ["Ben Knudsen", "IT Tech 2"],
  ["Renee Morrow", "Creative Director of Advancement"],
  ["Cindy Shephard", "Assistant Controller"],
  ["Maryna Melnychenko", "Marketing Services Assistant"],
  ["Mary Cole", "Accounts Payable"],
  ["Jenice Sabra", "HR Generalist"],
  ["Gwen McKinnon", "Payroll Specialist"],
  ["Joshua Haupt", "Senior Director, Delivery"],
  ["Ben Marthaler", "Support Associate, Help Desk"],
  ["Jen Gampp", "Systems Manager"],
  ["Kent Portell", "Enterprise Systems Engineer"],
  ["Caroline Israel", "CRM Technical Architect"],
  ["Bryan Douglas", "CRM Technical Architect"],
  ["Chris Oursbourn", "Product Manager Lead"],
  ["Darrin Hull", "Web Software Engineer III"],
  ["Brent Stilts", "Database Specialist III"],
  ["Helen Piper", "Coordinator IV"],
  ["David Eoff", "Inventory/Supplies Coord III"],
  ["Sam Casey", "Coordinator"],
  ["Roger Richardson", "Network Administrator IV"],
  ["Hayley Gentry", "Identity & Access Management Analyst I"],
  ["Aurelia Stratton", "Manager"],
  ["Jeff Sherman", "User Support Specialist IV"],
  ["Darren Furr", "Chief Technology Officer"],
  ["Jason Stratton", "Director of IT Operations"],
  ["Adin Hiebsch", "Software Engineer II"],
  ["George Georgiades", "Missions Software Manager"],
  ["Joe Roach", "Software Engineer II"],
  ["Sean O'Toole", "Senior IT Support Associate"],
  ["Lytia Alyson Moritz-Head", "PBX Operator"],
  ["Mia Giusti", "HR Assistant"],
  ["Elizabeth Faitz", "Data Analyst I"],
  ["George Marticorena", "Support Associate, Help Desk"],

  // Brian Johnson's team
  ["Brian Johnson", "Head of Infrastructure, Data and Services"],
  ["Branden Slocum", "Staff Engineer"],
  ["Christian Bourdeau", "Principal Data Visualization Engineer"],
  ["Akshara Desai", "Data Analyst, Workspace"],
  ["Jerry Perez", "Principal Data Architect & Engineer"],
  ["Greg Lavender", "Chief Technology Officer"],

  // Next block
  ["Maia Singletary", "Engineer"],
  ["John Malagon", "Senior Support Engineer"],
  ["Bryan Eaton", "Senior Staff Engineer"],
  ["Ryan Cook", "Senior Staff Engineer"],
  ["Jacob Klinvex", "Business Owner"],
  ["Reece Bluh", "Associate Support Specialist"],
  ["Joel Longtine", "Senior Director, Infrastructure"],
  ["Vincent Vigil", "Director, Platform Operations"],
  ["Chad Russell", "Staff Engineer"],
  ["David Barnum", "Director, Computing & Infrastructure"],
  ["Joe Stillman", "Associate Support Engineer"],
  ["Laura Walden", "Program Manager"],
  ["Matthew Pugmire", "Systems Engineer"],
  ["Lucas Pierson", "Product Manager"],
  ["William Gauthier", "Director, Gloo360 Product"],
  ["Raman Sinha", "Senior Staff Engineer"],
  ["Brian Knollman", "Director, Support"],
  ["Kaylynn Bossart", "Senior Support Specialist"],
  ["Scott Symmank", "Senior Staff Engineer"],
  ["Tom Josephson", "Staff Engineer"],
  ["Bethany Hayes", "Associate Support Specialist"],
  ["Trey Hicks", "Senior Staff Engineer"],
  ["Alex Ammons", "Director, Business Intelligence & Analytics"],
  ["Kevin Rexroad", "Systems Engineer"],
  ["Kyle Edwards", "Director, Computing & Infrastructure"],
  ["Beto Trew Ribeiro", "Associate Support Specialist"],
  ["Justin Stouder", "Vice President, Technology Operations"],
  ["Emma Elliott", "Business Intelligence Analyst"],
  ["Shawn Claxton", "Support Engineer"],
  ["Kellie Aistrop", "Product Designer"],
  ["Ruth Otto", "Director, Client Transition & Continuity"],
  ["Violetta Reum", "Project Manager"],
  ["Allyson Goeden", "Data Analyst"],
  ["David Gutierrez", "Senior Engineer"],
  ["Jeremy Barnes", "Senior Infrastructure Engineer"],
  ["Alastair Cuthbertson", "Senior Data Analyst"],

  // Leadership block
  ["Bryce Runyon", "Senior Director, Strategic Alignment"],
  ["Doug Hennum", "Division Chief Strategy Officer"],
  ["Paul Alexander", "Senior Vice President, Gloo360"],
  ["Kat Porter", "Executive Program Manager"],
  ["Labri Wright", "Office Administrator"],
  ["Ryan Baca", "Vice President, Portfolio & Delivery Operations"],
  ["Ben Gauthier", "President, Gloo 360"],
  ["Christian Patterson", "Director, Experience Design"],

  // Security block
  ["Corey Capel", "Principal Infrastructure Security Engineer"],
  ["Shane Thornley", "Director, Security & Corporate IT"],
  ["Lisa Martin", "Integration Security Engineer"],
  ["Edward Hahn", "Application and Product Security Engineer"],
  ["Matthew Baxter", "Senior IT Support Specialist"],

  // Gloo AI
  ["Alex Cook", "Senior Director, AI Engineering"],
  ["Ali Llewellyn", "Senior Manager, Gloo Open"],
  ["Jaron Swab", "Senior Engineer"],
  ["Graham Malone", "Director, Product Management"],
  ["Justin Chadbourne", "Product Manager, AI"],
  ["Dmitri Kobozev", "Full Stack AI Engineer"],
  ["Drew Bronson", "Senior MLOps Engineer"],
  ["Aaron Kulbe", "Senior MLOps Engineer"],
  ["Zack Leech", "Data Engineer"],
  ["Jonathan Shaw", "Head of Machine Learning"],
  ["James Yarris", "Senior Engineer"],
  ["Steele Billings", "President, Gloo AI"],
  ["Nick Skytland", "Vice President, Gloo Developers"],
  ["Dillon Mee", "AI Engineer"],

  // AI Ops block
  ["Devon Kline", "Vice President, AI Strategy and Operations"],
  ["David Adams", "Director of Operations"],
  ["Kathryn Ferguson", "Executive Assistant"],
  ["Daniel Wilson", "CEO, XRI Global, Inc."],
  ["Tracy Alexander", "Program Manager"],
  ["Mandy McCurdy", "Director, AI Solutions & Strategic Partnerships"],
  ["Mark Louie", "Senior Director of Program Management, Gloo AI"],
  ["Mike Beaulieu", "Senior Director of Operations"],

  // Workspace
  ["Josh Burnett", "AI First Product Lead"],
  ["Sarah Burnett", "AI First Product Operations & Adoption Lead"],
  ["Ashley Beaty", "Product Owner"],
  ["Dillon Wilson", "Vice President, Workspace Product"],
  ["Michelle Pagnotta", "Product Owner"],
  ["Matt Michel", "AI First Platform Architecture & Engineering Lead"],
  ["Doug Foltz", "Content Engineering & Values Alignment Lead"],

  // Design
  ["Sarah Kadlecek", "Senior Product Designer"],
  ["Bailey Pilgreen", "Senior Product Designer"],
  ["Thomas Havranek", "Senior Manager, Product Design"],
  ["Joe Skager", "Senior Product Designer"],
  ["Cal Fenske", "UX Designer"],
  ["Matthew Slaughter", "Senior Director, Creative"],
  ["Michael Powell", "Product Designer"],
  ["Stefani Soto", "Senior Product Designer"],

  // Engineering
  ["Matthew Hestera", "Project Manager"],
  ["Kasey McCurdy", "Senior Director, Engineering"],
  ["Michael Bosworth", "Senior Staff Engineer"],

  // Other Workspace
  ["Matthew Engel", "Senior Manager, Church Innovation"],
  ["Vinnie Scalia", "Senior Director, Demand Gen"],
  ["John Carter", "Senior Dedicated Account Manager"],
  ["Austin Walker", "Team Lead, Dedicated Account Manager"],
  ["Benjamin Bell", "Manager, Sales"],
  ["Jennifer Severn", "Senior Dedicated Account Manager"],
];

async function main() {
  // Get existing roster data
  const existing = await client.query(api.rosterData.get, { key: "default" });
  let rosterMeta: Record<string, any> = {};
  if (existing?.data) {
    try { rosterMeta = JSON.parse(existing.data); } catch {}
  }

  // Preserve existing custom JDs
  const customJDs = rosterMeta._customJDs || {};

  let added = 0;
  let updated = 0;

  for (const [name, role] of TEAM) {
    if (rosterMeta[name]) {
      // Person exists — only update role if they don't have one
      if (!rosterMeta[name].role) {
        rosterMeta[name].role = role;
        updated++;
      }
    } else {
      // New person
      rosterMeta[name] = {
        role,
        capabilities: [],
        email: "",
        phone: "",
        notes: "",
      };
      added++;
    }
  }

  rosterMeta._customJDs = customJDs;

  await client.mutation(api.rosterData.save, {
    key: "default",
    data: JSON.stringify(rosterMeta),
  });

  console.log(`Done! Added ${added} new, updated ${updated} existing. Total: ${Object.keys(rosterMeta).length - 1} people.`);
}

main().catch(console.error);
