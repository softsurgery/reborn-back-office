import React from "react";
import { Plus, Edit, Trash2, ChevronDown, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponseExperienceDto } from "@/types";

interface ExperienceSectionProps {
  experiences: ResponseExperienceDto[];
  onOpenAddSheet: () => void;
  onOpenEditSheet: (experience: ResponseExperienceDto) => void;
  onOpenDeleteDialog: (id: number) => void;
}

const MAX_DESCRIPTION_LENGTH = 150;

export function ExperienceSection({
  experiences,
  onOpenAddSheet,
  onOpenEditSheet,
  onOpenDeleteDialog,
}: ExperienceSectionProps) {
  const [expandedDescriptions, setExpandedDescriptions] = React.useState<
    Set<number>
  >(new Set());

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const formatDateRange = (experience: ResponseExperienceDto) => {
    const start = formatDate(experience.startDate);

    if (!experience.endDate) {
      return `${start} - Present`;
    }

    const end = formatDate(experience.endDate);
    return `${start} - ${end}`;
  };

  const toggleDescription = (id: number) => {
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

  const handleEditClick = (experience: ResponseExperienceDto) => {
    onOpenEditSheet(experience);
  };

  const handleDeleteClick = (id: number) => {
    if (id) {
      onOpenDeleteDialog(id);
    }
  };

  return (
    <section className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          <h2 className="text-xl font-bold text-foreground">Experience</h2>
        </div>
        <Button onClick={handleAddClick} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {/* Experience Grid */}
      {experiences && experiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4  space-y-3 overflow-y-auto no-scrollbar">
          {/* Display ALL experiences */}
          {experiences.map((experience) => {
            const isExpanded = expandedDescriptions.has(experience.id);
            const shouldShowExpandButton =
              experience.description &&
              experience.description.length > MAX_DESCRIPTION_LENGTH;

            const displayedDescription = isExpanded
              ? experience.description
              : experience.description?.substring(0, MAX_DESCRIPTION_LENGTH);

            return (
              <div
                key={experience.id}
                className="min-h-56 group relative flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:bg-secondary/5 h-fit"
              >
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Title and Company */}
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      {experience.title || "Untitled Position"}
                    </h3>
                    {experience.company && (
                      <p className="text-sm text-muted-foreground">
                        {experience.company}
                      </p>
                    )}
                  </div>

                  {/* Date Range */}
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatDateRange(experience)}</span>
                  </div>

                  {/* Description */}
                  {experience.description && (
                    <div className="space-y-2">
                      <p className="text-sm text-foreground leading-relaxed break-words">
                        {displayedDescription}
                        {shouldShowExpandButton && !isExpanded && "..."}
                      </p>
                      {shouldShowExpandButton && (
                        <button
                          onClick={() => toggleDescription(experience.id)}
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
                    onClick={() => handleEditClick(experience)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Edit experience"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => handleDeleteClick(experience.id)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    aria-label="Delete experience"
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
            No work experience added yet
          </p>
          <Button onClick={handleAddClick} variant="link" className="mt-2">
            Add your first experience
          </Button>
        </div>
      )}
    </section>
  );
}
