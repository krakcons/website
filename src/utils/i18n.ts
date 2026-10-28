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
    tagline: "Your mission. Our expertise.",
    heroEyebrow: "Where good ideas become action",
    talk: "Let's talk",
    meet: "Meet KRAK",
    mission: "Our mission",
    missionSections: "Mission page sections",
    introHeading: "Practical solutions.\nBuilt around you.",
    missionLink: "Practical technology. People first.",
    workLabel: "How we work",
    workHeading: "Start with the people. Build what matters.",
    processLink: "How we work",
    projectsLabel: "Our projects",
    workedWith: "Worked with",
    pauseLogos: "Pause logo scrolling",
    resumeLogos: "Resume logo scrolling",
    github: "View on GitHub",
    appStore: "View on the App Store",
    contactHeading: "Let's get KRAKing.",
    contactText: "Tell us about your goals and the tools you need.",
    contactLink: "Start a conversation",
    rights: "KRAK Consultants Inc. All rights reserved.",
    email: "Email us",
    copyEmail: "Copy email",
    emailCopied: "Email copied",
    emailCopyError:
      "Couldn't copy. Select the email address and copy it manually.",
    contactForm: {
      heading: "Tell us what you have in mind",
      name: "Name",
      email: "Email address",
      organization: "Company or organization (optional)",
      message: "How can we help?",
      submit: "Send message",
      sending: "Sending…",
      success: "Thanks! Your message has been received.",
      error:
        "Your message couldn't be sent. Please try again or copy our email address to contact us directly.",
      invalid: "Please check the highlighted fields and try again.",
      privacy:
        "We'll use these details to respond to your inquiry. Please don't include sensitive information.",
      noScript:
        "Enable JavaScript to send this form, or copy our email address to contact us directly.",
      honeypot: "Leave this field blank",
    },
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
    nav: ["About us", "Mission", "Projects", "Contact"],
    infrastructure: {
      label: "Our ecosystem",
      heading: "The foundations behind the work.",
      intro:
        "From websites to custom applications, our work draws on a connected ecosystem of open-source tools and deployment infrastructure.",
      projects: "What we build",
      projectTypes: [
        "Websites & content",
        "Custom applications",
        "Internal products",
      ],
      core: "Core technologies",
      layers: [
        {
          title: "Web & content",
          description: "Websites and tools for managing content.",
        },
        {
          title: "Applications & services",
          description: "Interfaces and the services behind them.",
        },
        {
          title: "Shared building blocks",
          description: "Reusable components, authentication, and data access.",
        },
      ],
      foundation: "Deployment & data",
      foundationDescription:
        "The infrastructure that supports deployment, hosting, and the storage of project data.",
      note: "Technologies and hosting are chosen to fit each project.",
    },
    steps: [
      {
        title: "Listen & understand",
        text: "Understand your goals, your users, and the challenge.",
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
        title: "Client work",
        description:
          "Digital solutions for the organizations and people we work with.",
      },
      {
        title: "Internal products",
        description:
          "Our own products, built to solve useful problems and strengthen our ecosystem.",
      },
      {
        title: "Open source",
        description: "KrakStack tools and components that others can build on.",
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
    tagline: "Votre mission. Notre expertise.",
    heroEyebrow: "Là où les bonnes idées deviennent action",
    talk: "Parlons-en",
    meet: "Découvrir KRAK",
    mission: "Notre mission",
    missionSections: "Sections de la page Mission",
    introHeading: "Des solutions concrètes.\nPensées pour vous.",
    missionLink: "Des solutions concrètes. Les personnes d'abord.",
    workLabel: "Notre approche",
    workHeading: "Les personnes d'abord. Des outils qui comptent.",
    processLink: "Notre démarche",
    projectsLabel: "Nos projets",
    workedWith: "Ils ont travaillé avec nous",
    pauseLogos: "Mettre le défilement des logos en pause",
    resumeLogos: "Reprendre le défilement des logos",
    github: "Voir sur GitHub",
    appStore: "Voir sur l'App Store",
    contactHeading: "Passons à l'action.",
    contactText:
      "Parlez-nous de vos objectifs et des outils dont vous avez besoin.",
    contactLink: "Entamer la conversation",
    rights: "KRAK Consultants Inc. Tous droits réservés.",
    email: "Écrivez-nous",
    copyEmail: "Copier le courriel",
    emailCopied: "Courriel copié",
    emailCopyError:
      "La copie a échoué. Sélectionnez l'adresse et copiez-la manuellement.",
    contactForm: {
      heading: "Parlez-nous de votre projet",
      name: "Nom",
      email: "Adresse courriel",
      organization: "Entreprise ou organisation (facultatif)",
      message: "Comment pouvons-nous vous aider?",
      submit: "Envoyer le message",
      sending: "Envoi en cours…",
      success: "Merci! Votre message a bien été reçu.",
      error:
        "Votre message n'a pas pu être envoyé. Réessayez ou copiez notre adresse courriel pour nous contacter directement.",
      invalid: "Vérifiez les champs indiqués et réessayez.",
      privacy:
        "Nous utiliserons ces renseignements pour répondre à votre demande. Veuillez ne pas inclure de renseignements sensibles.",
      noScript:
        "Activez JavaScript pour envoyer ce formulaire, ou copiez notre adresse courriel pour nous contacter directement.",
      honeypot: "Laissez ce champ vide",
    },
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
    nav: ["À propos", "Mission", "Projets", "Contact"],
    infrastructure: {
      label: "Notre écosystème",
      heading: "Les fondations de nos projets.",
      intro:
        "Des sites web aux applications sur mesure, nos projets s’appuient sur un écosystème d’outils libres et d’infrastructure de déploiement.",
      projects: "Ce que nous créons",
      projectTypes: [
        "Sites web et contenu",
        "Applications sur mesure",
        "Produits internes",
      ],
      core: "Technologies clés",
      layers: [
        {
          title: "Web et contenu",
          description: "Des sites web et des outils de gestion de contenu.",
        },
        {
          title: "Applications et services",
          description: "Les interfaces et les services qui les soutiennent.",
        },
        {
          title: "Composants partagés",
          description:
            "Des composants réutilisables, l’authentification et l’accès aux données.",
        },
      ],
      foundation: "Déploiement et données",
      foundationDescription:
        "L’infrastructure qui soutient le déploiement, l’hébergement et le stockage des données des projets.",
      note: "Les technologies et l’hébergement sont adaptés à chaque projet.",
    },
    steps: [
      {
        title: "Écouter et comprendre",
        text: "Comprendre vos objectifs, vos utilisateurs et le défi à relever.",
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
        title: "Mandats clients",
        description:
          "Des solutions numériques pour les organisations et les personnes avec qui nous travaillons.",
      },
      {
        title: "Produits internes",
        description:
          "Nos propres produits, conçus pour résoudre des problèmes concrets et enrichir notre écosystème.",
      },
      {
        title: "Logiciels libres",
        description:
          "Des outils et des composants KrakStack sur lesquels d'autres peuvent s'appuyer.",
      },
    ],
  },
};
