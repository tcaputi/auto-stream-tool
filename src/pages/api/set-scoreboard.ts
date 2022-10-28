import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(400).json({ message: "Only POST requests allowed" });
    return;
  }

  try {
    const jsonPath = path.join(process.cwd(), "data", "app-vars.json");
    await fs.writeFile(jsonPath, JSON.stringify(req.body));
    res.status(200).send("success");
  } catch (err) {
    res.json(err);
  }
}
