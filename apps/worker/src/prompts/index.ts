import type { QuestionStyle, Difficulty } from "@mcqs/shared";

interface StyleDistribution {
  style: QuestionStyle;
  count: number;
}

interface PromptParams {
  subject: string;
  theme?: string;
  difficulty: Difficulty;
  styles: StyleDistribution[];
  totalCount: number;
}

// ============================================================================
// UPSC PRELIMS EXAM CONTEXT
// ============================================================================
// - 100 questions, 200 marks (2 marks per question)
// - Negative marking: 0.66 marks deducted per wrong answer (1/3rd of 2)
// - Duration: 2 hours
// - Cut-off typically ranges from 75-100 marks depending on difficulty
// - Questions are designed to be elimination-proof with sophisticated distractors

const DIFFICULTY_INSTRUCTIONS: Record<Difficulty, string> = {
  easy: `
DIFFICULTY: EASY (NCERT Level - ~33% of actual UPSC paper)
Target: Foundation-level questions that test basic recall and fundamental understanding.

Characteristics:
- Questions answerable directly from NCERT textbooks (Class 6-12)
- Tests basic facts, definitions, and fundamental concepts
- Clear, unambiguous language without tricky phrasing
- One option should be obviously correct to a prepared candidate
- Distractors should be clearly wrong but not absurd

Example difficulty benchmark:
- "Which Article of the Constitution deals with Right to Education?" (Factual recall)
- "The Indus Valley Civilization was primarily known for:" (Basic NCERT fact)
- Simple cause-effect relationships from textbooks`,

  medium: `
DIFFICULTY: MEDIUM (Application Level - ~35% of actual UPSC paper)
Target: Questions requiring conceptual understanding and application of knowledge.

Characteristics:
- Requires connecting multiple concepts or applying knowledge to scenarios
- Tests understanding beyond mere memorization
- May require elimination strategy to arrive at correct answer
- Distractors are plausible and test fine distinctions
- Questions from standard reference books (Laxmikanth, Spectrum, Ramesh Singh)

Example difficulty benchmark:
- Comparing two constitutional provisions and their implications
- Understanding why a particular policy was implemented (not just what)
- Questions linking current affairs to static syllabus concepts
- Questions requiring understanding of exceptions and special cases`,

  hard: `
DIFFICULTY: HARD (Analytical Level - ~32% of actual UPSC paper)
Target: Questions requiring deep analysis, multi-concept integration, and nuanced understanding.

Characteristics:
- Multi-layered reasoning required
- Tests obscure facts or fine distinctions between similar concepts
- Elimination techniques alone won't work - needs solid knowledge
- Sophisticated distractors that appear correct on surface reading
- Questions that integrate current affairs with deep static knowledge
- May test exceptions, recent amendments, or lesser-known provisions

Example difficulty benchmark:
- Statement questions where 2-3 statements appear correct but have subtle errors
- Questions on recent constitutional amendments and their implications
- Match-the-following with similar-sounding options
- Assertion-Reason where both seem independently true but relationship is tricky
- Questions on international conventions/treaties with specific provisions`,
};

const STYLE_INSTRUCTIONS: Record<QuestionStyle, string> = {
  factual: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION STYLE: STANDARD/FACTUAL MCQ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Format: Direct question with 4 options (A, B, C, D)
questionType: "standard"

UPSC Pattern Guidelines:
- Question should test specific knowledge or understanding
- Frame questions as "Which of the following...", "Consider the following...", or direct questions
- All four options must be grammatically consistent with the question stem
- Correct answer must be definitively correct, not "most correct"

Distractor Design (CRITICAL):
- DO NOT use absolute words like "only", "always", "never", "all", "none" in wrong options
  (UPSC aspirants know these are usually wrong - your distractors must be smarter)
- Each distractor should be a plausible misconception or commonly confused fact
- Distractors should test genuine knowledge gaps, not trick through wordplay
- Include distractors that would trap someone who studied superficially

Example Structure:
Q: Which of the following is NOT a feature of the Indian Constitution borrowed from the British Constitution?
A) Parliamentary system of government
B) Rule of law
C) Single citizenship
D) Bicameral legislature

