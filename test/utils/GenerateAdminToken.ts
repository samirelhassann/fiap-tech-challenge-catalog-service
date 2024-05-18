import jwt from "jsonwebtoken";

import { env } from "@/config/env";

export function generateAdminToken() {
  const payload = {
    role: "ADMIN",
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    subject: "admin-user-id", // Substitua por um ID de usuário admin válido se necessário
    expiresIn: "1h", // Defina o tempo de expiração conforme necessário
  });

  return token;
}
