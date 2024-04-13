import puppeteer from "puppeteer";
import { db } from "./src/db/db";

(async () => {
  const products = await db.products
    // .where({ id: 7 })
    .select(
      "link",
      "installmentPrice",
      "installmentPriceSelectorHTML",
      "cashPrice",
      "cashPriceSelectorHTML"
    )
    .limit(10);

  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  for await (const product of products) {
    await page.goto(product.link!);

    // Query for an element handle.
    const element = await page.$eval(
      product.cashPriceSelectorHTML!,
      (e: any) => e.innerText
    );
    const elementInstallment = await page.$eval(
      product.installmentPriceSelectorHTML!,
      (e: any) => e.innerText
    );

    console.log(product.link, { element, elementInstallment });
  }

  // Go to your site

  // Close browser.
  await browser.close();

  // console.log(product);

  // Launch the browser and open a new blank page
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
})();
