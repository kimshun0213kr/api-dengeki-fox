import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push("https://dengeki-fox.net/");
    }, 1000);
  });
  return (
    <>
      <Head>
        <title>api.dengeki-fox</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <h1>Login not allowed.</h1>
        <h3>
          If you are not redirected, click{" "}
          <Link as="span" href="https://dengeki-fox.net/">
            here
          </Link>{" "}
          to access the home page.
        </h3>
      </body>
    </>
  );
}
