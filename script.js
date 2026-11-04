document.addEventListener("DOMContentLoaded", () => {

  /* ===== 상단 안내 문구 슬라이드 ===== */
  const messages = [
    "free shipping for orders over 30€",
    "free samples with every order",
    "refill your favorites and save 10%"
  ];
  const tickerText = document.querySelector(".ticker-text");
  let tIndex = 0;
  const showMessage = (dir) => {
    tIndex = (tIndex + dir + messages.length) % messages.length;
    tickerText.classList.add("fade");
    setTimeout(() => {
      tickerText.textContent = messages[tIndex];
      tickerText.classList.remove("fade");
    }, 250);
  };
  document.querySelectorAll(".ticker-btn").forEach((btn) =>
    btn.addEventListener("click", () => showMessage(Number(btn.dataset.dir)))
  );

  /* ===== 모바일 메뉴 ===== */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", false);
    })
  );

  /* ===== 1단락: 히어로 슬라이드 ===== */
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-controls .dot");
  const pauseBtn = document.getElementById("heroPause");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hIndex = 0;
  let playing = !reduceMotion;
  let timer;

  const goHero = (i) => {
    hIndex = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === hIndex));
    dots.forEach((d, n) => d.classList.toggle("is-active", n === hIndex));
  };
  const startAuto = () => {
    clearInterval(timer);
    if (playing) timer = setInterval(() => goHero(hIndex + 1), 5000);
  };
  dots.forEach((d, n) => d.addEventListener("click", () => { goHero(n); startAuto(); }));
  pauseBtn.addEventListener("click", () => {
    playing = !playing;
    pauseBtn.textContent = playing ? "❚❚" : "▶";
    pauseBtn.setAttribute("aria-label", playing ? "일시정지" : "재생");
    startAuto();
  });

  // 히어로 영역 터치 스와이프
  const hero = document.querySelector("[data-hero]");
  let hx = null;
  hero.addEventListener("touchstart", (e) => (hx = e.touches[0].clientX), { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (hx === null) return;
    const diff = e.changedTouches[0].clientX - hx;
    if (Math.abs(diff) > 50) { goHero(hIndex + (diff < 0 ? 1 : -1)); startAuto(); }
    hx = null;
  });
  startAuto();

  /* ===== 2단락: 베스트셀러 슬라이드 ===== */
  const track = document.getElementById("track");
  const bar = document.getElementById("progressBar");
  const cards = track.children;
  let pIndex = 0;

  const perView = () => (window.innerWidth <= 900 ? 2 : 4);
  const maxIndex = () => Math.max(0, cards.length - perView());

  const updateTrack = () => {
    pIndex = Math.min(Math.max(pIndex, 0), maxIndex());
    const cardW = cards[0].getBoundingClientRect().width;
    track.style.transform = `translateX(${-pIndex * cardW}px)`;
    const total = maxIndex() + 1;
    bar.style.width = `${100 / total}%`;
    bar.style.left = `${(100 / total) * pIndex}%`;
  };

  // 마우스 드래그 + 터치 스와이프
  let startX = null, moved = 0;
  const onStart = (x) => { startX = x; moved = 0; track.classList.add("dragging"); };
  const onMove = (x) => {
    if (startX === null) return;
    moved = x - startX;
    const cardW = cards[0].getBoundingClientRect().width;
    track.style.transform = `translateX(${-pIndex * cardW + moved}px)`;
  };
  const onEnd = () => {
    if (startX === null) return;
    track.classList.remove("dragging");
    if (Math.abs(moved) > 50) pIndex += moved < 0 ? 1 : -1;
    startX = null;
    updateTrack();
  };
  track.addEventListener("mousedown", (e) => { e.preventDefault(); onStart(e.clientX); });
  window.addEventListener("mousemove", (e) => onMove(e.clientX));
  window.addEventListener("mouseup", onEnd);
  track.addEventListener("touchstart", (e) => onStart(e.touches[0].clientX), { passive: true });
  track.addEventListener("touchmove", (e) => onMove(e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", onEnd);
  window.addEventListener("resize", updateTrack);

  // best sellers / sets 탭
  document.querySelectorAll(".tab").forEach((tab) =>
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t === tab));
      pIndex = 0;
      // 탭별 상품 데이터를 바꾸려면 여기서 track 내용을 교체하세요.
      updateTrack();
    })
  );

  updateTrack();
});
