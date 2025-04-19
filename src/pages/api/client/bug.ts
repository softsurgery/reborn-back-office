import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bugService = container.BugService;
  try {
    switch (req.method) {
      case "POST": {
        const bug = await bugService.createBug(req.body);
        return res.status(200).json({
          message: "Bug Submitted successfully",
          code: 200,
          data: bug,
        });
      }
      default:
        return res.status(405).json({ error: "Method Not Allowed", code: 405 });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}
