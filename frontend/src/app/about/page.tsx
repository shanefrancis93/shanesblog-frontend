'use client';

import Layout from '../../components/Layout';
import CollapsibleSection from '../../components/CollapsibleSection';
import { MapPin, Mail, Linkedin, FileText, ChevronDown, Download } from 'lucide-react';

const AboutPage = () => {
  return (
    <Layout>
      <div className="min-h-screen text-[#2D2D2D] dark:text-[#EAEAEA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 relative">
          {/* Decorative background elements - both modes */}
          <div className="absolute top-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-[#6BA5F7]/10 to-transparent dark:from-[#6BA5F7]/15 -z-10" />
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-bl from-[#9B7EF8]/10 to-transparent dark:from-[#9B7EF8]/15 -z-10" />

          {/* Hero Section */}
          <div className="prose prose-lg max-w-none mb-8 sm:mb-16">
            <p className="text-xl sm:text-xl font-serif leading-relaxed mb-4 sm:mb-6 text-[#333333] dark:text-[#F5F5F5]">
              Friction is a function of misaligned incentives and miscommunication.
            </p>
            <p className="text-xl sm:text-xl font-serif leading-relaxed mb-4 sm:mb-6 text-[#333333] dark:text-[#F5F5F5]">
              I spent 10 years as an economist aligning incentives within my universe.
            </p>
            <p className="text-xl sm:text-xl font-serif leading-relaxed text-[#333333] dark:text-[#F5F5F5]">
              My approach to the first determinant polished, my attention turns to the latter.
            </p>
          </div>

          {/* Current Focus Section */}
          <div className="mb-8 sm:mb-12 backdrop-blur-sm bg-white/40 dark:bg-[#1A2B3B]/40 rounded-xl p-4 sm:p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#6BA5F7] dark:text-[#6BA5F7] mb-4 sm:mb-6">
              Current Focus
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 rounded-full bg-[#6BA5F7] dark:bg-[#6BA5F7] mt-2 flex-shrink-0" />
                <span className="text-sm sm:text-base leading-relaxed">
                  LLM architectures that can track and respond to sentiment state over time either with multi-threaded or compositional models.
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 rounded-full bg-[#6BA5F7] dark:bg-[#6BA5F7] mt-2 flex-shrink-0" />
                <span className="text-sm sm:text-base leading-relaxed">
                  Emulating writing styles with limited examples, either by fine-tuning with synthetic text or very clever inference-sampling.
                </span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <div className="w-2 h-2 rounded-full bg-[#6BA5F7] dark:bg-[#6BA5F7] mt-2 flex-shrink-0" />
                <span className="text-sm sm:text-base leading-relaxed">
                  Affective computation models to semantically-translate adversarial communication styles.
                </span>
              </li>
            </ul>
          </div>

          {/* Contact and Experience Sections */}
          <div className="space-y-5 sm:space-y-7">
            <CollapsibleSection 
              section={{
                id: 'contact-me',
                title: 'Contact Me',
                content: `
                  <div class="space-y-5 sm:space-y-7 p-5 sm:p-7 backdrop-blur-sm bg-white/40 dark:bg-[#1A2B3B]/40 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <div class="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                      <MapPin size={18} className="text-[#6BA5F7] dark:text-[#6BA5F7] sm:w-5 sm:h-5" />
                      <span>San Diego, California</span>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                      <Mail size={18} className="text-[#6BA5F7] dark:text-[#6BA5F7] sm:w-5 sm:h-5" />
                      <span>dtaspire@gmail.com</span>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                      <Linkedin size={18} className="text-[#6BA5F7] dark:text-[#6BA5F7] sm:w-5 sm:h-5" />
                      <a 
                        href="https://www.linkedin.com/in/sfeconomist"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#5494E6] dark:hover:text-[#5494E6] transition-colors break-all sm:break-normal"
                      >
                        linkedin.com/in/sfeconomist
                      </a>
                    </div>
                    <div class="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" className="text-[#6BA5F7] dark:text-[#6BA5F7] sm:w-5 sm:h-5">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                      <span>@dtaspire</span>
                    </div>
                  </div>
                `
              }}
              defaultExpanded={true}
            />

            <CollapsibleSection 
              section={{
                id: 'work-experience',
                title: 'Work Experience',
                content: `
                  <div class="space-y-6 sm:space-y-8 p-5 sm:p-7 backdrop-blur-sm bg-white/40 dark:bg-[#1A2B3B]/40 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 sm:mb-4">
                        <h3 class="text-lg sm:text-2xl font-serif font-semibold">Senior Data Scientist</h3>
                        <p class="text-[#5494E6] dark:text-[#5494E6] text-xs sm:text-sm font-medium italic mt-1 sm:mt-0">2022-PRESENT</p>
                      </div>
                      <p class="text-[#6BA5F7] dark:text-[#6BA5F7] text-sm font-medium mb-4">OPTUM INSIGHTS, UNITEDHEALTH GROUP</p>
                      <div class="space-y-3">
                        <p class="text-sm sm:text-base">I train large language models on payer research to substitute expert consultation.</p>
                        <p class="text-sm sm:text-base">I advise research teams on market sizing and consumer segmentation cross-enterprise and lead health payer research within OptumInsights.</p>
                      </div>
                    </div>
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 sm:mb-4">
                        <h3 class="text-lg sm:text-2xl font-serif font-semibold">Health Care Economist</h3>
                        <p class="text-[#5494E6] dark:text-[#5494E6] text-xs sm:text-sm font-medium italic mt-1 sm:mt-0">2021-2022</p>
                      </div>
                      <p class="text-[#6BA5F7] dark:text-[#6BA5F7] text-sm font-medium mb-4">STATE LEGISLATURE, STATE OF LOUISIANA</p>
                      <div class="space-y-3">
                        <p class="text-sm sm:text-base">Created majority of fiscal notes on legislative action impacting the Department of Health, accounting for 50% of the Covid-era state budget.</p>
                        <p class="text-sm sm:text-base">Induced the filing of HCR88 in 2022, appropriating pharmacy rebates excess of Department of Health predictions.</p>
                      </div>
                    </div>
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 sm:mb-4">
                        <h3 class="text-lg sm:text-2xl font-serif font-semibold">Health Care Economist</h3>
                        <p class="text-[#5494E6] dark:text-[#5494E6] text-xs sm:text-sm font-medium italic mt-1 sm:mt-0">2017 - 2020</p>
                      </div>
                      <p class="text-[#6BA5F7] dark:text-[#6BA5F7] text-sm font-medium mb-4">DEPT. OF ADMIN / REVENUE, STATE OF ALASKA</p>
                      <div class="space-y-3">
                        <p class="text-sm sm:text-base">Facilitated the addition of orthopedic travel surgery benefits and incentive structures for state employee and retirees.</p>
                        <p class="text-sm sm:text-base">Identified shortfalls in actuarial assumptions, leading to a correction in the state's unfunded liability calculations.</p>
                      </div>
                    </div>
                  </div>
                `
              }}
              defaultExpanded={false}
            />

            <CollapsibleSection 
              section={{
                id: 'education',
                title: 'Education',
                content: `
                  <div class="space-y-5 sm:space-y-7 p-5 sm:p-7 backdrop-blur-sm bg-white/40 dark:bg-[#1A2B3B]/40 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 sm:mb-4">
                        <h3 class="text-lg sm:text-2xl font-serif font-semibold">Bachelor's Degree, Economics, Theatre</h3>
                        <p class="text-[#5494E6] dark:text-[#5494E6] text-xs sm:text-sm font-medium italic mt-1 sm:mt-0">2016</p>
                      </div>
                      <p class="text-[#6BA5F7] dark:text-[#6BA5F7] text-sm font-medium">Whittier College</p>
                    </div>
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 sm:mb-4">
                        <h3 class="text-lg sm:text-2xl font-serif font-semibold">Master's Candidate, Health Economics</h3>
                        <p class="text-[#5494E6] dark:text-[#5494E6] text-xs sm:text-sm font-medium italic mt-1 sm:mt-0">2016 – 2017</p>
                      </div>
                      <p class="text-[#6BA5F7] dark:text-[#6BA5F7] text-sm font-medium">Johns Hopkins University</p>
                    </div>
                  </div>
                `
              }}
              defaultExpanded={false}
            />

            <CollapsibleSection 
              section={{
                id: 'awards',
                title: 'Awards',
                content: `
                  <div class="space-y-5 sm:space-y-7 p-5 sm:p-7 backdrop-blur-sm bg-white/40 dark:bg-[#1A2B3B]/40 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 sm:mb-4">
                        <h3 class="text-lg sm:text-2xl font-serif font-semibold">Insighty Awards</h3>
                        <p class="text-[#5494E6] dark:text-[#5494E6] text-xs sm:text-sm font-medium italic mt-1 sm:mt-0">NOVEMBER 2023</p>
                      </div>
                      <p class="text-[#6BA5F7] dark:text-[#6BA5F7] text-sm font-medium">Business Impact & Advancing Insights, Optum Strategic Insights</p>
                    </div>
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 sm:mb-4">
                        <h3 class="text-lg sm:text-2xl font-serif font-semibold">Computational Justice Fellowship</h3>
                        <p class="text-[#5494E6] dark:text-[#5494E6] text-xs sm:text-sm font-medium italic mt-1 sm:mt-0">APRIL 2020</p>
                      </div>
                      <p class="text-[#6BA5F7] dark:text-[#6BA5F7] text-sm font-medium">Claremont Graduate University</p>
                    </div>
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 sm:mb-4">
                        <h3 class="text-lg sm:text-2xl font-serif font-semibold">Commencement Speaker</h3>
                        <p class="text-[#5494E6] dark:text-[#5494E6] text-xs sm:text-sm font-medium italic mt-1 sm:mt-0">MAY 2016</p>
                      </div>
                      <p class="text-[#6BA5F7] dark:text-[#6BA5F7] text-sm font-medium">Whittier College</p>
                    </div>
                    <div>
                      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-3 sm:mb-4">
                        <h3 class="text-lg sm:text-2xl font-serif font-semibold">Richard T. Clawson Award</h3>
                        <p class="text-[#5494E6] dark:text-[#5494E6] text-xs sm:text-sm font-medium italic mt-1 sm:mt-0">MAY 2016</p>
                      </div>
                      <p class="text-[#6BA5F7] dark:text-[#6BA5F7] text-sm font-medium">Service & Leadership, Whittier College</p>
                    </div>
                  </div>
                `
              }}
              defaultExpanded={false}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;