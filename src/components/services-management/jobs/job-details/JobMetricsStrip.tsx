import React from "react";
import { Users, Eye, ThumbsUp, Share2 } from "lucide-react";

interface JobMetricsStripProps {
  likeCount: number;
}

export const JobMetricsStrip = ({ likeCount }: JobMetricsStripProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-card/80 dark:bg-card/90 border border-border/80 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group">
        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 mb-2 group-hover:scale-110 transition-transform">
          <Users className="w-5 h-5" />
        </div>
        <span className="text-2xl font-black text-foreground">24</span>
        <span className="text-xs font-semibold text-muted-foreground mt-0.5">
          Applications
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-card/80 dark:bg-card/90 border border-border/80 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 mb-2 group-hover:scale-110 transition-transform">
          <Eye className="w-5 h-5" />
        </div>
        <span className="text-2xl font-black text-foreground">156</span>
        <span className="text-xs font-semibold text-muted-foreground mt-0.5">
          Views
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-card/80 dark:bg-card/90 border border-border/80 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group">
        <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500 mb-2 group-hover:scale-110 transition-transform">
          <ThumbsUp className="w-5 h-5" />
        </div>
        <span className="text-2xl font-black text-foreground">
          {likeCount}
        </span>
        <span className="text-xs font-semibold text-muted-foreground mt-0.5">
          Likes
        </span>
      </div>

      <div className="p-5 rounded-2xl bg-card/80 dark:bg-card/90 border border-border/80 shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 mb-2 group-hover:scale-110 transition-transform">
          <Share2 className="w-5 h-5" />
        </div>
        <span className="text-2xl font-black text-foreground">3</span>
        <span className="text-xs font-semibold text-muted-foreground mt-0.5">
          Shares
        </span>
      </div>
    </div>
  );
};
