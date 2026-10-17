/* === STARFIELD === */
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

let stars = [];
let shootingStars = [];
let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function createStars() {
  stars = [];
  const count = Math.floor((W * H) / 4000);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random(),
      alphaDir: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.005 + 0.001),
      gold: Math.random() < 0.15
    });
  }
}

function spawnShootingStar() {
  if (Math.random() < 0.004) {
    shootingStars.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.4,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 6 + 4,
      alpha: 1,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, W, H);

  // Draw regular stars
  for (const s of stars) {
    s.alpha += s.alphaDir;
    if (s.alpha > 1)  { s.alpha = 1;  s.alphaDir *= -1; }
    if (s.alpha < 0)  { s.alpha = 0;  s.alphaDir *= -1; }

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    if (s.gold) {
      ctx.fillStyle = `rgba(240, 200, 80, ${s.alpha})`;
    } else {
      ctx.fillStyle = `rgba(200, 220, 255, ${s.alpha})`;
    }
    ctx.fill();

    // Larger stars get a glow cross
    if (s.r > 1.2) {
      const glow = s.gold ? `rgba(240,200,80,${s.alpha * 0.3})` : `rgba(200,220,255,${s.alpha * 0.3})`;
      ctx.beginPath();
      ctx.moveTo(s.x - s.r * 3, s.y);
      ctx.lineTo(s.x + s.r * 3, s.y);
      ctx.strokeStyle = glow;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - s.r * 3);
      ctx.lineTo(s.x, s.y + s.r * 3);
      ctx.stroke();
    }
  }

  // Draw shooting stars
  spawnShootingStar();
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    const ex = s.x + Math.cos(s.angle) * s.len;
    const ey = s.y + Math.sin(s.angle) * s.len;

    const grad = ctx.createLinearGradient(s.x, s.y, ex, ey);
    grad.addColorStop(0, `rgba(255, 248, 200, ${s.alpha})`);
    grad.addColorStop(1, 'rgba(255, 248, 200, 0)');

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(ex, ey);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    s.x += Math.cos(s.angle) * s.speed;
    s.y += Math.sin(s.angle) * s.speed;
    s.alpha -= 0.02;

    if (s.alpha <= 0 || s.x > W || s.y > H) {
      shootingStars.splice(i, 1);
    }
  }

  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', () => { resize(); createStars(); });
resize();
createStars();
drawStars();


