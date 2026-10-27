import type { Section } from "./pages";

export type Guide = {
  category: string;
  slug: string;
  title: string;
  summary: string;
  sections: Section[];
};
const guide = (
  category: string,
  slug: string,
  title: string,
  summary: string,
  sections: Section[],
): Guide => ({ category, slug, title, summary, sections });

export const guides: Guide[] = [
  guide(
    "Getting started",
    "getting-started/set-up-wicmini",
    "Set up your WICCLAW Box",
    "Connect WICCLAW Box using your supplied instructions, pair the designated Telegram user, and check that the first request reaches the right business and device.",
    [
      {
        title: "Have the basics ready",
        text: "Keep your supplied power equipment, internet connection, Telegram account, and pilot onboarding instructions available. Choose a ventilated location for the mini. The hardware configuration and connection steps are specific to your deployment.",
      },
      {
        title: "Connect and pair",
        text: "Follow your onboarding instructions to power WICCLAW Box and connect it to the internet. Use the supplied QR pairing flow with the business owner’s Telegram account. Check that the pairing relates to the correct business and device.",
      },
      {
        title: "Verify the first result",
        text: "Begin with a status check using the instructions supplied for your pilot, then try one simple task. If pairing or connectivity is unclear, send the team the device name and the step where you stopped. Do not forward pairing credentials in a public message.",
      },
    ],
  ),
  guide(
    "Getting started",
    "getting-started/meet-wicclaw",
    "Meet your WICCLAW system",
    "Understand how an instruction reaches your dedicated computer, how configured tools help carry out supported steps, and why the result still needs review.",
    [
      {
        title: "Three parts, one workflow",
        text: "WICCLAW Box is the agent's dedicated computer. Telegram carries the owner's instruction and available result. WICCLAW's control layer associates the right business and device with the task, while the configured skill and tools determine which steps the agent can perform. A remote AI model or connected application may also process information needed for the job.",
      },
      {
        title: "Give it a clear first job",
        text: "Choose a repeatable job whose result you can check. A transaction review, prospect brief, or operational report needs a clear source, time period, and expected output. Begin with a narrow request before adding connected actions or a recurring schedule.",
      },
      {
        title: "Learn from the output",
        text: "Compare the returned result with the original source and distinguish a prepared draft from an action completed in another application. If information or access was missing, correct that before repeating the task. A useful workflow makes completed work and unresolved steps visible.",
      },
    ],
  ),
  guide(
    "Getting started",
    "getting-started/prepare-your-first-workflow",
    "Prepare your first workflow",
    "Choose one recurring business task, identify its sources and owner, and define a result your team can verify before granting account access.",
    [
      {
        title: "Pick one business outcome",
        text: "Start with a task that occurs often enough to matter and has a result your team can check. Reviewing accessible transactions for exceptions or preparing a report from approved sources are more precise starting points than 'handle administration.' Avoid combining unrelated jobs in the first request.",
      },
      {
        title: "Identify what it needs",
        text: "List the source documents or systems involved, and distinguish information that can be supplied directly from information that needs an integration. Ask the pilot team which connections are supported before planning around them.",
      },
      {
        title: "Decide what success looks like",
        text: "Write down the expected output, who reviews it, and what the workflow must not do. A draft, an internal summary, and an external update have different consequences. Agree on the boundary before running the task.",
      },
    ],
  ),
  guide(
    "Getting started",
    "getting-started/work-through-telegram",
    "Give WICCLAW Box work through Telegram",
    "Use the paired Telegram conversation to describe the task, relevant source, time period, desired result, and actions that must wait for approval.",
    [
      {
        title: "Use the paired conversation",
        text: "Follow your onboarding instructions to use the Telegram conversation linked to your device and business. Include the location when it matters, especially in a Fleet deployment. A request should identify the right business context before describing the work.",
      },
      {
        title: "Describe the output",
        text: "Try: “Draft a short message for our weekend offer using the details below. Give me two versions for review; do not publish either.” Then provide the offer, dates, audience, and tone. This is an illustrative request, not a required command format.",
      },
      {
        title: "Read the response before retrying",
        text: "The result may require clarification or review. Check what was actually returned and whether the task is still pending before submitting it again. Use your pilot instructions for status requests and escalation.",
      },
    ],
  ),
  guide(
    "Getting started",
    "getting-started/work-while-away",
    "Prepare work that can continue while you are away",
    "Learn which configured work can continue on a powered, connected WICCLAW Box and which interruptions still require your sign-in, information, or decision.",
    [
      {
        title: "Keep the device reachable",
        text: "WICCLAW Box needs power and a reliable internet connection for the connected workflow. Before leaving work unattended, verify the device’s last known state and whether the configured task has the information it needs.",
      },
      {
        title: "Agree on what can proceed",
        text: "A request in a conversation is not automatically a recurring schedule or permission for external changes. Ask the pilot team to confirm supported triggers, execution boundaries, and what should happen when a task cannot continue.",
      },
      {
        title: "Know where to check",
        text: "Agree on how results will be returned and which situations need the owner’s attention. On your return, review the result rather than assuming that connectivity proves completion. Resolve a pending decision before creating another copy of the work.",
      },
    ],
  ),
  guide(
    "Getting started",
    "getting-started/define-business-roles",
    "Define the work your business needs",
    "Map the repeated jobs that consume your team's time, then identify the information, tools, and reviewer each one needs.",
    [
      {
        title: "Start with responsibilities",
        text: "List the business outcomes you want help with: quote preparation, promotional drafts, reporting, or operational checks. Group tasks that use the same information and review process. A separate task name does not always mean a separate deployment.",
      },
      {
        title: "Name the owner",
        text: "For each workflow, identify the person who supplies source information and reviews the output. In a Fleet pilot, also name the relevant business location. Clear ownership reduces ambiguity when work is routed or needs attention.",
      },
      {
        title: "Take the map to onboarding",
        text: "Ask the team to confirm which workflows fit the pilot and how they will be configured. Add complexity after reviewing actual results. The website does not imply a self-service interface for creating unlimited agents.",
      },
    ],
  ),
  guide(
    "Working with agents",
    "agents/configure-a-workflow",
    "Write a workflow brief",
    "Explain the job in ordinary language, then record its inputs, permitted actions, approval points, and what a successful result looks like.",
    [
      {
        title: "Describe the job",
        text: "Use a short name and explain the outcome in everyday business terms. “Prepare a quote draft for review” is more useful than “automate sales.” Include an example of a good result if you already have one.",
      },
      {
        title: "Define inputs and boundaries",
        text: "List the documents or connected systems the work needs, the business owner, and the permitted actions. State whether the output is only a draft or whether the configured workflow is expected to change something.",
      },
      {
        title: "Test before expanding",
        text: "Run a small example with the team, compare the output with the brief, and record the gaps. Update the brief when the business process changes. Configuration details are agreed for the pilot, not inferred from a generic example.",
      },
    ],
  ),
  guide(
    "Working with agents",
    "agents/provide-context",
    "Give the task useful context",
    "Provide current source material and distinguish business facts from preferences so the agent has a reliable basis for the task.",
    [
      {
        title: "Use current source material",
        text: "Choose the latest brief, price list, offer details, or operational information relevant to the task. Include dates and units where ambiguity would matter. An agent should not have to invent missing facts about your business.",
      },
      {
        title: "Separate facts from preferences",
        text: "Provide the factual information first, then explain tone, formatting, length, or audience. For example, distinguish a discount’s actual end date from your preferred friendly writing style. This makes the result easier to check.",
      },
      {
        title: "Review what is missing",
        text: "If the result is wrong, check whether the input actually contained the required information. Correct the context and narrow the task before repeating it. Ask the team how persistent business references are handled in your pilot.",
      },
    ],
  ),
  guide(
    "Working with agents",
    "agents/context-and-history",
    "Understand context and history",
    "Know what information applies to this request, what may persist in your configuration, and what you should provide again rather than assume the agent remembers.",
    [
      {
        title: "Give important facts explicitly",
        text: "A previous conversation and a current source document are not the same thing. Restate the details that matter for the present task, such as the reporting period or the current offer. Identify which source takes precedence when information conflicts.",
      },
      {
        title: "Ask about persistence",
        text: "Your pilot configuration determines how business context, task history, and results are retained or made available. Ask the team to explain that behavior before relying on information from an earlier task. This site does not promise a particular long-term memory system.",
      },
      {
        title: "Keep your source of truth",
        text: "Maintain your own current business documents and approved outputs. When a rule changes, update the relevant source and notify the pilot team if it affects configuration. Do not treat an old generated answer as a permanent policy.",
      },
    ],
  ),
  guide(
    "Working with agents",
    "agents/choose-a-task-type",
    "Choose between a task and a recurring workflow",
    "Run and review a task once before discussing a schedule, trigger, and rules for repeating it.",
    [
      {
        title: "Begin with a single request",
        text: "Use a one-off task when the outcome is new or the instructions are still being refined. It is easier to spot missing information and evaluate the work when one request produces one reviewable result.",
      },
      {
        title: "Recognize repetition",
        text: "A job becomes a candidate for a recurring workflow when its inputs, output, timing, and reviewer are clear. Tell the pilot team how often it occurs and what changes between runs. Confirm supported scheduling before relying on it.",
      },
      {
        title: "Keep permissions separate",
        text: "Repeating a task does not expand what it is allowed to do. Revisit permissions when the task changes from producing a draft to acting on an external system, or when a new data source is introduced.",
      },
    ],
  ),
  guide(
    "Working with agents",
    "agents/organize-workflows",
    "Organize several workflows",
    "Give each process a defined owner, source, output, and handoff so separate tasks do not silently depend on one another.",
    [
      {
        title: "Group related work",
        text: "Tasks using the same source information, business owner, and review process may belong in one workflow family. Work for a different location or requiring different access deserves a separate discussion.",
      },
      {
        title: "Define the handoff",
        text: "If one result becomes another workflow’s input, identify who verifies it first and where the approved version lives. Do not assume that separate tasks automatically share context or coordinate with one another.",
      },
      {
        title: "Expand with evidence",
        text: "Add a workflow after the current one produces understandable results. Share the proposed roles with the pilot team so configuration and capacity can be reviewed. More prompts are not a substitute for a clear business process.",
      },
    ],
  ),
  guide(
    "Working with agents",
    "agents/keep-projects-separate",
    "Keep business tasks in the right context",
    "Identify the correct customer, business, project, or location before the agent uses records or prepares an output.",
    [
      {
        title: "Identify the work",
        text: "Name the location or project at the start of a request when several are in play. Use consistent reference names for quotes, reporting periods, and campaigns. This helps the reviewer connect a result to the correct request.",
      },
      {
        title: "Avoid mixing assumptions",
        text: "A draft for one customer should not reuse another customer’s details. Supply the intended facts explicitly, and check the output for carryover from unrelated work. Ask the pilot team about separation requirements for sensitive projects.",
      },
      {
        title: "Store approved outputs deliberately",
        text: "Keep the final reviewed version in the business location where your team expects to find it. Agree on result destinations as part of onboarding. A chat history alone may not be the right operational record.",
      },
    ],
  ),
  guide(
    "Working with agents",
    "agents/change-a-workflow",
    "Change or retire a workflow",
    "Review pending work, connected access, and saved results before changing or ending a configured process.",
    [
      {
        title: "Describe the change",
        text: "Tell the team whether you are changing instructions, pausing a responsibility, or ending a workflow. Include the device and business affected. A clear request is especially important when several locations share a control layer.",
      },
      {
        title: "Review work already in flight",
        text: "Check the queue and last known results before assuming all work has stopped. Ask how pending tasks and any configured recurrence will be handled. Preserve outputs that the business still needs.",
      },
      {
        title: "Confirm the new boundary",
        text: "Review connected systems, ownership, and permissions after a scope change. Ask the team to confirm the resulting configuration, then test a small task. Decommissioning and data handling should follow the applicable pilot agreement.",
      },
    ],
  ),
  guide(
    "Automation planning",
    "automations/plan-recurring-work",
    "Plan a recurring workflow",
    "Test the work as a single task, then agree on its trigger, limits, reviewer, and failure behavior before it repeats.",
    [
      {
        title: "Prove the task first",
        text: "Try the work as a single reviewed request. Make sure it can use the available information and return the required output before proposing a schedule. Fixing an unclear task is easier before it repeats.",
      },
      {
        title: "Write the recurrence brief",
        text: "Specify timing and time zone, the information to use, and where the result belongs. Define what counts as a meaningful change and who should handle an exception. Confirm that your pilot supports the requested trigger.",
      },
      {
        title: "Agree on failure behavior",
        text: "Ask what should happen if the device is offline, source information is unavailable, or permissions prevent execution. Have the team confirm retry behavior and any usage limits before unattended work begins.",
      },
    ],
  ),
  guide(
    "Automation planning",
    "automations/result-destinations",
    "Choose where results belong",
    "Decide who should receive each result and where an approved version belongs; confirm that the destination is supported in your configuration.",
    [
      {
        title: "Name the reviewer",
        text: "A completed draft is only useful if the right person sees it. Identify the owner and describe whether the output is for internal review or a later business action. Keep those stages distinct.",
      },
      {
        title: "Use a supported destination",
        text: "Telegram is the current WICCLAW control interface. Additional result destinations depend on your configured workflow and available connections. Ask the team to confirm the destination instead of assuming a document, inbox, or system is connected.",
      },
      {
        title: "Check a real example",
        text: "Run a small task and verify that the result is accessible to the intended reviewer. Include the business name, time period, or task reference in the output where useful. Keep the approved result with the relevant business records.",
      },
    ],
  ),
  guide(
    "Automation planning",
    "automations/permissions-and-limits",
    "Set boundaries for recurring work",
    "Define which repeated steps may proceed automatically and which changes or external messages require a person's approval.",
    [
      {
        title: "Describe allowed actions",
        text: "Separate reading information, drafting a result, and changing an external system. State what the workflow must not do. The WICCLAW permission check is part of dispatch, while the specific permitted operations are defined for your pilot.",
      },
      {
        title: "Review the frequency",
        text: "A more frequent task may create more output, more review work, or more external service usage. Choose a frequency that fits the business question. Discuss available limits and costs with the team before increasing it.",
      },
      {
        title: "Revisit after changes",
        text: "A new data source or broader task can change the risk and effort involved. Review the brief, access, and recovery rules with the pilot team rather than assuming the original setup covers the new scope.",
      },
    ],
  ),
  guide(
    "Automation planning",
    "automations/recover-a-task",
    "Investigate a delayed or failed task",
    "Check the last known task state and any external effect before retrying, especially when a duplicate action could change a record or send a message twice.",
    [
      {
        title: "Read what is already known",
        text: "Identify the request, device, and approximate time. Check the returned result or last visible task state. A queue entry, a reachable device, and a completed business outcome are different signals.",
      },
      {
        title: "Find the point of interruption",
        text: "Check connectivity, missing source information, and whether the task reached a permission boundary. If the message is unclear, send the exact non-sensitive error to the pilot team along with the task reference.",
      },
      {
        title: "Avoid duplicate effects",
        text: "Before retrying, establish whether the earlier task may have completed some work. This matters particularly for configured workflows that change an external system. Ask for help when the outcome cannot be confirmed.",
      },
    ],
  ),
  guide(
    "Connections and data",
    "connections/connect-a-service",
    "Plan a service connection",
    "Start with the task the connection must support, then confirm the available authorization method, permitted actions, and any separate setup work.",
    [
      {
        title: "Start with the reason",
        text: "Name the application and the exact job. Reading available QuickBooks information, drafting an email reply, and changing a customer record call for different access and review. The team needs that distinction to assess whether a supported connection or custom work is required.",
      },
      {
        title: "Confirm support",
        text: "WICCLAW does not publish a universal integration catalog on this site. Ask the pilot team whether the service is supported and which authorization process applies. Do not paste account passwords into the task conversation.",
      },
      {
        title: "Test a narrow request",
        text: "Once the connection is configured, begin with a small reviewed task that demonstrates the intended access. Confirm the account and business context. Review the scope again if the workflow later needs additional actions.",
      },
    ],
  ),
  guide(
    "Connections and data",
    "connections/review-access",
    "Review connected access",
    "Keep a record of connected business accounts and revisit access when owners, roles, or workflows change.",
    [
      {
        title: "Keep an access inventory",
        text: "Record which business accounts are involved in the pilot, why each is needed, and who owns it. Include the external service’s account name so similar personal and work accounts are not confused.",
      },
      {
        title: "Review when roles change",
        text: "Ask the pilot team to review access when a person leaves, a location changes ownership, or a workflow ends. Confirm the supported revocation process instead of assuming that deleting a chat disconnects a service.",
      },
      {
        title: "Check the result of a change",
        text: "After access is updated, test a small task and verify the intended account is used. Keep the relevant source and approval boundaries current. An existing connection should not be treated as permission for every possible action.",
      },
    ],
  ),
  guide(
    "Connections and data",
    "connections/custom-tools",
    "Discuss a custom API or tool",
    "Describe the business job, target system, required information or actions, and account owner so custom integration work can be scoped and tested.",
    [
      {
        title: "Describe the business need",
        text: "Explain the task, the target system, and the specific information or action required. Share public documentation for the API or tool if available. Do not assume an arbitrary endpoint can be connected directly from Telegram.",
      },
      {
        title: "Identify the integration owner",
        text: "Name the person who can approve access and maintain the external system. Discuss authentication, allowed actions, error handling, and data flow with the pilot team. Custom API or MCP support must be confirmed for the deployment.",
      },
      {
        title: "Agree on a test",
        text: "Define a small, reversible example and the expected output before broader access is considered. Confirm the implementation and support scope in the pilot proposal. Keep credentials out of emails or chat messages used to describe the request.",
      },
    ],
  ),
  guide(
    "Connections and data",
    "connections/files-and-source-material",
    "Prepare files and reference information",
    "Provide only the current material a task needs, identify the source of truth, and confirm how that material can be supplied to your configuration.",
    [
      {
        title: "Choose only relevant material",
        text: "Identify the document or data needed for the specific task. Use current versions and label dates, currencies, and units. Remove unrelated private information before it enters the workflow.",
      },
      {
        title: "Confirm the supported method",
        text: "Ask your pilot team how the configured workflow accepts reference material. Do not assume every file format or attachment type is supported. A clear, small sample can help establish what is practical.",
      },
      {
        title: "Check the facts in the output",
        text: "Review names, quantities, dates, and totals against the original source. If the source changes, give the task the updated version before requesting another result. Keep approved business records independently of generated drafts.",
      },
    ],
  ),
  guide(
    "Safety and control",
    "safety/permissions-and-review",
    "Understand permissions and review",
    "Define what a workflow may read, draft, change, or send, then identify the actions and outputs that need human review.",
    [
      {
        title: "Define the action boundary",
        text: "Before a workflow is configured, decide what it can read, prepare, or change. The deployment plan should state how requests and permissions are checked. The exact boundaries belong in the pilot setup, not only in an informal conversation.",
      },
      {
        title: "Review meaningful outputs",
        text: "A permitted task can still return a draft that needs correction. Check business facts and suitability before using the result. Begin with a level of supervision that lets you understand the workflow in practice.",
      },
      {
        title: "Request a configuration change",
        text: "If the workflow needs broader access, discuss that explicitly with the team. Ask how it affects future tasks and any pending work. Do not treat a successful earlier run as blanket approval for new actions.",
      },
    ],
  ),
  guide(
    "Safety and control",
    "safety/telegram-notifications",
    "Manage Telegram notifications",
    "Use the paired Telegram conversation to check results and requests for input; confirm which events your configured workflow actually reports.",
    [
      {
        title: "Check the paired conversation",
        text: "Use the Telegram account and conversation designated during onboarding. If a result seems missing, open the conversation directly before assuming the task failed. A notification and the underlying message are different things.",
      },
      {
        title: "Check your device settings",
        text: "Review Telegram and operating-system notification permissions on the phone or computer you use. A muted conversation may still contain results. Ask the pilot team which workflow events are expected to produce a message.",
      },
      {
        title: "Read before responding",
        text: "Open the relevant message to understand the task, business, and requested next step. Keep important operational decisions in the agreed workflow. Avoid sharing pairing or account credentials when reporting a notification problem.",
      },
    ],
  ),
  guide(
    "Safety and control",
    "safety/task-results",
    "Read task state and results",
    "Learn the difference between a reachable computer, a task in progress, and an output or external action you have verified.",
    [
      {
        title: "Separate connectivity from completion",
        text: "Heartbeat is about device reachability. Queue state is about work awaiting or progressing through dispatch. A task result is the evidence to review for a particular request. These signals answer different questions.",
      },
      {
        title: "Match the result to the request",
        text: "Check the business, time period, and original instructions. Confirm whether the output is a draft, a status response, or the result of a configured action. Review its content rather than relying only on a success label.",
      },
      {
        title: "Keep investigation details",
        text: "When something is unclear, record the device name, approximate time, and last visible state. Share non-sensitive details with the team. Resolve uncertainty about an earlier run before submitting a duplicate task.",
      },
    ],
  ),
  guide(
    "Safety and control",
    "safety/data-and-credentials",
    "Ask about data and credentials",
    "Ask which information stays on WICCLAW Box, which services or model providers receive task data, and how credentials, retention, and access are handled.",
    [
      {
        title: "Map the information flow",
        text: "A WICCLAW deployment involves a device, Telegram, the control layer, and potentially external services. Ask which information each part receives and where it is stored. A physical device does not by itself mean all processing stays local.",
      },
      {
        title: "Request the applicable documentation",
        text: "Before sharing sensitive information, ask which data stays on WICCLAW Box, what reaches Telegram or WICCLAW services, and what a remote AI model or connected application receives. Confirm authorization, retention, deletion, and credential handling for your deployment. Owning the computer alone does not answer those questions.",
      },
      {
        title: "Share less when troubleshooting",
        text: "Describe an issue using device names, timestamps, and redacted error messages. Do not include passwords, private keys, or pairing secrets in ordinary support correspondence. Follow the authorization process specified for your deployment.",
      },
    ],
  ),
  guide(
    "Devices and Fleet",
    "devices/check-your-device",
    "Check your WICCLAW Box",
    "Check power and connectivity first, then inspect the task separately; contact support before resetting a device with work in progress.",
    [
      {
        title: "Look at the physical setup",
        text: "Confirm that the supplied power equipment is connected and that the device has a suitable network connection. Keep ventilation clear. Follow the hardware instructions for your configuration rather than assuming a particular indicator or button behavior.",
      },
      {
        title: "Check the system signal",
        text: "Use the status workflow agreed during onboarding to review the device’s last known heartbeat. In Fleet, verify that you are looking at the intended business and location. Then inspect any delayed task separately.",
      },
      {
        title: "Escalate before resetting",
        text: "If the device remains unreachable, send the team the name, location, and approximate time the issue began. Ask for recovery guidance before wiping configuration or changing ownership. Existing tasks may need review first.",
      },
    ],
  ),
  guide(
    "Devices and Fleet",
    "devices/add-a-location",
    "Bring another location into a Fleet pilot",
    "Define the new location's owner, accounts, workflow, and review responsibility before confirming a multi-device configuration.",
    [
      {
        title: "Describe the new location",
        text: "Provide the business name, network environment, workflow needs, and responsible owner. Explain whether the new location needs the same work as existing devices or a different scope.",
      },
      {
        title: "Agree on the mapping",
        text: "Work with the team to identify the device in the registry and define its task-routing context. Use a naming convention your operators can recognize. Review access and result ownership for the new location.",
      },
      {
        title: "Validate a complete round trip",
        text: "After onboarding, check the device heartbeat and run a small location-specific task. Verify that the result belongs to the right business. Expand only after the team confirms the new deployment is configured as intended.",
      },
    ],
  ),
  guide(
    "Devices and Fleet",
    "devices/core-or-fleet",
    "Decide between Core and Fleet",
    "Start with the workload and access boundaries; add devices when a second location, distinct data boundary, or capacity need justifies them.",
    [
      {
        title: "Use Core as a starting point",
        text: "Core is aimed at one business beginning with a focused workflow on a dedicated computer. Confirm the included pairing, monitoring, task delivery, and support behavior in the written offer before assuming another device is required.",
      },
      {
        title: "Consider Fleet for multiple deployments",
        text: "Fleet is a proposed configuration for several devices or locations. Its routing, result tracking, operations view, and support arrangements must be defined and confirmed for each deployment.",
      },
      {
        title: "Discuss capacity and separation",
        text: "Tell the team about physical locations, ownership requirements, and expected workload. Device count and performance requirements are confirmed during pilot planning. The website does not publish a universal agent-per-device limit.",
      },
    ],
  ),
  guide(
    "Troubleshooting",
    "support/troubleshooting",
    "Troubleshoot a pilot task",
    "Identify whether the problem is the instruction, source information, authorization, external service, or WICCLAW Box, and report the last visible result.",
    [
      {
        title: "Identify the symptom",
        text: "Is the device unreachable, the task delayed, or the output incorrect? Record the time and last known state. Avoid changing several things at once, because it becomes harder to understand what fixed the problem.",
      },
      {
        title: "Check the relevant layer",
        text: "For connectivity, check power and internet access. For delayed work, inspect the queue or ask for the task state. For an incorrect result, compare the instructions and source information with the output. Ask the team if a permission boundary or missing connection is involved.",
      },
      {
        title: "Escalate with a useful report",
        text: "Include the device, business, task description, expected result, and what actually happened. Redact private information. If an external change may already have occurred, ask the team to investigate before you retry.",
      },
    ],
  ),
  guide(
    "Troubleshooting",
    "support/usage-and-costs",
    "Discuss usage and pilot costs",
    "Review the written price for hardware, setup, model usage, integrations, custom work, updates, and support before increasing the workflow's scope.",
    [
      {
        title: "Review the proposal",
        text: "Current WICCLAW Box hardware is $799. Business starts at $10,000 and Enterprise at $50,000 for separately scoped deployments. Check the written proposal for hardware, setup, supported workflows, model usage, custom development, maintenance, and support charges before you agree.",
      },
      {
        title: "Describe the workload",
        text: "Provide expected task frequency, typical source size, number of locations, and whether work is recurring. These details help the team discuss a suitable configuration and any available usage controls.",
      },
      {
        title: "Assess the business result",
        text: "Compare the pilot’s useful outputs and review effort with the process it is intended to improve. Make changes based on those results. Confirm any additional costs before extending the scope or adding devices.",
      },
    ],
  ),
  guide(
    "Troubleshooting",
    "support/contact-the-team",
    "Contact the pilot team",
    "Share the business, device, approximate time, requested task, and last visible result; keep passwords and verification codes out of ordinary support messages.",
    [
      {
        title: "Use the right subject",
        text: "Email hello@wicclaw.ai with a subject that identifies a new pilot, an existing deployment, or a technical issue. Use the address associated with the pilot when possible and include any reference from your correspondence.",
      },
      {
        title: "Make the issue reproducible",
        text: "Describe the device and location, what you asked it to do, the time, and the last result or error. Explain what you already checked. For business enquiries, include the workflow and number of locations instead.",
      },
      {
        title: "Keep secrets out",
        text: "Do not include passwords, access tokens, or pairing codes. Ask the team for the appropriate process if account authorization is required. This website prepares email drafts; it does not operate a support-ticket backend.",
      },
    ],
  ),
];

export const guideCategories = [
  ...new Set(guides.map((item) => item.category)),
];
export const guidePath = (item: Guide) => `/help/${item.slug}`;