(Here C is correct - Single citizenship is from British; others are also from British but the "NOT" makes it tricky)`,

  conceptual: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION STYLE: CONCEPTUAL/APPLICATION MCQ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Format: Scenario-based or concept-testing question with 4 options
questionType: "standard"

UPSC Pattern Guidelines:
- Tests understanding of WHY, not just WHAT
- May present a scenario and ask for correct interpretation
- Tests ability to apply constitutional/legal/economic principles
- Often connects theoretical knowledge to real-world application

Question Framing:
- "In the context of..., which statement is correct?"
- "Which of the following best explains...?"
- "The primary objective of [policy/provision] is:"
- Present a situation and ask what provision/article applies

Distractor Design:
- Include options that would be correct in a different context
- Use commonly held misconceptions as distractors
- Test understanding of scope and limitations of concepts
- Include options that mix up similar-sounding provisions`,

  statement: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION STYLE: STATEMENT-BASED (56% OF UPSC PAPER - MOST IMPORTANT!)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Format: Multiple statements to evaluate for correctness
questionType: "statement"

UPSC 2025 Distribution (follow this):
- Two-statement questions: ~15 per paper
- Three-statement questions: ~39 per paper (MOST COMMON)
- Four-statement questions: ~9 per paper
- Five+ statement questions: ~4 per paper

TWO-STATEMENT FORMAT:
"Consider the following statements:
Statement I: [First statement]
Statement II: [Second statement]
Which of the statements given above is/are correct?"

Options MUST be:
A) Both Statement I and Statement II are correct
B) Only Statement I is correct
C) Only Statement II is correct
D) Neither Statement I nor Statement II is correct

THREE-STATEMENT FORMAT (MOST USED IN UPSC):
"Consider the following statements regarding [topic]:
1. [Statement 1]
2. [Statement 2]
3. [Statement 3]
How many of the above statements is/are correct?"

Options MUST be:
A) Only one
B) Only two
C) All three
D) None

OR Alternative format:
"Which of the statements given above is/are correct?"
A) 1 and 2 only
B) 2 and 3 only
C) 1 and 3 only
D) 1, 2 and 3

FOUR-STATEMENT FORMAT:
Same as three-statement but with 4 statements
Options: A) Only one  B) Only two  C) Only three  D) All four

CRITICAL RULES FOR STATEMENT QUESTIONS:
1. Each statement must be independently verifiable as true or false
2. Statements should be related to the same topic but test different aspects
3. AVOID making all statements true or all false (makes question too easy)
4. Ideal: 1-2 statements correct, 1-2 incorrect (requires careful analysis)
5. Wrong statements should contain subtle errors, not obvious mistakes
6. Use specific facts (years, numbers, names) in some statements to test precision
7. Test common misconceptions in incorrect statements`,

  match: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION STYLE: MATCH THE FOLLOWING (~8 questions per UPSC paper)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Format: Two columns to match with combination options
questionType: "match"

STANDARD UPSC FORMAT:
"Match List-I with List-II and select the correct answer using the code given below:

List-I (Item)          List-II (Description)
A. [Item 1]            1. [Description 1]
B. [Item 2]            2. [Description 2]
C. [Item 3]            3. [Description 3]
D. [Item 4]            4. [Description 4]

Select the correct answer using the code given below:"

Options format:
A)  A-1, B-2, C-3, D-4
B)  A-2, B-1, C-4, D-3
C)  A-3, B-4, C-1, D-2
D)  A-4, B-3, C-2, D-1

DESIGN RULES:
1. Items in List-I should be of same category (all are rivers, all are acts, all are treaties, etc.)
2. Descriptions in List-II should be parallel (all are locations, all are years, all are features, etc.)
3. Include at least 2 items that could plausibly match with same description (creates difficulty)
4. Commonly confused pairs should be included to test precise knowledge
5. Ensure only ONE correct matching combination exists

COMMON UPSC MATCH THEMES:
- Treaties/Agreements ↔ Years/Countries
- Constitutional Articles ↔ Provisions
- Rivers ↔ Origins/Tributaries
- National Parks ↔ States/Species
- Government Schemes ↔ Objectives/Ministries
- International Organizations ↔ Headquarters/Functions
- Battles/Events ↔ Years/Leaders
- Authors ↔ Books
- Folk Arts ↔ States/Regions`,

  assertion: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION STYLE: ASSERTION-REASON (~7-18 questions per UPSC paper)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Format: Assertion and Reason with logical relationship analysis
questionType: "assertion"

EXACT UPSC FORMAT:
"Consider the following:
Assertion (A): [Statement of fact or claim]
Reason (R): [Statement explaining or related to assertion]

