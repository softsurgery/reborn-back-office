import React from "react";
import { Plus, Edit, Trash2, ChevronDown, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponseEducationDto } from "@/types";

interface EducationSectionProps {
  educations: ResponseEducationDto[];
  onOpenAddSheet: () => void;
  onOpenEditSheet: (education: ResponseEducationDto) => void;
  onOpenDeleteDialog: (id: string) => void;
}

const MAX_DESCRIPTION_LENGTH = 150;

export function EducationSection({
  educations,
  onOpenAddSheet,
  onOpenEditSheet,
  onOpenDeleteDialog,
}: EducationSectionProps) {
  const [expandedDescriptions, setExpandedDescriptions] = React.useState<
    Set<string>
  >(new Set());

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const formatDateRange = (education: ResponseEducationDto) => {
    const start = formatDate(education.startDate);

    if (!education.endDate) {
      return `${start} - Present`;
    }

    const end = formatDate(education.endDate);
    return `${start} - ${end}`;
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddClick = () => {
    onOpenAddSheet();
  };

  const handleEditClick = (education: ResponseEducationDto) => {
    onOpenEditSheet(education);
  };

  const handleDeleteClick = (id: string) => {
    if (id) {
      onOpenDeleteDialog(id);
    }
  };

  return (
    <section className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          <h2 className="text-xl font-bold text-foreground">Education</h2>
        </div>
        <Button onClick={handleAddClick} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {/* Education Grid */}
      {educations && educations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-3 overflow-y-auto no-scrollbar">
          {/* Display ALL educations */}
          {educations.map((education) => {
            const isExpanded = expandedDescriptions.has(education.id);
            const shouldShowExpandButton =
              education.description &&
              education.description.length > MAX_DESCRIPTION_LENGTH;

            const displayedDescription = isExpanded
              ? education.description
              : education.description?.substring(0, MAX_DESCRIPTION_LENGTH);

            return (
              <div
                key={education.id}
                className="group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-secondary/5 h-fit"
              >
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and Institution */}
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {education.title || "Untitled Education"}
                    </h3>
                    {education.institution && (
                      <p className="text-sm text-muted-foreground">
                        {education.institution}
                      </p>
                    )}
                  </div>

                  {/* Date Range */}
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatDateRange(education)}</span>
                  </div>

                  {/* Description */}
                  {education.description && (
                    <div className="space-y-2">
                      <p className="text-sm text-foreground leading-relaxed break-words">
                        {displayedDescription}
                        {shouldShowExpandButton && !isExpanded && "..."}
                      </p>
                      {shouldShowExpandButton && (
                        <button
                          onClick={() => toggleDescription(education.id)}
                          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          {isExpanded ? "Show less" : "Show more"}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 absolute top-4 right-4">
                  <Button
                    onClick={() => handleEditClick(education)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Edit education"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => handleDeleteClick(education.id)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label="Delete education"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-border bg-card/50 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No education added yet
          </p>
          <Button onClick={handleAddClick} variant="link" className="mt-2">
            Add your first education
          </Button>
        </div>
      )}
    </section>
  );
}
