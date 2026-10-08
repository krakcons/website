export type Locale = "en" | "fr";
export const getLocale = (value?: string): Locale =>
  value === "fr" ? "fr" : "en";
export const localePath = (path: string, locale: Locale) => {
  const unprefixed = path.replace(/^\/fr(?=\/|$)/, "") || "/";
  return locale === "fr" ? `/fr${unprefixed}` : unprefixed;
};

export const messages = {
  en: {
    proud: "Proudly Canadian",
    skip: "Skip to content",
    menu: "Menu",
    primaryNav: "Primary navigation",
    mobileNav: "Mobile navigation",
    footerNav: "Footer navigation",
    language: "Language",
    home: "Home",
    breadcrumb: "Breadcrumb",
    homeLabel: "KRAK Consultants home",
    tagline: "Canadian-first. Built for good.",
    heroEyebrow: "Digital solutions for societal challenges",
    talk: "Let's talk",
    meet: "Meet KRAK",
    mission: "Our mission",
    introHeading: "Your mission.\nOur digital expertise.",
    missionLink: "Technology in service of a better society",
    servicesLabel: "Our services",
    servicesHeading: "Build the tools\nyour mission needs.",
    servicesLink: "Explore what we do",
    workLabel: "How we work",
    workHeading: "Start with the people. Build what matters.",
    processLink: "How we work",
    projectsLabel: "Our projects",
    workedWith: "Worked with",
    pauseLogos: "Pause logo scrolling",
    resumeLogos: "Resume logo scrolling",
    github: "View on GitHub",
    appStore: "View on the App Store",
    ecosystemHeading: "One mission.\nA growing ecosystem.",
    projectsLink: "Explore our projects",
    contactHeading: "Let's get cracking.",
    contactText: "Tell us about your mission and the tools you need.",
    contactLink: "Start a conversation",
    rights: "KRAK Consultants Inc. All rights reserved.",
    email: "Email us",
    noForms: "No forms or fuss. Just a conversation.",
    comingHeading: "A new site.\nComing soon.",
    comingText:
      "We're getting things ready. In the meantime, get in touch by email.",
    notFound: "Page not found",
    notFoundHeading: "Nothing here.\nLet's head back.",
    notFoundText: "The page you're looking for doesn't exist.",
    backHome: "Back to home",
    categories: "Project categories",
    emptyHeading: "Have a project in mind?",
    emptyText: "Talk to us about the digital tools your organization needs.",
    explore: "Explore",
    newTab: "opens in a new tab",
    nav: ["About us", "Mission", "Services", "Projects", "Contact"],
    services: [
      {
        number: "01",
        title: "Software consulting",
        text: "Technical guidance and custom software built around your organization's mission.",
      },
      {
        number: "02",
        title: "Hosting & infrastructure",
        text: "Canadian-first hosting on infrastructure we operate, with a plan for what comes after launch.",
      },
      {
        number: "03",
        title: "Digital solutions",
        text: "Applications, integrations, and workflows for organizations tackling societal challenges.",
      },
      {
        number: "04",
        title: "Internal tools & learning",
        text: "Learning management systems and practical tools that support the work behind your mission.",
      },
    ],
    steps: [
      {
        title: "Listen & understand",
        text: "Understand your mission, your users, and the challenge.",
      },
      {
        title: "Plan with clarity",
        text: "Choose an approach that fits your organization.",
      },
      {
        title: "Get KRAKing",
        text: "Build, integrate, and put your digital tools to work.",
      },
      {
        title: "Look ahead",
        text: "Plan for hosting, maintenance, and future improvements.",
      },
    ],
    groups: [
      {
        title: "Client & nonprofit work",
        description:
          "Digital solutions for the organizations and people we work with.",
        teaser: "Digital solutions built with organizations working for good.",
        link: "Work with us",
      },
      {
        title: "Internal products",
        description:
          "Our own products, built to solve useful problems and strengthen our ecosystem.",
        teaser:
          "Nuonn, Kokobi Learning, and our own ecosystem of practical digital tools.",
        link: "Our products",
      },
      {
        title: "Open source",
        description: "KrakStack tools and components that others can build on.",
        teaser: "KrakStack's component registry, Auth, and Uptime.",
        link: "Build on KrakStack",
      },
    ],
  },
  fr: {
    proud: "Fièrement canadien",
    skip: "Aller au contenu",
    menu: "Menu",
    primaryNav: "Navigation principale",
    mobileNav: "Navigation mobile",
    footerNav: "Navigation du pied de page",
    language: "Langue",
    home: "Accueil",
    breadcrumb: "Fil d'Ariane",
    homeLabel: "Accueil de KRAK Consultants",
    tagline: "Le Canada d'abord. Le bien commun, toujours.",
    heroEyebrow: "Des solutions numériques aux enjeux de société",
    talk: "Parlons-en",
    meet: "Découvrir KRAK",
    mission: "Notre mission",
    introHeading: "Votre mission.\nNotre expertise numérique.",
    missionLink: "La technologie au service d'une société meilleure",
    servicesLabel: "Nos services",
    servicesHeading: "Les outils pour\nfaire avancer votre mission.",
    servicesLink: "Découvrir nos services",
    workLabel: "Notre approche",
    workHeading: "Les personnes d'abord. Des outils qui comptent.",
    processLink: "Notre démarche",
    projectsLabel: "Nos projets",
    workedWith: "Ils ont travaillé avec nous",
    pauseLogos: "Mettre le défilement des logos en pause",
    resumeLogos: "Reprendre le défilement des logos",
    github: "Voir sur GitHub",
    appStore: "Voir sur l'App Store",
    ecosystemHeading: "Une mission.\nUn écosystème en croissance.",
    projectsLink: "Découvrir nos projets",
    contactHeading: "Passons à l'action.",
    contactText:
      "Parlez-nous de votre mission et des outils dont vous avez besoin.",
    contactLink: "Entamer la conversation",
    rights: "KRAK Consultants Inc. Tous droits réservés.",
    email: "Écrivez-nous",
    noForms: "Sans formulaire compliqué. Une simple conversation.",
    comingHeading: "Un nouveau site.\nBientôt en ligne.",
    comingText:
      "Nous préparons notre nouveau site. En attendant, contactez-nous par courriel.",
    notFound: "Page introuvable",
    notFoundHeading: "Rien ici.\nRevenons à l'accueil.",
    notFoundText: "La page que vous cherchez n'existe pas.",
    backHome: "Retour à l'accueil",
    categories: "Catégories de projets",
    emptyHeading: "Un projet en tête?",
    emptyText:
      "Parlons des outils numériques dont votre organisation a besoin.",
    explore: "Découvrir",
    newTab: "s'ouvre dans un nouvel onglet",
    nav: ["À propos", "Mission", "Services", "Projets", "Contact"],
    services: [
      {
        number: "01",
        title: "Conseil en logiciel",
        text: "Des conseils techniques et des logiciels sur mesure au service de la mission de votre organisation.",
      },
      {
        number: "02",
        title: "Hébergement et infrastructure",
        text: "Un hébergement axé sur le Canada, sur notre propre infrastructure, avec une vision au-delà du lancement.",
      },
      {
        number: "03",
        title: "Solutions numériques",
        text: "Des applications, des intégrations et des processus pour les organisations qui s'attaquent aux enjeux de société.",
      },
      {
        number: "04",
        title: "Outils internes et formation",
        text: "Des systèmes de gestion de l'apprentissage et des outils pratiques pour soutenir votre travail au quotidien.",
      },
    ],
    steps: [
      {
        title: "Écouter et comprendre",
        text: "Comprendre votre mission, vos utilisateurs et le défi à relever.",
      },
      {
        title: "Planifier clairement",
        text: "Choisir une approche adaptée à votre organisation.",
      },
      {
        title: "Passer à l'action",
        text: "Créer, intégrer et mettre vos outils numériques au travail.",
      },
      {
        title: "Préparer la suite",
        text: "Prévoir l'hébergement, l'entretien et les améliorations à venir.",
      },
    ],
    groups: [
      {
        title: "Mandats clients et organismes",
        description:
          "Des solutions numériques pour les organisations et les personnes avec qui nous travaillons.",
        teaser:
          "Des solutions conçues avec des organisations qui œuvrent pour le bien commun.",
        link: "Travailler avec nous",
      },
      {
        title: "Produits internes",
        description:
          "Nos propres produits, conçus pour résoudre des problèmes concrets et enrichir notre écosystème.",
        teaser:
          "Nuonn, Kokobi Learning et notre propre écosystème d'outils numériques pratiques.",
        link: "Nos produits",
      },
      {
        title: "Logiciels libres",
        description:
          "Des outils et des composants KrakStack sur lesquels d'autres peuvent s'appuyer.",
        teaser: "Le registre de composants KrakStack, Auth et Uptime.",
        link: "Construire avec KrakStack",
      },
    ],
  },
};