Which one of the following is correct in respect of the above statements?"

Options MUST BE EXACTLY:
A) Both A and R are correct and R is the correct explanation of A
B) Both A and R are correct but R is NOT the correct explanation of A
C) A is correct but R is incorrect
D) A is incorrect but R is correct

CRITICAL DESIGN RULES:
1. Assertion must be a clear, verifiable statement
2. Reason must also be independently verifiable
3. The relationship between A and R is what makes this question hard
4. Most challenging: Both true but R doesn't explain A (tests logical thinking)

DIFFICULTY CALIBRATION:
- Easy: A is false, R is true (or vice versa) - straightforward
- Medium: Both true, R clearly explains A - tests knowledge
- Hard: Both true, but R is NOT the correct explanation - tests reasoning

COMMON TRAPS TO CREATE:
- R is a true statement but explains something else, not A
- R partially explains A but misses the main reason
- A and R are both true and seem related but causation is reversed
- R is the effect, not the cause of A

EXAMPLE:
Assertion (A): The Indian Parliament cannot discuss the conduct of judges of Supreme Court and High Courts.
Reason (R): Judges can be removed only through impeachment.

(Both are true, but R doesn't explain A - the correct explanation relates to judicial independence, not removal process)`,
};

// ============================================================================
// SUBJECT-SPECIFIC KNOWLEDGE BASES
// ============================================================================

