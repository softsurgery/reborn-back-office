// pages/api/feedback/[id].ts
import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const feedbackService = container.FeedbackService;
  const { id } = req.query;
  
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const feedback = await feedbackService.getFeedbackById(id);
        if (!feedback) {
          return res.status(404).json({ error: "Feedback not found" });
        }
        return res.status(200).json(feedback);
      }
      case "PUT": {
        const updatedFeedback = await feedbackService.updateFeedback(id, req.body);
        return res.status(200).json(updatedFeedback);
      }
      case "DELETE": {
        await feedbackService.deleteFeedback(id);
        return res.status(204).end();
      }
      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
