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
  const dlvt = await prisma.committee.findUnique({ where: { abbreviation: "DLVT" } });

  if (!sarah || !roberto || !conference || !csr || !bot || !tcvt || !bom || !ft || !dlvt) {
    console.error("Missing seed data. Run `npx prisma db seed` first.");
    process.exit(1);
  }

  // Delete existing resolutions to start fresh
  await prisma.resolution.deleteMany({});

  // ── 1. Black clergy legacy in Victoria — SUBMITTED, awaiting assignment ─
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0001",
      conferenceId: conference.id,
      petitionerId: sarah.id,
      status: "SUBMITTED",
      submittedAt: new Date("2026-02-15"),
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

  // ── 2. Conference Youth Director — SUBMITTED, auto-flagged for finance ──
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0002",
      conferenceId: conference.id,
      petitionerId: roberto.id,
      status: "SUBMITTED",
      submittedAt: new Date("2026-02-18"),
      hasFinancialImplications: true,
      financeReferralNote: 'Auto-detected financial language: "salary", "$85,000", "budget", "allocates", "Fund". Per SR-14 — Referral of Resolutions with Financial Implications, this resolution requires Finance & Administration (FT) committee review.',
      title_en: "Resolution to Create a Full-Time Conference Youth Director Position",
      title_es: "Resolución para Crear un Puesto de Director/a de Jóvenes de la Conferencia a Tiempo Completo",
      text_en: `WHEREAS, The Río Texas Conference currently has no dedicated full-time staff position focused on youth ministry coordination across the conference, and

WHEREAS, Research consistently shows that young people who are connected to a vibrant faith community during adolescence are more likely to remain active in the church as adults, and

WHEREAS, Many local churches, especially smaller congregations, lack the resources to develop comprehensive youth programs on their own and would benefit from conference-level support,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Creates a full-time Conference Youth Director position with an annual salary of $85,000 plus benefits, effective January 2027;
2. Allocates $120,000 from the conference budget for the first-year cost of salary, benefits, and program startup expenses;
3. Directs the Youth Director to coordinate district-level youth events, provide training and resources to local church youth leaders, and develop a conference-wide youth retreat;
4. Establishes a Youth Ministry Fund of $25,000 annually to provide grants to local churches for youth programming;
5. Requires the Youth Director to report annually to the Transforming Communities Vision Team on program outcomes and participation metrics.`,
      text_es: `POR CUANTO, La Conferencia Río Texas actualmente no tiene un puesto de personal dedicado a tiempo completo enfocado en la coordinación del ministerio juvenil a lo largo de la conferencia, y

POR CUANTO, La investigación muestra consistentemente que los jóvenes conectados a una comunidad de fe vibrante durante la adolescencia tienen más probabilidades de permanecer activos en la iglesia como adultos, y

POR CUANTO, Muchas iglesias locales, especialmente las congregaciones más pequeñas, carecen de recursos para desarrollar programas juveniles integrales por sí solas,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Cree un puesto de Director/a de Jóvenes de la Conferencia a tiempo completo con un salario anual de $85,000 más beneficios, efectivo a partir de enero de 2027;
2. Asigne $120,000 del presupuesto de la conferencia para el costo del primer año de salario, beneficios y gastos de inicio del programa;
3. Ordene al Director/a de Jóvenes coordinar eventos juveniles a nivel de distrito, proporcionar capacitación y recursos, y desarrollar un retiro juvenil de toda la conferencia;
4. Establezca un Fondo de Ministerio Juvenil de $25,000 anuales para otorgar subvenciones a las iglesias locales;
5. Requiera que el Director/a de Jóvenes informe anualmente al Equipo de Visión de Comunidades Transformadoras.`,
      rationale_en: "Investing in a dedicated youth director will strengthen youth ministry across the conference, especially in smaller churches that cannot afford their own youth pastor.",
      rationale_es: "Invertir en un director/a de jóvenes dedicado fortalecerá el ministerio juvenil en toda la conferencia, especialmente en las iglesias más pequeñas que no pueden costear su propio pastor de jóvenes.",
    },
  });

  // ── 3. Creation care — UNDER_REVIEW by CSR ─────────────────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0003",
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

  // ── 4. Mental health — RECOMMENDED by BOT ──────────────────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0004",
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

  // ── 5. Property trust clause — NOT_RECOMMENDED ──────────────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0005",
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

  // ── 6. Bilingual youth ministry — APPROVED for journal ──────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0006",
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

  // ── 7. Minimum clergy salary — NOT_ADVANCED (financial) ─────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0007",
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

  // ── 8. Bilingual pastor formation — UNDER_REVIEW by BOM ─────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0008",
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

  // ── 9. Lay servant training — DRAFT (not yet submitted) ─────────────────
  await prisma.resolution.create({
    data: {
      conferenceId: conference.id,
      petitionerId: roberto.id,
      status: "DRAFT",
      title_en: "Resolution on Expanding Lay Servant Training Opportunities",
      title_es: "Resolución sobre la Expansión de Oportunidades de Capacitación para Servidores Laicos",
      text_en: `WHEREAS, Lay servants play a vital role in the ministry of local churches across the Río Texas Conference, and

WHEREAS, Access to lay servant training courses is uneven across districts, with rural areas and Spanish-speaking communities facing the greatest barriers,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Develops a hybrid in-person and online lay servant training curriculum available in both English and Spanish;
2. Establishes at least two training weekends per district per year;
3. Creates a mentorship program pairing experienced lay servants with new candidates;
4. Directs the Developing Leaders Vision Team to evaluate and report on lay servant training access annually.`,
      rationale_en: "Equipping laity for ministry is central to our Wesleyan identity. Removing barriers to training strengthens every local church.",
    },
  });

  // ── 10. Disaster preparedness — UNDER_REVIEW by DLVT ───────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0009",
      conferenceId: conference.id,
      petitionerId: sarah.id,
      committeeId: dlvt.id,
      status: "UNDER_REVIEW",
      submittedAt: new Date("2026-02-12"),
      title_en: "Resolution on Disaster Preparedness and Mutual Aid Networks",
      title_es: "Resolución sobre Preparación para Desastres y Redes de Ayuda Mutua",
      text_en: `WHEREAS, The Río Texas Conference region is increasingly affected by hurricanes, flooding, and extreme heat events, and

WHEREAS, Our churches serve as vital community gathering points during emergencies, and

WHEREAS, Coordinated preparation across churches can multiply our capacity to serve those in need,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Develops a comprehensive disaster preparedness plan with district-level coordinators;
2. Establishes mutual aid agreements between churches within each district for resource sharing during emergencies;
3. Encourages every local church to designate a Disaster Response Coordinator and maintain an updated emergency supply inventory;
4. Partners with UMCOR and local emergency management agencies for annual readiness training.`,
      text_es: `POR CUANTO, La región de la Conferencia Río Texas se ve cada vez más afectada por huracanes, inundaciones y eventos de calor extremo, y

POR CUANTO, Nuestras iglesias sirven como puntos vitales de reunión comunitaria durante emergencias, y

POR CUANTO, La preparación coordinada entre iglesias puede multiplicar nuestra capacidad de servir,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Desarrolle un plan integral de preparación para desastres con coordinadores a nivel de distrito;
2. Establezca acuerdos de ayuda mutua entre iglesias dentro de cada distrito;
3. Aliente a cada iglesia local a designar un Coordinador de Respuesta a Desastres;
4. Se asocie con UMCOR y agencias locales de manejo de emergencias para capacitación anual.`,
      rationale_en: "Recent natural disasters have shown both the need and the capacity of our churches to serve as community resilience hubs.",
      rationale_es: "Los desastres naturales recientes han demostrado tanto la necesidad como la capacidad de nuestras iglesias para servir como centros de resiliencia comunitaria.",
    },
  });

  // ── 11. Church accessibility — RECOMMENDED by CSR ───────────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0010",
      conferenceId: conference.id,
      petitionerId: roberto.id,
      committeeId: csr.id,
      status: "RECOMMENDED",
      submittedAt: new Date("2026-01-28"),
      recommendedAt: new Date("2026-03-03"),
      recommendationText: "The Church and Society Relations committee concurs. Accessibility is a matter of hospitality and justice. We recommend adoption and note that implementation can proceed through existing district structures.",
      title_en: "Resolution on Church Accessibility and Disability Inclusion",
      title_es: "Resolución sobre Accesibilidad de las Iglesias e Inclusión de Personas con Discapacidad",
      text_en: `WHEREAS, The United Methodist Church affirms the dignity and worth of every person, including those with physical, sensory, and cognitive disabilities, and

WHEREAS, Many of our church buildings and programs remain inaccessible to members and visitors with disabilities,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Calls upon every local church to conduct an accessibility audit of its facilities and programs within the next two years;
2. Encourages churches to include persons with disabilities in worship leadership, committee service, and congregational life;
3. Directs the Church and Society committee to compile and distribute a guide on best practices for disability inclusion in worship and programming;
4. Recognizes churches that achieve a standard of accessibility with a "Welcoming Church" designation.`,
      text_es: `POR CUANTO, La Iglesia Metodista Unida afirma la dignidad y el valor de toda persona, incluyendo aquellas con discapacidades físicas, sensoriales y cognitivas, y

POR CUANTO, Muchos de nuestros edificios y programas eclesiásticos siguen siendo inaccesibles,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Llame a cada iglesia local a realizar una auditoría de accesibilidad de sus instalaciones y programas en los próximos dos años;
2. Aliente a las iglesias a incluir a personas con discapacidad en el liderazgo del culto y la vida congregacional;
3. Ordene al comité de Iglesia y Sociedad compilar y distribuir una guía de mejores prácticas;
4. Reconozca a las iglesias que alcancen un estándar de accesibilidad con la designación "Iglesia Acogedora".`,
      rationale_en: "True hospitality means ensuring that every person can fully participate in the life of the church, regardless of ability.",
      rationale_es: "La verdadera hospitalidad significa asegurar que toda persona pueda participar plenamente en la vida de la iglesia, independientemente de su capacidad.",
    },
  });

  // ── 12. Digital ministry — APPROVED ─────────────────────────────────────
  await prisma.resolution.create({
    data: {
      displayNumber: "RT-2026-0011",
      conferenceId: conference.id,
      petitionerId: sarah.id,
      committeeId: tcvt.id,
      status: "APPROVED",
      submittedAt: new Date("2026-01-10"),
      recommendedAt: new Date("2026-02-15"),
      recommendationText: "The Transforming Communities Vision Team concurs. The pandemic demonstrated the importance of digital ministry, and these recommendations will help our churches sustain hybrid ministry models.",
      utDecisionText: "The Uniting Table approves this resolution. The Communications office is well-positioned to coordinate implementation.",
      utDecidedAt: new Date("2026-03-10"),
      title_en: "Resolution on Strengthening Digital and Hybrid Ministry",
      title_es: "Resolución sobre el Fortalecimiento del Ministerio Digital e Híbrido",
      text_en: `WHEREAS, The COVID-19 pandemic accelerated the adoption of digital ministry across our conference, and

WHEREAS, Many congregations have found that online and hybrid worship expands their reach to homebound members, military families, and persons exploring faith,

THEREFORE BE IT RESOLVED, that the Río Texas Annual Conference:

1. Affirms digital and hybrid worship as a legitimate and valued extension of the gathered congregation;
2. Directs the Conference Communications office to offer annual training on livestreaming, social media ministry, and online community building;
3. Encourages local churches to ensure that online participants are integrated into the full life of the congregation;
4. Establishes a shared resource library of best practices for digital ministry.`,
      text_es: `POR CUANTO, La pandemia de COVID-19 aceleró la adopción del ministerio digital en toda nuestra conferencia, y

POR CUANTO, Muchas congregaciones han descubierto que el culto en línea e híbrido amplía su alcance,

POR LO TANTO, SE RESUELVE que la Conferencia Anual Río Texas:

1. Afirma el culto digital e híbrido como una extensión legítima y valiosa de la congregación reunida;
2. Ordena a la oficina de Comunicaciones ofrecer capacitación anual sobre transmisión en vivo y ministerio en redes sociales;
3. Alienta a las iglesias a asegurar que los participantes en línea estén integrados en la vida plena de la congregación;
4. Establece una biblioteca compartida de mejores prácticas para el ministerio digital.`,
      rationale_en: "Meeting people where they are — including online — is faithful to our mission of making disciples.",
      rationale_es: "Encontrar a las personas donde están — incluyendo en línea — es fiel a nuestra misión de hacer discípulos.",
    },
  });

  console.log("Created 12 test resolutions:");
  console.log("  RT-2026-0001  SUBMITTED          Black Clergy Legacy in Victoria");
  console.log("  RT-2026-0002  SUBMITTED          Conference Youth Director (financial flag)");
  console.log("  RT-2026-0003  UNDER_REVIEW       Creation Care (assigned to CSR)");
  console.log("  RT-2026-0004  RECOMMENDED        Mental Health / Clergy Wellness (by BOT)");
  console.log("  RT-2026-0005  NOT_RECOMMENDED    Property Trust Clause (by BOT)");
  console.log("  RT-2026-0006  APPROVED           Bilingual Youth Ministry");
  console.log("  RT-2026-0007  NOT_ADVANCED       Minimum Clergy Salary (financial)");
  console.log("  RT-2026-0008  UNDER_REVIEW       Bilingual Pastor Formation (assigned to BOM)");
  console.log("  (no number)   DRAFT              Lay Servant Training");
  console.log("  RT-2026-0009  UNDER_REVIEW       Disaster Preparedness (assigned to DLVT)");
  console.log("  RT-2026-0010  RECOMMENDED        Church Accessibility (by CSR)");
  console.log("  RT-2026-0011  APPROVED           Digital / Hybrid Ministry");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
