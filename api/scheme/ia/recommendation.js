import { SchemaType } from "@google/generative-ai";

const recommendedPersonSchema = {
  type: "object",
  properties: {
    id: {
      type: SchemaType.STRING,
      description: "Unique identifier for the recommended person.",
    },
    name: {
      type: SchemaType.STRING,
      description: "The full name of the recommended person.",
    },
    description: {
      type: SchemaType.STRING,
      description:
        "Detailed explanation of why this person's skills and experience align with the job requirements.",
    },
  },
  required: ["id", "name", "description"],
};

export default recommendedPersonSchema;
