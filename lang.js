// lang.js - Simple client-side i18n for Wedding Hub (updated with service names)
// Save as lang.js in project root.

(function () {
  const translations = {
    en: {
      hero_title: 'Your Dream Wedding Starts Here',
      hero_subtitle: 'Find the right vendors, hassle-free',
      search_service_placeholder: 'Search Service (DJ, Caterer, Photographer...)',
      search_location_placeholder: 'City or Location (Worldwide)',
      search_by_service: 'Search by Service',
      search_by_location: 'Search by Location',
      find_vendors: 'Find Vendors',
      follow_us: 'Follow us on',
      about_heading: 'About Wedding Hub',
      services_heading: 'Wedding Services',
      services_sub: 'Choose a service to find the best vendors',

      // services
      service_tent: 'Tent & Decoration',
      service_dj: 'DJ & Sound',
      service_caterers: 'Caterers',
      service_photography: 'Photography',
      service_makeup: 'Makeup Artist',
      service_pandit: 'Pandit',
      service_dhol: 'Dholwale',
      service_band: 'Band / Live Music',
      service_godi: 'Godi',
      service_luxcar: 'Luxury Car',
      service_banquet: 'Banquet Hall',
      service_ledwall: 'LED Wall',
      service_home_deco: 'Home Decoration',
      service_entry: 'Dulha-Dulhan Entry',
      service_mehndi: 'Mehndi',
      service_light_deco: 'Light Decoration',
      service_flower_deco: 'Flower Decoration',

      footer_tagline: 'शादी से जुड़ी हर सेवा – एक ही प्लेटफॉर्म पर'
    },
    hi: {
      hero_title: 'आपकी सपनों की शादी यहीं शुरू होती है',
      hero_subtitle: 'सही vendors पाएं, बिना झंझट के',
      search_service_placeholder: 'सर्विस खोजें (DJ, Caterer, Photographer...)',
      search_location_placeholder: 'शहर या लोकेशन (Worldwide)',
      search_by_service: 'सर्विस से खोजें',
      search_by_location: 'लोकेशन से खोजें',
      find_vendors: 'वेंडर खोजें',
      follow_us: 'हमें फ़ॉलो करें',
      about_heading: 'Wedding Hub के बारे में',
      services_heading: 'वेडिंग सर्विसेज',
      services_sub: 'सबसे अच्छे वेंडर चुनें',

      // services (Hindi)
      service_tent: 'टेंट और डेकोरेशन',
      service_dj: 'डीजे और साउंड',
      service_caterers: 'कैटरर्स',
      service_photography: 'फोटोग्राफ़ी',
      service_makeup: 'मेकअप आर्टिस्ट',
      service_pandit: 'पंडित',
      service_dhol: 'ढोल वाले',
      service_band: 'बैंड / लाइव म्यूजिक',
      service_godi: 'गोदी',
      service_luxcar: 'लक्ज़री कार',
      service_banquet: 'बैंकेट हॉल',
      service_ledwall: 'एलईडी वॉल',
      service_home_deco: 'होम डेकोरेशन',
      service_entry: 'दूल्हा-दुल्हन एंट्री',
      service_mehndi: 'मेहंदी',
      service_light_deco: 'लाइट डेकोरेशन',
      service_flower_deco: 'फूलों की सजावट',

      footer_tagline: 'शादी से जुड़ी हर सेवा – एक ही प्लेटफॉर्म पर'
    },
    hinglish: {
      hero_title: 'Aapki Dream Shaadi Yahin Start Hoti Hai',
      hero_subtitle: 'Best vendors milenge, tension-free',
      search_service_placeholder: 'Service dhoondo (DJ, Caterer, Photographer...)',
      search_location_placeholder: 'City ya Location (Worldwide)',
      search_by_service: 'Search Service',
      search_by_location: 'Search Location',
      find_vendors: 'Find Vendors',
      follow_us: 'Follow karo',
      about_heading: 'About Wedding Hub',
      services_heading: 'Wedding Services',
      services_sub: 'Choose a service to find best vendors',

      // services (hinglish)
      service_tent: 'Tent & Decoration',
      service_dj: 'DJ & Sound',
      service_caterers: 'Caterers',
      service_photography: 'Photography',
      service_makeup: 'Makeup Artist',
      service_pandit: 'Pandit',
      service_dhol: 'Dholwale',
      service_band: 'Band / Live Music',
      service_godi: 'Godi',
      service_luxcar: 'Luxury Car',
      service_banquet: 'Banquet Hall',
      service_ledwall: 'LED Wall',
      service_home_deco: 'Home Decoration',
      service_entry: 'Dulha-Dulhan Entry',
      service_mehndi: 'Mehndi',
      service_light_deco: 'Light Decoration',
      service_flower_deco: 'Flower Decoration',

      footer_tagline: 'Shaadi se judi har service — ek hi platform par'
    },
    gujarati: {
      hero_title: 'તમા���ી સપનાની લગ્ન અહીં શરૂ થાય છે',
      hero_subtitle: 'યોગ્ય vendors મેળવો, સરળ રીતે',
      search_service_placeholder: 'Service શોધો (DJ, Caterer, Photographer...)',
      search_location_placeholder: 'શહેર અથવા લોકેશન (Worldwide)',
      search_by_service: 'Service થી શોધો',
      search_by_location: 'Location થી શોધો',
      find_vendors: 'Vendors શોધો',
      follow_us: 'અમને ફોલો કરો',
      about_heading: 'Wedding Hub વિશે',
      services_heading: 'વેડિંગ સર્વિસીસ',
      services_sub: 'શ્રેષ્ઠ વેન્ડર્સ પસંદ કરો',

      // services (gujarati)
      service_tent: 'ટેન્ટ અને ડેકોરેશન',
      service_dj: 'ડીઝે અને સાઉન્ડ',
      service_caterers: 'કેટરર્સ',
      service_photography: 'ફોટોગ્રાફી',
      service_makeup: 'મેકઅપ આર્ટિસ્ટ',
      service_pandit: 'પંડિત',
      service_dhol: 'ઢોલવાળા',
      service_band: 'બેન્ડ / લાઇવ મ્યુઝિક',
      service_godi: 'ગોડી',
      service_luxcar: 'લક્ઝરી કાર',
      service_banquet: 'બાનક્વેટ હોલ',
      service_ledwall: 'LED વોલ',
      service_home_deco: 'હોમ ડેકોરેશન',
      service_entry: 'દુલ્હા-દુલ્હન એન્ટ્રી',
      service_mehndi: 'મેંડિ',
      service_light_deco: 'લાઈટ ડેકોરેશન',
      service_flower_deco: 'ફૂલનું ડેકોરેશન',

      footer_tagline: 'લગ્ન સંબંધિત તમામ સર્વિસ—એક જ પ્લેટફોર્મ પર'
    },
    marathi: {
      hero_title: 'तुमच्या स्वप्नांच्या लग्नाची सुरुवात इथे होते',
      hero_subtitle: 'योग्य vendors शोधा, सोप्या पद्धतीने',
      search_service_placeholder: 'Service शोधा (DJ, Caterer, Photographer...)',
      search_location_placeholder: 'शहर किंवा स्थान (Worldwide)',
      search_by_service: 'Service ने शोधा',
      search_by_location: 'Location ने शोधा',
      find_vendors: 'Vendors शोधा',
      follow_us: 'आमचे फॉलो करा',
      about_heading: 'Wedding Hub बद्दल',
      services_heading: 'वेडिंग सेवा',
      services_sub: 'सर्वोत्तम वेंडर्स निवडा',

      // services (marathi)
      service_tent: 'टेंट आणि डेकोरेशन',
      service_dj: 'डीजे आणि साऊंड',
      service_caterers: 'केटरर्स',
      service_photography: 'फोटोग्राफी',
      service_makeup: 'मेकअप आर्टिस्ट',
      service_pandit: 'पंडित',
      service_dhol: 'ढोलवाले',
      service_band: 'बँड / लाईव्ह म्युझिक',
      service_godi: 'गोदी',
      service_luxcar: 'लग्झरी कार',
      service_banquet: 'बँकेट हॉल',
      service_ledwall: 'LED वॉल',
      service_home_deco: 'होम डेकोरेशन',
      service_entry: 'दूल्हा-दुल्हन एंट्री',
      service_mehndi: 'मेहंदी',
      service_light_deco: 'लाइट डेकोरेशन',
      service_flower_deco: 'फुलांची सजावट',

      footer_tagline: 'लग्नाशी संबंधित सर्व सेवा — एका प्लॅटफॉर्मवर'
    },
    rajasthani: {
      hero_title: 'थारी सपना री शादी याँ सै शरू होवे',
      hero_subtitle: 'सही vendors मिलबे, बिना झंझट',
      search_service_placeholder: 'Service खोजो (DJ, Caterer, Photographer...)',
      search_location_placeholder: 'शहर या लोकेशन (Worldwide)',
      search_by_service: 'Service सै खोजो',
      search_by_location: 'Location सै खोजो',
      find_vendors: 'Vendors खोजो',
      follow_us: 'हमें फॉलो करो',
      about_heading: 'Wedding Hub बारे में',
      services_heading: 'Wedding Services',
      services_sub: 'बेस्ट वेंडर्स पाओ',

      // services (rajasthani - approximate)
      service_tent: 'टेंट और डेकोरेशन',
      service_dj: 'डीजे और साउंड',
      service_caterers: 'कैटरर्स',
      service_photography: 'फोटोग्राफी',
      service_makeup: 'मेकअप आर्टिस्ट',
      service_pandit: 'पंडित',
      service_dhol: 'ढोल वाले',
      service_band: 'बैंड / लाइव म्यूजिक',
      service_godi: 'गोदी',
      service_luxcar: 'लक्ज़री कार',
      service_banquet: 'बैंकेट हॉल',
      service_ledwall: 'LED वॉल',
      service_home_deco: 'होम डेकोरेशन',
      service_entry: 'दूल्हा-दुल्हन एंट्री',
      service_mehndi: 'मेहंदी',
      service_light_deco: 'लाइट डेकोरेशन',
      service_flower_deco: 'फूलों की सजावट',

      footer_tagline: 'शादी से जुड़ी हर सेवा — एक ही ��्लेटफॉर्म'
    }
  };

  function applyLanguage(lang) {
    if (!translations[lang]) lang = 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      const text = translations[lang][key] || translations['en'][key] || '';
      if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && 'placeholder' in el) {
        el.placeholder = text;
      } else {
        // for service cards, span is inside card; replace its inner span text if present
        const span = el.querySelector('span');
        if (span) span.textContent = text;
        else el.textContent = text;
      }
    });

    try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
  }

  function initLang() {
    let saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) { saved = null; }
    const defaultLang = saved || 'en';
    applyLanguage(defaultLang);

    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      const lang = btn.getAttribute('data-lang');
      if (!lang) return;
      applyLanguage(lang);
    });

    window.setAppLanguage = applyLanguage;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }
})();