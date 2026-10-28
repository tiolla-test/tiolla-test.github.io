import { D, W, full, fine, lang, scrollToEl, esc } from './env.js';

const DT = {
  ru: {
    rack: { field: 'Поле сканера', ph: 'Например LVL4181 и Enter', stickers: 'Наклейки на столе: нажмите, чтобы отсканировать', tube: 'Пробирка', cap: 'Крышка', foreign: 'Чужая пробирка',
      place: 'Разместить готовые', reset: 'Сначала', legend: ['Резерв', 'Нужен CSP', 'Готов', 'Размещён'],
      bad: 'Неверный штрихкод: должен начинаться с LVL или CSP', full: 'Серия заполнена. Нажмите «Разместить готовые»',
      lvlOk: function (p, c) { return p + ': ' + c + ' привязан. Теперь CSP с крышки'; }, ready: function (p) { return p + ': оба кода привязаны, статус «Готов»'; },
      needCsp: function (p) { return 'У ' + p + ' уже есть LVL. Сейчас нужен CSP с крышки'; }, needLvl: function (p) { return 'Для ' + p + ' сначала отсканируйте LVL с пробирки'; },
      dup: function (c, p) { return 'Код ' + c + ' уже привязан к ' + p + '. Повтор не принят, сканируйте дальше'; },
      placed: function (n) { return 'Размещено: ' + n; }, noReady: 'Готовых пробирок нет: у каждой нужны оба кода',
      stat: function (p, w, c) { return 'Серия на 12 позиций · следующая ячейка ' + p + (w ? ' · ждём ' + w : '') + ' · готов ' + c.ready + ' · размещён ' + c.placed; } },
    form: { bad: 'Врач вернул анкету: 1 замечание', ok: 'Замечаний нет', okSub: 'Анкету можно снова отправить врачу.', to: 'К полю', done: 'Замечание снято',
      com: 'Уточните год постановки диагноза, без этого нельзя оценить стаж.', where: 'Здоровье · год постановки диагноза', ph: 'например, 2019',
      S: [{ n: 'Основное', f: [['ФИО участника', 'Иванова Мария Петровна'], ['Дата рождения', '20.05.2010']] }, { n: 'Антропометрия', f: [['Рост, см', '152'], ['Вес, кг', '44']] },
          { n: 'Здоровье', f: [['Хронические заболевания', 'Сахарный диабет 1 типа'], ['Год постановки диагноза', ''], ['Госпитализации за 2 года', 'Нет']], com: 1 }, { n: 'История', f: [['Наследственность', 'Нет данных']] }] },
    ai: { label: 'Что говорит клиент', btn: 'Распознать', thr: 'порог 30 %',
      C: { 'Кофе': ['эспрессо', 'капучино', 'латте', 'раф', 'американо', 'кофе', 'флэт', 'мокко'], 'Чай': ['чай', 'улун', 'матча', 'зелен', 'черн', 'травян', 'пуэр'],
           'Оператор': ['оператор', 'человек', 'позов', 'специалист', 'менеджер', 'поговор', 'живой', 'живого'], 'Доставка': ['доставк', 'привез', 'курьер', 'адрес', 'заказ', 'доставьт'] },
      chips: ['айс латте', 'раф на кокосовом', 'позовите живого человека', 'привезите на адрес', 'что-нибудь бодрящее'],
      win: function (c, n) { return 'Категория <b>«' + c + '», ' + n + ' %</b>. Диалог идёт по ветке этой категории.'; },
      lose: 'Ни одна категория не набрала 30 %. Сработает поиск по <b>ключевым словам</b>, а если и он ничего не найдёт, ветка «Любой вопрос».' }
  },
  en: {
    rack: { field: 'Scanner field', ph: 'For example LVL4181 and Enter', stickers: 'Stickers on the bench: select one to scan', tube: 'Tube', cap: 'Cap', foreign: 'Someone else’s tube',
      place: 'Place ready ones', reset: 'Start over', legend: ['Reserve', 'CSP needed', 'Ready', 'Placed'],
      bad: 'Wrong barcode: must start with LVL or CSP', full: 'The series is full. Press “Place ready ones”',
      lvlOk: function (p, c) { return p + ': ' + c + ' linked. Now the CSP from the cap'; }, ready: function (p) { return p + ': both codes linked, status “Ready”'; },
      needCsp: function (p) { return p + ' already has an LVL. The CSP from the cap is needed now'; }, needLvl: function (p) { return 'For ' + p + ', scan the LVL on the tube first'; },
      dup: function (c, p) { return 'Code ' + c + ' is already linked to ' + p + '. Not accepted, keep scanning'; },
      placed: function (n) { return 'Placed: ' + n; }, noReady: 'No ready tubes: each one needs both codes',
      stat: function (p, w, c) { return 'A 12-position series · next cell ' + p + (w ? ' · waiting for ' + w : '') + ' · ready ' + c.ready + ' · placed ' + c.placed; } },
    form: { bad: 'The doctor returned the questionnaire: 1 comment', ok: 'No comments', okSub: 'The questionnaire can be sent to the doctor again.', to: 'Go to field', done: 'Comment cleared',
      com: 'Specify the year of diagnosis, without it the duration cannot be assessed.', where: 'Health · year of diagnosis', ph: 'for example, 2019',
      S: [{ n: 'Basic', f: [['Participant name', 'Maria Ivanova'], ['Date of birth', '20.05.2010']] }, { n: 'Body measurements', f: [['Height, cm', '152'], ['Weight, kg', '44']] },
          { n: 'Health', f: [['Chronic conditions', 'Type 1 diabetes'], ['Year of diagnosis', ''], ['Hospitalizations in 2 years', 'None']], com: 1 }, { n: 'History', f: [['Family history', 'No data']] }] },
    ai: { label: 'What the client says', btn: 'Recognize', thr: 'threshold 30 %',
      C: { 'Coffee': ['espresso', 'cappuccino', 'latte', 'raf', 'americano', 'coffee', 'flat', 'mocha'], 'Tea': ['tea', 'oolong', 'matcha', 'green', 'black', 'herbal', 'puer'],
           'Operator': ['operator', 'person', 'human', 'specialist', 'manager', 'talk', 'real', 'agent'], 'Delivery': ['deliver', 'courier', 'address', 'order', 'bring'] },
      chips: ['iced latte', 'raf with coconut milk', 'get me a real person', 'deliver to my address', 'something energizing'],
      win: function (c, n) { return 'Category <b>“' + c + '”, ' + n + ' %</b>. The dialogue follows this category’s branch.'; },
      lose: 'No category reached 30 %. <b>Keyword search</b> takes over, and if it finds nothing, the “Any question” branch.' }
  }
};

