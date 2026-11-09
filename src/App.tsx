import { useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  ShieldCheck, Ticket, Languages, Printer, Download, Copy,
  CheckCircle2, AlertCircle, ChevronRight
} from "lucide-react";
import chillAreaLogo from "./assets/chill-area-logo.jpg";

type Language = "km" | "en";

const rules = [
  {
    km: "សូមរក្សាបណ្ណ័ផ្ញើយានយន្តឱ្យបានល្អ និងមានសុវត្ថិភាព។",
    en: "Please keep your vehicle parking tag safe and in good condition.",
  },
  {
    km: "ហាមដោះដូរ ផ្ទេរ ឬប្រើប្រាស់បណ្ណ័ជាមួយយានយន្តផ្សេង។",
    en: "Do not exchange, transfer, or use the tag for another vehicle.",
  },
  {
    km: "ហាមកែប្រែ លុបលេខ ឬធ្វើឱ្យបណ្ណ័ខូចខាត។",
    en: "Do not alter, erase the number, or damage the parking tag.",
  },
  {
    km: "សូមបង្ហាញបណ្ណ័ជូនបុគ្គលិកនៅពេលមកទទួលយកយានយន្តវិញ។",
    en: "Present your parking tag to staff when collecting your vehicle.",
  },
  {
    km: "ក្នុងករណីបាត់បណ្ណ័ សូមជូនដំណឹងដល់បុគ្គលិកជាបន្ទាន់ ដើម្បីផ្ទៀងផ្ទាត់ព័ត៌មាន។",
    en: "If your tag is lost, notify staff immediately so they can verify your details.",
  },
  {
    km: "សូមពិនិត្យលេខសម្គាល់ និងយានយន្តរបស់ខ្លួនឱ្យបានត្រឹមត្រូវ មុនពេលចាកចេញ។",
    en: "Check the tag number and your vehicle carefully before leaving.",
  },
  {
    km: "សូមគោរពតាមការណែនាំរបស់បុគ្គលិក និងបទបញ្ជារបស់ទីតាំងផ្ញើយានយន្ត។",
    en: "Please follow staff instructions and all parking-area rules.",
  },
  {
    km: "ក្នុងករណីបាត់បណ្ណ័ផ្ញើយានយន្ត អតិថិជនត្រូវបង់ថ្លៃពិន័យចំនួន ៤,០០០ រៀល (ប្រហែល ១ ដុល្លារអាមេរិក)។",
    en: "If the parking tag is lost, the customer must pay a replacement penalty of 4,000 KHR (approximately US$1).",
  },
];

const copy = {
  km: {
    title: "បទបញ្ជា និងលក្ខខណ្ឌក្នុងការរក្សាបណ្ណ័យានយន្ត",
    subtitle: "សូមអនុវត្តតាមបទបញ្ជាខាងក្រោម",
    intro: "សូមអាន និងរក្សាបណ្ណ័ផ្ញើយានយន្តរបស់អ្នកឱ្យបានល្អ",
    thanks: "សូមអរគុណចំពោះការចូលរួមសហការ និងការជឿទុកចិត្តលើសេវាកម្មរបស់យើងខ្ញុំ។",
    scanTitle: "ស្កេន QR Code ដើម្បីអានបទបញ្ជា",
    scanText: "ភ្ញៀវអាចស្កេនកូដនេះ ដើម្បីបើកមើលបទបញ្ជា និងលក្ខខណ្ឌរបស់ Chill Area។",
    language: "English",
    print: "បោះពុម្ព",
    download: "ទាញយក QR",
    copy: "ចម្លង Website URL",
    copied: "បានចម្លង URL រួចរាល់!",
    copyFail: "មិនអាចចម្លងដោយស្វ័យប្រវត្តិបានទេ។ សូមចម្លង URL ដោយដៃ។",
    local: "អ្នកកំពុងមើល Website ក្នុងម៉ាស៊ីននេះ។ សូម Publish ទៅ GitHub Pages មុននឹងទាញយក QR សម្រាប់ភ្ញៀវ។",
    online: "QR Code នេះភ្ជាប់ទៅកាន់ទំព័របទបញ្ជា Chill Area បច្ចុប្បន្ន។",
    footer: "សេវាកម្មផ្ញើយានយន្ត",
  },
  en: {
    title: "Vehicle Parking Tag Rules & Conditions",
    subtitle: "Please follow these rules",
    intro: "Please read and keep your vehicle parking tag safe",
    thanks: "Thank you for your cooperation and for choosing our service.",
    scanTitle: "Scan the QR code to read the rules",
    scanText: "Visitors can scan this code to view Chill Area parking rules and conditions.",
    language: "ភាសាខ្មែរ",
    print: "Print",
    download: "Download QR",
    copy: "Copy Website URL",
    copied: "Website URL copied!",
    copyFail: "Could not copy automatically. Please copy the URL manually.",
    local: "You are viewing this website locally. Publish it to GitHub Pages before downloading a QR code for visitors.",
    online: "This QR code links to the current Chill Area parking rules page.",
    footer: "Vehicle Parking Service",
  },
};

