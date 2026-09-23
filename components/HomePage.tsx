import Link from "next/link";
import { ArrowUpRight, CreditCard, FileText, Gauge, MessageSquareText, TriangleAlert } from "lucide-react";
import { common, officialNews, type Lang } from "@/lib/content";
import { verifiedContent } from "@/lib/verified";

function RiverLines({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 720 520" fill="none" aria-hidden="true" focusable="false">
    <path d="M-95 108C40 12 152 18 277 104s228 93 363-2 228-87 327-7" />
    <path d="M-95 181C40 85 152 91 277 177s228 93 363-2 228-87 327-7" />
    <path d="M-95 254C40 158 152 164 277 250s228 93 363-2 228-87 327-7" />
    <path d="M-95 327C40 231 152 237 277 323s228 93 363-2 228-87 327-7" />
    <path d="M-95 400C40 304 152 310 277 396s228 93 363-2 228-87 327-7" />
    <path d="M-95 473C40 377 152 383 277 469s228 93 363-2 228-87 327-7" />
  </svg>;
}

export default function HomePage({ lang }: { lang: Lang }) {
  const t = common[lang];
  const v = verifiedContent[lang];
  const path = (section: string) => `/${lang}/${section}`;

  return <>
    <section className="hero">
      <div className="wrap heroGrid">
        <div className="heroCopy">
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="heroLinks">
            <Link href={path("readings")}>{lang === "kz" ? "Көрсеткішті беру жолы" : "Как передать показания"}<ArrowUpRight size={20} aria-hidden="true" /></Link>
            <Link href={path("contacts")}>{t.nav.contacts}<ArrowUpRight size={20} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="heroRiver" aria-hidden="true">
          <RiverLines className="riverLines" />
          <span className="riverName">Сырдарья</span>
          <span className="riverCity">Қызылорда</span>
        </div>
      </div>
    </section>

    <div className="statusbar">
      <div className="wrap statusInner">
        <span className="statusIcon" aria-hidden="true"><TriangleAlert size={24} strokeWidth={2} /></span>
        <div className="statusCopy"><strong>{t.statusTitle}</strong><span>{t.statusText}</span></div>
        <Link href={path("outages")}>{t.nav.outages}<ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
    </div>

    <section className="section servicesSection wrap" aria-labelledby="services-title">
      <div className="sectionhead"><h2 id="services-title">{t.quick}</h2><p>{t.quickDesc}</p></div>
      <div className="bentoGrid">
        <Link className="bentoTile bentoReadings" href={path("readings")}>
          <span className="bentoIcon"><Gauge size={30} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="bentoBody"><strong>{t.readings}</strong><small>{t.notConnected}</small></span>
          <ArrowUpRight className="bentoArrow" size={24} aria-hidden="true" />
          <RiverLines className="tileRiver" />
        </Link>
        <Link className="bentoTile bentoPayment" href={path("payment")}>
          <span className="bentoIcon"><CreditCard size={27} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="bentoBody"><strong>{t.payment}</strong><small>{t.notConnected}</small></span>
          <ArrowUpRight className="bentoArrow" size={23} aria-hidden="true" />
        </Link>
        <Link className="bentoTile bentoOutages" href={path("outages")}>
          <span className="bentoIcon"><TriangleAlert size={28} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="bentoBody"><strong>{t.nav.outages}</strong><small>{t.statusTitle}</small></span>
          <ArrowUpRight className="bentoArrow" size={23} aria-hidden="true" />
        </Link>
        <Link className="bentoTile bentoTariffs" href={path("tariffs")}>
          <span className="bentoIcon"><FileText size={27} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="bentoBody"><strong>{t.tariffs}</strong><small>{lang === "kz" ? "Расталған мәліметтер" : "Проверенные сведения"}</small></span>
          <ArrowUpRight className="bentoArrow" size={23} aria-hidden="true" />
        </Link>
        <Link className="bentoTile bentoAppeals" href={path("appeals")}>
          <span className="bentoIcon"><MessageSquareText size={27} strokeWidth={1.8} aria-hidden="true" /></span>
          <span className="bentoBody"><strong>{t.appeals}</strong><small>{t.notConnected}</small></span>
          <ArrowUpRight className="bentoArrow" size={23} aria-hidden="true" />
        </Link>
      </div>
    </section>

    <section className="section alt">
      <div className="wrap intro">
        <div className="introCopy"><h2>{t.introTitle}</h2><p>{t.introText}</p><Link className="textlink" href={path("about")}>{t.details}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <div className="factBox">
          <div><strong>{t.water}</strong><span>{t.waterSub}</span></div>
          <div><strong>{t.sewer}</strong><span>{t.sewerSub}</span></div>
          <div><strong>Қызылорда</strong><span>{t.address}</span></div>
          <div><strong>24/7</strong><span>{t.emergency}</span></div>
        </div>
      </div>
    </section>

    <section className="section wrap">
      <div className="sectionhead"><h2>{v.helpTitle}</h2></div>
      <div className="helpGrid">{([
        { title: v.helpReadingsQ, body: v.helpReadingsA, href: path("readings"), label: t.readings },
        { title: v.helpTariffsQ, body: v.helpTariffsA, href: path("tariffs"), label: t.nav.tariffs },
        { title: v.helpOutagesQ, body: v.helpOutagesA, href: path("outages"), label: t.nav.outages },
      ] as const).map(item => <article className="helpItem" key={item.href}><h3>{item.title}</h3><p>{item.body}</p><Link className="textlink" href={item.href}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link></article>)}</div>
    </section>

    <section className="section newsSection">
      <div className="wrap"><div className="sectionhead"><h2>{t.newsTitle}</h2><Link className="textlink" href={path("news")}>{t.viewAll}<ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <div className="newsGrid">{officialNews.slice(0, 3).map(news => <article className="newsItem" key={news.id}><span className="newsDate">{news.date}</span><h3><Link href={path(`news/${news.id}`)}>{news[lang].title}</Link></h3><p>{news[lang].body}</p><Link className="newsMore" href={path(`news/${news.id}`)} aria-label={`${t.details}: ${news[lang].title}`}><ArrowUpRight size={22} aria-hidden="true" /></Link></article>)}</div>
      </div>
    </section>
  </>;
}

