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
      description: "Summary of skills that match with the client's requirements.",
    },
    summary: {
      type: SchemaType.STRING,
      description: "A summary explaining why you are a strong candidate for this position, highlighting the company's potential interest in your qualifications.",
    },
  },
  required: ["jobTitle", "client", "matchSkills", "summary"],
};

export default bestMatchJobSchema;