export default function App() {
  const [language, setLanguage] = useState<Language>("km");
  const [notice, setNotice] = useState("");
  const t = copy[language];
  const url = window.location.href;
  const isLocal = window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  const qrValue = useMemo(() => url.split("#")[0], [url]);

  const downloadQr = () => {
    const canvas = document.getElementById("parking-qr") as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "Chill-Area-Parking-Rules-QR.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setNotice(t.copied);
    } catch {
      setNotice(`${t.copyFail} ${url}`);
    }
    window.setTimeout(() => setNotice(""), 3500);
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-glow" />
        <div className="container hero-inner">
          <div className="brand">
            <div className="brand-mark"><img src={chillAreaLogo} alt="Chill Area logo" /></div>
            <div>
              <div className="brand-name">CHILL AREA</div>
              <div className="brand-caption">VEHICLE PARKING</div>
            </div>
          </div>

          <div className="hero-copy">
            <div className="eyebrow"><Ticket size={15} /> PARKING INFORMATION</div>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
            <div className="hero-actions">
              <button className="button button-light" onClick={() => setLanguage(language === "km" ? "en" : "km")}>
                <Languages size={17} /> {t.language}
              </button>
              <button className="button button-ghost" onClick={() => window.print()}>
                <Printer size={17} /> {t.print}
              </button>
            </div>
          </div>
          <div className="hero-stamp"><ShieldCheck size={22} /><span>SAFE<br />PARKING</span></div>
        </div>
      </header>

      <main className="container content">
        <section className="rules-card">
          <div className="section-heading">
            <div>
              <div className="section-kicker">CHILL AREA · PARKING</div>
              <h2>{t.subtitle}</h2>
            </div>
            <div className="heading-icon"><ShieldCheck size={25} /></div>
          </div>

          <div className="rules-grid">
            {rules.map((rule, index) => (
              <article className="rule-item" key={rule.en}>
                <div className="rule-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="rule-content">
                  <p>{rule[language]}</p>
                  <span>{language === "km" ? rule.en : rule.km}</span>
                </div>
                <CheckCircle2 className="rule-check" size={18} />
              </article>
            ))}
          </div>

          <div className="thanks">
            <div className="thanks-icon"><CheckCircle2 size={20} /></div>
            <p>{t.thanks}</p>
          </div>
        </section>

        <section className="qr-card">
          <div className="qr-copy">
            <div className="qr-label"><span className="pulse-dot" /> DIGITAL PARKING GUIDE</div>
            <h2>{t.scanTitle}</h2>
            <p>{t.scanText}</p>
            <div className="qr-actions">
              <button className="button button-cream" onClick={downloadQr}><Download size={16} /> {t.download}</button>
              <button className="button button-outline" onClick={copyUrl}><Copy size={16} /> {t.copy}</button>
            </div>
            <div className={`url-status ${isLocal ? "warning" : "success"}`}>
              {isLocal ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
              <span>{isLocal ? t.local : t.online}</span>
            </div>
            {notice && <div className="toast">{notice}</div>}
          </div>
          <div className="qr-frame">
            <div className="qr-inner">
              <QRCodeCanvas id="parking-qr" value={qrValue} size={190} level="H" includeMargin bgColor="#ffffff" fgColor="#24170f" />
            </div>
            <span className="qr-caption">SCAN ME</span>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-brand"><img src={chillAreaLogo} alt="" /> <span>CHILL AREA</span></div>
          <ChevronRight size={14} />
          <span>{t.footer}</span>
          <span className="footer-year">© {new Date().getFullYear()}</span>
        </footer>
      </main>
    </div>
  );
}