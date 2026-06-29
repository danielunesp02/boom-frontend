import { parentDashboardMock } from '../data/parentDashboard.mock';
import type { ParentDashboardResponse } from '../types/parentDashboardTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function fetchParentDashboard(): Promise<ParentDashboardResponse> {
  if (USE_MOCKS) {
    await wait(250);
    return parentDashboardMock;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/parents/dashboard`, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You do not have access to this student dashboard.');
    }

    throw new Error('Unable to load the parent dashboard.');
  }

  return response.json();
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
