import { makeRequest } from "./makeRequest";

export function getWeeklyEngagement() {
  return makeRequest("/private/analytics/weekly-engagement");
}

export function getRevenueLast6Months() {
  return makeRequest("/private/analytics/revenue-6m");
}
