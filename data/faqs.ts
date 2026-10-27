export const faqs = [
  {
    category: "Product",
    question: "What exactly is WICCLAW?",
    answer: "WICCLAW is a dedicated AI computer paired with an agent configured for defined work. The agent can use authorized tools to complete supported steps and return a result for review. Telegram is the currently documented interface. A unified WICCLAW application is the intended future interface.",
  },
  {
    category: "Product",
    question: "How is WICCLAW different from ChatGPT or another AI assistant?",
    answer: "A general AI chat is often used for answers, drafts, and analysis. WICCLAW adds a dedicated computer and configured agent workflows that can use supported tools to act on an instruction. What it can do depends on its skills, connections, permissions, and the application's own rules.",
  },
  {
    category: "Product",
    question: "Why does the agent need its own computer?",
    answer: "WICCLAW Box gives the agent a separate environment for its tools and assigned work. Your personal laptop does not need to stay open while supported tasks run. The device still needs power, connectivity, and any outside services the workflow uses.",
  },
  {
    category: "Product",
    question: "What is Hermes Agent's role?",
    answer: "WICCLAW has been developed around Hermes Agent as its agent framework. WICCLAW's configuration connects that framework to the device, Telegram interaction, skills, tools, and business workflow. The exact version, architecture, and update responsibilities should be specified for your deployment.",
  },
  {
    category: "Hardware",
    question: "Can it work while my laptop is turned off?",
    answer: "Yes, a supported task can continue on a powered and connected WICCLAW Box without your laptop. Work that needs your approval, an application sign-in, unavailable information, or a failed connection may pause or stop until the issue is resolved.",
  },
  {
    category: "Hardware",
    question: "Does WICCLAW Box require an internet connection?",
    answer: "The Telegram-based interaction and connected applications described on this site require internet access. Some local processes may run on the device, but WICCLAW should not be treated as a complete offline system.",
  },
  {
    category: "Hardware",
    question: "Does WICCLAW run AI models locally?",
    answer: "The agent's tools and task environment run on the dedicated computer. The AI model may be remotely hosted, in which case relevant task information may be sent to its provider. Local-model support must be specified for a particular configuration; it does not follow automatically from owning the hardware.",
  },
  {
    category: "Hardware",
    question: "What are the hardware specifications and task capacity?",
    answer: "The processor, memory, storage, supplied equipment, and supported concurrent workload have not been finalized on this site. Product images are illustrative. Describe your expected work so the proposed hardware and capacity can be confirmed before purchase.",
  },
  {
    category: "Capabilities",
    question: "Can WICCLAW connect to QuickBooks?",
    answer: "An existing WICCLAW workflow has used browser-assisted interaction with QuickBooks. That does not establish support for every QuickBooks feature, account type, or company setup. The proposed workflow must identify the supported information and actions. Login, multifactor authentication, company access, and financial approvals may still require a person.",
  },
  {
    category: "Capabilities",
    question: "Can it access my email and calendar?",
    answer: "Potentially, if the relevant integration is developed, authorized, and included in your configuration. Email and calendar access are not advertised as standard capabilities until demonstrated and supported. A proposal should distinguish reading information, drafting changes, and sending or updating records.",
  },
  {
    category: "Capabilities",
    question: "Can WICCLAW communicate in Vietnamese?",
    answer: "This needs confirmation using the actual model, Telegram workflow, and type of work you need. Language quality can vary by task. If Vietnamese matters to your business, request a demonstration with representative instructions and outputs before purchase.",
  },
  {
    category: "Capabilities",
    question: "Can custom skills be developed?",
    answer: "Yes. A custom skill can define a business task, the tools and information it needs, the expected result, and points that require review. A new application connection, testing, and ongoing maintenance may require separate development work and cost.",
  },
  {
    category: "Capabilities",
    question: "Can it perform tasks automatically?",
    answer: "Supported recurring work may be possible when a trigger, access, limits, result destination, and recovery behavior are configured. A one-time Telegram request is not automatically a schedule or permission for future actions. Confirm the automation features available in your proposed deployment.",
  },
  {
    category: "Capabilities",
    question: "Can it work without supervision?",
    answer: "Some bounded, repeatable tasks may run without someone watching each step. Payments, financial changes, customer communication, publishing, deletion, and uncertain results need appropriate review or approval. WICCLAW should report a block rather than bypass a required decision.",
  },
  {
    category: "Access and data",
    question: "What happens when an application requires login?",
    answer: "You complete the application's legitimate sign-in or multifactor process through the supported setup. The agent should not bypass it or ask you to paste a password or one-time code into an ordinary task message. A workflow may pause until access is restored.",
  },
  {
    category: "Access and data",
    question: "Who controls my business data?",
    answer: "You decide which information and accounts to make available to the configured work. Owning WICCLAW Box gives you control over its physical environment; it does not mean every task stays entirely on it. Telegram, model providers, WICCLAW services, and connected applications may process the information needed for a task. Ask for the deployment-specific data flow and retention terms.",
  },
  {
    category: "Access and data",
    question: "Can one WICCLAW setup support multiple businesses?",
    answer: "The site describes device-to-business mapping and a Fleet deployment concept. Whether one configuration can serve several businesses, and how their data and permissions are separated, must be confirmed in a deployment plan. Separate devices may be appropriate for distinct locations or security boundaries.",
  },
  {
    category: "Access and data",
    question: "Is there a separate WICCLAW mobile app?",
    answer: "A dedicated WICCLAW application is the intended product direction. The currently documented customer interface is Telegram; this website does not demonstrate a released native app. Confirm app availability and supported devices before purchase.",
  },
  {
    category: "Application",
    question: "Will I need to use a terminal or configure an agent myself?",
    answer: "The intended app experience is designed to avoid terminals and manual agent setup. The actual onboarding steps for the configuration being sold must be confirmed in the offer. Today's pilot instructions still include device setup and Telegram pairing.",
  },
  {
    category: "Application",
    question: "How will I connect my applications?",
    answer: "WICCLAW's planned app is intended to guide supported connections and explain the access a task requires. Today, connection steps depend on the configured workflow and the application. Some services require separate login, multifactor authentication, or administrator action; universal one-click setup is not promised.",
  },
  {
    category: "Application",
    question: "How will approvals work?",
    answer: "Each workflow should identify which actions it may take and which require a person. A unified in-app approval experience is planned, but its exact controls are not verified here. Confirm the approval process for the deployment you are buying.",
  },
  {
    category: "Access and data",
    question: "What should my first instruction include?",
    answer: "Name the business and task, provide the source or authorized application, specify the time period and desired output, and say what should await approval. For example: 'Review this week's accessible transactions, flag items needing my attention, and summarize why. Do not change records.'",
  },
  {
    category: "Operations",
    question: "What happens if the internet disconnects?",
    answer: "Telegram messages and connected application work may be delayed or unavailable. The exact retry and recovery behavior depends on the deployment. Check the last task state before submitting the same consequential action again.",
  },
  {
    category: "Operations",
    question: "How do updates and maintenance work?",
    answer: "The update mechanism, who applies updates, maintenance timing, support responsibility, and any recurring fee have not been documented for a standard purchase. They should be specified before a customer depends on WICCLAW for ongoing business work.",
  },
  {
    category: "Pricing and support",
    question: "How much does WICCLAW cost?",
    answer: "The current WICCLAW Box hardware price is $799. A $20 reservation, when available, is credited to that price and leaves a $779 hardware balance. Business starts at $10,000 and Enterprise at $50,000 for separately scoped deployments. Setup, services, and ongoing costs must be confirmed in writing.",
  },
  {
    category: "Pricing and support",
    question: "Does WICCLAW require a monthly subscription?",
    answer: "Required recurring charges have not been confirmed for publication. Before ordering, ask for a written statement of any WICCLAW service fee, AI-model usage charge, third-party application fee, maintenance, and support charge. A hardware starting price alone does not answer this question.",
  },
  {
    category: "Pricing and support",
    question: "What is included in the purchase price?",
    answer: "The starting prices do not establish a fixed bundle. Before payment, the written offer should identify hardware, setup, the current interface, enabled skills, connections, model usage, support, updates, shipping, taxes, and later charges. A planned app feature is included only if the offer expressly commits to it.",
  },
  {
    category: "Pricing and support",
    question: "Can I track a pre-order on this site?",
    answer: "The pre-order page will use Stripe Checkout once the seller, price, and order terms are configured. Keep your Stripe receipt and order correspondence. This site does not provide a live shipping tracker; contact hello@wicclaw.ai using the receipt email for order questions.",
  },
  {
    category: "Pricing and support",
    question: "Where can I get help?",
    answer: "Use the help center for setup and task guidance, then email hello@wicclaw.ai with your business and device name, approximate time, task requested, and last visible result. Do not include passwords or verification codes.",
  },
];
