import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const delegate = await prisma.user.findFirst({ where: { email: "delegate@riotexas.org" } });
  const conference = await prisma.conference.findFirst({ where: { year: 2026 } });

  if (!delegate || !conference) {
    console.error("Missing delegate user or 2026 conference. Run seed first.");
    process.exit(1);
  }

  const resolution = await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0001",
      conferenceId: conference.id,
      petitionerId: delegate.id,
      status: "SUBMITTED",
      submittedAt: new Date(),
      title_en: "Resolution Honoring the Legacy of Black Methodist Clergy in Victoria, Texas",
      title_es: "Resolución en Honor al Legado del Clero Metodista Negro en Victoria, Texas",
      text_en: `WHEREAS, The roots of Black Methodism in Victoria, Texas reach back to the mid-nineteenth century, when freedmen and freedwomen gathered for worship and mutual support, and

WHEREAS, Generations of Black Methodist clergy in the Victoria area have faithfully served their congregations, mentored young leaders, and strengthened the broader community through education, civic engagement, and compassionate ministry, and

WHEREAS, The contributions of these pastors and their congregations are an essential part of the story of Methodism in South Texas yet remain insufficiently documented and celebrated, and

WHEREAS, The Río Texas Conference is enriched by the diverse heritage of all its member churches,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Recognizes and honors the enduring legacy of Black Methodist clergy and congregations in the Victoria area;

2. Directs the Conference Commission on Archives and History to compile an oral history project documenting the experiences and contributions of Black Methodist leaders in Victoria;

3. Encourages local churches in the Victoria district to host joint worship services and heritage celebrations that lift up this shared history;

4. Requests the Bishop to issue a letter of commendation to the congregations that have sustained this witness across generations.`,
      text_es: `POR CUANTO, Las raíces del metodismo negro en Victoria, Texas se remontan a mediados del siglo XIX, cuando hombres y mujeres liberados se reunían para adorar y apoyarse mutuamente, y

POR CUANTO, Generaciones de clérigos metodistas negros en el área de Victoria han servido fielmente a sus congregaciones, formado jóvenes líderes y fortalecido la comunidad a través de la educación, la participación cívica y el ministerio compasivo, y

POR CUANTO, Las contribuciones de estos pastores y sus congregaciones son parte esencial de la historia del metodismo en el sur de Texas, pero permanecen insuficientemente documentadas y celebradas, y

POR CUANTO, La Conferencia Río Texas se enriquece por la herencia diversa de todas sus iglesias miembros,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Reconoce y honra el legado perdurable del clero y las congregaciones metodistas negras en el área de Victoria;

2. Ordena a la Comisión de Archivos e Historia compilar un proyecto de historia oral que documente las experiencias y contribuciones de líderes metodistas negros en Victoria;

3. Alienta a las iglesias locales del distrito de Victoria a organizar servicios de adoración conjuntos y celebraciones del patrimonio;

4. Solicita al Obispo/a emitir una carta de reconocimiento a las congregaciones que han sostenido este testimonio a lo largo de generaciones.`,
      rationale_en: "Preserving and celebrating the history of Black Methodism in Victoria strengthens our collective identity and honors those whose faithful service built the foundation we stand on today.",
      rationale_es: "Preservar y celebrar la historia del metodismo negro en Victoria fortalece nuestra identidad colectiva y honra a quienes con su servicio fiel construyeron los cimientos sobre los que nos encontramos hoy.",
    },
  });

  console.log(`Created: ${resolution.displayNumber} — ${resolution.title_en}`);
  console.log(`  Status: SUBMITTED`);
  console.log(`  ID: ${resolution.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
