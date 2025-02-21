'use client';

import Layout from '../../components/Layout';
import CollapsibleSection from '../../components/CollapsibleSection';
import { MapPin, Mail, Linkedin, FileText, ChevronDown } from 'lucide-react';

const AboutPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0D1B2A] text-[#2D2D2D] dark:text-[#EAEAEA]">
        <div className="max-w-5xl mx-auto px-6 py-16 relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#4CAF50]/10 to-transparent dark:from-[#4CAF50]/5 -z-10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#409FA1]/10 to-transparent dark:from-[#409FA1]/5 -z-10" />

          {/* Hero Section */}
          <div className="prose prose-lg max-w-none mb-16">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-8 bg-gradient-to-r from-[#4CAF50] to-[#409FA1] bg-clip-text text-transparent">
              Things About Me:
            </h1>
            <p className="text-xl font-serif leading-relaxed mb-6 text-[#333333] dark:text-[#F5F5F5]">
              Friction is a function of misaligned incentives or miscommunication.
            </p>
            <p className="text-lg font-serif leading-relaxed text-[#333333] dark:text-[#F5F5F5]">
              I spent 10 years as an economist aligning incentives within the esoteric; my approach to the first determinant perfected, my attention turns to the latter.
            </p>
          </div>

          {/* Current Focus Section */}
          <div className="mb-12 bg-white dark:bg-[#1A1A1A] rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-serif font-semibold text-[#4CAF50] dark:text-[#5CBA5C] mb-6">
              Current Focus
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#409FA1] dark:bg-[#50B5B7] mt-2" />
                <span className="leading-relaxed">
                  LLM architectures that can track and respond to sentiment state over time either with multi-threaded or compositional models.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#409FA1] dark:bg-[#50B5B7] mt-2" />
                <span className="leading-relaxed">
                  Emulating writing styles with limited examples, either by fine-tuning with synthetic text or very clever inference-sampling.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#409FA1] dark:bg-[#50B5B7] mt-2" />
                <span className="leading-relaxed">
                  Affective computation models to semantically-translate adversarial communication styles.
                </span>
              </li>
            </ul>
          </div>

          {/* Resume download button */}
          <a 
            href="/pdfs/SF1124.pdf" 
            download
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#4CAF50] dark:bg-[#5CBA5C] text-white rounded-lg hover:bg-[#45A049] dark:hover:bg-[#4CAF50] transition-colors mb-12 shadow-sm hover:shadow-md"
          >
            <FileText size={20} />
            <span className="font-medium">Download Resume</span>
          </a>

          {/* Contact and Experience Sections */}
          <div className="space-y-6">
            <CollapsibleSection 
              section={{
                id: 'contact-me',
                title: 'Contact Me',
                content: `
                  <div class="space-y-4 p-6 bg-white dark:bg-[#1A1A1A] rounded-lg">
                    <div class="flex items-center gap-3 text-lg">
                      <MapPin size={20} className="text-[#4CAF50] dark:text-[#5CBA5C]" />
                      <span>San Diego, California</span>
                    </div>
                    <div class="flex items-center gap-3 text-lg">
                      <Mail size={20} className="text-[#4CAF50] dark:text-[#5CBA5C]" />
                      <span>dtaspire@gmail.com</span>
                    </div>
                    <div class="flex items-center gap-3 text-lg">
                      <Linkedin size={20} className="text-[#4CAF50] dark:text-[#5CBA5C]" />
                      <a 
                        href="https://www.linkedin.com/in/sfeconomist"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#409FA1] dark:hover:text-[#50B5B7] transition-colors"
                      >
                        linkedin.com/in/sfeconomist
                      </a>
                    </div>
                    <div class="flex items-center gap-3 text-lg">
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" className="text-[#4CAF50] dark:text-[#5CBA5C]">
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
                  <div class="space-y-8 p-6 bg-white dark:bg-[#1A1A1A] rounded-lg">
                    <div>
                      <h3 class="text-xl font-semibold mb-2">Senior Data Scientist</h3>
                      <p class="text-[#409FA1] dark:text-[#50B5B7] text-sm font-medium mb-4">OPTUM INSIGHTS, UNITEDHEALTH GROUP / 2022-PRESENT</p>
                      <ul class="space-y-3 list-none">
                        <li class="flex items-start gap-3">
                          <div class="w-1.5 h-1.5 rounded-full bg-[#4CAF50] dark:bg-[#5CBA5C] mt-2"></div>
                          <span>I train large language models on payer research to substitute expert consultation.</span>
                        </li>
                        <li class="flex items-start gap-3">
                          <div class="w-1.5 h-1.5 rounded-full bg-[#4CAF50] dark:bg-[#5CBA5C] mt-2"></div>
                          <span>I advise research teams on market sizing and consumer segmentation cross-enterprise and lead health payer research within OptumInsights.</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold mb-2">Health Care Economist</h3>
                      <p class="text-[#409FA1] dark:text-[#50B5B7] text-sm font-medium mb-4">STATE LEGISLATURE, STATE OF LOUISIANA / 2021-2022</p>
                      <ul class="space-y-3 list-none">
                        <li class="flex items-start gap-3">
                          <div class="w-1.5 h-1.5 rounded-full bg-[#4CAF50] dark:bg-[#5CBA5C] mt-2"></div>
                          <span>Created majority of fiscal notes on legislative action impacting the Department of Health, accounting for 50% of the Covid-era state budget.</span>
                        </li>
                        <li class="flex items-start gap-3">
                          <div class="w-1.5 h-1.5 rounded-full bg-[#4CAF50] dark:bg-[#5CBA5C] mt-2"></div>
                          <span>Induced the filing of HCR88 in 2022, appropriating pharmacy rebates excess of Department of Health predictions.</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold mb-2">Health Care Economist</h3>
                      <p class="text-[#409FA1] dark:text-[#50B5B7] text-sm font-medium mb-4">DEPT. OF ADMIN / REVENUE, STATE OF ALASKA / 2017 - 2020</p>
                      <ul class="space-y-3 list-none">
                        <li class="flex items-start gap-3">
                          <div class="w-1.5 h-1.5 rounded-full bg-[#4CAF50] dark:bg-[#5CBA5C] mt-2"></div>
                          <span>Facilitated the addition of orthopedic travel surgery benefits and incentive structures for state employee and retirees.</span>
                        </li>
                        <li class="flex items-start gap-3">
                          <div class="w-1.5 h-1.5 rounded-full bg-[#4CAF50] dark:bg-[#5CBA5C] mt-2"></div>
                          <span>Identified shortfalls in actuarial assumptions, leading to a correction in the state's unfunded liability calculations.</span>
                        </li>
                      </ul>
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
                  <div class="space-y-4 p-6 bg-white dark:bg-[#1A1A1A] rounded-lg">
                    <div>
                      <h3 class="text-xl font-semibold mb-2">Bachelor's Degree, Economics, Theatre</h3>
                      <p class="text-[#409FA1] dark:text-[#50B5B7] text-sm font-medium mb-4">Whittier College, 2016</p>
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold mb-2">Master's Candidate, Health Economics</h3>
                      <p class="text-[#409FA1] dark:text-[#50B5B7] text-sm font-medium mb-4">Johns Hopkins University, 2016 – 2017</p>
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
                  <div class="space-y-4 p-6 bg-white dark:bg-[#1A1A1A] rounded-lg">
                    <div>
                      <h3 class="text-xl font-semibold mb-2">"Insighty" Awards for Business Impact & Advancing Insights</h3>
                      <p class="text-[#409FA1] dark:text-[#50B5B7] text-sm font-medium mb-4">Optum Strategic Insights, Minneapolis, MN / November 2023</p>
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold mb-2">Computational Justice Fellowship</h3>
                      <p class="text-[#409FA1] dark:text-[#50B5B7] text-sm font-medium mb-4">Claremont Graduate University, Claremont, CA / April 2020</p>
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold mb-2">Commencement Speaker</h3>
                      <p class="text-[#409FA1] dark:text-[#50B5B7] text-sm font-medium mb-4">Whittier College, Whittier, CA / May 2016</p>
                    </div>
                    <div>
                      <h3 class="text-xl font-semibold mb-2">Richard T. Clawson Service & Leadership Award</h3>
                      <p class="text-[#409FA1] dark:text-[#50B5B7] text-sm font-medium mb-4">Whittier College, Whittier, CA / May 2016</p>
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