import { JobDifficulty, JobStyle } from "@/types";

export const getStyleBadgeColor = (style?: JobStyle) => {
  switch (style) {
    case JobStyle.REMOTE:
      return "bg-green-500/15 text-green-700 dark:text-green-300 border border-green-500/30";
    case JobStyle.ONSITE:
      return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30";
    case JobStyle.FLEXIBLE:
      return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30";
    case JobStyle.FULL_TIME:
      return "bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30";
    case JobStyle.DAY:
      return "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30";
    default:
      return "bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/30";
  }
};

export const getDifficultyBadgeColor = (difficulty?: JobDifficulty) => {
  switch (difficulty) {
    case JobDifficulty.ENTRY_LEVEL:
      return "bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30";
    case JobDifficulty.INTERN:
      return "bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30";
    case JobDifficulty.MID_LEVEL:
      return "bg-pink-500/15 text-pink-700 dark:text-pink-300 border border-pink-500/30";
    case JobDifficulty.SENIOR_LEVEL:
      return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30";
    default:
      return "bg-gray-500/15 text-gray-700 dark:text-gray-300 border border-gray-500/30";
  }
};
