import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboard } from "@/features/admin/admin-dashboard";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard · SharmaAI" },
      {
        name: "description",
        content:
          "Monitor learners, content readiness, submissions and mastery health across SharmaAI.",
      },
    ],
  }),
  component: AdminDashboard,
});