const SUBJECT_CONTEXTS: Record<string, string> = {
  polity: `
INDIAN POLITY & GOVERNANCE (15-20% of UPSC Prelims, ~15-20 questions)

PRIMARY SOURCES (align questions with these):
- M. Laxmikanth's "Indian Polity" - THE standard reference
- NCERT Political Science (Class 11-12)
- Constitution of India (original text)
- Recent Supreme Court judgments

HIGH-WEIGHTAGE TOPICS:
1. Constitutional Framework: Preamble, Fundamental Rights (Art 12-35), DPSPs (Art 36-51), Fundamental Duties (Art 51A)
2. Union Executive: President (Art 52-62), Vice President, PM & Council of Ministers, Attorney General
3. Parliament: Lok Sabha, Rajya Sabha, Legislative procedures, Money Bill vs Finance Bill, Parliamentary privileges
4. Judiciary: Supreme Court (Art 124-147), High Courts, Judicial Review, PIL, Basic Structure Doctrine
5. State Government: Governor (Art 153-167), CM & State Council, State Legislature
6. Local Government: 73rd Amendment (Panchayats), 74th Amendment (Municipalities), PESA Act
7. Constitutional Bodies: Election Commission, CAG, UPSC, Finance Commission, NCSC/NCST
8. Emergency Provisions: National (Art 352), State (Art 356), Financial (Art 360)
9. Amendment Procedure: Art 368, types of amendments, ratification requirements
10. Recent Amendments: 101st (GST), 102nd (NCBC), 103rd (EWS quota), 104th (SC/ST reservation), 105th (OBC enumeration), 106th (Women's reservation)

COMMON UPSC TRAPS IN POLITY:
- Confusing similar articles (Art 14 vs 15 vs 16)
- President's discretionary vs constitutional powers
- Difference between Ordinance-making powers (Art 123 vs 213)
- Money Bill vs Financial Bill misconceptions
- Governor's discretionary powers misconceptions
- Difference between Constitutional and Statutory bodies`,

  history: `
INDIAN HISTORY (10-18% of UPSC Prelims, ~10-18 questions)

PRIMARY SOURCES:
- NCERT History books (Class 6-12) - FOUNDATION
- Spectrum's "A Brief History of Modern India" - Modern History
- RS Sharma - Ancient India
- Satish Chandra - Medieval India
- Bipin Chandra - India's Struggle for Independence

ANCIENT HISTORY FOCUS AREAS:
1. Indus Valley Civilization: Sites, features, decline theories, script
2. Vedic Period: Rig Vedic vs Later Vedic, society, economy
3. Buddhism & Jainism: Teachings, councils, spread, decline
4. Mauryan Empire: Chandragupta, Ashoka, administration, Dhamma
5. Post-Mauryan: Kushanas, Satavahanas, Sangam literature
6. Gupta Period: Golden age, art, science, administration
7. Regional Kingdoms: Cholas, Pallavas, Chalukyas, Rashtrakutas

MEDIEVAL HISTORY FOCUS AREAS:
1. Delhi Sultanate: Dynasties, administration, architecture
2. Vijayanagara & Bahmani kingdoms
3. Mughal Empire: Administration, Mansabdari, art, religious policies
4. Bhakti & Sufi movements
5. Regional powers: Marathas, Sikhs, Rajputs

MODERN HISTORY (HIGHEST WEIGHTAGE):
1. British Expansion: Battles, policies, economic drain
2. Socio-Religious Reforms: Brahmo Samaj, Arya Samaj, others
3. 1857 Revolt: Causes, events, aftermath
4. Indian National Movement phases
5. Gandhi Era: Movements, strategies, timeline
6. Revolutionary Movement: HSRA, Anushilan, Ghadar
7. Constitutional Development: Acts of 1909, 1919, 1935
8. Independence & Partition

COMMON TRAPS:
- Confusing years of events (very specific dates asked)
- Mixing up reform movements and their founders
- Timeline errors in freedom movement
- Confusing British Acts and their provisions`,

  geography: `
INDIAN & WORLD GEOGRAPHY (12-18% of UPSC Prelims, ~12-18 questions)

PRIMARY SOURCES:
- NCERT Geography (Class 6-12) - FOUNDATION
- G.C. Leong's "Certificate Physical and Human Geography"
- Oxford School Atlas
- Khullar's "India: A Comprehensive Geography"

PHYSICAL GEOGRAPHY:
1. Geomorphology: Landforms, plate tectonics, volcanism, earthquakes
2. Climatology: Atmospheric circulation, monsoons, climate types
3. Oceanography: Currents, tides, marine resources
4. Biogeography: Biomes, soils, vegetation types

INDIAN GEOGRAPHY (HIGH WEIGHTAGE):
1. Physical Features: Himalayas, Northern Plains, Peninsular Plateau, Coastal Plains, Islands
2. Drainage: River systems (Himalayan vs Peninsular), interlinking projects
3. Climate: Monsoon mechanism, seasons, rainfall distribution
4. Natural Vegetation: Forest types, biosphere reserves
5. Agriculture: Cropping patterns, irrigation, Green/White/Blue revolutions
6. Minerals & Energy: Distribution, reserves, policies
7. Industries: Location factors, industrial regions, policies
8. Transport: Roadways, railways, waterways, airways

WORLD GEOGRAPHY:
1. Continents and major features
2. Important straits, channels, passes
3. Climate regions and their characteristics
4. Major agricultural regions
5. Geopolitically significant locations

COMMON TRAPS:
- Confusing tributaries of rivers (left bank vs right bank)
- Mixing up national parks and their locations/species
- Wrong associations of crops with soil types
- Confusing similar-sounding geographical features`,

  economy: `
INDIAN ECONOMY (10-15% of UPSC Prelims, ~10-15 questions)

PRIMARY SOURCES:
- NCERT Economics (Class 11-12)
- Ramesh Singh's "Indian Economy"
- Economic Survey (latest)
- Union Budget documents

MACROECONOMICS:
1. National Income: GDP, GNP, NDP, NNP concepts and calculation
2. Inflation: Types, measurement (CPI, WPI), causes, control
3. Monetary Policy: RBI tools (Repo, Reverse Repo, CRR, SLR, OMO)
4. Fiscal Policy: Budget components, deficits, FRBM Act
5. Balance of Payments: Current account, Capital account, forex reserves

BANKING & FINANCE:
1. Banking Structure: RBI, Commercial Banks, Payment Banks, SFBs
2. Financial Markets: Money market, capital market instruments
3. Financial Inclusion: Jan Dhan, MUDRA, Stand-Up India
4. Insurance & Pension: IRDAI, PFRDA, schemes

SECTORS:
1. Agriculture: MSP, procurement, subsidies, reforms
2. Industry: Make in India, PLI schemes, Industrial policies
3. Services: IT, telecom, tourism contributions

GOVERNMENT INITIATIVES:
1. Taxation: GST structure, Direct Tax Code
2. Social Sector: MGNREGA, PDS, food security
3. Infrastructure: Gati Shakti, Sagarmala, Bharatmala
4. Digital: UPI, ONDC, Digital India

INTERNATIONAL:
1. Trade: WTO, FTAs, trade balance
2. International Organizations: IMF, World Bank, ADB, NDB, AIIB
3. Global indices: HDI, GHI, Ease of Doing Business

COMMON TRAPS:
- Confusing monetary policy tools and their effects
- Mixing up different types of deficits
- Wrong associations of schemes with ministries
- Confusing similar-sounding financial instruments`,

  environment: `
ENVIRONMENT & ECOLOGY (15-20% of UPSC Prelims, ~15-20 questions)

PRIMARY SOURCES:
- NCERT Biology (Ecology chapters)
- Shankar IAS Environment book
- ENVIS portals
- MoEFCC reports

ECOLOGY CONCEPTS:
1. Ecosystem: Structure, function, energy flow, nutrient cycling
2. Biodiversity: Levels, hotspots, threats, conservation
3. Ecological Succession: Primary, secondary, climax community
4. Biomes: Terrestrial and aquatic ecosystems
5. Food chains, food webs, ecological pyramids

BIODIVERSITY & CONSERVATION:
1. Protected Areas: Categories (National Parks, Sanctuaries, Biosphere Reserves, Tiger Reserves)
2. Conservation approaches: In-situ vs Ex-situ
3. IUCN Red List categories
4. Wildlife Protection Act 1972 (Schedules)
5. Biodiversity Act 2002
6. Important species: Endemic, endangered, flagship, keystone

ENVIRONMENTAL ISSUES:
1. Pollution: Air (sources, standards), Water, Soil, Noise
2. Climate Change: Greenhouse effect, global warming, impacts
3. Waste Management: Solid waste, e-waste, plastic waste rules
4. Desertification, land degradation

INTERNATIONAL CONVENTIONS:
1. UNFCCC: COPs, Paris Agreement, NDCs
2. CBD: Aichi targets, Kunming-Montreal framework
3. CITES: Appendices, wildlife trade
4. Ramsar: Wetlands, Indian sites
5. Montreal Protocol: Ozone, Kigali Amendment
6. Basel, Rotterdam, Stockholm: Hazardous substances

INDIAN INITIATIVES:
1. National Action Plan on Climate Change: 8 missions
2. CAMPA, Green India Mission
3. National Biodiversity Authority
4. Compensatory Afforestation

COMMON TRAPS:
- Confusing different protected area categories
- Mixing up international conventions and their focus
- Wrong locations of national parks/tiger reserves
- Confusing endemic species locations`,

  science: `
SCIENCE & TECHNOLOGY (5-15% of UPSC Prelims, ~5-15 questions)

PRIMARY SOURCES:
- NCERT Science books (Class 6-10)
- NCERT Physics, Chemistry, Biology (Class 11-12 basics)
- Science Reporter magazine
- PIB releases on S&T

PHYSICS & SPACE:
1. Basic concepts: Motion, energy, waves, optics
2. Nuclear science: Fission, fusion, reactors
3. Space technology: ISRO missions, satellites, launch vehicles
4. Defense technology: Missiles, radar, indigenous development

CHEMISTRY:
1. Basic concepts: Atoms, molecules, reactions
2. Materials: Polymers, alloys, nanomaterials
3. Chemical industries: Fertilizers, petrochemicals

BIOLOGY & HEALTH:
1. Cell biology basics
2. Genetics: DNA, genes, genetic engineering, GMOs
3. Diseases: Communicable, non-communicable, epidemics
4. Biotechnology: Applications, ethics, regulations
5. Human body systems basics

CURRENT S&T DEVELOPMENTS:
1. AI & Machine Learning
2. Quantum computing
3. 5G/6G technology
4. Blockchain
5. Renewable energy tech
6. Space missions (global)
7. Medical breakthroughs

GOVERNMENT INITIATIVES:
1. ISRO programs: Chandrayaan, Gaganyaan, etc.
2. DRDO projects
3. DAE: Nuclear power program
4. DST: Various schemes
5. Make in India in defense

COMMON TRAPS:
- Confusing similar-sounding technologies
- Wrong agency associations (ISRO vs DRDO vs DAE)
- Outdated information on recent missions
- Mixing up satellite types and purposes`,

  "current affairs": `
CURRENT AFFAIRS (30-40% of UPSC Prelims directly/indirectly)

INTEGRATION APPROACH:
- Current affairs are NOT a separate subject
- UPSC tests static concepts THROUGH current events
- ~70% of current affairs questions need static knowledge to answer

KEY DOMAINS:
1. Government Schemes & Policies (link to Polity/Economy)
2. International Relations & Summits
3. Awards & Recognition (link to relevant fields)
4. Environmental developments (link to Environment)
5. Science & Technology breakthroughs
6. Economic data & reports
7. Constitutional & Legal developments

TIME FRAME:
- Focus on 18-24 months before exam
- Some questions test events from 2+ years ago
- Anniversary years (25th, 50th, 75th, 100th) are important

SOURCES TO ALIGN WITH:
- The Hindu / Indian Express editorials
- PIB (Press Information Bureau)
- Yojana & Kurukshetra magazines
- Economic Survey
- India Year Book

INTEGRATION EXAMPLES:
- G20 Summit → Link to economic organizations, India's foreign policy
- New environmental policy → Link to international conventions, constitutional provisions
- Supreme Court judgment → Link to relevant constitutional articles
- New government scheme → Link to ministry, budget allocation, related acts`,

  "art and culture": `
ART & CULTURE (5-10% of UPSC Prelims, ~5-10 questions)

PRIMARY SOURCES:
- NCERT Fine Arts book
- CCRT (Centre for Cultural Resources and Training) material
- Nitin Singhania's "Indian Art and Culture"

ARCHITECTURE:
1. Temple Architecture: Nagara, Dravida, Vesara styles
2. Cave Architecture: Ajanta, Ellora, Elephanta
3. Indo-Islamic: Sultanate and Mughal architecture
4. Colonial and Modern architecture
5. Buddhist Architecture: Stupas, Chaityas, Viharas

SCULPTURE & PAINTING:
1. Mauryan, Gupta, Medieval sculptures
2. Miniature paintings: Mughal, Rajasthani, Pahari schools
3. Folk paintings: Madhubani, Warli, Pattachitra, Kalamkari
4. Modern Indian art

PERFORMING ARTS:
1. Classical Dance: 8 forms recognized by Sangeet Natak Akademi
2. Folk Dances: State-wise
3. Classical Music: Hindustani vs Carnatic
4. Theatre: Traditional forms (Yakshagana, Kathakali, etc.)

LITERATURE:
1. Ancient: Vedic, Sanskrit literature
2. Medieval: Regional literature, Bhakti & Sufi poetry
3. Modern: Indian writers, literary awards

HERITAGE:
1. UNESCO World Heritage Sites in India
2. GI Tags
3. Intangible Cultural Heritage
4. Important monuments and their significance

COMMON TRAPS:
- Confusing similar dance forms
- Wrong state associations for folk arts
- Mixing up architectural styles
- Incorrect UNESCO site information`,
};

