"use client"

import Link from "next/link"
import { useState, createContext, useContext, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  FileText,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Menu,
  Building2,
  Star,
  Globe,
  Check,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ==================== TRANSLATIONS ====================
const translations = {
  en: {
    // Navigation
    features: "Features",
    how_it_works: "How It Works",
    pricing: "Pricing",
    login: "Login",
    register: "Get Started",
    menu: "Menu",
    navigation: "Navigation",

    // Hero
    trusted_property_platform: "Tanzania's Trusted Property Platform",
    hero_title: "Streamline Your Rental Business with ",
    hero_title_highlight: "Smart Financial Verification",
    hero_subtitle:
      "PropatiFlow helps landlords verify tenant finances, build credit histories, and manage properties—all in one secure platform built for Tanzania.",
    start_free_trial: "Start Free Trial",
    see_how_it_works: "See How It Works",

    // Trust badges
    credit_score_integration: "Credit Score Integration",
    background_checks: "Background Checks",
    api_for_lenders: "API for Lenders",

    // User Types Section
    for_every_role: "For Every Role",
    built_for_everyone: "Built for Everyone",
    three_powerful_dashboards:
      "Three powerful dashboards. One unified experience.",

    // Landlords
    landlords: "Landlords",
    landlords_desc:
      "Verify tenant finances, track rent payments, and build a reliable rental portfolio with ease.",
    property_portfolio_management: "Property portfolio management",
    automated_tenant_screening: "Automated tenant screening",
    rent_collection_tracking: "Rent collection & tracking",
    learn_more: "Learn More",

    // Tenants
    tenants: "Tenants",
    tenants_desc:
      "Build your TrustScore™, apply for rentals confidently, and manage your payment history.",
    advanced_property_search: "Advanced property search",
    financial_profile_builder: "Financial profile builder",
    one_click_applications: "One-click applications",

    // Features Section
    core_features: "Core Features",
    powerful_financial_verification: "Powerful Financial Verification",
    everything_you_need:
      "Everything you need to make informed rental decisions.",
    credit_score_integration_desc:
      "Connect with leading credit bureaus for instant tenant scoring.",
    document_verification: "Document Verification",
    document_verification_desc:
      "Automated ID, income, and employment document verification.",
    background_checks_desc:
      "Comprehensive criminal and eviction history checks.",
    income_verification: "Income Verification",
    income_verification_desc:
      "Real-time bank statement analysis and income validation.",
    property_analytics: "Property Analytics",
    property_analytics_desc:
      "Track occupancy, revenue, and property performance metrics.",
    api_for_lenders_desc:
      "Let lenders access verified tenant data via secure API.",

    // How It Works
    getting_started: "Getting Started",
    get_started_in_minutes: "Get set up and running in just a few minutes.",
    create_your_profile: "Create Your Profile",
    create_your_profile_desc:
      "Sign up and choose your role—landlord, tenant, or agent. Set up your account in minutes.",
    list_or_search_properties: "List or Search Properties",
    list_or_search_properties_desc:
      "Landlords list properties with details. Tenants search and find verified listings.",
    verify_financial_information: "Verify Financial Information",
    verify_financial_information_desc:
      "Tenants submit financial docs. Our system verifies and generates TrustScore™.",
    close_the_deal: "Close the Deal",
    close_the_deal_desc:
      "Connect verified tenants with landlords. Complete leases with confidence.",

    // Pricing Section
    pricing_title: "Simple Pricing. Extraordinary Value.",
    pricing_subtitle: "Pay based on portfolio size. No hidden fees. Cancel anytime.",
    bronze: "BRONZE",
    silver: "SILVER",
    gold: "GOLD",
    most_popular: "MOST POPULAR",
    units_3_10: "3-10 Units",
    units_10_50: "10-50 Units",
    units_50_plus: "50+ Units",
    month: "/month",
    year: "/year",
    get_started: "Get Started",
    choose_silver: "Choose Silver",
    best_for: "Best For:",

    // Bronze features
    automated_rent_collection: "Automated rent collection (M-Pesa)",
    payment_reminders: "Payment reminders to tenants",
    basic_trustscore: "Basic TrustScore™ (view only)",
    transaction_history: "Transaction history",
    email_support: "Email support",
    bronze_best_for: "Individual landlords, first-time users, small portfolios",

    // Silver features
    everything_in_bronze: "Everything in Bronze",
    pl_reports: "P&L reports (monthly/quarterly)",
    trustscore_sharing: "TrustScore™ sharing with lenders",
    priority_support: "Priority support (24hr response)",
    multi_property_management: "Multi-property management",
    vacancy_tracking: "Vacancy tracking",
    whatsapp_alerts: "WhatsApp alerts",
    silver_best_for: "Professional landlords, property managers, growth-focused portfolios",

    // Gold features
    everything_in_silver: "Everything in Silver",
    multi_property_dashboard: "Multi-property dashboard",
    trustscore_analytics: "TrustScore™ analytics & trends",
    dedicated_account_manager: "Dedicated account manager",
    api_access: "API access (integrate with your tools)",
    custom_reporting: "Custom reporting",
    phone_support: "Phone support (direct line)",
    gold_best_for: "Large-scale landlords, institutional property managers, enterprise portfolios",

    // FAQ Section
    got_questions: "Got Questions?",
    faq_title: "Questions Landlords Ask",
    faq_subtitle: "Everything you need to know about PropatiFlow. No fluff, just straight answers.",
    rent_disbursement: "Rent Disbursement",
    to_your_account: "to your account",
    rent_received: "Rent Received",
    zero_platform_fees: "zero platform fees",
    mobile_networks: "Mobile Networks",
    supported: "supported",

    // FAQ Questions & Answers
    faq_q1: "How does Propatiflow help me collect rent on time?",
    faq_a1: "On rent due date, Propatiflow sends a payment link directly to your tenant via M-Pesa, Tigo Pesa, Airtel Money, or Halo Pesa. The tenant pays with one tap. You receive 100% of rent—the tenant covers the 2.5% convenience fee. No manual reminders, no chasing.",
    faq_q2: "What if a tenant doesn't pay after receiving the payment link?",
    faq_a2: "Propatiflow records the missed payment and sends a follow-up reminder. All payment history—on-time and late—is logged in your dashboard and contributes to the tenant's TrustScore™ record. You always have a clean, digital audit trail.",
    faq_q3: "How quickly do I get my rent money?",
    faq_a3: "Within 24 hours of collection. Propatiflow instantly matches payments to units and disburses to your bank account daily. Zero fees on rent—you get 100% of what tenants pay.",
    faq_q4: "Is my data safe? What about tenant privacy?",
    faq_a4: "100% consent-based. Every tenant explicitly agrees to data sharing. We're PDPC-compliant and never share data without permission. Tenant data is encrypted and stored securely.",
    faq_q5: "Can I cancel anytime?",
    faq_a5: "Yes. No long-term contracts. Cancel anytime with 30 days notice. Your data exports automatically.",
    faq_q6: "What if I have technical issues?",
    faq_a6: "Silver and Gold members get priority support. Bronze members get email support. We also have a WhatsApp support line for urgent issues.",
    faq_q7: "What is TrustScore™ and how does it work?",
    faq_a7: "TrustScore™ is Propatiflow's tenant verification system. Every payment—on-time or late—is recorded and contributes to the tenant's payment history profile. Landlords use TrustScore™ to screen future tenants. Over time, this payment history data can be shared (with tenant consent) with financial institutions for credit eligibility assessments. Tenants control who sees their data.",
    faq_q8: "Can I use Propatiflow for multiple properties?",
    faq_a8: "Yes. Silver and Gold tiers support unlimited properties. Bronze is designed for single or small portfolios but can add properties as you grow.",
    faq_q9: "What payment methods do tenants use?",
    faq_a9: "Tenants can pay via M-Pesa, Tigo Pesa, Airtel Money, or Halo Pesa using the payment link sent on rent due date. All major Tanzanian mobile money networks are supported.",
    faq_q10: "Is there a setup fee?",
    faq_a10: "No setup fees. No hidden charges. Just the monthly subscription based on your tier. That's it.",

    // CTA Section
    cta_title: "Ready to Transform Your Property Business?",
    cta_subtitle: "Join thousands of landlords, tenants, and agents already using PropatiFlow to simplify property management.",
    learn_more_link: "Learn More",

    // Footer
    footer_tagline:
      "Building trust between landlords and tenants through verified financial data.",
    product: "Product",
    api_documentation: "API Documentation",
    company: "Company",
    about_us: "About Us",
    contact: "Contact",
    careers: "Careers",
    legal: "Legal",
    privacy_policy: "Privacy Policy",
    terms_of_service: "Terms of Service",
    security: "Security",
    rentsecure: "PropatiFlow",
    all_rights_reserved: "All rights reserved.",
  },
  sw: {
    // Navigation
    features: "Vipengele",
    how_it_works: "Inavyofanya Kazi",
    pricing: "Bei",
    login: "Ingia",
    register: "Anza Sasa",
    menu: "Menyu",
    navigation: "Urambazaji",

    // Hero
    trusted_property_platform: "Jukwaa la Mali Linaloaminika Tanzania",
    hero_title: "Rahisisha Biashara Yako ya Upangishaji na ",
    hero_title_highlight: "Uthibitishaji wa Kifedha wa Kisasa",
    hero_subtitle:
      "PropatiFlow inasaidia wamiliki wa nyumba kuthibitisha fedha za wapangaji, kujenga historia ya mikopo, na kusimamia mali—yote katika jukwaa moja salama lililojengwa kwa Tanzania.",
    start_free_trial: "Anza Jaribio Bure",
    see_how_it_works: "Tazama Inavyofanya Kazi",

    // Trust badges
    credit_score_integration: "Muunganisho wa Alama ya Mkopo",
    background_checks: "Ukaguzi wa Historia",
    api_for_lenders: "API kwa Wakopeshaji",

    // User Types Section
    for_every_role: "Kwa Kila Nafasi",
    built_for_everyone: "Imejengwa kwa Kila Mtu",
    three_powerful_dashboards:
      "Dashibodi tatu zenye nguvu. Uzoefu mmoja uliounganishwa.",

    // Landlords
    landlords: "Wamiliki wa Nyumba",
    landlords_desc:
      "Thibitisha fedha za wapangaji, fuatilia malipo ya kodi, na jenga portfolio ya upangishaji ya kuaminika kwa urahisi.",
    property_portfolio_management: "Usimamizi wa portfolio ya mali",
    automated_tenant_screening: "Uchunguzi wa wapangaji otomatiki",
    rent_collection_tracking: "Ukusanyaji na ufuatiliaji wa kodi",
    learn_more: "Jifunze Zaidi",

    // Tenants
    tenants: "Wapangaji",
    tenants_desc:
      "Jenga TrustScore™ yako, omba nyumba kwa ujasiri, na simamia historia yako ya malipo.",
    advanced_property_search: "Utafutaji wa hali ya juu wa mali",
    financial_profile_builder: "Mjenzi wa wasifu wa kifedha",
    one_click_applications: "Maombi kwa kubofya moja",

    // Features Section
    core_features: "Vipengele Vikuu",
    powerful_financial_verification: "Uthibitishaji wa Kifedha wenye Nguvu",
    everything_you_need:
      "Kila unachohitaji kufanya maamuzi sahihi ya upangishaji.",
    credit_score_integration_desc:
      "Unganisha na mashirika ya mikopo kwa alama za wapangaji papo hapo.",
    document_verification: "Uthibitishaji wa Hati",
    document_verification_desc:
      "Uthibitishaji otomatiki wa kitambulisho, mapato, na hati za ajira.",
    background_checks_desc:
      "Ukaguzi kamili wa historia ya uhalifu na kufukuzwa.",
    income_verification: "Uthibitishaji wa Mapato",
    income_verification_desc:
      "Uchambuzi wa taarifa za benki na uthibitishaji wa mapato papo hapo.",
    property_analytics: "Uchambuzi wa Mali",
    property_analytics_desc:
      "Fuatilia upangaji, mapato, na viashiria vya utendaji wa mali.",
    api_for_lenders_desc:
      "Waruhusu wakopeshaji kupata data iliyothibitishwa ya wapangaji kupitia API salama.",

    // How It Works
    getting_started: "Kuanza",
    get_started_in_minutes: "Jipange na uendeshe katika dakika chache tu.",
    create_your_profile: "Unda Wasifu Wako",
    create_your_profile_desc:
      "Jiandikishe na uchague nafasi yako—mmiliki, mpangaji, au wakala. Sanidi akaunti yako katika dakika.",
    list_or_search_properties: "Orodhesha au Tafuta Mali",
    list_or_search_properties_desc:
      "Wamiliki wanaorodhesha mali na maelezo. Wapangaji wanatafuta na kupata orodha zilizothibitishwa.",
    verify_financial_information: "Thibitisha Taarifa za Kifedha",
    verify_financial_information_desc:
      "Wapangaji wanawasilisha hati za kifedha. Mfumo wetu unathibitisha na kutengeneza TrustScore™.",
    close_the_deal: "Kamilisha Mkataba",
    close_the_deal_desc:
      "Unganisha wapangaji waliothibitishwa na wamiliki. Kamilisha mikataba kwa ujasiri.",

    // Pricing Section
    pricing_title: "Bei Rahisi. Thamani ya Ajabu.",
    pricing_subtitle: "Lipa kulingana na ukubwa wa portfolio. Hakuna ada zilizofichwa. Ghairi wakati wowote.",
    bronze: "SHABA",
    silver: "FEDHA",
    gold: "DHAHABU",
    most_popular: "MAARUFU ZAIDI",
    units_3_10: "Vitengo 3-10",
    units_10_50: "Vitengo 10-50",
    units_50_plus: "Vitengo 50+",
    month: "/mwezi",
    year: "/mwaka",
    get_started: "Anza Sasa",
    choose_silver: "Chagua Fedha",
    best_for: "Bora Kwa:",

    // Bronze features
    automated_rent_collection: "Ukusanyaji wa kodi otomatiki (M-Pesa)",
    payment_reminders: "Vikumbusho vya malipo kwa wapangaji",
    basic_trustscore: "TrustScore™ ya msingi (kutazama tu)",
    transaction_history: "Historia ya miamala",
    email_support: "Msaada wa barua pepe",
    bronze_best_for: "Wamiliki binafsi, watumiaji wa kwanza, portfolio ndogo",

    // Silver features
    everything_in_bronze: "Kila kitu katika Shaba",
    pl_reports: "Ripoti za P&L (kila mwezi/robo mwaka)",
    trustscore_sharing: "Kushiriki TrustScore™ na wakopeshaji",
    priority_support: "Msaada wa kipaumbele (jibu la saa 24)",
    multi_property_management: "Usimamizi wa mali nyingi",
    vacancy_tracking: "Ufuatiliaji wa nafasi tupu",
    whatsapp_alerts: "Tahadhari za WhatsApp",
    silver_best_for: "Wamiliki wa kitaalamu, wasimamizi wa mali, portfolio zinazokua",

    // Gold features
    everything_in_silver: "Kila kitu katika Fedha",
    multi_property_dashboard: "Dashibodi ya mali nyingi",
    trustscore_analytics: "Uchambuzi na mienendo ya TrustScore™",
    dedicated_account_manager: "Meneja wa akaunti wa kipekee",
    api_access: "Ufikiaji wa API (unganisha na zana zako)",
    custom_reporting: "Ripoti maalum",
    phone_support: "Msaada wa simu (simu ya moja kwa moja)",
    gold_best_for: "Wamiliki wakubwa, wasimamizi wa mali wa kitaasisi, portfolio za biashara",

    // FAQ Section
    got_questions: "Una Maswali?",
    faq_title: "Maswali Wamiliki Wanauliza",
    faq_subtitle: "Kila unachohitaji kujua kuhusu PropatiFlow. Hakuna maneno mengi, majibu ya moja kwa moja tu.",
    rent_disbursement: "Ugawaji wa Kodi",
    to_your_account: "kwenda akaunti yako",
    rent_received: "Kodi Iliyopokelewa",
    zero_platform_fees: "ada za jukwaa sifuri",
    mobile_networks: "Mitandao ya Simu",
    supported: "inayoungwa mkono",

    // FAQ Questions & Answers
    faq_q1: "Propatiflow inasaidiaje kukusanya kodi kwa wakati?",
    faq_a1: "Siku ya kulipa kodi, Propatiflow inatuma kiungo cha malipo moja kwa moja kwa mpangaji wako kupitia M-Pesa, Tigo Pesa, Airtel Money, au Halo Pesa. Mpangaji analipa kwa kubofya moja. Unapokea 100% ya kodi—mpangaji analipa ada ya urahisi ya 2.5%. Hakuna vikumbusho vya mikono, hakuna kufuatilia.",
    faq_q2: "Je, mpangaji asipolipa baada ya kupokea kiungo cha malipo?",
    faq_a2: "Propatiflow inarekodi malipo yaliyokosekana na kutuma kikumbusho cha kufuatilia. Historia yote ya malipo—kwa wakati na kuchelewa—imerekodiwa kwenye dashibodi yako na inachangia rekodi ya TrustScore™ ya mpangaji. Daima una njia ya ukaguzi safi ya kidijitali.",
    faq_q3: "Ni haraka kiasi gani napata pesa zangu za kodi?",
    faq_a3: "Ndani ya saa 24 za ukusanyaji. Propatiflow inalinganisha malipo na vitengo papo hapo na kutoa kwenda akaunti yako ya benki kila siku. Ada sifuri kwa kodi—unapata 100% ya wapangaji wanaolipa.",
    faq_q4: "Je, data yangu ni salama? Vipi kuhusu faragha ya mpangaji?",
    faq_a4: "100% inategemea ridhaa. Kila mpangaji anakubali wazi kushiriki data. Tuko chini ya PDPC na hatushiriki data bila ruhusa. Data ya mpangaji imefichwa na kuhifadhiwa kwa usalama.",
    faq_q5: "Ninaweza kughairi wakati wowote?",
    faq_a5: "Ndiyo. Hakuna mikataba ya muda mrefu. Ghairi wakati wowote na notisi ya siku 30. Data yako inasafirishwa kiotomatiki.",
    faq_q6: "Je, nikipata matatizo ya kiufundi?",
    faq_a6: "Wanachama wa Fedha na Dhahabu wanapata msaada wa kipaumbele. Wanachama wa Shaba wanapata msaada wa barua pepe. Pia tuna msaada wa WhatsApp kwa masuala ya dharura.",
    faq_q7: "TrustScore™ ni nini na inafanya kazi vipi?",
    faq_a7: "TrustScore™ ni mfumo wa uthibitishaji wa mpangaji wa Propatiflow. Kila malipo—kwa wakati au kuchelewa—imerekodiwa na inachangia wasifu wa historia ya malipo ya mpangaji. Wamiliki wanatumia TrustScore™ kuchunguza wapangaji wa baadaye. Baada ya muda, data hii ya historia ya malipo inaweza kushirikiwa (kwa ridhaa ya mpangaji) na taasisi za kifedha kwa tathmini za ustahiki wa mkopo. Wapangaji wanadhibiti nani anaona data yao.",
    faq_q8: "Ninaweza kutumia Propatiflow kwa mali nyingi?",
    faq_a8: "Ndiyo. Viwango vya Fedha na Dhahabu vinamuunga mkono mali zisizo na kikomo. Shaba imeundwa kwa portfolio moja au ndogo lakini inaweza kuongeza mali unavyokua.",
    faq_q9: "Wapangaji wanatumia njia zipi za malipo?",
    faq_a9: "Wapangaji wanaweza kulipa kupitia M-Pesa, Tigo Pesa, Airtel Money, au Halo Pesa kwa kutumia kiungo cha malipo kinachotumwa siku ya kulipa kodi. Mitandao yote mikubwa ya pesa za simu za Tanzania inaungwa mkono.",
    faq_q10: "Je, kuna ada ya usanidi?",
    faq_a10: "Hakuna ada za usanidi. Hakuna ada zilizofichwa. Usajili wa kila mwezi kulingana na kiwango chako tu. Ndivyo tu.",

    // CTA Section
    cta_title: "Uko Tayari Kubadilisha Biashara Yako ya Mali?",
    cta_subtitle: "Jiunge na maelfu ya wamiliki, wapangaji, na mawakala wanaotumia tayari PropatiFlow kurahisisha usimamizi wa mali.",
    learn_more_link: "Jifunze Zaidi",

    // Footer
    footer_tagline:
      "Kujenga uaminifu kati ya wamiliki na wapangaji kupitia data iliyothibitishwa ya kifedha.",
    product: "Bidhaa",
    api_documentation: "Hati za API",
    company: "Kampuni",
    about_us: "Kuhusu Sisi",
    contact: "Wasiliana",
    careers: "Kazi",
    legal: "Kisheria",
    privacy_policy: "Sera ya Faragha",
    terms_of_service: "Masharti ya Huduma",
    security: "Usalama",
    rentsecure: "PropatiFlow",
    all_rights_reserved: "Haki zote zimehifadhiwa.",
  },
}

type Language = "en" | "sw"

// ==================== LANGUAGE CONTEXT ====================
interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// ==================== LANGUAGE SWITCHER ====================
function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const languages = [
    { code: "en" as Language, label: "English", flag: "🇬🇧" },
    { code: "sw" as Language, label: "Kiswahili", flag: "🇹🇿" },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 gap-2 px-2.5">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium uppercase">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
            {language === lang.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ==================== LOGO COMPONENT ====================
function PFLogo({ className, size = 340 }: { className?: string; size?: number }) {
  // Responsive logo sizing
  return (
    <div className={className} style={{ maxWidth: size }}>
      <img
        src="/pt_info.png"
        alt="PropatiFlow Logo"
        style={{ width: "100%", height: "auto", maxWidth: size }}
        className="block max-w-[120px] sm:max-w-[180px] md:max-w-[260px] lg:max-w-[340px] h-auto"
      />
    </div>
  )
}

// ==================== HOME PAGE CONTENT ====================
function HomePageContent() {
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const faqs = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
    { q: t("faq_q6"), a: t("faq_a6") },
    { q: t("faq_q7"), a: t("faq_a7") },
    { q: t("faq_q8"), a: t("faq_a8") },
    { q: t("faq_q9"), a: t("faq_a9") },
    { q: t("faq_q10"), a: t("faq_a10") },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 md:h-20 flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center shrink-0 min-w-0">
            <PFLogo className="object-contain" size={120} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {[t("features"), t("how_it_works"), t("pricing")].map((item, idx) => {
              const hrefs = ["#features", "#how-it-works", "#pricing"]
              return (
                <Link
                  key={item}
                  href={hrefs[idx]}
                  className="text-sm lg:text-base font-semibold text-muted-foreground hover:text-foreground px-3 lg:px-4 py-2 rounded-lg hover:bg-muted/60 transition-all"
                >
                  {item}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" className="h-10 text-sm font-semibold px-4">
                {t("login")}
              </Button>
            </Link>
            <Link href="/register">
              <Button className="h-10 text-sm font-semibold px-5 rounded-lg">
                {t("register")}
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1.5">
            <LanguageSwitcher />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" aria-label={t("menu")}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(280px,85vw)] sm:w-[320px] p-0">
                <SheetHeader className="px-5 pt-5 pb-4 border-b border-border/40">
                  <SheetTitle className="flex items-center">
                    <PFLogo className="max-w-[80px] h-auto" size={80} />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col px-4 py-4" aria-label={t("navigation")}>
                  {[
                    { label: t("features"), href: "#features" },
                    { label: t("how_it_works"), href: "#how-it-works" },
                    { label: t("pricing"), href: "#pricing" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-base font-semibold py-3.5 px-3 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-border/40 mt-4 pt-4 flex flex-col gap-2.5 px-1">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-11 text-sm font-semibold">
                        {t("login")}
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full h-11 text-sm font-semibold">{t("register")}</Button>
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-primary)/0.04,transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-primary/[0.08] border border-primary/15 mb-6 sm:mb-8 max-w-full">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary shrink-0" />
              <span className="text-[9px] sm:text-xs font-semibold text-primary uppercase tracking-wider truncate">
                {t("trusted_property_platform")}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-foreground text-balance mb-4 sm:mb-6 leading-tight tracking-tight break-words">
              {t("hero_title")}
              <span className="text-primary">{t("hero_title_highlight")}</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground text-balance mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto px-2">
              {t("hero_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4 sm:px-0">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-11 sm:h-12 text-sm font-semibold px-6 sm:px-8 rounded-lg gap-2">
                  {t("start_free_trial")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-11 sm:h-12 text-sm font-semibold px-6 sm:px-8 rounded-lg bg-transparent"
                >
                  {t("see_how_it_works")}
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground px-2">
              {[t("credit_score_integration"), t("background_checks"), t("api_for_lenders")].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              {t("for_every_role")}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3 tracking-tight text-balance">
              {t("built_for_everyone")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto text-balance">
              {t("three_powerful_dashboards")}
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {/* Landlords Card */}
            <Card className="group border-border/60 shadow-none hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
              <CardContent className="pt-6 sm:pt-8 pb-6 px-5 sm:px-6 relative">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent" />
                <div className="relative">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-primary/[0.08] flex items-center justify-center mb-4 sm:mb-5">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 tracking-tight">
                    {t("landlords")}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
                    {t("landlords_desc")}
                  </p>
                  <ul className="flex flex-col gap-2.5 sm:gap-3">
                    {[t("property_portfolio_management"), t("automated_tenant_screening"), t("rent_collection_tracking")].map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-foreground/80 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center gap-1.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-semibold uppercase tracking-wider">{t("learn_more")}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Tenants Card */}
            <Card className="group border-border/60 shadow-none hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
              <CardContent className="pt-6 sm:pt-8 pb-6 px-5 sm:px-6 relative">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-accent/5 to-transparent" />
                <div className="relative">
                  <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-primary/[0.08] flex items-center justify-center mb-4 sm:mb-5">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 tracking-tight">
                    {t("tenants")}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
                    {t("tenants_desc")}
                  </p>
                  <ul className="flex flex-col gap-2.5 sm:gap-3">
                    {[t("advanced_property_search"), t("financial_profile_builder"), t("one_click_applications")].map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-foreground/80 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-center gap-1.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-semibold uppercase tracking-wider">{t("learn_more")}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              {t("core_features")}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3 tracking-tight text-balance">
              {t("powerful_financial_verification")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto text-balance">
              {t("everything_you_need")}
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Shield, title: t("credit_score_integration"), desc: t("credit_score_integration_desc"), color: "bg-primary/10 text-primary" },
              { icon: FileText, title: t("document_verification"), desc: t("document_verification_desc"), color: "bg-accent/10 text-accent" },
              { icon: Users, title: t("background_checks"), desc: t("background_checks_desc"), color: "bg-primary/10 text-primary" },
              { icon: TrendingUp, title: t("income_verification"), desc: t("income_verification_desc"), color: "bg-accent/10 text-accent" },
              { icon: Star, title: t("property_analytics"), desc: t("property_analytics_desc"), color: "bg-primary/10 text-primary" },
              { icon: CheckCircle, title: t("api_for_lenders"), desc: t("api_for_lenders_desc"), color: "bg-accent/10 text-accent" },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-4 sm:p-5 rounded-xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all group"
              >
                <div className={`h-10 w-10 sm:h-11 sm:w-11 rounded-lg flex items-center justify-center shrink-0 ${feature.color.split(" ")[0]}`}>
                  <feature.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${feature.color.split(" ")[1]}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-foreground mb-1 tracking-tight">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              {t("getting_started")}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3 tracking-tight text-balance">
              {t("how_it_works")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto text-balance">
              {t("get_started_in_minutes")}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-0">
              {[
                { step: 1, title: t("create_your_profile"), desc: t("create_your_profile_desc") },
                { step: 2, title: t("list_or_search_properties"), desc: t("list_or_search_properties_desc") },
                { step: 3, title: t("verify_financial_information"), desc: t("verify_financial_information_desc") },
                { step: 4, title: t("close_the_deal"), desc: t("close_the_deal_desc") },
              ].map((item, i) => (
                <div key={item.step} className="flex gap-4 sm:gap-6 relative">
                  {i < 3 && (
                    <div className="absolute left-[19px] sm:left-[21px] top-11 sm:top-12 w-px h-[calc(100%-16px)] bg-border/60" />
                  )}
                  <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 text-sm sm:text-base font-bold z-10 shadow-sm">
                    {item.step}
                  </div>
                  <div className="pb-8 sm:pb-10">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground mb-1.5 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              {t("pricing")}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3 tracking-tight text-balance">
              {t("pricing_title")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto text-balance">
              {t("pricing_subtitle")}
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 pt-4">
            {/* BRONZE */}
            <Card className="border-border/60 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-600/10 text-amber-600 px-3 py-1 rounded-bl-lg text-xs font-semibold">
                {t("bronze")}
              </div>
              <CardHeader className="pb-2 px-5 sm:px-6 pt-8">
                <CardTitle className="text-lg font-bold text-foreground">{t("units_3_10")}</CardTitle>
                <div className="mt-2">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    TSh 35,000<span className="text-sm font-normal text-muted-foreground">{t("month")}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">TSh 420,000{t("year")}</div>
                </div>
              </CardHeader>
              <CardContent className="px-5 sm:px-6 pb-6">
                <ul className="text-xs sm:text-sm space-y-3 mb-6">
                  {[
                    t("automated_rent_collection"),
                    t("payment_reminders"),
                    t("basic_trustscore"),
                    t("transaction_history"),
                    t("email_support"),
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-muted-foreground mb-4 pb-3 border-b border-border/40">
                  <span className="font-semibold text-foreground">{t("best_for")}</span> {t("bronze_best_for")}
                </div>
                <Button asChild className="w-full h-11" variant="outline">
                  <Link href="/register">{t("get_started")}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* SILVER - MOST POPULAR */}
            <Card className="border-primary/50 shadow-lg shadow-primary/10 relative overflow-visible scale-105 z-10">
              <div className="absolute -top-3 inset-x-0 flex justify-center z-20">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider">
                  <Star className="h-3 w-3" />
                  {t("most_popular")}
                </span>
              </div>
              <div className="absolute top-0 right-0 bg-primary/10 text-primary px-3 py-1 rounded-bl-lg text-xs font-semibold">
                {t("silver")}
              </div>
              <CardHeader className="pb-2 px-5 sm:px-6 pt-10">
                <CardTitle className="text-lg font-bold text-foreground">{t("units_10_50")}</CardTitle>
                <div className="mt-2">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    TSh 75,000<span className="text-sm font-normal text-muted-foreground">{t("month")}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">TSh 900,000{t("year")}</div>
                </div>
              </CardHeader>
              <CardContent className="px-5 sm:px-6 pb-6">
                <ul className="text-xs sm:text-sm space-y-3 mb-6">
                  {[
                    t("everything_in_bronze"),
                    t("pl_reports"),
                    t("trustscore_sharing"),
                    t("priority_support"),
                    t("multi_property_management"),
                    t("vacancy_tracking"),
                    t("whatsapp_alerts"),
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-muted-foreground mb-4 pb-3 border-b border-border/40">
                  <span className="font-semibold text-foreground">{t("best_for")}</span> {t("silver_best_for")}
                </div>
                <Button asChild className="w-full h-11 bg-primary hover:bg-primary/90">
                  <Link href="/register">{t("choose_silver")}</Link>
                </Button>
              </CardContent>
            </Card>

            {/* GOLD */}
            <Card className="border-border/60 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-600/10 text-yellow-600 px-3 py-1 rounded-bl-lg text-xs font-semibold">
                {t("gold")}
              </div>
              <CardHeader className="pb-2 px-5 sm:px-6 pt-8">
                <CardTitle className="text-lg font-bold text-foreground">{t("units_50_plus")}</CardTitle>
                <div className="mt-2">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    TSh 180,000<span className="text-sm font-normal text-muted-foreground">{t("month")}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">TSh 2,160,000{t("year")}</div>
                </div>
              </CardHeader>
              <CardContent className="px-5 sm:px-6 pb-6">
                <ul className="text-xs sm:text-sm space-y-3 mb-6">
                  {[
                    t("everything_in_silver"),
                    t("multi_property_dashboard"),
                    t("trustscore_analytics"),
                    t("dedicated_account_manager"),
                    t("api_access"),
                    t("custom_reporting"),
                    t("phone_support"),
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-muted-foreground mb-4 pb-3 border-b border-border/40">
                  <span className="font-semibold text-foreground">{t("best_for")}</span> {t("gold_best_for")}
                </div>
                <Button asChild className="w-full h-11" variant="outline">
                  <Link href="/register">{t("get_started")}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">{t("got_questions")}</p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3 tracking-tight text-balance">
              {t("faq_title")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto text-balance">
              {t("faq_subtitle")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Featured Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              {[
                { value: "24h", label: t("rent_disbursement"), sub: t("to_your_account") },
                { value: "100%", label: t("rent_received"), sub: t("zero_platform_fees") },
                { value: "4+", label: t("mobile_networks"), sub: t("supported") },
              ].map((stat) => (
                <div key={stat.label} className="bg-muted/30 rounded-xl p-4 text-center border border-border/40">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-foreground">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* FAQ Grid */}
            <div className="grid gap-3 md:gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="group border border-border/60 rounded-xl bg-background hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
                >
                  <details className="group/details">
                    <summary className="flex items-center justify-between p-5 md:p-6 cursor-pointer list-none">
                      <h3 className="text-sm md:text-base font-bold text-foreground pr-8">{faq.q}</h3>
                      <div className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-primary/10 text-primary group-open/details:rotate-90 transition-transform duration-300">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </summary>
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-border/40 mt-1">
                      {faq.a}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-xl sm:rounded-2xl md:rounded-3xl bg-primary px-5 sm:px-10 md:px-16 py-8 sm:py-14 md:py-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.7_0.15_250/0.2),transparent_60%)]" />
            <div className="relative">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary-foreground mb-3 sm:mb-4 text-balance">
                {t("cta_title")}
              </h2>
              <p className="text-sm sm:text-base text-primary-foreground/80 mb-6 sm:mb-8 max-w-xl mx-auto text-balance">
                {t("cta_subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto h-11 sm:h-12 text-sm font-semibold px-6 sm:px-8 rounded-lg gap-2"
                  >
                    {t("start_free_trial")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 md:py-12 border-t border-border/60 mt-auto bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-8 sm:mb-10">
            <div className="sm:col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3 sm:mb-4">
                <PFLogo className="max-w-[180px] sm:max-w-[240px] md:max-w-[320px] h-auto" size={320} />
              </Link>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs">
                {t("footer_tagline")}
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-foreground font-semibold mb-3 sm:mb-4">
                {t("product")}
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    {t("features")}
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    {t("pricing")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    {t("api_documentation")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-foreground font-semibold mb-3 sm:mb-4">
                {t("company")}
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    {t("about_us")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    {t("contact")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    {t("careers")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-foreground font-semibold mb-3 sm:mb-4">
                {t("legal")}
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    {t("privacy_policy")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    {t("terms_of_service")}
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    {t("security")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-border/40 text-center">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              &copy; 2025 {t("rentsecure")}. {t("all_rights_reserved")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ==================== MAIN PAGE ====================
export default function HomePage() {
  return (
    <LanguageProvider>
      <HomePageContent />
    </LanguageProvider>
  )
}
