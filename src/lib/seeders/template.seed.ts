import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

const TEMPLATES_DIR = path.join(__dirname, "templates");

async function seedTemplates() {
  const files = await fs.readdir(TEMPLATES_DIR);

  const baseNames = new Set(
    files
      .filter((file) => file.endsWith(".html"))
      .map((file) => path.basename(file, ".html"))
  );

  //@ts-ignore
  for (const name of baseNames) {
    const htmlPath = path.join(TEMPLATES_DIR, `${name}.html`);
    const cssPath = path.join(TEMPLATES_DIR, `${name}.css`);

    const [markdownContent, styleheetContent] = await Promise.all([
      fs.readFile(htmlPath, "utf-8"),
      fs.readFile(cssPath, "utf-8").catch(() => null),
    ]);

    await prisma.template.upsert({
      where: { name },
      update: { markdownContent, styleheetContent },
      create: {
        name,
        markdownContent,
        styleheetContent,
      },
    });

    console.log(`Seeded template: ${name}`);
  }
}

async function main() {
  const start = new Date();
  console.log("Seeding Templates...");

  await seedTemplates();

  const end = new Date();
  console.log(`Completed in ${end.getTime() - start.getTime()}ms`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
