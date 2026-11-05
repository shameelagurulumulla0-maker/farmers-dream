/* Translate interface strings while keeping form values and user content intact. */
(() => {
  const catalog = window.FD_MESSAGES;
  let language = 'en';
  try { const saved = localStorage.getItem('fd-language'); if (['en','si','ta'].includes(saved)) language = saved; } catch {}
  const originals = new WeakMap();
  function translate(source) {
    if (language === 'en') return source;
    const leading = source.match(/^\s*/)[0], trailing = source.match(/\s*$/)[0], text = source.trim();
    if (catalog[text]) return leading + catalog[text][language] + trailing;
    let match = text.match(/^(\d+) registered members$/);
    if(match)return language==='si'?`ලියාපදිංචි සාමාජිකයන් ${match[1]}`:`பதிவுசெய்த உறுப்பினர்கள் ${match[1]}`;
    match = text.match(/^(\d+) opportunities( saved)?$/);
    if (match) return language === 'si' ? `${match[2]?'සුරැකි ':''}අවස්ථා ${match[1]}` : `${match[2]?'சேமித்த ':''}வாய்ப்புகள் ${match[1]}`;
    match = text.match(/^(\d+) enquiry drafts$/);
    if (match) return language === 'si' ? `විමසීම් කෙටුම්පත් ${match[1]}` : `விசாரணை வரைவுகள் ${match[1]}`;
    match = text.match(/^Listing as (.+) · (.+)$/);
    if (match) return language === 'si' ? `දැන්වීම පළ කරන්නේ ${match[1]} · ${translate(match[2])}` : `விளம்பரமிடுபவர் ${match[1]} · ${translate(match[2])}`;
    match = text.match(/^Local preview signed in as (.+)\. Not a verified account\.$/);
    if (match) return language === 'si' ? `${match[1]} ලෙස දේශීය පෙරදසුනට පිවිස ඇත. සත්‍යාපිත ගිණුමක් නොවේ.` : `${match[1]} ஆக உள்ளக முன்னோட்டத்தில் உள்நுழைந்துள்ளீர்கள். இது சரிபார்க்கப்பட்ட கணக்கு அல்ல.`;
    match = text.match(/^(Save|Unsave) (.+)$/);
    if (match) return `${language==='si'?(match[1]==='Save'?'සුරකින්න':'සුරැකුම ඉවත් කරන්න'):(match[1]==='Save'?'சேமி':'சேமிப்பை நீக்கு')} ${translate(match[2])}`;
    match = text.match(/^(.+) · (Farmer|Wholesale buyer|Transport provider|Fertilizer supplier|Land seller|Exporter|Equipment seller)$/);
    if (match) return `${match[1]} · ${translate(match[2])}`;
    return source;
  }
  window.fdTranslate = translate;
  function updateValue(node, key, get, set) {
    let record = originals.get(node); if (!record) { record = {}; originals.set(node, record); }
    const value = get();
    if (!record[key] || value !== record[key].rendered) record[key] = { source: value };
    const result = translate(record[key].source); record[key].rendered = result;
    if (result !== value) set(result);
  }
  function apply() {
    observer.disconnect();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('script,style,#language,[data-no-translate]')) continue;
      updateValue(node, 'text', () => node.nodeValue, value => { node.nodeValue = value; });
    }
    document.querySelectorAll('[placeholder],[aria-label]').forEach(element => {
      if (element.closest('[data-no-translate]')) return;
      for (const attr of ['placeholder','aria-label']) if (element.hasAttribute(attr)) updateValue(element, attr, () => element.getAttribute(attr), value => element.setAttribute(attr,value));
    });
    document.documentElement.lang = language;
    document.title = language === 'si' ? 'Farmers Dream — එක්ව සරු වෙමු' : language === 'ta' ? 'Farmers Dream — ஒன்றாக வளர்வோம்' : 'Farmers Dream — Grow together';
    observer.observe(document.body, { subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:['placeholder','aria-label'] });
  }
  const observer = new MutationObserver(apply);
  const selector = document.querySelector('#language'); selector.value = language;
  selector.addEventListener('change', () => {
    language = selector.value;
    try { localStorage.setItem('fd-language',language); } catch {}
    document.querySelectorAll('input,select,textarea').forEach(field => field.setCustomValidity(''));
    if (typeof render === 'function') render();
    apply();
  });
  document.addEventListener('invalid', event => {
    const field = event.target;
    if (!field.validity) return;
    const message = language==='si' ? 'කරුණාකර මෙම ක්ෂේත්‍රය නිවැරදිව සම්පූර්ණ කරන්න.' : language==='ta' ? 'இந்தப் புலத்தைச் சரியாக நிரப்பவும்.' : 'Please complete this field correctly.';
    field.setCustomValidity(message);
  }, true);
  document.addEventListener('input', event => event.target.setCustomValidity?.(''));
  document.addEventListener('change', event => event.target.setCustomValidity?.(''));
  apply();
})();
