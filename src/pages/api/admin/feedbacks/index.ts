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
        return res.status(200).json({
          message: "Feedback Created Successfully",
          code: 200,
          data: feedback,
        });
      }
      case "DELETE": {
        try {
          const { ids } = req.body;
          if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({error : "Invalid request. 'ids' array required"});
          }
          const feedbacks = await feedbackService.deleteFeedbacks(ids)
          return res.status(200).json({
            message: "Feedback Deleted Successfully",
            code: 200,
            data: feedbacks,
          });
        }
        catch(error:any) {
          console.error("Error deleting feedbacksxxx:",error);
          return res.status(500).json({error : "Internal Server Error",details:error.message});
        }
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
