import { SchemaType } from "@google/generative-ai";

const schema = {
    description: "Details of an individual CV",
    type: SchemaType.OBJECT,
    properties: {
        fullName: {
            type: SchemaType.STRING,
            description: "Full name of the individual",
            nullable: false,
        },
        contactInfo: {
            type: SchemaType.OBJECT,
            description: "Contact information of the individual",
            properties: {
                email: {
                    type: SchemaType.STRING,
                    description: "Email address",
                    nullable: false,
                },
                phone: {
                    type: SchemaType.STRING,
                    description: "Phone number",
                    nullable: true,
                },
            },
            required: ["email"],
        },
        workExperience: {
            type: SchemaType.ARRAY,
            description: "List of work experiences",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    jobTitle: {
                        type: SchemaType.STRING,
                        description: "Title of the job position",
                        nullable: false,
                    },
                    companyName: {
                        type: SchemaType.STRING,
                        description: "Name of the company",
                        nullable: false,
                    },
                    startDate: {
                        type: SchemaType.STRING,
                        description: "Start date of employment",
                        nullable: false,
                    },
                    endDate: {
                        type: SchemaType.STRING,
                        description: "End date of employment (if applicable)",
                        nullable: true,
                    },
                },
                required: ["jobTitle", "companyName", "startDate"],
            },
        },
        education: {
            type: SchemaType.ARRAY,
            description: "List of educational qualifications",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    degree: {
                        type: SchemaType.STRING,
                        description: "Degree obtained",
                        nullable: false,
                    },
                    institution: {
                        type: SchemaType.STRING,
                        description: "Name of the educational institution",
                        nullable: false,
                    },
                    graduationYear: {
                        type: SchemaType.STRING,
                        description: "Year of graduation",
                        nullable: true,
                    },
                },
                required: ["degree", "institution"],
            },
        },
        skills: {
            type: SchemaType.OBJECT,
            description: "Categorized skills including technical and soft skills",
            properties: {
                tech: {
                    type: SchemaType.ARRAY,
                    description: "List of technical skills",
                    items: {
                        type: SchemaType.OBJECT,
                        description: "Technical skill details",
                        properties: {
                            skillName: {
                                type: SchemaType.STRING,
                                description: "Name of the technical skill",
                                nullable: false,
                            },
                            proficiencyLevel: {
                                type: SchemaType.STRING,
                                description: "Level of proficiency (e.g., Beginner, Intermediate, Expert)",
                                enum: ["Beginner", "Intermediate", "Expert"],
                                nullable: false,
                            },
                            yearsOfExperience: {
                                type: SchemaType.NUMBER,
                                description: "Years of experience with the skill",
                                nullable: true,
                            },
                        },
                        required: ["skillName", "proficiencyLevel"],
                    },
                },
                soft: {
                    type: SchemaType.ARRAY,
                    description: "List of soft skills",
                    items: {
                        type: SchemaType.OBJECT,
                        description: "Soft skill details",
                        properties: {
                            skillName: {
                                type: SchemaType.STRING,
                                description: "Name of the soft skill",
                                nullable: false,
                            },
                            proficiencyLevel: {
                                type: SchemaType.STRING,
                                description: "Level of proficiency (e.g., Beginner, Intermediate, Expert)",
                                enum: ["Beginner", "Intermediate", "Expert"],
                                nullable: false,
                            },
                            contextualExample: {
                                type: SchemaType.STRING,
                                description: "Example of how the skill is applied in practice",
                                nullable: true,
                            },
                        },
                        required: ["skillName", "proficiencyLevel"],
                    },
                },
            },
            required: ["tech", "soft"],
        },
        certifications: {
            type: SchemaType.ARRAY,
            description: "List of certifications",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    certificationName: {
                        type: SchemaType.STRING,
                        description: "Name of the certification",
                        nullable: false,
                    },
                    issuingOrganization: {
                        type: SchemaType.STRING,
                        description: "Organization that issued the certification",
                        nullable: false,
                    },
                    issueDate: {
                        type: SchemaType.STRING,
                        description: "Date the certification was issued",
                        nullable: true,
                    },
                },
                required: ["certificationName", "issuingOrganization"],
            },
        },
    },
    required: ["fullName", "contactInfo", "workExperience", "skills"],
};

export default schema;