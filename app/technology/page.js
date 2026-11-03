import Link from 'next/link'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getTechnologyMessages } from '@/lib/i18n/technologyMessages'
import styles from './page.module.css'

const APP_STORE_URL = 'https://apps.apple.com/tw/app/dogtor-%E9%80%97%E8%AA%B2/id6751773627'

const SECTION_ORDER = ['graph', 'pipeline', 'tutor', 'custom', 'mastery', 'parent', 'cloud', 'responsible']

export async function generateMetadata() {
  const h = await headers()
  const t = getTechnologyMessages(h.get('x-locale') || 'zh-TW')
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: '/technology' },
    openGraph: { title: t.metaTitle, description: t.metaDescription },
  }
}

function Points({ items }) {
  return (
    <ul className={styles.points}>
      {items.map((p) => (
        <li key={p}>{p}</li>
      ))}
    </ul>
  )
}

export default async function Technology() {
  const h = await headers()
  const t = getTechnologyMessages(h.get('x-locale') || 'zh-TW')
  const s = t.sections

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <header className={styles.pageHeader}>
            <p className={styles.eyebrow}>{t.eyebrow}</p>
            <h1 className={styles.pageTitle}>{t.pageTitle}</h1>
            <p className={styles.pageSubtitle}>{t.pageSubtitle}</p>
          </header>

          <dl className={styles.stats} aria-label={t.statsLabel}>
            {t.stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt className={styles.statValue}>{stat.value}</dt>
                <dd className={styles.statLabel}>{stat.label}</dd>
              </div>
            ))}
          </dl>

          <nav className={styles.toc} aria-label={t.tocLabel}>
            {SECTION_ORDER.map((key) => (
              <a key={key} href={`#${key}`} className={styles.tocLink}>
                {s[key].title}
              </a>
            ))}
          </nav>

          <div className={styles.content}>
            <section id="graph" className={styles.section}>
              <p className={styles.tag}>{s.graph.tag}</p>
              <h2 className={styles.sectionTitle}>{s.graph.title}</h2>
              <p className={styles.text}>{s.graph.lead}</p>
              <Points items={s.graph.points} />
            </section>

            <section id="pipeline" className={styles.section}>
              <p className={styles.tag}>{s.pipeline.tag}</p>
              <h2 className={styles.sectionTitle}>{s.pipeline.title}</h2>
              <p className={styles.text}>{s.pipeline.lead}</p>
              <ol className={styles.steps}>
                {s.pipeline.steps.map((step, i) => (
                  <li key={step.title} className={styles.step}>
                    <span className={styles.stepNum} aria-hidden="true">{i + 1}</span>
                    <div>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.stepDesc}>{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className={styles.note}>{s.pipeline.note}</p>
            </section>

            <section id="tutor" className={styles.section}>
              <p className={styles.tag}>{s.tutor.tag}</p>
              <h2 className={styles.sectionTitle}>{s.tutor.title}</h2>
              <p className={styles.text}>{s.tutor.lead}</p>
              <div className={styles.cardGrid}>
                {s.tutor.tools.map((tool) => (
                  <div key={tool.name} className={styles.card}>
                    <h3 className={styles.cardTitle}>{tool.name}</h3>
                    <p className={styles.cardDesc}>{tool.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="custom" className={styles.section}>
              <p className={styles.tag}>{s.custom.tag}</p>
              <h2 className={styles.sectionTitle}>{s.custom.title}</h2>
              <p className={styles.text}>{s.custom.lead}</p>
              <Points items={s.custom.points} />
            </section>

            <section id="mastery" className={styles.section}>
              <p className={styles.tag}>{s.mastery.tag}</p>
              <h2 className={styles.sectionTitle}>{s.mastery.title}</h2>
              <p className={styles.text}>{s.mastery.lead}</p>
              <div className={styles.cardGrid}>
                {s.mastery.blocks.map((block) => (
                  <div key={block.title} className={styles.card}>
                    <h3 className={styles.cardTitle}>{block.title}</h3>
                    <p className={styles.cardDesc}>{block.desc}</p>
                    <code className={styles.formula}>{block.formula}</code>
                  </div>
                ))}
              </div>
            </section>

            <section id="parent" className={styles.section}>
              <p className={styles.tag}>{s.parent.tag}</p>
              <h2 className={styles.sectionTitle}>{s.parent.title}</h2>
              <p className={styles.text}>{s.parent.lead}</p>
            </section>

            <section id="cloud" className={styles.section}>
              <p className={styles.tag}>{s.cloud.tag}</p>
              <h2 className={styles.sectionTitle}>{s.cloud.title}</h2>
              <p className={styles.text}>{s.cloud.lead}</p>
              <div className={styles.cardGrid}>
                {s.cloud.services.map((svc) => (
                  <div key={svc.name} className={styles.card}>
                    <h3 className={styles.cardTitle}>{svc.name}</h3>
                    <p className={styles.cardDesc}>{svc.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="responsible" className={styles.section}>
              <p className={styles.tag}>{s.responsible.tag}</p>
              <h2 className={styles.sectionTitle}>{s.responsible.title}</h2>
              <Points items={s.responsible.points} />
            </section>

            <section className={styles.ctaSection}>
              <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
              <p className={styles.ctaText}>{t.ctaText}</p>
              <div className={styles.ctaButtons}>
                <a href={APP_STORE_URL} className="btn btn-primary" target="_blank" rel="noreferrer">
                  App Store
                </a>
                <Link href="/about" className="btn btn-secondary">
                  {t.ctaAbout}
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
