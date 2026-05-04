import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simple translations for demo purposes
const resources = {
  en: {
    translation: {
      hero: {
        tag: "Premium Medical Concierge",
        title1: "World-Class Healthcare,",
        title2: "Beyond Borders.",
        subtitle: "MediTrip connects you with India's most prestigious hospitals and elite surgeons. Experience premium care with a dedicated medical concierge.",
        jci_title: "JCI Accredited",
        jci_subtitle: "Highest Global Standard"
      },
      nav: {
        treatments: "Treatments",
        hospitals: "Hospitals",
        doctors: "Doctors",
        packages: "Packages",
        why_india: "Why India",
        blog: "Journal"
      }
    }
  },
  ar: {
    translation: {
      hero: {
        tag: "كونسيرج طبي متميز",
        title1: "رعاية صحية عالمية المستوى،",
        title2: "بلا حدود.",
        subtitle: "MediTrip يوصلك بأرقى المستشفيات في الهند ونخبة الجراحين. استمتع برعاية متميزة مع كونسيرج طبي مخصص.",
        jci_title: "معتمد من JCI",
        jci_subtitle: "أعلى المعايير العالمية"
      },
      nav: {
        treatments: "العلاجات",
        hospitals: "المستشفيات",
        doctors: "الأطباء",
        packages: "باقات",
        why_india: "لماذا الهند؟",
        blog: "المدونة"
      }
    }
  },
  hi: {
    translation: {
      hero: {
        tag: "प्रीमियम मेडिकल कंसीयज",
        title1: "विश्व स्तरीय स्वास्थ्य सेवा,",
        title2: "सीमाओं के परे।",
        subtitle: "MediTrip आपको भारत के सबसे प्रतिष्ठित अस्पतालों और विशिष्ट सर्जनों से जोड़ता है। एक समर्पित चिकित्सा कंसीयज के साथ प्रीमियम देखभाल का अनुभव करें।" ,
        jci_title: "JCI मान्यता प्राप्त",
        jci_subtitle: "उच्चतम वैश्विक मानक"
      },
      nav: {
        treatments: "इलाज",
        hospitals: "अस्पताल",
        doctors: "डॉक्टर",
        packages: "पैकेज",
        why_india: "भारत ही क्यों?",
        blog: "जर्नल"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