function toaster(el) {
  var t = 0;
  return function (msg, kind) {
    el.textContent = msg;
    el.className = 'lv-toast on' + (kind ? ' ' + kind : '');
    clearTimeout(t);
    t = setTimeout(function () { el.className = 'lv-toast'; }, 2400);
  };
}
function barcode(code) {
  var x = 2, bars = '';
  for (var i = 0; i < code.length; i++) {
    var c = code.charCodeAt(i);
    for (var j = 0; j < 3; j++) { var w = 1 + ((c >> j) & 1) + (j === 1 ? 1 : 0); bars += '<rect x="' + x + '" y="0" width="' + w + '" height="34"/>'; x += w + 1 + ((c >> (j + 3)) & 1); }
  }
  return '<svg viewBox="0 0 ' + (x + 2) + ' 34" preserveAspectRatio="none" aria-hidden="true">' + bars + '</svg>';
}
function demoRack(body, T) {
  var RX = 'ABCDEFGHI', SERIES = 12, st = [], cur = 0;
  var grid = '<span class="lab"></span>';
  for (var c = 1; c <= 9; c++) grid += '<span class="lab">' + c + '</span>';
  for (var i = 0; i < 81; i++) { if (i % 9 === 0) grid += '<span class="lab">' + RX[i / 9] + '</span>'; grid += '<div class="lv-c"><span class="p">' + RX[Math.floor(i / 9)] + (i % 9 + 1) + '</span><span class="c"></span></div>'; }
  var cols = ['#F1EFEA', '#FFF4CC', '#E6EDFF', '#E2F3EA'];
  body.innerHTML = '<div class="lv-wrap"><div><div class="lv-grid">' + grid + '</div><div class="lv-legend">' + T.legend.map(function (l, k) { return '<span><i style="background:' + cols[k] + '"></i>' + l + '</span>'; }).join('') + '</div></div>' +
    '<div><label class="lv-scan"><span class="mono">' + T.field + '</span><input type="text" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="' + T.ph + '"></label>' +
    '<p class="mono lv-k">' + T.stickers + '</p><div class="lv-stk"></div>' +
    '<div class="lv-btns"><button type="button" class="lv-btn" data-a="place">' + T.place + '</button><button type="button" class="lv-btn ghost" data-a="reset">' + T.reset + '</button></div>' +
    '<p class="lv-stat"></p></div></div><div class="lv-toast" role="status" aria-live="polite"></div>';
  var cells = body.querySelectorAll('.lv-c'), inp = body.querySelector('input'), stk = body.querySelector('.lv-stk'), stat = body.querySelector('.lv-stat');
  var toast = toaster(body.querySelector('.lv-toast'));
  var pos = function (k) { return RX[Math.floor(k / 9)] + (k % 9 + 1); };
  var lvl = function (k) { return 'LVL' + (4181 + k); }, csp = function (k) { return 'CSP' + (4781 + k); };
  function reset() { st = []; for (var k = 0; k < 81; k++) st.push({ s: k < SERIES ? 'res' : '', lvl: '', csp: '' }); cur = 0; render(); }
  function render() {
    var n = { ready: 0, placed: 0 };
    st.forEach(function (x, k) {
      cells[k].className = 'lv-c' + (x.s ? ' ' + x.s : '') + (k === cur && cur < SERIES ? ' now' : '');
      cells[k].lastChild.textContent = x.lvl ? x.lvl.slice(-4) : '';
      if (n[x.s] !== undefined) n[x.s]++;
    });
    var wait = cur < SERIES ? (st[cur].lvl ? 'CSP' : 'LVL') : '';
    stat.textContent = T.stat(cur < SERIES ? pos(cur) : '·', wait, n);
    var html = '';
    if (cur < SERIES) {
      var x = st[cur];
      html += '<button type="button" class="lv-s' + (x.lvl ? ' used' : '') + '" data-code="' + lvl(cur) + '">' + barcode(lvl(cur)) + '<span class="mono">' + lvl(cur) + '</span><small>' + T.tube + ' ' + pos(cur) + '</small></button>';
      html += '<button type="button" class="lv-s" data-code="' + csp(cur) + '">' + barcode(csp(cur)) + '<span class="mono">' + csp(cur) + '</span><small>' + T.cap + ' ' + pos(cur) + '</small></button>';
    }
    var first = -1;
    st.forEach(function (y, k) { if (y.lvl && first < 0) first = k; });
    if (first >= 0) html += '<button type="button" class="lv-s" data-code="' + st[first].lvl + '">' + barcode(st[first].lvl) + '<span class="mono">' + st[first].lvl + '</span><small>' + T.foreign + '</small></button>';
    stk.innerHTML = html;
  }
  function submit(code) {
    code = String(code || '').trim().toUpperCase();
    if (!code) return;
    inp.value = '';
    if (!/^(LVL|CSP)\d{3,}$/.test(code)) { toast(T.bad, 'err'); return; }
    var where = -1;
    st.forEach(function (y, k) { if (y.lvl === code || y.csp === code) where = k; });
    if (where >= 0) { toast(T.dup(code, pos(where)), 'err'); return; }
    if (cur >= SERIES) { toast(T.full); return; }
    var x = st[cur];
    if (code.indexOf('LVL') === 0) {
      if (x.lvl) { toast(T.needCsp(pos(cur)), 'err'); return; }
      x.lvl = code; x.s = 'need'; toast(T.lvlOk(pos(cur), code));
    } else {
      if (!x.lvl) { toast(T.needLvl(pos(cur)), 'err'); return; }
      x.csp = code; x.s = 'ready'; toast(T.ready(pos(cur)), 'ok'); cur++;
    }
    render();
  }
  function type(code) {
    if (!full) { inp.value = code; submit(code); return; }
    var k = 0;
    inp.value = '';
    (function step() { inp.value = code.slice(0, ++k); if (k < code.length) setTimeout(step, 22); else setTimeout(function () { submit(code); }, 90); })();
  }
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(inp.value); } });
  stk.addEventListener('click', function (e) { var b = e.target.closest('.lv-s'); if (b) { type(b.getAttribute('data-code')); if (fine) inp.focus({ preventScroll: true }); } });
  body.querySelector('[data-a="place"]').addEventListener('click', function () {
    var k = 0;
    st.forEach(function (y) { if (y.s === 'ready') { y.s = 'placed'; k++; } });
    toast(k ? T.placed(k) : T.noReady, k ? 'ok' : '');
    render();
  });
  body.querySelector('[data-a="reset"]').addEventListener('click', reset);
  reset();
}
function demoForm(body, T) {
  var S = JSON.parse(JSON.stringify(T.S)), open = 0, fixed = false;
  body.innerHTML = '<div class="lv-q"><div class="lv-nav"></div><div><div class="lv-ban"></div><div class="lv-f"></div></div></div>';
  var nav = body.querySelector('.lv-nav'), ban = body.querySelector('.lv-ban'), form = body.querySelector('.lv-f');
  function render(focus) {
    nav.innerHTML = S.map(function (s, i) {
      var bad = s.com !== undefined && !fixed;
      return '<button type="button" data-q="' + i + '" aria-current="' + (i === open) + '">' + esc(s.n) + '<span class="st' + (bad ? ' bad' : '') + '">' + (bad ? '1' : '✓') + '</span></button>';
    }).join('');
    form.innerHTML = S[open].f.map(function (f, j) {
      var flag = S[open].com === j && !fixed;
      return '<label>' + esc(f[0]) + '<input type="text" data-f="' + j + '" value="' + esc(f[1]) + '"' + (flag ? ' class="flag" placeholder="' + T.ph + '"' : '') + '></label>';
    }).join('');
    ban.className = 'lv-ban' + (fixed ? ' ok' : '');
    ban.innerHTML = fixed
      ? '<b>' + T.ok + '</b>' + T.okSub + '<div class="lv-com done"><div><small>' + T.done + '</small>' + T.com + '</div></div>'
      : '<b>' + T.bad + '</b><div class="lv-com"><div><small>' + T.where + '</small>' + T.com + '</div><button type="button" class="lv-btn ghost" data-to>' + T.to + '</button></div>';
    if (focus) {
      var t = form.querySelector('[data-f="1"]');
      t.classList.add('hl');
      t.focus({ preventScroll: true });
      scrollToEl(t, !full);
      setTimeout(function () { t.classList.remove('hl'); }, 1600);
    }
  }
  /* render() rebuilds the markup, so focus goes back to the matching new element */
  body.addEventListener('click', function (e) {
    var q = e.target.closest('[data-q]');
    if (q) { open = +q.getAttribute('data-q'); render(); nav.querySelector('[data-q="' + open + '"]').focus(); return; }
    if (e.target.closest('[data-to]')) { open = 2; render(true); }
  });
  body.addEventListener('input', function (e) {
    var inp = e.target.closest('input[data-f]');
    if (!inp) return;
    S[open].f[+inp.getAttribute('data-f')][1] = inp.value;
    if (open === 2 && inp.getAttribute('data-f') === '1' && /^\d{4}$/.test(inp.value.trim()) && !fixed) {
      fixed = true; render();
      var t = form.querySelector('[data-f="1"]');
      t.focus({ preventScroll: true });
      t.setSelectionRange(t.value.length, t.value.length);
    }
  });
  render();
}
function demoAI(body, T) {
  var names = Object.keys(T.C), THR = 30;
  body.innerHTML = '<div class="lv-ai"><input type="text" value="' + esc(T.chips[0]) + '" aria-label="' + T.label + '"><button type="button" class="lv-btn">' + T.btn + '</button></div>' +
    '<div class="lv-chips">' + T.chips.map(function (c) { return '<button type="button" class="lv-chip">' + esc(c) + '</button>'; }).join('') + '</div>' +
    '<div class="lv-bars">' + names.map(function (n) { return '<div class="lv-row" data-c="' + esc(n) + '"><span>' + esc(n) + '</span><div class="lv-tr"><div class="lv-fl"></div></div><span class="pc">0 %</span></div>'; }).join('') + '<div class="lv-thr"><span>' + T.thr + '</span></div></div><p class="lv-v"></p>';
  var inp = body.querySelector('input'), bars = body.querySelector('.lv-bars');
  function classify() {
    var words = inp.value.toLowerCase().replace(/ё/g, 'е').split(/[^a-zа-я]+/).filter(Boolean);
    var raw = names.map(function (n) {
      var s = 0;
      words.forEach(function (w) { T.C[n].forEach(function (k) { if (w === k || (k.length >= 4 && w.indexOf(k) === 0) || (w.length >= 4 && k.indexOf(w) === 0)) s += 1; }); });
      return s * 2 + 0.3;
    });
    var sum = raw.reduce(function (a, b) { return a + b; }, 0), pct = raw.map(function (r) { return Math.round(r / sum * 100); });
    var best = pct.indexOf(Math.max.apply(null, pct)), tr = bars.querySelector('.lv-tr');
    bars.querySelector('.lv-thr').style.left = (tr.offsetLeft + tr.offsetWidth * THR / 100) + 'px';
    names.forEach(function (n, i) {
      var row = bars.children[i];
      row.querySelector('.lv-fl').style.width = pct[i] + '%';
      row.querySelector('.pc').textContent = pct[i] + ' %';
      row.classList.toggle('win', i === best && pct[i] >= THR);
    });
    body.querySelector('.lv-v').innerHTML = pct[best] >= THR ? T.win(esc(names[best]), pct[best]) : T.lose;
  }
  body.querySelector('.lv-btn').addEventListener('click', classify);
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') classify(); });
  body.querySelector('.lv-chips').addEventListener('click', function (e) { var c = e.target.closest('.lv-chip'); if (c) { inp.value = c.textContent; classify(); } });
  classify();
}
export function initDemos(art) {
  var T = DT[art.getAttribute('lang') === 'en' ? 'en' : 'ru'];
  function init(box) {
    if (box.__on) return;
    box.__on = true;
    var body = box.querySelector('.live-b'), k = box.getAttribute('data-demo');
    if (k === 'rack') demoRack(body, T.rack);
    else if (k === 'form') demoForm(body, T.form);
    else if (k === 'ai') demoAI(body, T.ai);
  }
  art.querySelectorAll('[data-demo]').forEach(function (box) { if (!box.hidden) init(box); });
  var tabs = art.querySelectorAll('.live-tabs [data-tab]');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var k = t.getAttribute('data-tab');
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
      art.querySelectorAll('.c-live [data-demo]').forEach(function (b) { b.hidden = b.getAttribute('data-demo') !== k; if (!b.hidden) init(b); });
    });
  });
}

