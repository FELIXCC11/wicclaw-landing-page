export type Section = { title: string; text: string; points?: string[] };
export type ContentPage = {
  slug: string;
  category: string;
  title: string;
  accent: string;
  description: string;
  visual?: "hardware" | "chat" | "flow" | "fleet" | "control";
  image?: string;
  sections: Section[];
  related: string[];
};

export const pages: ContentPage[] = [
  {
    slug: "products",
    category: "WICCLAW / Products",
    title: "One dedicated computer.",
    accent: "A simpler way to delegate work.",
    description:
      "WICCLAW combines WICCLAW Box, a configured AI agent, and the tools needed for a defined business job. Customers use Telegram today; a unified WICCLAW application is the intended next step.",
    visual: "hardware",
    sections: [
      {
        title: "A computer for the agent.",
        text: "WICCLAW Box gives the agent its own place to run configured tools and workflows. Supported work can continue when your laptop is closed, as long as the device, network, accounts, and services needed for the task remain available.",
      },
      {
        title: "An agent that can use tools.",
        text: "Give WICCLAW a specific outcome. Its configured agent can identify an appropriate skill, use authorized information or applications, complete supported steps, and report the outcome. It should stop for missing access, a security challenge, or an action that requires your approval.",
      },
      {
        title: "Configured for your business.",
        text: "Your business has its own sources, rules, and review points. A WICCLAW configuration defines the job, tools, permitted actions, and expected result. New integrations or custom skills may require separate development, testing, and maintenance. The proposal states exactly what is included.",
        points: [
          "Core — one business and a reviewable starting workflow.",
          "Fleet — separate devices where locations or access boundaries require them.",
          "Business and Enterprise — larger configurations priced to scope.",
        ],
      },
    ],
    related: ["wicmini", "fleet", "app"],
  },
  {
    slug: "hardware",
    category: "Products / Hardware",
    title: "The agent has",
    accent: "its own computer.",
    description:
      "WICCLAW Box is the dedicated computer behind WICCLAW. It gives the agent a separate place to run configured tools and workflows, so your personal laptop does not have to stay open for supported work.",
    visual: "hardware",
    image: "hero",
    sections: [
      {
        title: "WICCLAW Box specifications.",
        text: "AMD Ryzen 7 7735HS processor, Radeon 680M graphics, 16GB LPDDR5 RAM, 1TB NVMe SSD, Wi-Fi, 4K UHD display support, and Windows 11 Pro. A 24GB LPDDR5 option is coming soon; its price has not been set. Final ports, wireless standard, dimensions, and included accessories will be confirmed before ordering. Product imagery is illustrative.",
      },
      {
        title: "What runs on WICCLAW Box.",
        text: "The computer runs the configured agent environment and local tools for its assigned work. A task can also involve Telegram, a connected business application, and a remotely hosted AI model. WICCLAW Box is where the agent works; it is not proof that every part of the task stays on the device.",
      },
      {
        title: "What it needs to keep working.",
        text: "WICCLAW Box needs power and the connectivity required by its workflow. An external service outage, expired authorization, or approval request can pause a task even when the device is online. A connection indicator shows reachability; the task result shows whether the work finished.",
      },
      {
        title: "Know where processing happens.",
        text: "Ask where each part of your configured workflow runs: on WICCLAW Box, with a model provider, or in a connected application. Owning the computer gives you control over the physical device, but data handling depends on the services and permissions selected for your deployment. Confirm specifications and updates before purchase; product images are illustrative.",
        points: [
          "One location: explore WICCLAW Box.",
          "Several locations: explore WICCLAW Fleet.",
          "Existing environment: discuss requirements with the team.",
        ],
      },
    ],
    related: ["wicmini", "fleet", "get-started"],
  },
  {
    slug: "wicmini",
    category: "Products / WICCLAW Box",
    title: "One business.",
    accent: "One useful first job.",
    description:
      "The current WICCLAW Box hardware price is $799. A configured first workflow, setup, services, and any ongoing costs must be stated in the written offer. A $20 reservation option is planned, subject to approved preorder terms.",
    visual: "hardware",
    sections: [
      {
        title: "Choose a repeatable task.",
        text: "Pick work with a clear input and result, such as an exception summary or prospect brief. Starting with one reviewable job makes it easier to see whether the agent saves manual steps.",
      },
      {
        title: "Set the boundaries.",
        text: "Identify the sources, accounts, permitted actions, and decisions that require a person. The agent can use only the tools and access provided to its configuration. Drafting, changing a record, and contacting a customer need different approval rules.",
      },
      {
        title: "Prove the result, then expand.",
        text: "Compare outputs with their sources, correct gaps, and add another skill only when the first workflow is useful. The proposal should identify setup, AI usage, maintenance, and support costs separately.",
        points: [
          "Start with one outcome your team can evaluate.",
          "Confirm the tools, access, and approval points.",
          "Review the full purchase and ongoing costs.",
        ],
      },
    ],
    related: ["how-it-works", "use-cases", "contact"],
  },
  {
    slug: "fleet",
    category: "Products / WICCLAW Fleet",
    title: "More locations.",
    accent: "Clear boundaries.",
    description:
      "WICCLAW Fleet is a proposed multi-device configuration for organizations whose locations, access boundaries, or workloads need separation. Routing, oversight, recovery, and support are defined for each deployment.",
    visual: "fleet",
    sections: [
      {
        title: "Map the operation.",
        text: "Record which business, location, users, and data each device serves. A clear map helps keep a task for one site from being confused with another.",
      },
      {
        title: "Route and review work.",
        text: "Define how tasks reach the right device and who checks each result. Confirm supported monitoring, fallback, and recovery behavior in the deployment plan before relying on them.",
      },
      {
        title: "Add devices for a reason.",
        text: "Add capacity or separation only where it solves an operational need. Another device also adds setup and support work, so establish a useful first workflow before extending it across sites.",
        points: [
          "Map devices to business locations.",
          "Define task routing and result ownership.",
          "Agree on offline recovery and operational support.",
        ],
      },
    ],
    related: ["identity", "gateway", "contact"],
  },
  {
    slug: "app",
    category: "Products / WICCLAW experience",
    title: "Everything starts",
    accent: "with a conversation.",
    description:
      "WICCLAW's goal is to make delegation feel like asking for help. Today's documented interface is Telegram; one app for conversation, connections, approvals, progress, and results is the intended product experience, not a verified current feature.",
    visual: "chat",
    sections: [
      {
        title: "Give a useful instruction.",
        text: "Describe the outcome in your own words and include the source, time period, and action boundary. For example: 'Review this week's accessible transactions and prepare a list of items needing my attention. Do not change records.' The agent can ask when a detail is missing.",
      },
      {
        title: "Follow the actual task.",
        text: "A request can finish, need clarification, pause for sign-in, or stop because a connection is unavailable. Review the returned status and output before repeating a task that might create a second message, record, or transaction. A unified progress view is planned for the WICCLAW app, not verified in the current product.",
      },
      {
        title: "Keep access deliberate.",
        text: "Pair the designated user using the supplied onboarding process. Authorize each business application through its legitimate sign-in method and grant only the access the workflow needs. Never send passwords or verification codes in a task message. Guided connections and in-app approvals are planned, not current release claims.",
        points: [
          "Pair through your pilot onboarding instructions.",
          "Start with a status check or a small draft.",
          "Review outputs before using them in your business.",
        ],
      },
    ],
    related: ["get-started", "permissions", "help"],
  },
  {
    slug: "platform",
    category: "WICCLAW / Platform",
    title: "From instruction",
    accent: "to inspected result.",
    description:
      "WICCLAW connects an instruction, a business context, a configured agent, and the tools it is allowed to use. The agent can help carry out supported steps; a person remains responsible for permissions and consequential decisions.",
    visual: "flow",
    sections: [
      {
        title: "Interpret the request.",
        text: "An instruction arrives through today's paired Telegram interface. The configured workflow identifies the requested outcome, source, and business context. If these are unclear or outside scope, it should ask rather than guess.",
      },
      {
        title: "Use the permitted tools.",
        text: "The agent selects a configured skill or authorized tool to complete supported steps. Login requirements and approval points still apply. An AI model can help determine the next step; tools carry out the interaction with an application.",
      },
      {
        title: "Report what happened.",
        text: "WICCLAW should show the output, completed actions, missing information, and any step still needing a person. A prepared draft is not a completed external action. Device health, task completion, and business correctness remain different things.",
      },
    ],
    related: ["runtime", "gateway", "permissions", "identity", "usage"],
  },
  {
    slug: "runtime",
    category: "Platform / Runtime",
    title: "The agent's",
    accent: "working process.",
    description:
      "Developed around Hermes Agent, WICCLAW's agent environment helps turn a request into supported actions using configured tools, available access, and review rules.",
    visual: "flow",
    sections: [
      {
        title: "Beyond an answer.",
        text: "A conventional AI chat exchange often ends with generated advice. A configured agent can continue through supported steps: gather information, work with an authorized application, organize findings, and prepare an output. Its skills, connections, and permissions define the limit.",
      },
      {
        title: "Context keeps the work relevant.",
        text: "State the company, time period, source of truth, desired format, and actions that must wait for review. For a transaction review, specify exceptions to flag and whether the task is read-only. The agent should not invent missing facts or assume a broad instruction grants new access.",
      },
      {
        title: "Check the finish.",
        text: "A useful draft is not the same as an action completed in another application. WICCLAW should distinguish those outcomes. Compare consequential outputs with their sources before relying on them.",
        points: [
          "Describe the intended output.",
          "Provide the relevant source information.",
          "Review the result before expanding the workflow.",
        ],
      },
    ],
    related: ["gateway", "use-cases", "permissions"],
  },
  {
    slug: "gateway",
    category: "Platform / Task dispatch",
    title: "Put the right work",
    accent: "on the right device.",
    description:
      "A task needs to reach the right configured computer and business context. One device may take a direct path; a multi-device setup needs explicit routing, ownership, and recovery rules. Exact dispatch capabilities are deployment-specific.",
    visual: "flow",
    sections: [
      {
        title: "Route with business context.",
        text: "Match a request to its authorized business, workflow, user, and device. Multi-location routing must be defined and verified in the deployment plan before work begins.",
      },
      {
        title: "Separate progress from completion.",
        text: "Pending, running, and completed are different task states. A device heartbeat shows reachability, not that a transaction was reviewed or a report delivered. Use the task result to verify the business outcome.",
      },
      {
        title: "Recover without duplication.",
        text: "Check the last known state before retrying an action that might already have happened. A repeated request can duplicate a message, record, or transaction. Define retry and escalation behavior in the deployment plan.",
      },
    ],
    related: ["runtime", "fleet", "status"],
  },
  {
    slug: "permissions",
    category: "Platform / Pairing & permissions",
    title: "Give the agent",
    accent: "the right access.",
    description:
      "You decide which accounts a workflow may use and which actions need review. WICCLAW should request legitimate access or approval when required, rather than treating a natural-language instruction as unlimited permission.",
    visual: "control",
    sections: [
      {
        title: "Pair the owner.",
        text: "Use the current device-specific onboarding flow to associate the correct Telegram user, business, and WICCLAW Box. Confirm those relationships before connected work begins.",
      },
      {
        title: "Match actions to the job.",
        text: "Reading, drafting, changing, and sending have different consequences. Define which actions are allowed, which require review, and which are outside the workflow. A consolidated approval screen belongs to the planned WICCLAW app until demonstrated.",
      },
      {
        title: "Respect application sign-in.",
        text: "Complete provider login, multifactor checks, and company selection through supported processes. A QuickBooks browser-assisted workflow may still require a person to approve financial actions. Never send passwords or verification codes in an ordinary task message.",
      },
    ],
    related: ["app", "identity", "privacy"],
  },
  {
    slug: "identity",
    category: "Platform / Device identity",
    title: "Every result belongs",
    accent: "to the right business.",
    description:
      "A useful AI worker needs the correct business context. Your deployment should associate each device and workflow with its owner, location, permitted information, and reviewer.",
    visual: "fleet",
    sections: [
      {
        title: "Name the context.",
        text: "Label the business, location, device, and responsible person. Clear associations make routing and support more reliable; keep them current as the operation changes.",
      },
      {
        title: "Maintain separation.",
        text: "Define which information and workflows belong to each deployment. Verify separation before multiple businesses share infrastructure or an operations view.",
      },
      {
        title: "Device identity, explained.",
        text: "Here, identity means the registered computer and its business relationship. It does not mean agents automatically receive email accounts, phone numbers, or external identities. Discuss communication requirements as part of the workflow scope.",
      },
    ],
    related: ["fleet", "permissions", "help"],
  },
  {
    slug: "usage",
    category: "Platform / Usage & pilot costs",
    title: "A clear job.",
    accent: "A clear price.",
    description:
      "Current WICCLAW Box hardware is priced at $799. Business starts at $10,000 and Enterprise at $50,000 for separately scoped deployments. Your written proposal defines services and ongoing charges.",
    visual: "control",
    sections: [
      {
        title: "Choose the right starting scope.",
        text: "Current WICCLAW Box hardware is $799, with setup and workflow scope to be confirmed in writing. Business starts at $10,000 for tailored skills, integrations, and more involved processes. Enterprise starts at $50,000 for specialized architecture, multiple agents or devices, and complex requirements. Final scope and price are agreed individually.",
      },
      {
        title: "Separate purchase from ongoing costs.",
        text: "Request a written breakdown of hardware, setup, AI-model usage, connected services, custom development, maintenance, and support. A starting price alone does not establish whether recurring services or app access are included.",
      },
      {
        title: "Measure the result in real work.",
        text: "Start with a task your team can time and inspect, such as a weekly review or prospect brief. Compare the reviewed output and remaining human effort with the current process before expanding.",
        points: [
          "Discuss initial and recurring costs.",
          "Confirm any external service charges.",
          "Agree on the review point for the pilot.",
        ],
      },
    ],
    related: ["products", "contact", "terms"],
  },
  {
    slug: "how-it-works",
    category: "WICCLAW / How it works",
    title: "From first setup",
    accent: "to useful result.",
    description:
      "Start with one task you can verify. Set up the computer, pair today's Telegram interface, authorize only the services that job needs, and review the result. Guided WICCLAW app setup is the intended future experience.",
    visual: "flow",
    sections: [
      {
        title: "01 / Connect WICCLAW Box.",
        text: "Provide power and internet access, then follow the supplied device configuration. The connected computer gives the agent a place to work separately from your personal laptop.",
      },
      {
        title: "02 / Pair and authorize.",
        text: "Pair the designated Telegram user with the correct business and device. Authorize only the service access needed for the first job, and complete provider sign-in or multifactor checks yourself when required.",
      },
      {
        title: "03 / Send a bounded request.",
        text: "Describe the outcome, source, and action boundary in natural language. A focused request is easier to carry out and verify.",
      },
      {
        title: "04 / Check and improve.",
        text: "Check the output, completed actions, and any decision or access still needed. Compare the result with its source; distinguish a draft from an action completed in another application.",
      },
    ],
    related: ["get-started", "use-cases", "help"],
  },
  {
    slug: "use-cases",
    category: "WICCLAW / Everyday work",
    title: "Real work.",
    accent: "Reviewable results.",
    description:
      "These are examples of work a properly configured agent may help with. Each needs the relevant skill, data access, and review rule. Your written offer identifies which examples are supported in your deployment.",
    visual: "chat",
    sections: [
      {
        title: "Accounting and bookkeeping.",
        text: "Transaction review often means checking the same queue and preparing the same summary. In a browser-assisted QuickBooks workflow described for WICCLAW, the agent can work with permitted information and prepare items for review. Supported actions must be demonstrated for each deployment. A person may still need to sign in, complete multifactor authentication, select the right company, and approve financial decisions.",
      },
      {
        title: "Research potential customers.",
        text: "Prospect research takes time before a salesperson speaks to anyone. With an appropriate skill, WICCLAW could examine public sources against your criteria, organize findings, and prepare a brief with references and open questions. Your team verifies the information and decides whom to contact; contact details and sales are not guaranteed.",
      },
      {
        title: "Prepare business reports.",
        text: "When operating information is scattered across accessible sources, a configured workflow can collect relevant facts for a defined period and prepare a structured report. It should identify where figures came from and what was unavailable. A business owner reviews it before making decisions.",
      },
      {
        title: "Build a workflow around your process.",
        text: "A custom skill can bring your procedure, sources, tools, and approval points into a repeatable workflow. Email triage, for example, could summarize messages and prepare replies if a supported email connection is built and authorized. Custom integration, testing, and maintenance are scoped separately.",
      },
    ],
    related: ["wicmini", "app", "contact"],
  },
  {
    slug: "get-started",
    category: "Welcome / Getting started",
    title: "One job. One owner.",
    accent: "A result you can check.",
    description:
      "Choose a real task, identify who owns it, and agree on what a correct result looks like. Start with the current supported interface and expand only after the first workflow proves useful.",
    visual: "hardware",
    sections: [
      {
        title: "Prepare the first job.",
        text: "Have WICCLAW Box, power, internet, your designated Telegram account, and current onboarding instructions ready. Choose a first process to test and identify who will review the result.",
      },
      {
        title: "Connect and authorize.",
        text: "Follow the device-specific setup, pair the designated Telegram user, and complete legitimate sign-in for only the services the task requires. This website does not issue pairing codes or request credentials. Guided app onboarding should replace these instructions only after release.",
      },
      {
        title: "Run and review.",
        text: "Run a bounded request, compare its result with the source, and identify missing access or decisions. If it stops, contact the team with the device name and last visible state. Never send passwords or recovery codes in an enquiry.",
      },
    ],
    related: ["help", "app", "contact"],
  },
  {
    slug: "order",
    category: "Support / Order help",
    title: "Questions about",
    accent: "your order?",
    description:
      "Use the email associated with your Stripe Checkout order and include the receipt or payment reference, never your card number.",
    sections: [
      {
        title: "Get an order update.",
        text: "Email hello@wicclaw.ai from the address used at checkout and include the Stripe receipt or payment reference. The team can review the order record and available delivery correspondence. This page is not a live shipping tracker.",
      },
      {
        title: "Keep your scope in view.",
        text: "The receipt records the payment; your order and onboarding correspondence define what comes next. For Business, Enterprise, or Fleet work, refer to the separate written proposal for the agreed configuration and timing.",
      },
    ],
    related: ["contact", "get-started", "terms"],
  },
  {
    slug: "status",
    category: "Support / Service information",
    title: "A task stopped?",
    accent: "Find the right signal.",
    description:
      "Check your device, review the task state, and give the team the information they need to investigate.",
    visual: "control",
    sections: [
      {
        title: "Check the device, then the task.",
        text: "Confirm that WICCLAW Box has power and internet access, then inspect the individual task state. A heartbeat indicates connectivity, not that a transaction was reviewed or a report delivered. Check the result before retrying.",
      },
      {
        title: "No live status feed here.",
        text: "This website is not connected to deployment telemetry or an incident feed, so it does not display operational badges or uptime claims. Contact the WICCLAW team for current service information affecting your pilot.",
      },
      {
        title: "Report the useful details.",
        text: "Send the business and device name, approximate time, intended action, and last visible state. Do not include credentials. If the task may already have changed an application, ask the team to review it before sending another copy.",
      },
    ],
    related: ["help", "contact", "gateway"],
  },
  {
    slug: "changelog",
    category: "WICCLAW / Updates",
    title: "Website and guide",
    accent: "updates.",
    description:
      "This page records website and documentation changes. Product software, device, security, and service updates are communicated separately when available.",
    sections: [
      {
        title: "Product guides, together.",
        text: "The website now includes dedicated explanations of Core, Fleet, the hardware, and Telegram control. Platform pages walk through task execution, dispatch, permissions, device identity, and pilot costs.",
      },
      {
        title: "A practical help center.",
        text: "Setup, workflow planning, permissions, device monitoring, and troubleshooting now have dedicated guides. Search by the question you are trying to answer, then follow the related guide when you need more detail.",
      },
      {
        title: "The same WICCLAW.",
        text: "The orange-and-white grid, pixel typography, and introductory boot animation remain consistent across the site. These are website updates; they are not firmware release notes or a claim that new device capabilities have shipped.",
      },
    ],
    related: ["products", "help", "contact"],
  },
  {
    slug: "privacy",
    category: "Legal / Privacy policy",
    title: "Your data.",
    accent: "Handled with care.",
    description:
      "How information is handled when you browse, contact WICCLAW, or pre-order through Stripe. Updated October 19, 2026.",
    sections: [
      {
        title: "Website and enquiry information.",
        text: "The contact form prepares an email in your mail application. We receive the details you choose to send so we can respond. Our hosting provider may process IP address and browser request data to deliver and secure the site. Search and interactive examples run in your browser.",
      },
      {
        title: "Accounts and browser storage.",
        text: "An account stores your name, email, and a salted password hash. Sign-in uses an HttpOnly session cookie that expires after seven days; session tokens are stored as hashes. Your browser stores the shopping bag and saved configuration locally. Checkout retry identifiers use session storage. These support shopping and account access.",
      },
      {
        title: "Orders and payments.",
        text: "Stripe hosts preorder checkout and collects payment, name, email, billing address, and shipping address details. WICCLAW stores the customer and order details needed to confirm payment, send a receipt, support customers, and arrange fulfillment. A transactional email provider processes the confirmation email. Card details are handled by Stripe, not collected on this website. Shipping details may be shared with a fulfillment partner to deliver an order.",
      },
      {
        title: "Retention and your requests.",
        text: "We keep enquiry and order information as needed for support, fulfillment, recordkeeping, and legal obligations. To ask for access, correction, or deletion, email hello@wicclaw.ai or use the data-request page; some records may need to be retained. WICCLAW Box, Telegram, AI providers, and connected tools have separate data flows. Ask for deployment-specific documentation before sharing sensitive business information. This site includes no advertising or analytics trackers in its code.",
      },
    ],
    related: ["data-request", "permissions", "contact"],
  },
  {
    slug: "terms",
    category: "Legal / Terms of sale",
    title: "Know the terms.",
    accent: "Before you order.",
    description:
      "Terms for WICCLAW Box preorders and this website. Updated October 19, 2026.",
    sections: [
      {
        title: "Seller and product.",
        text: "The seller is WICCLAW Corp. Contact hello@wicclaw.ai for seller and order enquiries. Product images are illustrative; final hardware specifications, accessories, setup, and supported workflows must be confirmed before checkout. Fleet and tailored deployments require a separate written agreement.",
      },
      {
        title: "Price, payment, and timing.",
        text: "The order page shows the selected WICCLAW Box version, approved hardware price, reservation or full-payment amount, remaining hardware balance, estimated delivery, shipping regions, and refund terms. A $20 reservation for the current $799 hardware is credited to that price. The $779 hardware balance is requested separately before shipment; it is not charged automatically. Stripe hosts payment and shows any applicable tax and shipping charge before you pay. A preorder is for future delivery; it does not promise immediate shipment. We will contact you if a material delivery estimate changes.",
      },
      {
        title: "Cancellation, support, and website use.",
        text: "The seller is WICCLAW Corp. Read the cancellation and refund policy and shipping page before ordering. For order questions, email hello@wicclaw.ai from the address used at checkout. Do not submit passwords or private credentials through the contact form. Nothing here limits consumer rights that cannot be waived under applicable law. Deployment-specific service terms are provided separately.",
      },
    ],
    related: ["refunds", "shipping", "privacy"],
  },
  {
    slug: "shipping",
    category: "Legal / Shipping information",
    title: "From order",
    accent: "to doorstep.",
    description: "Shipping regions, delivery estimates, and what happens when a pre-order is ready.",
    sections: [
      { title: "Where we ship.", text: "International shipping is planned, with charges based on USPS or UPS rates. Eligible destination countries will be confirmed and enforced in Stripe Checkout before ordering opens. We cannot accept orders outside those regions. Checkout displays the total, including any applicable shipping charge, before payment." },
      { title: "When it ships.", text: "The estimated delivery window is shown before checkout opens. It is an estimate, not a guaranteed arrival date. We will contact customers using their checkout email if the estimate changes materially or an order cannot be fulfilled." },
      { title: "Delivery questions.", text: "Stripe collects your shipping address at checkout. Email hello@wicclaw.ai promptly with your receipt email if you need an address correction or have an order question. A shipment may be impossible to redirect once dispatched." },
    ],
    related: ["refunds", "terms", "contact"],
  },
  {
    slug: "refunds",
    category: "Legal / Cancellation & refunds",
    title: "Change of plans?",
    accent: "Know your options.",
    description: "Review the published pre-order cancellation and refund terms before payment.",
    sections: [
      { title: "Before ordering.", text: "The $20 Core reservation deposit is fully refundable until the remaining hardware balance is paid. Cancellation terms for fully prepaid orders before shipment are still being finalized; full-payment checkout remains closed." },
      { title: "Returns after delivery.", text: "You may request a return within 14 days of delivery. Hardware must be in its original condition and packaging. The buyer pays return shipping, and a 15% restocking fee is deducted from the refund, subject to applicable consumer rights. Contact hello@wicclaw.ai for return instructions." },
      { title: "Request a cancellation or refund.", text: "Email hello@wicclaw.ai from the address used at checkout and include your Stripe receipt or payment reference. We review the request under the terms shown when you ordered and any rights that apply by law. Do not send card numbers by email." },
      { title: "If we cannot fulfill.", text: "If WICCLAW cannot fulfill a paid pre-order, we will contact the purchaser and arrange the appropriate refund. Refunds are returned through Stripe to the original payment method where possible; bank processing time may vary." },
    ],
    related: ["shipping", "terms", "contact"],
  },
];

export const pageBySlug = (slug: string) =>
  pages.find((page) => page.slug === slug);
