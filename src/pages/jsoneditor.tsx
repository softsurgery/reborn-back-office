import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import JSONForm, { JSONValue } from "@/components/ui/json-editor";

const initialDataSample: JSONValue = {
  name: "Project A",
  version: 1,
  active: true,
  metadata: {
    owner: "alice",
    createdAt: "2025-01-01T12:00:00.000Z",
    flags: {
      archived: false,
      confidential: false,
    },
  },
  tags: ["alpha", "beta"],
  contributors: [
    {
      id: 1,
      name: "Alice",
      roles: ["maintainer", "dev"],
      preferences: { darkMode: true, dailyEmails: false },
    },
    {
      id: 2,
      name: "Bob",
      roles: ["reviewer"],
      preferences: { darkMode: false, dailyEmails: true },
    },
  ],
  thresholds: [0.1, 0.5, 0.9],
  notes: null,
};

export default function JsonEditor() {
  const [data, setData] = React.useState<JSONValue>(initialDataSample);

  // Function to reset to initial data
  const handleReset = () => {
    setData(initialDataSample);
    toast("Reset to initial");
  };

  return (
    <main className="overflow-auto p-4">
      <JSONForm
        value={data}
        onChange={setData}
        title="Project Data"
        description="Edit the project configuration"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleReset}>
          Reset to Initial Data
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            toast("Data logged to console");
          }}
        >
          Log Current Data
        </Button>
      </div>
    </main>
  );
}
