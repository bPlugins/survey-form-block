<?php
/**
 * Seeder Script for Survey Form Block Demos.
 *
 * Seeds:
 * 1. 6 CPT 'survey-form-block' posts with full attributes.
 * 2. Column schema in 'wp_svb_columns'.
 * 3. Realistic sample submissions in 'wp_svb_data'.
 * 4. 6 Dedicated, fully designed demo landing pages.
 * 5. 1 Master Showcase Hub page (/survey-demos/).
 */

if ( ! defined( 'ABSPATH' ) ) {
    require_once __DIR__ . '/../../../../wp-load.php';
}

require_once __DIR__ . '/../includes/Patterns.php';
require_once __DIR__ . '/../includes/SurveyColumnModel.php';
require_once __DIR__ . '/../includes/SurveyDataModel.php';

// Set current user as Administrator so block comments (<!-- wp:... /-->) are not escaped by kses
wp_set_current_user( 1 );
if ( function_exists( 'kses_remove_filters' ) ) {
    kses_remove_filters();
}

echo "=== Starting Survey Form Block Demo Seeding (Designed Pages) ===\n\n";

$demos = [
    'csat-nps' => [
        'title' => 'Customer Satisfaction & NPS (CSAT / NPS)',
        'slug'  => 'customer-satisfaction-survey',
        'badge' => 'Customer Experience',
        'desc'  => 'Measure CSAT & Net Promoter Score with 5-star rating, 0-10 NPS scale, multi-select tag chips, and follow-up consent.',
        'submissions' => [
            [
                'cs_name'     => 'Sophia Martinez',
                'cs_email'    => 'sophia.m@cloudscale.io',
                'cs_duration' => '6-12m',
                'cs_rating'   => 5,
                'cs_nps'      => 10,
                'cs_features' => ['analytics', 'workflows', 'collaboration'],
                'cs_improve'  => 'Dark mode for the analytics dashboard would be fantastic for late night reporting!',
                'cs_followup' => 'Yes, happy to chat',
            ],
            [
                'cs_name'     => 'Marcus Vance',
                'cs_email'    => 'marcus.v@fintechpulse.com',
                'cs_duration' => '1-6m',
                'cs_rating'   => 4,
                'cs_nps'      => 8,
                'cs_features' => ['workflows', 'api'],
                'cs_improve'  => 'More pre-built webhook templates for Slack and Discord would save us setup time.',
                'cs_followup' => 'Yes, happy to chat',
            ],
            [
                'cs_name'     => 'Emily Zhang',
                'cs_email'    => 'emily@nexuscortex.ai',
                'cs_duration' => '>1y',
                'cs_rating'   => 5,
                'cs_nps'      => 9,
                'cs_features' => ['analytics', 'api', 'mobile'],
                'cs_improve'  => 'The platform has been rock solid for our team of 40 developers. Keep up the great work!',
                'cs_followup' => 'No, thank you',
            ],
        ],
    ],
    'product-feedback' => [
        'title' => 'Product Feedback & Feature Request',
        'slug'  => 'product-feedback-survey',
        'badge' => 'Product Management',
        'desc'  => 'Collect customer roadmap input with 1-10 usability scale, friction range slider, priority select, and beta tester opt-in.',
        'submissions' => [
            [
                'pf_name'     => 'David K.',
                'pf_email'    => 'david.k@devagency.co',
                'pf_platform' => 'web',
                'pf_ease'     => 9,
                'pf_feature'  => 'ai_assistant',
                'pf_friction' => 2,
                'pf_details'  => 'An AI summarizer that synthesizes long customer transcripts into 3 bullet points would cut our triage time in half.',
                'pf_beta'     => 'Count me in!',
            ],
            [
                'pf_name'     => 'Sarah Jenkins',
                'pf_email'    => 'sarah@growthloop.net',
                'pf_platform' => 'macos',
                'pf_ease'     => 8,
                'pf_feature'  => 'rbac',
                'pf_friction' => 4,
                'pf_details'  => 'We have junior freelancers who need read-only access to specific folders without seeing billing settings.',
                'pf_beta'     => 'Count me in!',
            ],
            [
                'pf_name'     => 'Liam O\'Connor',
                'pf_email'    => 'liam@vanguardops.de',
                'pf_platform' => 'windows',
                'pf_ease'     => 9,
                'pf_feature'  => 'webhooks',
                'pf_friction' => 1,
                'pf_details'  => 'Outbound webhooks on status changes will let us sync state directly to our internal PostgreSQL instance.',
                'pf_beta'     => 'Not right now',
            ],
        ],
    ],
    'event-registration' => [
        'title' => 'Tech Conference & Event Registration',
        'slug'  => 'event-registration-survey',
        'badge' => 'Events & Community',
        'desc'  => 'Full conference registration with attendee details, attendance format, session tracks, dietary options, and arrival date.',
        'submissions' => [
            [
                'ev_name'    => 'Dr. Elena Rostova',
                'ev_email'   => 'elena.rostova@ai-research.org',
                'ev_company' => 'DeepVision Labs',
                'ev_title'   => 'Principal AI Researcher',
                'ev_phone'   => '+1 (415) 890-1234',
                'ev_format'  => 'in_person',
                'ev_tracks'  => ['ai_agents', 'cloud_native'],
                'ev_diet'    => 'vegetarian',
                'ev_date'    => '2026-10-14',
                'ev_access'  => 'No accommodations needed',
            ],
            [
                'ev_name'    => 'Julian Blake',
                'ev_email'   => 'julian@orbitventures.vc',
                'ev_company' => 'Orbit Ventures',
                'ev_title'   => 'Managing Partner',
                'ev_phone'   => '+1 (650) 432-8765',
                'ev_format'  => 'in_person',
                'ev_tracks'  => ['startup_growth', 'ai_agents'],
                'ev_diet'    => 'none',
                'ev_date'    => '2026-10-15',
                'ev_access'  => 'No accommodations needed',
            ],
            [
                'ev_name'    => 'Kenji Sato',
                'ev_email'   => 'kenji.sato@tokyotech.jp',
                'ev_company' => 'Tokyo Web Studio',
                'ev_title'   => 'Lead Design Technologist',
                'ev_phone'   => '+81 3 5555 0199',
                'ev_format'  => 'virtual',
                'ev_tracks'  => ['design_ux', 'cloud_native'],
                'ev_diet'    => 'none',
                'ev_date'    => '2026-10-15',
                'ev_access'  => 'No accommodations needed',
            ],
        ],
    ],
    'job-application' => [
        'title' => 'Job Application & Candidate Screening',
        'slug'  => 'job-application-survey',
        'badge' => 'Recruiting & HR',
        'desc'  => 'Engineering candidate application form with portfolio links, years experience, technical proficiency scale, and work authorization.',
        'submissions' => [
            [
                'ja_name'   => 'Jordan Rivera',
                'ja_email'  => 'jordan.rivera.dev@gmail.com',
                'ja_phone'  => '+1 (512) 345-6789',
                'ja_url'    => 'https://github.com/jrivera-dev',
                'ja_stack'  => 'ts_react',
                'ja_exp'    => 6,
                'ja_start'  => '2026-11-01',
                'ja_level'  => 9,
                'ja_impact' => 'Architected a micro-frontend migration that reduced bundle size by 45% and improved core web vitals from 68 to 96.',
                'ja_auth'   => 'authorized',
                'ja_remote' => 'Open to 100% Remote',
            ],
            [
                'ja_name'   => 'Ananya Sen',
                'ja_email'  => 'ananya.sen@codehub.io',
                'ja_phone'  => '+1 (206) 789-0123',
                'ja_url'    => 'https://linkedin.com/in/ananya-sen',
                'ja_stack'  => 'python_fastapi',
                'ja_exp'    => 4,
                'ja_start'  => '2026-10-15',
                'ja_level'  => 8,
                'ja_impact' => 'Built an asynchronous ML inference service handling 12,000 requests per second with sub-40ms latency on Kubernetes.',
                'ja_auth'   => 'authorized',
                'ja_remote' => 'Open to 100% Remote',
            ],
        ],
    ],
    'bug-report' => [
        'title' => 'Website Usability & Bug Report Form',
        'slug'  => 'website-bug-report-survey',
        'badge' => 'QA & Support',
        'desc'  => 'Issue report tracker with URL input, urgency selector, category select, date stamp, and reproduction steps.',
        'submissions' => [
            [
                'br_name'     => 'Priya Patel',
                'br_email'    => 'priya@shopfront.store',
                'br_url'      => 'https://pod.local/checkout/step-2',
                'br_category' => 'api_error',
                'br_urgency'  => 'critical',
                'br_date'     => '2026-09-15',
                'br_steps'    => '1. Added items to cart. 2. Selected Apple Pay. 3. Modal closed with 500 internal server error without creating order.',
                'br_rating'   => 4,
            ],
            [
                'br_name'     => 'Trevor Hansen',
                'br_email'    => 'trevor@acmebranding.co',
                'br_url'      => 'https://pod.local/dashboard/reports',
                'br_category' => 'visual',
                'br_urgency'  => 'low',
                'br_date'     => '2026-09-16',
                'br_steps'    => 'Table column headers overflow into the action icons when viewport is between 768px and 900px.',
                'br_rating'   => 5,
            ],
        ],
    ],
    'employee-onboarding' => [
        'title' => 'Employee Onboarding & 30-Day Check-in',
        'slug'  => 'employee-onboarding-survey',
        'badge' => 'Internal Culture',
        'desc'  => 'Pulse check for new hires to assess first-month support, tooling access, goal clarity, and team mentorship.',
        'submissions' => [
            [
                'ob_dept'           => 'engineering',
                'ob_start'          => '2026-08-15',
                'ob_welcome_rating' => 5,
                'ob_equipment'      => 'Fully equipped on Day 1',
                'ob_goal_clarity'   => 9,
                'ob_mentorship'     => 'exceptional',
                'ob_feedback'       => 'My onboarding buddy was incredibly patient and guided me through my first production deployment within my second week!',
                'ob_coffee'         => 'All good right now',
            ],
            [
                'ob_dept'           => 'product_design',
                'ob_start'          => '2026-08-01',
                'ob_welcome_rating' => 5,
                'ob_equipment'      => 'Fully equipped on Day 1',
                'ob_goal_clarity'   => 8,
                'ob_mentorship'     => 'exceptional',
                'ob_feedback'       => 'The Figma design system documentation is top-notch. Would love to have more cross-team design syncs.',
                'ob_coffee'         => 'Yes, let\'s grab virtual coffee!',
            ],
        ],
    ],
];

