import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(400).json({ message: "Only GET requests allowed" });
    return;
  }

  try {
    const jsonPath = path.join(process.cwd(), "data", "app-vars.json");
    const appVars = await fs.readFile(jsonPath, "utf8");
    res.status(200).send(appVars);
  } catch (err) {
    res.status(500).json(err);
  }
}
