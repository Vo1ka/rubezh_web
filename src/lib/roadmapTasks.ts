export type RoadmapTaskField = {
  label: string;
  value: string;
};

export type RoadmapTask = {
  id: string;
  slug: string;
  code: string;
  title: string;
  kind: "task" | "spike";
  epic_id: string | null;
  status: string | null;
  fields: RoadmapTaskField[];
  position: number;
  created_at: string;
  updated_at: string;
};