// Get subject context if available
function getSubjectContext(subject: string): string {
  const lowerSubject = subject.toLowerCase();

  for (const [key, context] of Object.entries(SUBJECT_CONTEXTS)) {
    if (lowerSubject.includes(key) || key.includes(lowerSubject)) {
      return context;
    }
  }

  // Check for common variations
  if (lowerSubject.includes("polity") || lowerSubject.includes("constitution") || lowerSubject.includes("governance")) {
    return SUBJECT_CONTEXTS.polity;
  }
  if (lowerSubject.includes("history") || lowerSubject.includes("freedom") || lowerSubject.includes("independence")) {
    return SUBJECT_CONTEXTS.history;
  }
  if (lowerSubject.includes("geography") || lowerSubject.includes("geo")) {
    return SUBJECT_CONTEXTS.geography;
  }
  if (lowerSubject.includes("economy") || lowerSubject.includes("economic") || lowerSubject.includes("finance")) {
    return SUBJECT_CONTEXTS.economy;
  }
  if (lowerSubject.includes("environment") || lowerSubject.includes("ecology") || lowerSubject.includes("biodiversity")) {
    return SUBJECT_CONTEXTS.environment;
  }
  if (lowerSubject.includes("science") || lowerSubject.includes("technology") || lowerSubject.includes("space")) {
    return SUBJECT_CONTEXTS.science;
  }
  if (lowerSubject.includes("current") || lowerSubject.includes("affairs")) {
    return SUBJECT_CONTEXTS["current affairs"];
  }
  if (lowerSubject.includes("art") || lowerSubject.includes("culture") || lowerSubject.includes("heritage")) {
    return SUBJECT_CONTEXTS["art and culture"];
  }

  return "";
}