$columnModel = new BPSVB_Survey_Column_Model();
$dataModel   = new BPSVB_Survey_Data_Model();

$cptPosts = [];
$pagePosts = [];

/**
 * Builds tailored, high-converting landing page HTML for each survey demo.
 */
function buildDemoPageHtml( $key, $demo, $cptPostId, $content ) {
    $adminUrl = admin_url( 'post.php?post=' . $cptPostId . '&action=edit' );

    $pillClasses = [
        'csat-nps'            => 'svb-pill-blue',
        'product-feedback'    => 'svb-pill-purple',
        'event-registration'  => 'svb-pill-teal',
        'job-application'     => 'svb-pill-blue',
        'bug-report'          => 'svb-pill-red',
        'employee-onboarding' => 'svb-pill-amber',
    ];
    $pillClass = isset( $pillClasses[ $key ] ) ? $pillClasses[ $key ] : 'svb-pill-blue';

    $topBar = <<<HTML
<div class="svb-demo-topbar">
    <a href="/survey-demos/" class="svb-back-link">&larr; Back to All Survey Demos</a>
    <div class="svb-demo-topbar-meta">
        <span class="svb-demo-pill {$pillClass}">{$demo['badge']}</span>
        <span>Shortcode: <code class="svb-shortcode-snippet">[survey-form-block id="{$cptPostId}"]</code></span>
        <a href="{$adminUrl}" class="svb-demo-admin-btn" target="_blank">&rarr; Edit in Admin</a>
    </div>
</div>
HTML;

    switch ( $key ) {
        case 'csat-nps':
            return <<<HTML
{$topBar}
<div class="svb-landing-hero theme-blue">
    <span class="svb-hero-badge svb-pill-blue">Customer Experience &amp; CSAT</span>
    <h1 class="svb-hero-title">How Was Your Experience With Us?</h1>
    <p class="svb-hero-subtitle">Your candid feedback helps us refine our product, prioritize bug fixes, and empower our customer success teams. Takes less than 2 minutes.</p>
    <div class="svb-hero-stats">
        <span class="svb-hero-stat-item">⭐ <strong>4.9 / 5</strong> Average CSAT</span>
        <span class="svb-hero-stat-item">👥 <strong>10,000+</strong> Happy Teams</span>
        <span class="svb-hero-stat-item">⚡️ <strong>2 Min</strong> Average Completion</span>
        <span class="svb-hero-stat-item">🔒 <strong>100%</strong> Confidential</span>
    </div>
</div>

<div class="svb-demo-main-container">
    <div class="svb-centered-form-wrapper">
        {$content}
    </div>

    <div class="svb-feature-grid">
        <div class="svb-feature-box">
            <span class="svb-feature-box-icon">📊</span>
            <h4>Direct Leadership Review</h4>
            <p>Every submission is reviewed weekly by our Customer Success and Product directors to track trends and sentiment.</p>
        </div>
        <div class="svb-feature-box">
            <span class="svb-feature-box-icon">🚀</span>
            <h4>Roadmap Impact</h4>
            <p>Over 70% of features shipped in our quarterly updates originated directly from customer survey suggestions.</p>
        </div>
        <div class="svb-feature-box">
            <span class="svb-feature-box-icon">🛡️</span>
            <h4>Privacy &amp; Follow-up</h4>
            <p>We respect your time and data. Follow-up contact is strictly optional, and your email is never shared with third parties.</p>
        </div>
    </div>
</div>
HTML;

        case 'product-feedback':
            return <<<HTML
{$topBar}
<div class="svb-landing-hero theme-purple">
    <span class="svb-hero-badge svb-pill-purple">Product Management &amp; Roadmap</span>
    <h1 class="svb-hero-title">Help Shape Our Product Roadmap</h1>
    <p class="svb-hero-subtitle">Vote on planned features, highlight workflow bottlenecks, and suggest integrations that will unlock maximum productivity for your team.</p>
    <div class="svb-hero-stats">
        <span class="svb-hero-stat-item">✅ <strong>Shipped:</strong> REST API v2</span>
        <span class="svb-hero-stat-item">🟡 <strong>In Progress:</strong> AI Summary Assistant</span>
        <span class="svb-hero-stat-item">💡 <strong>Under Review:</strong> Custom Webhooks &amp; RBAC</span>
    </div>
</div>

<div class="svb-demo-main-container">
    <div class="svb-split-layout">
        <div class="svb-sidebar-context">
            <h3 class="svb-sidebar-title">You Build With Us</h3>
            <p class="svb-sidebar-desc">We believe the best product roadmaps are co-created with the practitioners who use them every day. Here is how your suggestions flow into engineering sprints:</p>

            <div class="svb-sidebar-card">
                <h4>🎯 Feature Lifecycle</h4>
                <div class="svb-step-timeline">
                    <div class="svb-step-item">
                        <span class="svb-step-num">1</span>
                        <div class="svb-step-content">
                            <h5>Community Feedback</h5>
                            <p>You submit feature requests, pain points, and workflow bottlenecks.</p>
                        </div>
                    </div>
                    <div class="svb-step-item">
                        <span class="svb-step-num">2</span>
                        <div class="svb-step-content">
                            <h5>Product Triage</h5>
                            <p>Our product management team reviews submissions weekly and clusters common patterns.</p>
                        </div>
                    </div>
                    <div class="svb-step-item">
                        <span class="svb-step-num">3</span>
                        <div class="svb-step-content">
                            <h5>Quarterly Sprints</h5>
                            <p>Top-voted features enter active development and get released in public betas.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="svb-sidebar-card">
                <h4>✨ Private Beta Program</h4>
                <p style="font-size:14px;color:#64748b;margin-bottom:12px">Want early access to unreleased tools? Opt in via the form toggle to get:</p>
                <ul class="svb-checklist">
                    <li>Direct access to core product designers and engineers</li>
                    <li>Exclusive Discord alpha testing channels</li>
                    <li>Free preview credits for upcoming premium modules</li>
                </ul>
            </div>
        </div>

        <div class="svb-form-column">
            <div class="svb-centered-form-wrapper" style="max-width:100%">
                {$content}
            </div>
        </div>
    </div>
</div>
HTML;

        case 'event-registration':
            return <<<HTML
{$topBar}
<div class="svb-landing-hero theme-dark">
    <span class="svb-hero-badge svb-pill-teal">ANNUAL DEVELOPER SUMMIT • OCT 14–16, 2026 • SAN FRANCISCO &amp; ONLINE</span>
    <h1 class="svb-hero-title">Global Tech Summit 2026</h1>
    <p class="svb-hero-subtitle">3 days of visionary keynotes, hands-on technical labs, and executive networking at Moscone Center &amp; broadcast live worldwide.</p>
    <div class="svb-hero-stats">
        <span class="svb-hero-stat-item" style="color:#e2e8f0">🎙️ <strong>45+</strong> Keynote Speakers</span>
        <span class="svb-hero-stat-item" style="color:#e2e8f0">👥 <strong>2,500+</strong> Attendees</span>
        <span class="svb-hero-stat-item" style="color:#e2e8f0">🛠️ <strong>12</strong> Technical Labs</span>
        <span class="svb-hero-stat-item" style="color:#e2e8f0">🌐 <strong>Worldwide</strong> Livestream</span>
    </div>
</div>

<div class="svb-demo-main-container">
    <div class="svb-split-layout">
        <div class="svb-sidebar-context">
            <h3 class="svb-sidebar-title">Join 2,500+ Innovators</h3>
            <p class="svb-sidebar-desc">Connect with engineering leaders from OpenAI, Google, AWS, and fast-growing startups. Reserve your in-person or virtual pass below.</p>

            <div class="svb-sidebar-card">
                <h4>🎟️ Included With Your Pass</h4>
                <ul class="svb-checklist">
                    <li>Full access to all 4 track stages (AI, Cloud, UX, Startups)</li>
                    <li>Hands-on technical labs with cloud GPU access credits</li>
                    <li>Networking mixers, expo hall floor, and catered lunch (In-Person)</li>
                    <li>1-Year on-demand video recordings &amp; presentation decks</li>
                    <li>Attendee Discord community &amp; private speaker Q&amp;A rooms</li>
                </ul>
            </div>

            <div class="svb-sidebar-card">
                <h4>📍 Venue &amp; Dates</h4>
                <p style="font-size:14px;color:#334155;margin:0 0 8px 0"><strong>Moscone Center</strong><br>747 Howard St, San Francisco, CA 94103</p>
                <p style="font-size:13px;color:#64748b;margin:0">October 14–16, 2026 • 9:00 AM – 6:00 PM PST</p>
            </div>
        </div>

        <div class="svb-form-column">
            <div class="svb-centered-form-wrapper" style="max-width:100%">
                {$content}
            </div>
        </div>
    </div>
</div>
HTML;

        case 'job-application':
            return <<<HTML
{$topBar}
<div class="svb-landing-hero theme-blue">
    <span class="svb-hero-badge svb-pill-blue">ENGINEERING ROLES • FULL-TIME</span>
    <h1 class="svb-hero-title">Senior Full-Stack Engineer</h1>
    <p class="svb-hero-subtitle">We are looking for thoughtful builders to architect next-generation web applications. Join an autonomous, product-driven, remote-first team.</p>
    <div class="svb-hero-stats">
        <span class="svb-hero-stat-item">🌍 <strong>Location:</strong> 100% Remote (Global)</span>
        <span class="svb-hero-stat-item">💰 <strong>Compensation:</strong> $150k - $190k + Equity</span>
        <span class="svb-hero-stat-item">💻 <strong>Stack:</strong> React, TypeScript, Go, Python</span>
    </div>
</div>

<div class="svb-demo-main-container">
    <div class="svb-split-layout">
        <div class="svb-sidebar-context">
            <h3 class="svb-sidebar-title">About The Role</h3>
            <p class="svb-sidebar-desc">You will take high-level product concepts from early architecture design through to production deployment, collaborating closely with designers and product managers.</p>

            <div class="svb-sidebar-card">
                <h4>🛠️ Our Core Tech Stack</h4>
                <ul class="svb-checklist">
                    <li><strong>Frontend:</strong> React 18, TypeScript, Tailwind CSS, Next.js</li>
                    <li><strong>Backend:</strong> Go, Node.js, Python, GraphQL, REST APIs</li>
                    <li><strong>Data &amp; Infra:</strong> PostgreSQL, Redis, Kubernetes, AWS, Terraform</li>
                </ul>
            </div>

            <div class="svb-sidebar-card">
                <h4>🎁 What We Offer</h4>
                <ul class="svb-checklist">
                    <li>100% remote-first culture with flexible asynchronous hours</li>
                    <li>$3,000 annual home office setup budget</li>
                    <li>Unlimited paid time off (4 weeks minimum recommended)</li>
                    <li>Comprehensive health, dental, and vision insurance</li>
                    <li>$2,500 annual professional development &amp; conference allowance</li>
                </ul>
            </div>
        </div>

        <div class="svb-form-column">
            <div class="svb-centered-form-wrapper" style="max-width:100%">
                {$content}
            </div>
        </div>
    </div>
</div>
HTML;

        case 'bug-report':
            return <<<HTML
{$topBar}
<div class="svb-landing-hero">
    <span class="svb-hero-badge svb-pill-red">DEV SUPPORT &amp; QA DESK</span>
    <h1 class="svb-hero-title">Report an Issue or Bug</h1>
    <p class="svb-hero-subtitle">Help our engineering team identify, reproduce, and resolve website or application issues quickly.</p>
    <div class="svb-hero-stats">
        <span class="svb-hero-stat-item">🟢 <strong>Status:</strong> All Core Systems Operational</span>
        <span class="svb-hero-stat-item">⚡️ <strong>SLA:</strong> Critical bugs triaged in &lt; 2 hours</span>
        <span class="svb-hero-stat-item">📬 <strong>Updates:</strong> Direct email notifications on fix deploy</span>
    </div>
</div>

<div class="svb-demo-main-container">
    <div class="svb-split-layout">
        <div class="svb-sidebar-context">
            <h3 class="svb-sidebar-title">Submitting Great Bug Reports</h3>
            <p class="svb-sidebar-desc">The more specific your details, the faster our engineering team can isolate the issue in our staging environment and deploy a patch.</p>

            <div class="svb-sidebar-card">
                <h4>📝 Three Essential Details</h4>
                <div class="svb-step-timeline">
                    <div class="svb-step-item">
                        <span class="svb-step-num">1</span>
                        <div class="svb-step-content">
                            <h5>Exact URL</h5>
                            <p>Provide the page address or screen where the glitch occurred.</p>
                        </div>
                    </div>
                    <div class="svb-step-item">
                        <span class="svb-step-num">2</span>
                        <div class="svb-step-content">
                            <h5>Steps to Reproduce</h5>
                            <p>List the exact sequence of clicks, keystrokes, or inputs that trigger the error.</p>
                        </div>
                    </div>
                    <div class="svb-step-item">
                        <span class="svb-step-num">3</span>
                        <div class="svb-step-content">
                            <h5>Expected vs Actual</h5>
                            <p>Describe what you anticipated happening vs what actually rendered or failed.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="svb-sidebar-card">
                <h4>🚨 Severity Level Guide</h4>
                <p style="font-size:13px;line-height:1.6;color:#475569;margin:0">
                    <strong>Critical:</strong> Outage, checkout failure, data loss.<br>
                    <strong>High:</strong> Core feature broken with no workaround.<br>
                    <strong>Medium:</strong> Feature glitch, but workaround exists.<br>
                    <strong>Low:</strong> Cosmetic alignment, typo, or minor visual bug.
                </p>
            </div>
        </div>

        <div class="svb-form-column">
            <div class="svb-centered-form-wrapper" style="max-width:100%">
                {$content}
            </div>
        </div>
    </div>
</div>
HTML;

        case 'employee-onboarding':
            return <<<HTML
{$topBar}
<div class="svb-landing-hero theme-warm">
    <span class="svb-hero-badge svb-pill-amber">PEOPLE OPS &amp; CULTURE • INTERNAL PORTAL</span>
    <h1 class="svb-hero-title">🎉 30-Day New Hire Pulse Check</h1>
    <p class="svb-hero-subtitle">You've officially completed your first month with the team! Your voice directly shapes our team rituals and helps us elevate our onboarding playbook for future teammates.</p>
    <div class="svb-hero-stats">
        <span class="svb-hero-stat-item">🔒 <strong>100% Safe Space:</strong> Candid reflections are celebrated</span>
        <span class="svb-hero-stat-item">🤝 <strong>Personal Support:</strong> Optional 1-on-1 People Ops coffee</span>
    </div>
</div>

<div class="svb-demo-main-container">
    <div class="svb-centered-form-wrapper">
        {$content}
    </div>

    <div class="svb-feature-grid">
        <div class="svb-feature-box">
            <span class="svb-feature-box-icon">📖</span>
            <h4>Company Playbook</h4>
            <p>Check out our Notion handbook for async communication guidelines, sprint cadence, and team culture rituals.</p>
        </div>
        <div class="svb-feature-box">
            <span class="svb-feature-box-icon">👥</span>
            <h4>Team Directory</h4>
            <p>Connect with onboarding buddies, cross-functional leads, and mentors across all departments.</p>
        </div>
        <div class="svb-feature-box">
            <span class="svb-feature-box-icon">☕️</span>
            <h4>Wellness &amp; Coffee Chats</h4>
            <p>Remember to expense your $500 quarterly wellness stipend and schedule coffee chats with teammates.</p>
        </div>
    </div>
</div>
HTML;

        default:
            return $content;
    }
}

