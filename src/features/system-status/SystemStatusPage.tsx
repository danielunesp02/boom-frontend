import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiClient";

type SystemStatusResponse = {
  status: string;
  service: string;
  timestamp: string;
};

type SystemStatusState =
  | { type: "loading" }
  | { type: "ready"; data: SystemStatusResponse }
  | { type: "error"; message: string };

export function SystemStatusPage() {
  const [state, setState] = useState<SystemStatusState>({ type: "loading" });

  useEffect(() => {
    let active = true;

    async function loadStatus() {
      try {
        const data = await apiRequest<SystemStatusResponse>("/api/v1/system/status");

        if (active) {
          setState({ type: "ready", data });
        }
      } catch (error) {
        if (active) {
          setState({
            type: "error",
            message: error instanceof Error ? error.message : "Unable to load system status",
          });
        }
      }
    }

    void loadStatus();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main style={{ margin: "0 auto", maxWidth: "720px", padding: "48px 24px" }}>
      <h1>Boom system status</h1>

      {state.type === "loading" && <p>Loading system status...</p>}

      {state.type === "error" && (
        <section role="alert">
          <h2>Unable to load system status</h2>
          <p>{state.message}</p>
        </section>
      )}

      {state.type === "ready" && (
        <section aria-label="System status details">
          <p>API: {state.data.status}</p>
          <p>Service: {state.data.service}</p>
          <p>Timestamp: {state.data.timestamp}</p>
        </section>
      )}
    </main>
  );
}
