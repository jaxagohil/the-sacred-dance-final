import { guideStyles } from "./guides";

export const getGuideName = (
  guide: keyof typeof guideStyles,
  profile?: any
) => {
  if (!profile) return guideStyles[guide].defaultName;

  const map = {
    guide_heart: profile?.guide_1_name,
    guide_structure: profile?.guide_2_name,
    guide_cosmic: profile?.guide_3_name,
  };

  return map[guide] || guideStyles[guide].defaultName;
};