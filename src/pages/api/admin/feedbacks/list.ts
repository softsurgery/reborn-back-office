import container from "@/lib/container";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const feedbackService = container.FeedbackService;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed", code: 405 });
  }
  try {
    const feedbacks = await feedbackService.getPaginatedFeedbacks(req.query);
    return res.status(200).json(feedbacks);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", code: 500, details: error });
  }
}
