import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const feedbackService = container.FeedbackService;
  try {
    switch (req.method) {
      case "GET": {
        const feedbacks = await feedbackService.getAllFeedbacks(req.query);
        return res.status(200).json(feedbacks);
      }
      case "POST": {
        const feedback = await feedbackService.createFeedback(req.body);
        return res.status(201).json(feedback);
      }
      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error });
  }
}