export function getPrompt(params: PromptParams): string {
  const { subject, theme, difficulty, styles, totalCount } = params;

  const themeContext = theme
    ? `SPECIFIC FOCUS: "${theme}" - Generate questions specifically on this topic/theme within ${subject}.`
    : `COVERAGE: Generate questions covering diverse important topics within ${subject}.`;

  const subjectContext = getSubjectContext(subject);

  // Build style distribution instructions
  const styleInstructions = styles
    .map(({ style, count }) => {
      return `
═══════════════════════════════════════════════════════════════════════════════
GENERATE ${count} QUESTION(S) IN THE FOLLOWING STYLE:
═══════════════════════════════════════════════════════════════════════════════
${STYLE_INSTRUCTIONS[style]}`;
    })
    .join("\n");

  return `
╔══════════════════════════════════════════════════════════════════════════════╗
║                    UPSC CIVIL SERVICES PRELIMINARY EXAMINATION                ║
║                         MCQ GENERATION TASK                                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

GENERATE ${totalCount} UPSC-STANDARD MCQ QUESTIONS

SUBJECT: ${subject.toUpperCase()}
${themeContext}

${subjectContext ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBJECT-SPECIFIC CONTEXT & KNOWLEDGE BASE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${subjectContext}
` : ""}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIFFICULTY CALIBRATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${DIFFICULTY_INSTRUCTIONS[difficulty]}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUESTION STYLE DISTRIBUTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${styleInstructions}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL QUALITY REQUIREMENTS (NON-NEGOTIABLE):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. FACTUAL ACCURACY (MOST IMPORTANT):
   - Every fact, date, number, name MUST be 100% accurate
   - Cross-reference with NCERT textbooks and standard references
   - If uncertain about a fact, DO NOT include it
   - Constitutional articles, amendment numbers must be exact
   - Years of events, treaties, acts must be verified