/* === LANG TOGGLE === */
const translations = {
  pt: {
    'nav-logo': '✦ VEIL',
    'hero-eyebrow': 'Um jogo de aventura em pixel art',
    'hero-tagline': 'Quando dois universos se sobrepõem, nenhum mundo permanece intacto.',
    'btn-story': 'Descobrir a História',
    'btn-chars': 'Conhecer os Personagens',
    'section-tag-story': '✦ A História',
    'story-title': 'Um mundo em colapso',
    'story-card1-title': 'Cidade Estrela',
    'story-card1-text': 'Em um vilarejo pacato banhado pela luz das estrelas, Lumi viveu uma vida simples ao lado de sua irmã Aya. Mas a paz tem um preço que nem sempre escolhemos pagar.',
    'story-card2-title': 'O Rapto',
    'story-card2-text': 'Quando forças sombrias capturam Aya, Lumi pega suas espadas e parte em uma jornada que vai além do que ele jamais imaginou. O que parecia um resgate simples revela segredos que abalaram a própria estrutura da realidade.',
    'story-card3-title': 'O Anti-Universo',
    'story-card3-text': 'Existe uma teoria proibida: um espelho da existência, um anti-universo escondido além do véu da realidade. Alguém quer alcançá-lo — e não importa o custo.',
    'lore-world-label': 'Nosso Universo',
    'lore-antiworld-label': 'Anti-Universo',
    'rift-label': 'Sobreposição',
    'lore-text': 'Os experimentos foram longe demais. O véu entre os universos se rasgou — e agora cidades inteiras existem em dois lugares ao mesmo tempo, presas entre espaços-tempo sobrepostos. A realidade não é mais o que era.',
    'section-tag-chars': '✦ Personagens',
    'chars-title': 'Vozes de um mundo partido',
    'lumi-tag': 'Protagonista',
    'lumi-desc': 'Um jovem guerreiro de Cidade Estrela. Combatente de espadas habilidoso, mas ainda inexperiente diante do peso que o destino lhe impôs. Sua determinação em salvar Aya o levará a lugares além da compreensão.',
    'trait-fighter': 'Lutador',
    'trait-brave': 'Corajoso',
    'trait-loyal': 'Leal',
    'aya-tag': 'Mistério',
    'aya-desc': 'A irmã de Lumi. Sua captura foi o estopim de tudo — mas será que é apenas uma vítima? Sua conexão com os eventos do anti-universo pode ser mais profunda do que qualquer um imagina.',
    'trait-mystery': '?????',
    'trait-captured': 'Capturada',
    'section-tag-world': '✦ O Mundo',
    'world-title': 'Lugares que existem entre dois tempos',
    'world-place1': 'Cidade Estrela',
    'world-place1-desc': 'O lar de Lumi e Aya. Um vilarejo tranquilo sob um céu eternamente estrelado — ou assim era, antes que a sobreposição chegasse.',
    'world-place2': 'Zonas Sobrepostas',
    'world-place2-desc': 'Cidades presas entre os dois universos. Nem aqui, nem lá. Habitadas por ecos de ambos os mundos — criaturas e fenômenos impossíveis.',
    'world-place3': 'O Anti-Universo',
    'status-intact': 'Intacta',
    'status-overlap': 'Sobreposta',
    'status-unknown': 'Desconhecido',
    'section-tag-notify': '✦ Em Desenvolvimento',
    'cta-title': 'O mundo ainda está sendo construído',
    'cta-text': 'Veil: Collapse está em desenvolvimento. Deixe seu e-mail para ser notificado quando o jogo for lançado.',
    'email-placeholder': 'seu@email.com',
    'btn-notify': 'Me avise!',
    'notify-success': '✦ Obrigado! Você será notificado quando o mundo renascer.',
    'footer-sub': 'Um jogo independente em desenvolvimento',
    'footer-copy': '© 2025 · Feito com ✦ e muitas noites estreladas',
  },
  en: {
    'nav-logo': '✦ VEIL',
    'hero-eyebrow': 'A pixel art adventure game',
    'hero-tagline': 'When two universes overlap, no world remains intact.',
    'btn-story': 'Discover the Story',
    'btn-chars': 'Meet the Characters',
    'section-tag-story': '✦ The Story',
    'story-title': 'A world in collapse',
    'story-card1-title': 'Star City',
    'story-card1-text': 'In a quiet village bathed in starlight, Lumi lived a simple life alongside his sister Aya. But peace has a price we don\'t always choose to pay.',
    'story-card2-title': 'The Abduction',
    'story-card2-text': 'When dark forces capture Aya, Lumi takes up his swords and sets off on a journey beyond anything he imagined. What seemed like a simple rescue reveals secrets that shake the very fabric of reality.',
    'story-card3-title': 'The Anti-Universe',
    'story-card3-text': 'There is a forbidden theory: a mirror of existence, an anti-universe hidden beyond the veil of reality. Someone wants to reach it — whatever the cost.',
    'lore-world-label': 'Our Universe',
    'lore-antiworld-label': 'Anti-Universe',
    'rift-label': 'Overlap',
    'lore-text': 'The experiments went too far. The veil between universes tore — and now entire cities exist in two places at once, trapped between overlapping space-times. Reality is no longer what it was.',
    'section-tag-chars': '✦ Characters',
    'chars-title': 'Voices of a shattered world',
    'lumi-tag': 'Protagonist',
    'lumi-desc': 'A young warrior from Star City. A skilled swordsman, but still inexperienced in the face of the weight fate has placed upon him. His determination to save Aya will take him to places beyond comprehension.',
    'trait-fighter': 'Fighter',
    'trait-brave': 'Brave',
    'trait-loyal': 'Loyal',
    'aya-tag': 'Mystery',
    'aya-desc': 'Lumi\'s sister. Her capture was the trigger for everything — but is she merely a victim? Her connection to the anti-universe events may run deeper than anyone imagines.',
    'trait-mystery': '?????',
    'trait-captured': 'Captured',
    'section-tag-world': '✦ The World',
    'world-title': 'Places that exist between two timelines',
    'world-place1': 'Star City',
    'world-place1-desc': 'Lumi and Aya\'s home. A peaceful village under an eternally starlit sky — or so it was, before the overlap arrived.',
    'world-place2': 'Overlap Zones',
    'world-place2-desc': 'Cities trapped between two universes. Neither here nor there. Inhabited by echoes of both worlds — impossible creatures and phenomena.',
    'world-place3': 'The Anti-Universe',
    'status-intact': 'Intact',
    'status-overlap': 'Overlapped',
    'status-unknown': 'Unknown',
    'section-tag-notify': '✦ In Development',
    'cta-title': 'The world is still being built',
    'cta-text': 'Veil: Collapse is in development. Leave your email to be notified when the game launches.',
    'email-placeholder': 'your@email.com',
    'btn-notify': 'Notify me!',
    'notify-success': '✦ Thank you! You\'ll be notified when the world is reborn.',
    'footer-sub': 'An indie game in development',
    'footer-copy': '© 2025 · Made with ✦ and many starlit nights',
  }
};

let currentLang = 'pt';

function applyLang(lang) {
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.getElementById('langBtn').textContent = lang === 'pt' ? 'EN' : 'PT';
}

function toggleLang() {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  applyLang(currentLang);
}


/* === NEWSLETTER FORM === */
function submitEmail(e) {
  e.preventDefault();
  const input = document.getElementById('emailInput');
  const success = document.getElementById('notifySuccess');
  if (!input.value) return;
  input.style.display = 'none';
  e.target.querySelector('button').style.display = 'none';
  success.style.display = 'block';
}


/* === SCROLL ANIMATIONS === */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.story-card, .char-card, .world-card, .lore-block').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
