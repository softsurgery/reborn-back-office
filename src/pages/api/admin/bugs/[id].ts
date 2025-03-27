import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bugService = container.BugService;
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const bug = await bugService.getBugById(id);
        if (!bug) {
          return res.status(404).json({ error: "Bug not found", code: 404 });
        }
        return res.status(200).json(bug);
      }
      case "PUT": {
        const updatedBug = await bugService.updateBug(id, req.body);
        return res.status(200).json({
          message: "Bug updated successfully",
          code: 200,
          data: updatedBug,
        });
      }
      case "DELETE": {
        console.log("failed");
        const deletedBug = await bugService.deleteBug(Number(id));
        return res.status(200).json({
          message: "Bug deleted successfully",
          code: 200,
          data: deletedBug,
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
