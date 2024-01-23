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
      loginID: string;
      loginPASS: string;
      token: string;
      user: string;
      ip: string;
      network: string;
      locate: string;
    };
  },
  res: {
    status: any;
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
  const { token, user, ip, network, locate, loginID, loginPASS } = req.body;
  const campusIp = process.env.NEXT_PUBLIC_CAMPUS_IP!;
  const admin_id = process.env.NEXT_PUBLIC_ADMIN_ID!;
  const hashADMINPASS = process.env.NEXT_PUBLIC_ADMIN_PASS!;
  const user_id = process.env.NEXT_PUBLIC_USER_ID!;
  const hashUSERPASS = process.env.NEXT_PUBLIC_USER_ID!;
  const response = await fetch("https://ipapi.co/json");
  const data = await response.json();
  let Localip = data.ip;
  let Localhost = data.network;
  let Locallocate = `${data.city},${data.region},${data.country_name}`;
  let hashPass: string = "";
  if (loginPASS) {
    hashPass = encryptSha256(loginPASS);
  }

  const arrowLogin: boolean =
    (admin_id == loginID && hashADMINPASS == hashPass) ||
    (user_id == loginID && hashUSERPASS == hashPass);

  const arrow: boolean =
    arrowLogin &&
    token != "" &&
    user != "" &&
    ip != "" &&
    network != "" &&
    locate != "" &&
    Localip.includes(campusIp) &&
    Localhost.includes(campusIp);

  const now = new Date();
  let limit = new Date();
  limit.setDate(limit.getDate() + 3);

  if (arrow) {
    const result = await prisma.loginAuth.create({
      data: {
        token: token,
        user: user,
        ip: ip,
        network: network,
        locate: locate,
        login: String(now),
        limit: String(limit),
      },
    });
    return res.json(result);
  } else {
    const result = await prisma.errorloginAuth.create({
      data: {
        network: Localhost,
        locate: Locallocate,
        date: String(now),
        ip: Localip,
      },
    });
    res.status(403).end();
  }
}
