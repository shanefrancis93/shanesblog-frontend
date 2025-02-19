'use client';

import Layout from '../../components/Layout';
import CollapsibleSection from '../../components/CollapsibleSection';
import { MapPin, Mail, Linkedin, FileText } from 'lucide-react';

const AboutPage = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="prose prose-lg max-w-none text-theme-light-text dark:text-theme-dark-text mb-12">
          <p className="text-xl font-serif leading-relaxed">
            Friction is a function of misaligned incentives or miscommunication.
          </p>

          <p className="text-x2 font-serif leading-relaxed">  I spent 10 years as an economist aligning incentives within the esoteric; my approach to the first determinant perfected, my attention turns to the latter.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-serif text-theme-light-primary dark:text-theme-dark-primary mb-4">
            Current Focus
          </h2>
          <ul className="space-y-2 text-theme-light-text dark:text-theme-dark-text">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-theme-light-secondary dark:bg-theme-dark-secondary" />
              LLM architectures that can track and respond to sentiment state over time either with multi-threaded or compositional models.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-theme-light-secondary dark:bg-theme-dark-secondary" />
              Emulating writing styles with limited examples, either by fine-tuning with synthetic text or very clever inference-sampling.
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-theme-light-secondary dark:bg-theme-dark-secondary" />
              Affective computation models to semantically-translate adversarial communication styles.
            </li>
          </ul>
        </div>

        {/* Resume download link */}
        <a 
          href="/pdfs/SF1124.pdf" 
          download
          className="flex items-center gap-2 hover:text-theme-light-primary dark:hover:text-theme-dark-primary transition-colors mb-4"
        >
          <FileText size={18} />
          <span>Download Resume</span>
        </a>

        <div className="space-y-4">
          <CollapsibleSection 
            section={{
              id: 'contact-me',
              title: 'Contact Me',
              content: `
                <div class="space-y-4 text-theme-light-text dark:text-theme-dark-text">
                  <div class="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>San Diego, California</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Mail size={18} />
                    <span>dtaspire@gmail.com</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Linkedin size={18} />
                    <a 
                      href="https://www.linkedin.com/in/sfeconomist"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-theme-light-primary dark:hover:text-theme-dark-primary transition-colors"
                    >
                      linkedin.com/in/sfeconomist
                    </a>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
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
                <div class="space-y-6 text-theme-light-text dark:text-theme-dark-text">
                  <div>
                    <h3 class="font-medium">Senior Data Scientist</h3>
                    <p class="text-theme-light-secondary dark:text-theme-dark-secondary">OPTUM INSIGHTS, UNITEDHEALTH GROUP / 2022-PRESENT</p>
                    <ul class="mt-2 space-y-2 list-disc pl-4">
                      <li>I train large language models on payer research to substitute expert consultation.</li>
                      <li>I advise research teams on market sizing and consumer segmentation cross-enterprise and lead health payer research within OptumInsights.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 class="font-medium">Health Care Economist</h3>
                    <p class="text-theme-light-secondary dark:text-theme-dark-secondary">STATE LEGISLATURE, STATE OF LOUISIANA / 2021-2022</p>
                    <ul class="mt-2 space-y-2 list-disc pl-4">
                      <li>Created majority of fiscal notes on legislative action impacting the Department of Health, accounting for 50% of the Covid-era state budget.</li>
                      <li>Induced the filing of HCR88 in 2022, appropriating pharmacy rebates excess of Department of Health predictions.</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 class="font-medium">Health Care Economist</h3>
                    <p class="text-theme-light-secondary dark:text-theme-dark-secondary">DEPT. OF ADMIN / REVENUE, STATE OF ALASKA / 2017 - 2020</p>
                    <ul class="mt-2 space-y-2 list-disc pl-4">
                      <li>Facilitated the addition of orthopedic travel surgery benefits and incentive structures for state employee and retirees.</li>
                      <li>Identified shortfalls in actuarial assumptions, leading to a correction in the state's unfunded liability calculations.</li>
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
                <div class="space-y-4 text-theme-light-text dark:text-theme-dark-text">
                  <div>
                    <h3 class="font-medium">Bachelor's Degree, Economics, Theatre</h3>
                    <p class="text-theme-light-secondary dark:text-theme-dark-secondary">Whittier College, 2016</p>
                  </div>
                  <div>
                    <h3 class="font-medium">Master's Candidate, Health Economics</h3>
                    <p class="text-theme-light-secondary dark:text-theme-dark-secondary">Johns Hopkins University, 2016 – 2017</p>
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
                <div class="space-y-4 text-theme-light-text dark:text-theme-dark-text">
                  <div>
                    <h3 class="font-medium">"Insighty" Awards for Business Impact & Advancing Insights</h3>
                    <p class="text-theme-light-secondary dark:text-theme-dark-secondary">Optum Strategic Insights, Minneapolis, MN / November 2023</p>
                  </div>
                  <div>
                    <h3 class="font-medium">Computational Justice Fellowship</h3>
                    <p class="text-theme-light-secondary dark:text-theme-dark-secondary">Claremont Graduate University, Claremont, CA / April 2020</p>
                  </div>
                  <div>
                    <h3 class="font-medium">Commencement Speaker</h3>
                    <p class="text-theme-light-secondary dark:text-theme-dark-secondary">Whittier College, Whittier, CA / May 2016</p>
                  </div>

                  <div>
                    <h3 class="font-medium">Richard T. Clawson Service & Leadership Award</h3>
                    <p class="text-theme-light-secondary dark:text-theme-dark-secondary">Whittier College, Whittier, CA / May 2016</p>
                  </div>
                </div>
              `
            }}
            defaultExpanded={false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage; 