2. SINGLE CORRECT ANSWER:
   - There must be exactly ONE correct answer
   - The correct answer must be DEFINITIVELY correct, not "most correct"
   - All distractors must be DEFINITIVELY incorrect
   - No ambiguity - a subject expert should agree on the answer

3. ELIMINATION-PROOF DISTRACTORS:
   - DO NOT use absolute words (only, always, never, all, none) in wrong options
   - UPSC aspirants know these patterns - your questions must be smarter
   - Distractors should be plausible misconceptions, not obvious wrong answers
   - Each distractor should trap someone with incomplete knowledge

4. UPSC LANGUAGE STANDARDS:
   - Use formal, precise language
   - Avoid colloquialisms or informal expressions
   - Technical terms should be used correctly
   - Questions should be clear but not simplistic

5. NO CONTROVERSIAL CONTENT:
   - Avoid politically sensitive topics
   - No questions on disputed territories without clear UPSC precedent
   - No questions on ongoing court cases
   - Avoid religious content unless historically factual

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY SELF-VERIFICATION CHECKLIST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before finalizing EACH question, verify:

□ Is every fact in the question 100% accurate?
□ Is the correct answer definitively correct?
□ Are ALL distractors definitively incorrect?
□ Would a UPSC subject expert agree with the answer?
□ Is the explanation accurate and educational?
□ Does the explanation cite proper reasoning (not just "this is correct")?
□ For statement questions: Is each statement independently verifiable?
□ For match questions: Is only ONE combination correct?
□ For assertion-reason: Is the relationship between A and R correctly identified?
□ Are there NO absolute words (only, always, never, all, none) making distractors obvious?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT (STRICT JSON):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return a JSON array with exactly ${totalCount} question objects.

Each object MUST have these exact fields:
{
  "questionText": "The complete question text with all statements/assertions formatted properly",
  "questionType": "standard" | "statement" | "match" | "assertion",
  "options": ["A) Option text", "B) Option text", "C) Option text", "D) Option text"],
  "correctOption": 0 | 1 | 2 | 3,  // Index of correct answer (0=A, 1=B, 2=C, 3=D)
  "explanation": "Detailed explanation with: 1) Why correct answer is correct, 2) Why each distractor is wrong, 3) Source reference (NCERT/Laxmikanth/etc.)"
}

IMPORTANT:
- Options array must have EXACTLY 4 options
- Each option must start with "A) ", "B) ", "C) ", "D) " prefix
- correctOption is 0-indexed (0=A, 1=B, 2=C, 3=D)
- Explanation should be educational and cite sources where applicable

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NOW GENERATE ${totalCount} HIGH-QUALITY UPSC MCQ QUESTIONS:`;
}
