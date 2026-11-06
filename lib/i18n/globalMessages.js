/**
 * Copy for the international site (global.superb-tutor.com).
 *
 * Merged over `messages.en` by getMessages(), so only what differs from the
 * Taiwan site's English translation lives here. That translation describes
 * the Taiwan app (Basic Competency Test, LINE, Parent Pro); the international
 * app prepares students for AP exams, the SAT and the GRE and has no parent
 * plan, so every section that mentions those is rewritten here.
 *
 * Facts about the app (subjects, limits, prices) must match the en product
 * document in the app repo: backend/app/prompts/product_info/en.md.
 */
const globalMessages = {
  common: {
    // The international site has one language; the switch leads to the
    // Taiwan site instead.
    langSwitch: '繁體中文（台灣）',
    langShort: '台灣',
  },
  header: {
    about: 'About',
    aboutTeam: 'Our Team',
  },
  company: {
    intro: 'The Dogtor app is developed and operated by:',
  },
  footer: {
    operatedBy: 'This website and the Dogtor app are developed and operated by',
  },
  home: {
    badge: 'AP · SAT · GRE',
    heroTitle1: 'Prep smarter.',
    heroTitle2: 'Ten minutes a day.',
    heroTagline: 'AP & SAT practice · An AI tutor on call · Battles with friends',
    heroSubtitle:
      'Dogtor turns AP and SAT prep into a daily game. Clear bite-sized levels, get every miss explained on the spot, and let AI pick the concepts you most need next — so your study time goes where it actually moves your score.',
    heroImgAlt: 'Dogtor, the study-whiz corgi mascot, reading a book',
    floatTitle: 'Daily streak',
    floatDesc: '15 days and counting!',
    floatImgAlt: 'Dogtor the corgi — daily streak reminder',
    subjectsTitle: 'What you can practice',
    subjectsSubtitle:
      'Question banks built around the College Board course frameworks, with more subjects on the way.',
    subjects: [
      'AP Biology',
      'AP Psychology',
      'AP Environmental Science',
      'AP U.S. Government and Politics',
      'SAT Reading and Writing',
      'GRE Vocabulary',
    ],
    subjectsCustom:
      "Your subject isn't here yet? Snap a photo of your notes or upload a PDF and Dogtor turns it into a practice level.",
    featuresSectionTitle: 'Why students use Dogtor',
    featuresSectionSubtitle:
      "It's not about doing more questions — it's about truly mastering each one, and closing the gaps that matter most in the least time.",
    featuresTechLink: 'See the AI behind Dogtor →',
    features: [
      {
        image: '/feature_1.png',
        imageAlt: 'A Dogtor learning island — gamified levels that master one concept per question',
        title: 'One question, one concept mastered',
        desc: 'Every question maps to a specific concept. Get it wrong and the explanation lands immediately, the question goes into your mistake book, and AI picks the next question you most need.',
      },
      {
        image: '/feature_2.png',
        imageAlt: 'Dogtor the corgi tutor reading a book',
        title: 'Ask Dogtor anything',
        desc: 'Stuck on a question? Type it or snap a photo and the AI tutor walks you through it. Ask it for practice questions on any topic, or turn your own notes into a custom level.',
      },
      {
        image: '/home-background-sky.png',
        imageAlt: 'Dogtor friend battles and ranked leaderboard',
        title: 'Battle your friends',
        desc: 'Challenge friends to real-time quiz battles or jump into ranked matchmaking. Climb the tiers, keep your streak alive and make test prep something you look forward to.',
      },
    ],
    ctaTitle: 'Ten minutes a day. Walk in ready.',
    ctaSubtitle:
      'Download Dogtor for free on iPhone or Android and let AI pinpoint the concepts holding your score back.',
  },
  faq: {
    pageSubtitle: 'Answers to common questions about Dogtor.',
    studentSectionTitle: 'Frequently asked questions',
    items: [
      {
        question: 'What is Dogtor? Is it related to veterinarians?',
        answer:
          'Dogtor is an AI study app for students preparing for AP exams, the SAT and the GRE. It has nothing to do with veterinarians or pet care — the name comes from our mascot, a study-whiz corgi.',
      },
      {
        question: 'Is the app free?',
        answer:
          'Yes. Dogtor is free to download, and the core practice, battles and AI tutor are free to use. Dogtor Pro is an optional subscription with unlimited hearts, more AI questions a day, more custom levels and no ads.',
      },
      {
        question: 'What subjects are covered?',
        answer:
          'Right now: AP Biology, AP Psychology, AP Environmental Science, AP U.S. Government and Politics, SAT Reading and Writing, and GRE Vocabulary. The question bank is still growing. For anything else, the Custom island turns your own notes, handouts or PDFs into practice levels, and you can ask Dogtor about any subject.',
      },
      {
        question: 'Is Dogtor affiliated with the College Board?',
        answer:
          'No. Dogtor is an independent study app. AP and SAT are trademarks of the College Board, and GRE is a trademark of ETS; neither organization is affiliated with or endorses Dogtor.',
      },
      {
        question: 'Can I turn my own notes into practice questions?',
        answer:
          'Yes. On the Custom island, snap a photo or upload notes, a handout, a past paper or a PDF, and Dogtor writes a practice level from it. The free plan includes 1 custom level; Pro includes 30 a month.',
      },
      {
        question: 'What is Ask Dogtor?',
        answer:
          'Ask Dogtor is the AI tutor inside the app. Type a question or attach a photo and it explains step by step. It can also write practice questions on a topic or on the questions you recently got wrong. The free plan includes 3 questions a day; Pro includes 20.',
      },
      {
        question: 'Where do the questions come from?',
        answer:
          'We map each course into units and concepts based on its published framework, generate questions for each concept with large language models, cross-check them with several models, and have the team review and refine them. If you spot a wrong question or answer, tap "Report a problem" on the question screen.',
      },
      {
        question: 'How do hearts work?',
        answer:
          'Entering a level or a battle uses 1 heart, and you can hold up to 5. Hearts refill on their own (1 every 12 hours), and you can get more by watching a short video, using a recovery potion or inviting friends. Dogtor Pro has unlimited hearts.',
      },
      {
        question: 'Can I learn with friends?',
        answer:
          'Yes. Add friends with an invite code to battle them in real time, or use ranked matchmaking for a random opponent. When a friend signs up with your invite code, you each get a recovery potion.',
      },
      {
        question: 'How do I subscribe to Dogtor Pro, cancel or get a refund?',
        answer:
          'Dogtor Pro is purchased in the app and billed through the App Store or Google Play, which show the price in your local currency. Manage or cancel it in your phone\'s subscription settings — deleting the app does not cancel it. Refunds are handled by Apple or Google under their refund policies.',
      },
      {
        question: 'Is Dogtor available on Android?',
        answer: 'Yes. Dogtor is available on both the App Store and Google Play.',
      },
      {
        question: 'Will my progress sync across devices?',
        answer:
          'Yes. Sign in with the same Google or Apple account and your progress, mistake book and achievements follow you to any device.',
      },
      {
        question: 'Is my data safe?',
        answer:
          'Yes. Your data is encrypted in transit and we never sell your personal information. See our Privacy Policy for the details.',
      },
      {
        question: 'How do I delete my account?',
        answer:
          'Email us from the Support Center with the account you want deleted and we will process it within 1–3 business days.',
      },
      {
        question: 'Who is Dogtor for?',
        answer:
          'High school students preparing for AP exams and the SAT, and college students preparing for the GRE. Dogtor is intended for users aged 13 and over.',
      },
      {
        question: 'How do I report a problem or suggest a feature?',
        answer:
          'Tell Dogtor in the app chat (a screenshot helps), use "Report a problem" on your profile, or email us at dogtor@superb-tutor.com. Feature ideas are always welcome.',
      },
    ],
    parentSections: [],
  },
  about: {
    pageSubtitle: 'Our mission is to make studying something students look forward to.',
    whyTitle: 'Why we built Dogtor',
    whyP1:
      'Test prep often feels isolating: dry materials, little feedback and hours spent on questions you already know. Dogtor is built on a simple belief — studying should not be boring.',
    whyP2:
      'We combine the pull of games with the power of social learning, so prep becomes a short daily habit instead of a chore. Levels, streaks and battles keep you coming back; AI makes sure the time goes to what you actually need.',
    whyP3:
      'We started Dogtor for students in Taiwan, where it has helped junior and senior high school students prepare for their national exams. Now we are bringing the same approach to AP, SAT and GRE prep, so students everywhere can study smarter in ten minutes a day.',
    teamP1:
      'Dogtor is built by a team of National Taiwan University (NTU) students and experienced exam-prep teachers, advised by NTU professors in AI, software engineering, human-computer interaction and learning design.',
    teamP2:
      'Our engineers lead AI research and product development, our teachers bring years of frontline tutoring experience, and our advisors keep the learning design grounded in research.',
    ctaText: 'Ready to try a new way to prep? Download Dogtor and start your first island today.',
  },
  support: {
    actions: {
      billing: { title: 'Purchases & Pro', desc: 'Questions about Dogtor Pro or in-app purchases' },
    },
    emailSubjects: {
      billing: 'Purchase or Dogtor Pro question',
    },
    tipItems: [
      'A detailed description of the issue',
      'When the issue occurred',
      'Your phone model, operating system and app version',
      'Relevant screenshots (if possible)',
    ],
  },
}

export default globalMessages
