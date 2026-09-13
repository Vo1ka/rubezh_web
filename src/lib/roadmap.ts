export type Milestone = {
  code: string;
  title: string;
  definition: string;
  composition: string;
};

export type RecommendedStep = {
  step: number;
  summary: string;
  rationale: string;
};

export type NextSprint = {
  goal: string;
  tasks: string[];
  non_code_actions: string[];
  dependencies: string;
  expected_build_state: string;
  validation: string[];
  exit_criteria: string;
  gate_status: string;
  escalations: string[];
};

export type RoadmapSnapshot = {
  id: string;
  source_version: string;
  capacity_note: string | null;
  milestones: Milestone[];
  recommended_order: RecommendedStep[];
  next_sprint: NextSprint;
  created_at: string;
};
