import { SchemaType } from "@google/generative-ai";

const bestMatchJobSchema = {
  type: "object",
  properties: {
    jobTitle: {
      type: SchemaType.STRING,
      description: "The title of the best matching job position.",
    },
    client: {
      type: SchemaType.STRING,
      description: "The client offering the job position.",
    },
    matchSkills: {
      type: SchemaType.STRING,
      description: "Summary of skills that matches with the client",
    },
    summary: {
      type: SchemaType.STRING,
      description: "A brief summary of why this job is the best match.",
    },
  },
  required: ["jobTitle", "client", "matchSkills", "summary"],
};

export default bestMatchJobSchema;