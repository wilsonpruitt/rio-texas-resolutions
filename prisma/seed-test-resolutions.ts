import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const sarah = await prisma.user.findFirst({ where: { email: "delegate@riotexas.org" } });
  const roberto = await prisma.user.findFirst({ where: { email: "delegado@riotexas.org" } });
  const conference = await prisma.conference.findFirst({ where: { year: 2026 } });
  const csr = await prisma.committee.findUnique({ where: { abbreviation: "CSR" } });
  const bot = await prisma.committee.findUnique({ where: { abbreviation: "BOT" } });
  const tcvt = await prisma.committee.findUnique({ where: { abbreviation: "TCVT" } });
  const bom = await prisma.committee.findUnique({ where: { abbreviation: "BOM" } });
  const ft = await prisma.committee.findUnique({ where: { abbreviation: "FT" } });

  if (!sarah || !roberto || !conference || !csr || !bot || !tcvt || !bom || !ft) {
    console.error("Missing seed data. Run `npx prisma db seed` first.");
    process.exit(1);
  }

  // Delete existing resolutions to start fresh
  await prisma.resolution.deleteMany({});

  // ── 1. ICE resolution — SUBMITTED, auto-flagged for finance ──────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0001",
      conferenceId: conference.id,
      petitionerId: sarah.id,
      status: "SUBMITTED",
      submittedAt: new Date("2026-02-15"),
      hasFinancialImplications: true,
      financeReferralNote: 'Auto-detected financial language: "$50,000", "allocates", "reserves", "Fund". Per SR-14 — Referral of Resolutions with Financial Implications, this resolution requires Finance & Administration (FT) committee review.',
      title_en: "Resolution Opposing Immigration Enforcement Actions on Church Property and Affirming Sanctuary Ministries",
      title_es: "Resolución en Oposición a las Acciones de Cumplimiento Migratorio en Propiedad Eclesiástica y Afirmación de los Ministerios de Santuario",
      text_en: `WHEREAS, The United Methodist Church affirms in the Book of Discipline ¶162.H that "we recognize, embrace, and affirm all persons, regardless of country of origin, as members of the family of God," and

WHEREAS, Scripture commands us to welcome the stranger (Exodus 23:9, Leviticus 19:33-34), and the Holy Family themselves were refugees fleeing state violence (Matthew 2:13-15), and

WHEREAS, Jesus taught that how we treat "the least of these"—the hungry, the stranger, the imprisoned—is how we treat Christ himself (Matthew 25:35-40), and

WHEREAS, Immigration and Customs Enforcement (ICE) operations in the Río Texas Conference area have created a climate of fear in our congregations and communities, separating families and disrupting the ministry of local churches, and

WHEREAS, Many of our congregations include undocumented members and their families who live in daily fear of detention and deportation,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Affirms that all church properties within the Conference are sacred spaces;
2. Calls upon every local church to adopt a "Safe Church" policy;
3. Directs the Conference Board of Church and Society to establish a Rapid Response Network;
4. Allocates $50,000 from Conference reserves to establish an Immigration Legal Aid Fund;
5. Requests that the Bishop issue a pastoral letter to all congregations.`,
      text_es: `POR CUANTO, La Iglesia Metodista Unida afirma en el Libro de Disciplina ¶162.H que "reconocemos, abrazamos y afirmamos a todas las personas, sin importar su país de origen, como miembros de la familia de Dios," y

POR CUANTO, Las Escrituras nos mandan acoger al extranjero (Éxodo 23:9, Levítico 19:33-34), y

POR CUANTO, Las operaciones de ICE en el área de la Conferencia Río Texas han creado un clima de miedo en nuestras congregaciones,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Afirma que todas las propiedades eclesiásticas son espacios sagrados;
2. Hace un llamado a adoptar una política de "Iglesia Segura";
3. Ordena establecer una Red de Respuesta Rápida;
4. Asigna $50,000 para un Fondo de Asistencia Legal Migratoria;
5. Solicita que el Obispo/a emita una carta pastoral.`,
      rationale_en: "This resolution is grounded in our Wesleyan tradition of social holiness and the scriptural mandate to welcome the stranger.",
      rationale_es: "Esta resolución se fundamenta en nuestra tradición wesleyana de santidad social y el mandato bíblico de acoger al extranjero.",
    },
  });

  // ── 2. Climate resolution — UNDER_REVIEW by CSR ──────────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0002",
      conferenceId: conference.id,
      petitionerId: sarah.id,
      committeeId: csr.id,
      status: "UNDER_REVIEW",
      submittedAt: new Date("2026-02-10"),
      title_en: "Resolution on Creation Care and Environmental Stewardship",
      title_es: "Resolución sobre el Cuidado de la Creación y la Responsabilidad Ambiental",
      text_en: `WHEREAS, God calls us to be stewards of creation (Genesis 2:15), and

WHEREAS, Climate change disproportionately affects the most vulnerable communities in the Río Texas Conference area, including low-income neighborhoods and communities of color,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Commits to reducing the carbon footprint of conference-owned properties by 50% by 2030;
2. Encourages all local churches to conduct energy audits;
3. Establishes a "Green Church" certification program;
4. Calls on all conference institutions to divest from fossil fuel companies within five years.`,
      text_es: `POR CUANTO, Dios nos llama a ser mayordomos de la creación (Génesis 2:15), y

POR CUANTO, El cambio climático afecta desproporcionadamente a las comunidades más vulnerables,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Se compromete a reducir la huella de carbono de las propiedades de la conferencia en un 50% para 2030;
2. Alienta a todas las iglesias locales a realizar auditorías energéticas;
3. Establece un programa de certificación "Iglesia Verde";
4. Llama a desinvertir de empresas de combustibles fósiles.`,
      rationale_en: "As people of faith, we have a moral obligation to protect God's creation for future generations.",
      rationale_es: "Como personas de fe, tenemos la obligación moral de proteger la creación de Dios para las generaciones futuras.",
    },
  });

  // ── 3. Mental health resolution — RECOMMENDED by BOT ─────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0003",
      conferenceId: conference.id,
      petitionerId: roberto.id,
      committeeId: bot.id,
      status: "RECOMMENDED",
      submittedAt: new Date("2026-01-20"),
      recommendedAt: new Date("2026-03-01"),
      recommendationText: "The Board of Trustees concurs with this resolution. We recommend adoption and note that implementation can be handled within existing staff capacity and pastoral care structures.",
      title_en: "Resolution on Mental Health Ministry and Clergy Wellness",
      title_es: "Resolución sobre el Ministerio de Salud Mental y el Bienestar del Clero",
      text_en: `WHEREAS, The demands of pastoral ministry have intensified, and clergy burnout rates continue to rise across our conference, and

WHEREAS, Mental health stigma remains a barrier to seeking help in many of our congregations,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Requires all clergy under appointment to have access to confidential mental health services;
2. Establishes a peer support program for clergy;
3. Encourages every local church to designate a Mental Health Advocate;
4. Partners with local mental health organizations to provide training for lay leaders.`,
      text_es: `POR CUANTO, Las demandas del ministerio pastoral se han intensificado, y las tasas de agotamiento del clero continúan aumentando, y

POR CUANTO, El estigma de la salud mental sigue siendo una barrera para buscar ayuda,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Requiere que todo el clero tenga acceso a servicios confidenciales de salud mental;
2. Establece un programa de apoyo entre pares para el clero;
3. Alienta a cada iglesia a designar un Defensor de Salud Mental;
4. Se asocia con organizaciones locales de salud mental.`,
      rationale_en: "Caring for those who care for others is both a biblical mandate and a practical necessity.",
      rationale_es: "Cuidar a quienes cuidan de otros es tanto un mandato bíblico como una necesidad práctica.",
    },
  });

  // ── 4. Property resolution — NOT_RECOMMENDED ─────────────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0004",
      conferenceId: conference.id,
      petitionerId: sarah.id,
      committeeId: bot.id,
      status: "NOT_RECOMMENDED",
      submittedAt: new Date("2026-01-25"),
      recommendedAt: new Date("2026-03-05"),
      recommendationText: "The Board of Trustees does not recommend this resolution. The trust clause (¶2501) is established by the General Conference and cannot be modified at the annual conference level. We recommend the petitioner pursue this through General Conference channels.",
      title_en: "Resolution to Modify Local Church Property Trust Clause",
      title_es: "Resolución para Modificar la Cláusula de Fideicomiso de Propiedad de Iglesias Locales",
      text_en: `WHEREAS, Several churches in our conference have expressed concerns about the trust clause, and

WHEREAS, Local congregations should have greater autonomy over their own property,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference petitions the General Conference to allow annual conferences to modify the trust clause for local church property.`,
      text_es: `POR CUANTO, Varias iglesias en nuestra conferencia han expresado preocupaciones sobre la cláusula de fideicomiso, y

POR CUANTO, Las congregaciones locales deberían tener mayor autonomía sobre su propiedad,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas solicite a la Conferencia General modificar la cláusula de fideicomiso.`,
      rationale_en: "Local churches deserve greater say in the management of their own property.",
      rationale_es: "Las iglesias locales merecen mayor participación en la gestión de su propia propiedad.",
    },
  });

  // ── 5. Youth ministry — APPROVED for journal ─────────────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0005",
      conferenceId: conference.id,
      petitionerId: roberto.id,
      committeeId: tcvt.id,
      status: "APPROVED",
      submittedAt: new Date("2026-01-15"),
      recommendedAt: new Date("2026-02-20"),
      recommendationText: "The Transforming Communities Vision Team enthusiastically concurs. This resolution aligns with our strategic priority of reaching younger generations.",
      utDecisionText: "The Uniting Table approves this resolution for inclusion in the pre-conference journal. Implementation should be coordinated with the Conference Youth Coordinator.",
      utDecidedAt: new Date("2026-03-08"),
      title_en: "Resolution on Expanding Bilingual Youth and Young Adult Ministry",
      title_es: "Resolución sobre la Expansión del Ministerio Bilingüe de Jóvenes y Jóvenes Adultos",
      text_en: `WHEREAS, The Río Texas Conference serves a diverse, bilingual community, and

WHEREAS, Young people are leaving the church at increasing rates, and many cite lack of cultural relevance,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Creates a bilingual Youth Ministry Coordinator position;
2. Develops culturally relevant bilingual curriculum for youth and young adults;
3. Hosts an annual bilingual youth conference;
4. Establishes mentorship connections between generations.`,
      text_es: `POR CUANTO, La Conferencia Río Texas sirve a una comunidad diversa y bilingüe, y

POR CUANTO, Los jóvenes están dejando la iglesia a tasas crecientes,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Cree un puesto de Coordinador Bilingüe de Ministerio Juvenil;
2. Desarrolle currículo bilingüe culturalmente relevante;
3. Organice una conferencia juvenil bilingüe anual;
4. Establezca conexiones de mentoría entre generaciones.`,
      rationale_en: "Investing in bilingual youth ministry is essential to the future of our conference.",
      rationale_es: "Invertir en el ministerio juvenil bilingüe es esencial para el futuro de nuestra conferencia.",
    },
  });

  // ── 6. Salary resolution — NOT_ADVANCED ──────────────────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0006",
      conferenceId: conference.id,
      petitionerId: sarah.id,
      committeeId: ft.id,
      status: "NOT_ADVANCED",
      submittedAt: new Date("2026-02-01"),
      hasFinancialImplications: true,
      financeReferralNote: 'Auto-detected financial language: "salary", "compensation", "$75,000", "budget". Per SR-14 — Referral of Resolutions with Financial Implications, this resolution requires Finance & Administration (FT) committee review.',
      recommendedAt: new Date("2026-02-25"),
      recommendationText: "Finance and Administration reviewed this resolution but cannot concur. The proposed salary floor would require an additional $1.2M annually, which exceeds available conference resources. We recommend the petitioner work with the Commission on Equitable Compensation on a phased approach.",
      utDecisionText: "The Uniting Table concurs with Finance's assessment. This resolution will not be advanced. The petitioner is encouraged to collaborate with COE on a revised, phased proposal for the 2027 conference.",
      utDecidedAt: new Date("2026-03-06"),
      finalExplanation: "Not advanced per Uniting Table action. The financial requirements exceed conference capacity. A phased approach through the Commission on Equitable Compensation is recommended for 2027.",
      title_en: "Resolution on Minimum Clergy Salary Increase",
      title_es: "Resolución sobre el Aumento del Salario Mínimo del Clero",
      text_en: `WHEREAS, Many clergy in our conference struggle to make ends meet, especially those serving smaller congregations, and

WHEREAS, The current minimum salary has not kept pace with the cost of living in Texas,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Raises the minimum clergy salary to $75,000 effective January 2027;
2. Increases the conference budget allocation for equitable compensation;
3. Establishes a cost-of-living adjustment formula for future years.`,
      text_es: `POR CUANTO, Muchos clérigos en nuestra conferencia luchan para llegar a fin de mes, y

POR CUANTO, El salario mínimo actual no se ha mantenido al ritmo del costo de vida en Texas,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Aumente el salario mínimo del clero a $75,000 a partir de enero de 2027;
2. Aumente la asignación presupuestaria para compensación equitativa;
3. Establezca una fórmula de ajuste por costo de vida.`,
      rationale_en: "Fair compensation for clergy is a matter of justice and conference integrity.",
      rationale_es: "La compensación justa para el clero es una cuestión de justicia e integridad de la conferencia.",
    },
  });

  // ── 7. Draft resolution (not yet submitted) ──────────────────────────
  await prisma.resolution.create({
    data: {
      conferenceId: conference.id,
      petitionerId: roberto.id,
      status: "DRAFT",
      title_en: "Resolution on Disaster Preparedness and Mutual Aid Networks",
      title_es: "Resolución sobre Preparación para Desastres y Redes de Ayuda Mutua",
      text_en: `WHEREAS, The Río Texas Conference region is increasingly affected by hurricanes, flooding, and extreme heat events, and

WHEREAS, Our churches serve as vital community gathering points during emergencies,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference develops a comprehensive disaster preparedness plan and establishes mutual aid networks between churches.`,
      rationale_en: "Recent natural disasters have shown both the need and the capacity of our churches to serve as community resilience hubs.",
    },
  });

  // ── 8. Spanish-primary resolution — UNDER_REVIEW by BOM ──────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0007",
      conferenceId: conference.id,
      petitionerId: roberto.id,
      committeeId: bom.id,
      status: "UNDER_REVIEW",
      submittedAt: new Date("2026-02-20"),
      title_es: "Resolución sobre la Formación de Pastores Bilingües",
      title_en: "Resolution on Bilingual Pastor Formation",
      text_es: `POR CUANTO, La necesidad de pastores bilingües en nuestra conferencia continúa creciendo, y

POR CUANTO, Muchas congregaciones hispanas/latinas no tienen acceso a pastores que hablen español con fluidez, y

POR CUANTO, Los programas actuales de formación ministerial no abordan adecuadamente las competencias bilingües y biculturales,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Establezca un programa de inmersión bilingüe para candidatos al ministerio;
2. Requiera competencia básica en español para todos los clérigos nuevos asignados dentro de la conferencia;
3. Provea recursos de educación continua en español;
4. Se asocie con seminarios para desarrollar currículo bilingüe.`,
      text_en: `WHEREAS, The need for bilingual pastors in our conference continues to grow, and

WHEREAS, Many Hispanic/Latino congregations lack access to fluent Spanish-speaking pastors, and

WHEREAS, Current ministerial formation programs do not adequately address bilingual and bicultural competencies,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Establishes a bilingual immersion program for ministry candidates;
2. Requires basic Spanish competency for all new clergy appointed within the conference;
3. Provides continuing education resources in Spanish;
4. Partners with seminaries to develop bilingual curriculum.`,
      rationale_es: "Nuestra conferencia es inherentemente bilingüe. Nuestro liderazgo pastoral debe reflejar esta realidad.",
      rationale_en: "Our conference is inherently bilingual. Our pastoral leadership must reflect this reality.",
    },
  });

  console.log("Created 8 test resolutions:");
  console.log("  RT-2026-0001  SUBMITTED         ICE / Sanctuary (financial flag)");
  console.log("  RT-2026-0002  UNDER_REVIEW       Climate / Creation Care (assigned to CSR)");
  console.log("  RT-2026-0003  RECOMMENDED        Mental Health / Clergy Wellness (by BOT)");
  console.log("  RT-2026-0004  NOT_RECOMMENDED    Property Trust Clause (by BOT)");
  console.log("  RT-2026-0005  APPROVED           Bilingual Youth Ministry");
  console.log("  RT-2026-0006  NOT_ADVANCED       Minimum Clergy Salary");
  console.log("  (no number)   DRAFT              Disaster Preparedness");
  console.log("  RT-2026-0007  UNDER_REVIEW       Bilingual Pastor Formation (assigned to BOM)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