// 1. Process each demo
foreach ( $demos as $key => $demo ) {
    $attributes = BPSVB_Patterns::getTemplateAttributes( $key );
    $blockJson  = wp_json_encode( $attributes, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
    $content    = "<!-- wp:svb/survey-block {$blockJson} /-->";
    $formId     = $attributes['form']['id'];
    $formName   = $attributes['form']['title'];

    // Check or Create 'survey-form-block' CPT post
    $existing = get_page_by_path( $demo['slug'], OBJECT, 'survey-form-block' );
    if ( ! $existing ) {
        $byTitle = get_posts( [
            'post_type'   => 'survey-form-block',
            'title'       => $demo['title'],
            'post_status' => 'any',
            'numberposts' => 1,
        ] );
        if ( ! empty( $byTitle ) ) {
            $existing = $byTitle[0];
        }
    }

    $cptPostData = [
        'post_title'   => $demo['title'],
        'post_name'    => $demo['slug'],
        'post_content' => $content,
        'post_status'  => 'publish',
        'post_type'    => 'survey-form-block',
    ];

    if ( $existing ) {
        $cptPostData['ID'] = $existing->ID;
        $cptPostId = wp_update_post( $cptPostData );
        echo "[UPDATED] Survey CPT: {$demo['title']} (ID: {$cptPostId})\n";
    } else {
        $cptPostId = wp_insert_post( $cptPostData );
        echo "[CREATED] Survey CPT: {$demo['title']} (ID: {$cptPostId})\n";
    }

    $cptPosts[ $key ] = $cptPostId;

    // Register column schema in 'wp_svb_columns'
    $colMap = [];
    foreach ( $attributes['fields'] as $f ) {
        if ( 'section' === $f['type'] ) {
            continue;
        }
        $colMap[ $f['id'] ] = wp_strip_all_tags( $f['label'] );
    }

    $columnModel->addColumns( [
        'form_id'         => $formId,
        'form_name'       => $formName,
        'columns'         => wp_json_encode( $colMap ),
        'form_creator_id' => 1,
        'post_id'         => $cptPostId,
    ] );
    echo "  -> Columns registered in wp_svb_columns ({$formId})\n";

    // Populate sample submissions in 'wp_svb_data'
    global $wpdb;
    $tableData = $wpdb->prefix . 'svb_data';
    $wpdb->delete( $tableData, [ 'form_id' => $formId ] );

    foreach ( $demo['submissions'] as $subIndex => $subPayload ) {
        $subPayload['id']         = $formId;
        $subPayload['title']      = $formName;
        $subPayload['creator_id'] = 1;

        $wpdb->insert(
            $tableData,
            [
                'data'            => wp_json_encode( $subPayload ),
                'form_id'         => $formId,
                'form_creator_id' => 1,
                'form_name'       => $formName,
                'created_at'      => gmdate( 'Y-m-d H:i:s', time() - ( ( count( $demo['submissions'] ) - $subIndex ) * 3600 * 6 ) ),
            ]
        );
    }
    echo "  -> Seeded " . count( $demo['submissions'] ) . " realistic submissions\n";

    // Create tailored, fully designed Page for this demo
    $existingPage = get_page_by_path( $demo['slug'], OBJECT, 'page' );
    $pageHtml     = buildDemoPageHtml( $key, $demo, $cptPostId, $content );

    $pagePostData = [
        'post_title'   => $demo['title'],
        'post_name'    => $demo['slug'],
        'post_content' => $pageHtml,
        'post_status'  => 'publish',
        'post_type'    => 'page',
    ];

    if ( $existingPage ) {
        $pagePostData['ID'] = $existingPage->ID;
        $pagePostId = wp_update_post( $pagePostData );
        echo "[UPDATED] Designed Page: {$demo['title']} -> /{$demo['slug']}/ (ID: {$pagePostId})\n";
    } else {
        $pagePostId = wp_insert_post( $pagePostData );
        echo "[CREATED] Designed Page: {$demo['title']} -> /{$demo['slug']}/ (ID: {$pagePostId})\n";
    }

    $pagePosts[ $key ] = $pagePostId;
}

// 2. Create the Master Showcase Hub Page (/survey-demos/)
$hubCardsHtml = '';
$pillClasses = [
    'csat-nps'            => 'svb-pill-blue',
    'product-feedback'    => 'svb-pill-purple',
    'event-registration'  => 'svb-pill-teal',
    'job-application'     => 'svb-pill-blue',
    'bug-report'          => 'svb-pill-red',
    'employee-onboarding' => 'svb-pill-amber',
];

foreach ( $demos as $key => $demo ) {
    $cptId    = $cptPosts[ $key ];
    $demoUrl  = home_url( '/' . $demo['slug'] . '/' );
    $adminUrl = admin_url( 'post.php?post=' . $cptId . '&action=edit' );
    $pillClass = isset( $pillClasses[ $key ] ) ? $pillClasses[ $key ] : 'svb-pill-blue';

    $attributes = BPSVB_Patterns::getTemplateAttributes( $key );
    $types = [];
    foreach ( $attributes['fields'] as $fld ) {
        if ( ! in_array( $fld['type'], $types, true ) && $fld['type'] ) {
            $types[] = $fld['type'];
        }
    }
    $tagsHtml = '';
    foreach ( array_slice( $types, 0, 5 ) as $t ) {
        $tagsHtml .= '<span class="svb-hub-tag">' . esc_html( ucfirst( str_replace( '_', ' ', $t ) ) ) . '</span>';
    }

    $hubCardsHtml .= <<<HTML
    <div class="svb-hub-card">
        <span class="svb-demo-pill {$pillClass}" style="align-self: flex-start; margin-bottom: 12px;">{$demo['badge']}</span>
        <h3 class="svb-hub-card-title">{$demo['title']}</h3>
        <p class="svb-hub-card-desc">{$demo['desc']}</p>
        <div class="svb-hub-card-tags">{$tagsHtml}</div>
        <p style="font-size:12px;color:#64748b;margin:0 0 16px 0"><strong>Shortcode:</strong> <code class="svb-shortcode-snippet">[survey-form-block id="{$cptId}"]</code></p>
        <div class="svb-hub-actions">
            <a href="{$demoUrl}" class="svb-btn-primary" target="_blank">View Live Demo &rarr;</a>
            <a href="{$adminUrl}" class="svb-btn-outline" target="_blank">Edit in Admin</a>
        </div>
    </div>
HTML;
}

$hubContent = <<<HTML
<div class="svb-hub-header">
    <span class="svb-hero-badge svb-pill-blue" style="background: rgba(37,99,235,0.2); color: #93c5fd; border: 1px solid rgba(147,197,253,0.3); margin-bottom: 16px;">PRODUCTION USE CASES</span>
    <h1 style="font-size: 38px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0; letter-spacing: -0.5px;">Survey Form Block &mdash; Live Demos</h1>
    <p style="font-size: 18px; line-height: 1.6; color: #94a3b8; max-width: 720px; margin: 0 auto 28px auto;">Explore 6 authentic, production-ready real-world surveys and form use cases. Each page is completely art-directed with rich context, responsive layouts, and interactive block controls.</p>
    <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="/wp-admin/edit.php?post_type=survey-form-block" class="svb-btn-primary" style="padding: 10px 22px; font-size: 14px;">Open Survey Forms in Admin &rarr;</a>
        <a href="/wp-admin/admin.php?page=survey-form-block" class="svb-btn-outline" style="padding: 10px 20px; font-size: 14px; background: rgba(255,255,255,0.1); color: #ffffff !important; border-color: rgba(255,255,255,0.25);">View Stored Responses &rarr;</a>
    </div>
</div>

<div class="svb-demo-main-container">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 28px;">
        {$hubCardsHtml}
    </div>
</div>
HTML;

$existingHub = get_page_by_path( 'survey-demos', OBJECT, 'page' );
$hubPostData = [
    'post_title'   => 'Survey Form Block Demos Showcase',
    'post_name'    => 'survey-demos',
    'post_content' => $hubContent,
    'post_status'  => 'publish',
    'post_type'    => 'page',
];

if ( $existingHub ) {
    $hubPostData['ID'] = $existingHub->ID;
    $hubId = wp_update_post( $hubPostData );
    echo "\n[UPDATED] Master Showcase Hub: /survey-demos/ (ID: {$hubId})\n";
} else {
    $hubId = wp_insert_post( $hubPostData );
    echo "\n[CREATED] Master Showcase Hub: /survey-demos/ (ID: {$hubId})\n";
}

echo "\n=== All Demos Re-Seeded with Custom UI/UX Pages Successfully! ===\n";
