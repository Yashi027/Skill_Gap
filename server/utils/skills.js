export const SKILLS = {
    HTML: { label: "HTML" },
    CSS: { label: "CSS" },
    JavaScript: { label: "JavaScript" },
    React: { label: "React" },
    NodeJs: { label: "Node.js" },
    Redux: { label: "Redux" },
    Express: { label: "Express" },
    MongoDB: { label: "MongoDB" },
    SQL: { label: "SQL" },
    API_DESIGN: { label: "API Design" }
}

const ALIASES = { mongoose: "MongoDB", MongoDb: "MongoDB", Mongo: "MongoDB", mongodb: "MongoDB", "Node.js": "NodeJs" , "node.js": "NodeJs", restapi: "API_DESIGN", "react.js":"React", reactjs: "React"};

export const CAREER_SKILLS = {
  frontend: ["HTML", "CSS", "JavaScript", "React", "Redux"],
  backend: ["NodeJs", "Express", "MongoDB", "SQL", "API_Design"],
  fullstack: ["HTML", "CSS", "JavaScript", "React", "NodeJs", "MongoDB"]
}

export const normalizeSkill = (skill) => (
    SKILLS[skill] ? skill : ALIASES[skill] || skill
)

export function normalizeSkillObject(obj = {}){
  const out = {};
  for(const [rawkey, value] of Object.entries(obj || {})){
    const key = normalizeSkill(rawkey);
    if(!(key in out)){
      out[key] = value;
    }else if(typeof value === "number" && typeof out[key] === "number"){
      out[key] = Math.max(out[key],value);
    }
  }
  return out;
}

export const CAREERS_KEYS = ["frontend","backend","fullstack"]

export const LANGUAGE_RULES={
  JavaScript: "JavaScript", TypeScript: "JavaScript",
  HTML: "HTML", CSS: "CSS", SCSS: "CSS", Sass: "CSS", Less: "CSS",
  TSQL: "SQL", PLpgSQL: "SQL", PLSQL: "SQL"
}

export const DEPENDENCY_RULES = {
  react: "React",
  "react-dom": "React",
  next: "React",
  redux: "Redux",
  "react-redux": "Redux",
  "@reduxjs/toolkit": "Redux",
  express: "Express",
  mongoose: "MongoDB",
  mongodb: "MongoDB",
  mysql: "SQL",
  mysql2: "SQL",
  pg: "SQL",
  sqlite3: "SQL",
  "better-sqlite3": "SQL",
  sequelize: "SQL",
  knex: "SQL",
  typeorm: "SQL",
  prisma: "SQL",
  "@prisma/client": "SQL",
  tailwindcss: "CSS",
  "@tailwindcss/vite": "CSS",
  sass: "CSS"
};

export const NODE_BACKEND_DEPS = [
  "express", "fastify", "koa", "@nestjs/core", "@hapi/hapi", "hapi", "restify", "nodemon"
];

export const API_DESIGN_DEPS = [
  "swagger-ui-express", "swagger-jsdoc", "joi", "zod", "express-validator",
  "jsonwebtoken", "helmet", "express-rate-limit", "cors", "morgan"
];