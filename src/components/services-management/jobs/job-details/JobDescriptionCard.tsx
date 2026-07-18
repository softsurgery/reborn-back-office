import React from "react";
import { Sparkles, Tag } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ResponseJobDto } from "@/types";

interface JobDescriptionCardProps {
  job: ResponseJobDto | any | null;
}

export const JobDescriptionCard = ({ job }: JobDescriptionCardProps) => {
  return (
    <Card>
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-black text-foreground tracking-tight">
              Job Description
            </CardTitle>
            <CardDescription className="text-xs">
              Detailed breakdown and requirements
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed">
          <p className="whitespace-pre-wrap font-normal text-foreground/90">
            {job?.description}
          </p>
        </div>

        {/* Tags Section */}
        {Array.isArray(job?.tags) && job.tags.length > 0 && (
          <div className="pt-6 border-t border-border/50 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary" /> Required Skills &
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-accent/50 text-accent-foreground border border-border/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-200 shadow-sm"
                >
                  <Tag className="w-3 h-3 opacity-70" />
                  {tag.label?.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
