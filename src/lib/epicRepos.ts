export type EpicRepoLink = {
  id: string;
  epic_id: string;
  repo_owner: string;
  repo_name: string;
  path: string | null;
  label: string | null;
  created_at: string;
};
