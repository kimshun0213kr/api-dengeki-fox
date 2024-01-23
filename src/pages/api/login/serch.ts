import prisma from "../../../lib/prisma";
import { createHash } from "crypto";

const encryptSha256 = (str: string) => {
  const hash = createHash("sha256");
  hash.update(str);
  return hash.digest().toString("base64");
};

export default async function handle(
  req: {
    body: {
      localToken: string;
    };
  },
  res: {
    json: (arg0: {
      id: number;
      token: string;
      user: string;
      ip: string;
      network: string;
      locate: string;
      login: string;
      limit: string;
    }) => void;
  }
) {
  const { localToken } = req.body;

  const now = new Date();
  let limit = new Date();
  limit.setDate(limit.getDate() + 3);

  if (localToken) {
    const result = await prisma.loginAuth.findFirst({
      where: {
        token: encryptSha256(localToken!),
      },
    });
    if (result) {
      return res.json(result!);
    } else {
      return res.json({
        id: 0,
        token: "",
        user: "",
        ip: "",
        network: "",
        locate: "",
        login: "",
        limit: "",
      });
    }
  } else {
    return res.json({
      id: 0,
      token: "",
      user: "",
      ip: "",
      network: "",
      locate: "",
      login: "",
      limit: "",
    });
  }
}
