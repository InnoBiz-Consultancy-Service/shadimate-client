/* ── Profile Visit Types ── */

export interface ProfileVisitCountResponse {
  count: number;
}

export interface ProfileVisitor {
  userId: string;
  name: string;
  visitCount: number;
  visitedAt: string;
}

export interface ProfileVisitorsResponse {
  data: ProfileVisitor[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
