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
      title_en: "Resolution Opposing Immigration Enforcement Actions on Church Property and Affirming Sanctuary Ministries",
      title_es: "Resolución en Oposición a las Acciones de Cumplimiento Migratorio en Propiedad Eclesiástica y Afirmación de los Ministerios de Santuario",
      text_en: `WHEREAS, The United Methodist Church affirms in the Book of Discipline ¶162.H that "we recognize, embrace, and affirm all persons, regardless of country of origin, as members of the family of God," and

WHEREAS, Scripture commands us to welcome the stranger (Exodus 23:9, Leviticus 19:33-34), and the Holy Family themselves were refugees fleeing state violence (Matthew 2:13-15), and

WHEREAS, Jesus taught that how we treat "the least of these"—the hungry, the stranger, the imprisoned—is how we treat Christ himself (Matthew 25:35-40), and

WHEREAS, Immigration and Customs Enforcement (ICE) operations in the Río Texas Conference area have created a climate of fear in our congregations and communities, separating families and disrupting the ministry of local churches, and

WHEREAS, Many of our congregations include undocumented members and their families who live in daily fear of detention and deportation, and

WHEREAS, The historic practice of church sanctuary has deep roots in both Christian tradition and American history as a prophetic witness against unjust laws,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Affirms that all church properties within the Conference are sacred spaces where all persons should be free from fear of immigration enforcement;

2. Calls upon every local church to adopt a "Safe Church" policy stating that immigration enforcement agents will not be granted voluntary access to church property during worship, meetings, or ministry activities;

3. Directs the Conference Board of Church and Society to establish a Rapid Response Network to provide real-time notification and pastoral support when immigration enforcement actions occur in our communities;

4. Allocates $50,000 from Conference reserves to establish an Immigration Legal Aid Fund providing direct legal assistance to immigrant families connected to our congregations;

5. Directs the Conference to partner with local legal aid organizations to train clergy and lay leaders in "Know Your Rights" education;

6. Requests that the Bishop issue a pastoral letter to all congregations affirming the Conference's commitment to welcoming the stranger and opposing policies that separate families; and

7. Instructs the Conference Secretary to communicate this resolution to the appropriate agencies of The United Methodist Church and to relevant civil authorities.`,
      text_es: `POR CUANTO, La Iglesia Metodista Unida afirma en el Libro de Disciplina ¶162.H que "reconocemos, abrazamos y afirmamos a todas las personas, sin importar su país de origen, como miembros de la familia de Dios," y

POR CUANTO, Las Escrituras nos mandan acoger al extranjero (Éxodo 23:9, Levítico 19:33-34), y la Sagrada Familia misma fueron refugiados huyendo de la violencia estatal (Mateo 2:13-15), y

POR CUANTO, Jesús enseñó que cómo tratamos a "los más pequeños"—los hambrientos, los extranjeros, los encarcelados—es cómo tratamos a Cristo mismo (Mateo 25:35-40), y

POR CUANTO, Las operaciones del Servicio de Inmigración y Control de Aduanas (ICE) en el área de la Conferencia Río Texas han creado un clima de miedo en nuestras congregaciones y comunidades, separando familias e interrumpiendo el ministerio de las iglesias locales, y

POR CUANTO, Muchas de nuestras congregaciones incluyen miembros indocumentados y sus familias que viven con el temor diario de detención y deportación, y

POR CUANTO, La práctica histórica del santuario eclesiástico tiene raíces profundas tanto en la tradición cristiana como en la historia estadounidense como un testimonio profético contra leyes injustas,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Afirma que todas las propiedades eclesiásticas dentro de la Conferencia son espacios sagrados donde todas las personas deben estar libres del temor a la aplicación de leyes migratorias;

2. Hace un llamado a cada iglesia local a adoptar una política de "Iglesia Segura" que establezca que los agentes de inmigración no tendrán acceso voluntario a la propiedad eclesiástica durante el culto, reuniones o actividades ministeriales;

3. Ordena a la Junta de Iglesia y Sociedad de la Conferencia establecer una Red de Respuesta Rápida para proporcionar notificación en tiempo real y apoyo pastoral cuando ocurran acciones migratorias en nuestras comunidades;

4. Asigna $50,000 de las reservas de la Conferencia para establecer un Fondo de Asistencia Legal Migratoria que proporcione asistencia legal directa a familias inmigrantes conectadas con nuestras congregaciones;

5. Ordena a la Conferencia asociarse con organizaciones locales de asistencia legal para capacitar a clérigos y líderes laicos en educación de "Conozca Sus Derechos";

6. Solicita que el Obispo/la Obispa emita una carta pastoral a todas las congregaciones afirmando el compromiso de la Conferencia con la acogida del extranjero y la oposición a políticas que separan familias; y

7. Instruye al Secretario/a de la Conferencia a comunicar esta resolución a las agencias correspondientes de La Iglesia Metodista Unida y a las autoridades civiles pertinentes.`,
      rationale_en: "This resolution is grounded in our Wesleyan tradition of social holiness and the scriptural mandate to welcome the stranger. The Río Texas Conference, situated along the U.S.-Mexico border region, has a unique calling to embody Christ's hospitality. As ICE enforcement actions intensify, our churches must provide both prophetic witness and practical support to vulnerable members of our community.",
      rationale_es: "Esta resolución se fundamenta en nuestra tradición wesleyana de santidad social y el mandato bíblico de acoger al extranjero. La Conferencia Río Texas, situada en la región fronteriza entre Estados Unidos y México, tiene un llamado único para encarnar la hospitalidad de Cristo. A medida que se intensifican las acciones de cumplimiento migratorio, nuestras iglesias deben proporcionar tanto testimonio profético como apoyo práctico a los miembros vulnerables de nuestra comunidad.",
    },
  });

  console.log(`Created: ${resolution.displayNumber} — ${resolution.title_en}`);
  console.log(`  Status: SUBMITTED`);
  console.log(`  ID: ${resolution.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