export function initReel() {
  var reel = D.querySelector('.reel');
  if (!reel) return;
  var stage = reel.querySelector('.reel-stage'), tabs = reel.querySelectorAll('[data-sc]'), go = reel.querySelector('.reel-go'), bar = reel.querySelector('.reel-prog i');
  var pauseBtn = reel.querySelector('.reel-pause');
  var hrefs = JSON.parse(go.getAttribute('data-hrefs')), idx = 0, timers = [], seen = true, pending = false, paused = false;
  var auto = full && !W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* scenes move only while the show plays; paused or in calm mode each scene is drawn in its final state */
  function moving() { return auto && !paused; }
  function clear() { timers.forEach(clearTimeout); timers = []; }
  function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
  var CUR = '<svg class="rs-cur" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.4 L17.5 13.4 Z" fill="#0F0F0E" stroke="#fff" stroke-width="1.4"/></svg>';
  function rack(T) {
    var g = '<span class="lab"></span>';
    for (var c = 1; c <= 9; c++) g += '<span class="lab">' + c + '</span>';
    for (var i = 0; i < 54; i++) { if (i % 9 === 0) g += '<span class="lab">' + 'ABCDEF'[i / 9] + '</span>'; g += '<div class="lv-c' + (i < 8 ? ' res' : '') + '"><span class="p">' + 'ABCDEF'[Math.floor(i / 9)] + (i % 9 + 1) + '</span><span class="c"></span></div>'; }
    stage.innerHTML = '<div class="rs rs-rack"><div><div class="rs-stk"></div><div class="rs-field"><small>' + T.field + '</small><span></span></div></div><div class="lv-grid">' + g + '</div><div class="rs-toast"></div></div>';
    var cells = stage.querySelectorAll('.lv-c'), stk = stage.querySelector('.rs-stk'), field = stage.querySelector('.rs-field span'), toast = stage.querySelector('.rs-toast');
    function sticker(code, label) { stk.innerHTML = barcode(code) + '<b>' + code + '</b><small>' + label + '</small><i class="beam"></i>'; stk.classList.remove('scan'); void stk.offsetWidth; stk.classList.add('scan'); }
    function say(t, k) { toast.textContent = t; toast.className = 'rs-toast on' + (k ? ' ' + k : ''); }
    var N = 4;
    if (!moving()) {
      for (var k = 0; k < N; k++) { cells[k].className = 'lv-c placed'; cells[k].lastChild.textContent = String(4181 + k); }
      sticker('CSP' + (4780 + N), T.cap + ' A' + N); field.textContent = 'CSP' + (4780 + N); say(T.placed(N), 'ok');
      return 0;
    }
    var t = 350;
    for (var j = 0; j < N; j++) (function (j) {
      var p = 'A' + (j + 1), L = 'LVL' + (4181 + j), C = 'CSP' + (4781 + j);
      at(t, function () { sticker(L, T.tube + ' ' + p); });
      at(t + 420, function () { field.textContent = L; cells[j].className = 'lv-c need'; cells[j].lastChild.textContent = L.slice(-4); say(T.lvlOk(p, L)); });
      at(t + 760, function () { sticker(C, T.cap + ' ' + p); });
      at(t + 1180, function () { field.textContent = C; cells[j].className = 'lv-c ready'; say(T.ready(p), 'ok'); });
      t += 1350;
    })(j);
    at(t + 250, function () { for (var k = 0; k < N; k++) cells[k].className = 'lv-c placed'; say(T.placed(N), 'ok'); });
    return t + 1700;
  }
  function form(T) {
    var S = T.S;
    stage.innerHTML = '<div class="rs rs-form"><div class="rs-nav">' + S.map(function (s, i) { return '<span' + (i === 2 ? ' class="on"' : '') + '>' + esc(s.n) + '<i' + (s.com !== undefined ? ' class="bad">1' : '>✓') + '</i></span>'; }).join('') + '</div>' +
      '<div><div class="rs-ban"><b>' + T.bad + '</b><div class="rs-com"><span>' + T.com + '</span><span class="rs-to">' + T.to + '</span></div></div>' +
      '<label class="rs-lbl">' + esc(S[2].f[0][0]) + '<span class="rs-in">' + esc(S[2].f[0][1]) + '</span></label>' +
      '<label class="rs-lbl">' + esc(S[2].f[1][0]) + '<span class="rs-in flag"></span></label></div>' + CUR + '</div>';
    var sc = stage.querySelector('.rs'), cur = stage.querySelector('.rs-cur'), btn = stage.querySelector('.rs-to'), fld = stage.querySelector('.rs-in.flag'), ban = stage.querySelector('.rs-ban'), badge = stage.querySelector('.rs-nav i.bad');
    function place(el, dx, dy) { var r = el.getBoundingClientRect(), s = sc.getBoundingClientRect(); cur.style.transform = 'translate(' + (r.left - s.left + dx) + 'px,' + (r.top - s.top + dy) + 'px)'; }
    function done() { fld.classList.remove('flag', 'hl'); fld.textContent = '2019'; ban.className = 'rs-ban ok'; ban.innerHTML = '<b>' + T.ok + '</b><div class="rs-com"><span>' + T.done + ': ' + T.com + '</span></div>'; badge.className = ''; badge.textContent = '✓'; }
    if (!moving()) { done(); cur.style.display = 'none'; return 0; }
    var s0 = sc.getBoundingClientRect();
    cur.style.transform = 'translate(' + (s0.width - 40) + 'px,' + (s0.height - 40) + 'px)';
    at(450, function () { place(btn, btn.offsetWidth * 0.55, btn.offsetHeight * 0.55); });
    at(1450, function () { btn.classList.add('press'); });
    at(1750, function () { btn.classList.remove('press'); fld.classList.add('hl'); place(fld, 40, 16); });
    var t = 2700, txt = '2019';
    for (var i = 1; i <= 4; i++) (function (i) { at(t + i * 160, function () { fld.textContent = txt.slice(0, i); }); })(i);
    at(t + 900, done);
    return t + 3100;
  }
  function ai(T) {
    var names = Object.keys(T.C), phrase = T.chips[0];
    stage.innerHTML = '<div class="rs rs-ai"><div class="rs-q"><span class="rs-in"><span class="tx"></span><i class="caret"></i></span><span class="rs-btn">' + T.btn + '</span></div>' +
      '<div class="lv-bars">' + names.map(function (n) { return '<div class="lv-row"><span>' + esc(n) + '</span><div class="lv-tr"><div class="lv-fl"></div></div><span class="pc">0 %</span></div>'; }).join('') + '<div class="lv-thr"><span>' + T.thr + '</span></div></div><p class="lv-v">&nbsp;</p></div>';
    var tx = stage.querySelector('.tx'), bars = stage.querySelector('.lv-bars'), v = stage.querySelector('.lv-v');
    function result() {
      var words = phrase.toLowerCase().replace(/ё/g, 'е').split(/[^a-zа-я]+/).filter(Boolean);
      var raw = names.map(function (n) { var s = 0; words.forEach(function (w) { T.C[n].forEach(function (k) { if (w === k || (k.length >= 4 && w.indexOf(k) === 0) || (w.length >= 4 && k.indexOf(w) === 0)) s++; }); }); return s * 2 + 0.3; });
      var sum = raw.reduce(function (a, b) { return a + b; }, 0), pct = raw.map(function (r) { return Math.round(r / sum * 100); }), best = pct.indexOf(Math.max.apply(null, pct));
      var tr = bars.querySelector('.lv-tr');
      bars.querySelector('.lv-thr').style.left = (tr.offsetLeft + tr.offsetWidth * 0.3) + 'px';
      names.forEach(function (n, i) { var row = bars.children[i]; row.querySelector('.lv-fl').style.width = pct[i] + '%'; row.querySelector('.pc').textContent = pct[i] + ' %'; row.classList.toggle('win', i === best); });
      v.innerHTML = T.win(esc(names[best]), pct[best]);
    }
    if (!moving()) { tx.textContent = phrase; result(); return 0; }
    var t = 400;
    for (var i = 1; i <= phrase.length; i++) (function (i) { at(t + i * 85, function () { tx.textContent = phrase.slice(0, i); }); })(i);
    t += phrase.length * 85 + 450;
    at(t, function () { var b = stage.querySelector('.rs-btn'); b.style.background = 'var(--accent)'; b.style.color = 'var(--ink)'; result(); });
    return t + 3000;
  }
  function show(i) {
    clear();
    idx = i;
    tabs.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i ? 'true' : 'false'); });
    go.setAttribute('href', hrefs[i]);
    var T = DT[lang];
    var dur = [function () { return rack(T.rack); }, function () { return form(T.form); }, function () { return ai(T.ai); }][i]();
    bar.style.transition = 'none';
    bar.style.transform = 'scaleX(' + (moving() ? 0 : 1) + ')';
    if (!moving()) return;
    void bar.offsetWidth;
    bar.style.transition = 'transform ' + dur + 'ms linear';
    bar.style.transform = 'scaleX(1)';
    at(dur + 500, function () { if (seen) show((idx + 1) % 3); else pending = true; });
  }
  tabs.forEach(function (b, j) { b.addEventListener('click', function () { show(j); }); });
  var PAUSE = { ru: ['Остановить показ', 'Запустить показ'], en: ['Pause', 'Play'] }[lang];
  function syncPause() {
    pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
    pauseBtn.setAttribute('aria-label', PAUSE[paused ? 1 : 0]);
    pauseBtn.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true">' + (paused ? '<path d="M3 1.5 L10.5 6 L3 10.5 Z"/>' : '<rect x="2" y="1.5" width="3" height="9" rx=".5"/><rect x="7" y="1.5" width="3" height="9" rx=".5"/>') + '</svg>';
  }
  if (auto) {
    pauseBtn.hidden = false;
    pauseBtn.addEventListener('click', function () { paused = !paused; pending = false; syncPause(); show(idx); });
    syncPause();
  }
  if ('IntersectionObserver' in W) new IntersectionObserver(function (es) {
    seen = es[0].isIntersecting;
    if (seen && pending && !paused) { pending = false; show((idx + 1) % 3); }
  }).observe(reel);
  show(0);
}
