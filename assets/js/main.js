const RSVP_ENDPOINT = ""; // <-- dán URL Web App của Google Apps Script vào đây

      (function () {
        "use strict";

        var params = new URLSearchParams(location.search);
        var guest = (params.get("guest") || "").trim().slice(0, 80);

        /* ===== CỜ SVG ===== */
        var FLAG_VI =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#c93728"></rect><path d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z" opacity=".15"></path><path d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z" fill="#fff" opacity=".2"></path><path fill="#ff5" d="M18.008 16.366L21.257 14.006 17.241 14.006 16 10.186 14.759 14.006 10.743 14.006 13.992 16.366 12.751 20.186 16 17.825 19.249 20.186 18.008 16.366z"></path></svg>';
        var FLAG_EN =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="1" y="4" width="30" height="24" rx="4" ry="4" fill="#071b65"></rect><path d="M5.101,4h-.101c-1.981,0-3.615,1.444-3.933,3.334L26.899,28h.101c1.981,0,3.615-1.444,3.933-3.334L5.101,4Z" fill="#fff"></path><path d="M22.25,19h-2.5l9.934,7.947c.387-.353,.704-.777,.929-1.257l-8.363-6.691Z" fill="#b92932"></path><path d="M1.387,6.309l8.363,6.691h2.5L2.316,5.053c-.387,.353-.704,.777-.929,1.257Z" fill="#b92932"></path><path d="M5,28h.101L30.933,7.334c-.318-1.891-1.952-3.334-3.933-3.334h-.101L1.067,24.666c.318,1.891,1.952,3.334,3.933,3.334Z" fill="#fff"></path><rect x="13" y="4" width="6" height="24" fill="#fff"></rect><rect x="1" y="13" width="30" height="6" fill="#fff"></rect><rect x="14" y="4" width="4" height="24" fill="#b92932"></rect><rect x="14" y="1" width="4" height="30" transform="translate(32) rotate(90)" fill="#b92932"></rect><path d="M28.222,4.21l-9.222,7.376v1.414h.75l9.943-7.94c-.419-.384-.918-.671-1.471-.85Z" fill="#b92932"></path><path d="M2.328,26.957c.414,.374,.904,.656,1.447,.832l9.225-7.38v-1.408h-.75L2.328,26.957Z" fill="#b92932"></path></svg>';
        function setFlag(el, code) {
          if (el) el.innerHTML = code === "en" ? FLAG_EN : FLAG_VI;
        }
        setFlag(document.querySelector(".flag-vi"), "vi");
        setFlag(document.querySelector(".flag-en"), "en");

        /* ===== NGÔN NGỮ (?lang=en) ===== */
        var lang = params.get("lang") === "en" ? "en" : "vi";

        function applyLang(l) {
          var en = l === "en";
          document.documentElement.lang = en ? "en" : "vi";
          // text song ngữ
          document.querySelectorAll("[data-en]").forEach(function (el) {
            if (el.dataset.vi === undefined) el.dataset.vi = el.textContent; // lưu bản VI gốc
            el.textContent = en ? el.getAttribute("data-en") : el.dataset.vi;
          });
          // placeholder
          document.querySelectorAll("[data-en-ph]").forEach(function (el) {
            if (el.dataset.viPh === undefined)
              el.dataset.viPh = el.getAttribute("placeholder") || "";
            el.setAttribute(
              "placeholder",
              en ? el.getAttribute("data-en-ph") : el.dataset.viPh,
            );
          });
          // footer names (có span &)
          var fn = document.getElementById("footerNames");
          if (fn)
            fn.innerHTML = en
              ? "Mai Le <span>&amp;</span> Phuc Thanh"
              : "Mai Lê <span>&amp;</span> Phúc Thành";
          // đoạn lời ngỏ (VI/EN pre & post)
          var show = function (id, on) {
            var e = document.getElementById(id);
            if (e) e.style.display = on ? "" : "none";
          };
          show("bodyViPre", !en);
          show("bodyEnPre", en);
          show("bodyViPost", !en);
          show("bodyEnPost", en);
          // cờ trên nút + đánh dấu lựa chọn đang chọn
          setFlag(document.getElementById("langFlag"), en ? "en" : "vi");
          document.querySelectorAll(".langopt").forEach(function (o) {
            o.classList.toggle(
              "active",
              o.getAttribute("data-lang") === (en ? "en" : "vi"),
            );
          });
          // áp lại lời mời khách theo ngôn ngữ
          applyGuest(en);
        }

        /* ===== TÊN KHÁCH ===== */
        function applyGuest(en) {
          // xưng hô (áp cả khi không có tên khách)
          var we = document.getElementById("weWord");
          if (we) {
            if (en) {
              we.textContent = "we";
            } else if (guest) {
              var first = guest
                .toLowerCase()
                .replace(/^\s+/, "")
                .split(/[\s.,&]/)[0];
              var senior = [
                "anh",
                "chị",
                "chi",
                "cô",
                "co",
                "chú",
                "chu",
                "bác",
                "bac",
                "ông",
                "ong",
                "bà",
                "ba",
                "dì",
                "di",
                "cậu",
                "cau",
                "thầy",
                "thay",
                "cha",
                "mẹ",
                "me",
                "bố",
                "bo",
              ];
              we.textContent =
                senior.indexOf(first) >= 0 ? "chúng em" : "chúng mình";
            } else {
              we.textContent = "chúng mình";
            }
          }
          if (!guest) return;
          document.getElementById("guestName").textContent = guest;
          document.getElementById("guestGreet").style.display = "block";
          var plain = document.getElementById("guestPlain");
          if (plain) plain.style.display = "none";
          var rName = document.getElementById("rName");
          if (rName) rName.value = guest;
        }

        applyLang(lang);

        /* dropdown ngôn ngữ — cờ Việt/Anh, giữ nguyên param guest */
        var langBtn = document.getElementById("langBtn");
        var langMenu = document.getElementById("langMenu");
        function openMenu(on) {
          langMenu.classList.toggle("open", on);
          langBtn.setAttribute("aria-expanded", on ? "true" : "false");
        }
        langBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          openMenu(!langMenu.classList.contains("open"));
        });
        document.querySelectorAll(".langopt").forEach(function (opt) {
          opt.addEventListener("click", function (e) {
            e.stopPropagation();
            lang = opt.getAttribute("data-lang");
            var p = new URLSearchParams(location.search);
            if (lang === "en") p.set("lang", "en");
            else p.delete("lang");
            history.replaceState(
              null,
              "",
              location.pathname +
                (p.toString() ? "?" + p.toString() : "") +
                location.hash,
            );
            applyLang(lang);
            openMenu(false);
          });
        });
        document.addEventListener("click", function () {
          openMenu(false);
        }); // bấm ra ngoài đóng menu

        /* COUNTDOWN -> Lễ Thành Hôn 19/07/2026 11:30 +07 */
        const target = new Date("2026-07-19T11:30:00+07:00").getTime();
        const put = (k, v) => {
          const el = document.querySelector('[data-count="' + k + '"]');
          if (el) el.textContent = String(v).padStart(2, "0");
        };
        function tick() {
          let diff = Math.max(0, target - Date.now());
          const d = Math.floor(diff / 864e5);
          diff %= 864e5;
          const h = Math.floor(diff / 36e5);
          diff %= 36e5;
          const m = Math.floor(diff / 6e4);
          diff %= 6e4;
          const s = Math.floor(diff / 1e3);
          put("d", d);
          put("h", h);
          put("m", m);
          put("s", s);
        }
        tick();
        setInterval(tick, 1000);

        /* REVEAL */
        if ("IntersectionObserver" in window) {
          var io = new IntersectionObserver(
            (es) => {
              es.forEach((e) => {
                if (e.isIntersecting) {
                  e.target.classList.add("in");
                  io.unobserve(e.target);
                }
              });
            },
            { threshold: 0.12 },
          );
          document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
        } else {
          document
            .querySelectorAll(".reveal")
            .forEach((el) => el.classList.add("in"));
        }

        /* MUSIC: tự phát khi chạm/cuộn lần đầu */
        const audio = document.getElementById("bgMusic");
        const icon = document.getElementById("musicIcon");
        let musicOn = false,
          autoTried = false;
        audio.volume = 0.45;
        function setIcon() {
          icon.textContent = musicOn ? "❚❚" : "♪";
          icon.style.fontSize = musicOn ? "1rem" : ".78rem";
        }
        function play() {
          audio
            .play()
            .then(() => {
              musicOn = true;
              setIcon();
            })
            .catch(() => {});
        }
        function pause() {
          audio.pause();
          musicOn = false;
          setIcon();
        }
        document.getElementById("musicBtn").addEventListener("click", (e) => {
          e.stopPropagation();
          musicOn ? pause() : play();
        });
        function autoOnce() {
          if (autoTried) return;
          autoTried = true;
          play();
          ["touchstart", "scroll", "click", "keydown"].forEach((ev) =>
            window.removeEventListener(ev, autoOnce),
          );
        }
        ["touchstart", "scroll", "click", "keydown"].forEach((ev) =>
          window.addEventListener(ev, autoOnce, { passive: true }),
        );

        /* GIFT box — lật 3D, click để mở/đóng */
        const giftWrap = document.querySelector(".gift-card-wrap");
        document
          .getElementById("giftClosed")
          .addEventListener("click", () => giftWrap.classList.add("flipped"));
        document
          .getElementById("giftOpen")
          .addEventListener("click", () =>
            giftWrap.classList.remove("flipped"),
          );

        /* LIGHTBOX */
        const imgs = Array.from(document.querySelectorAll("#masonry img"));
        const lb = document.getElementById("lightbox"),
          lbImg = document.getElementById("lbImg");
        let idx = 0;
        function show(i) {
          idx = (i + imgs.length) % imgs.length;
          lbImg.src = imgs[idx].src;
          lbImg.alt = imgs[idx].alt;
        }
        function openLB(i) {
          show(i);
          lb.classList.add("open");
          document.body.style.overflow = "hidden";
        }
        function closeLB() {
          lb.classList.remove("open");
          document.body.style.overflow = "";
        }
        imgs.forEach((im, i) =>
          im.parentElement.addEventListener("click", () => openLB(i)),
        );
        document.getElementById("lbClose").addEventListener("click", closeLB);
        document.getElementById("lbPrev").addEventListener("click", (e) => {
          e.stopPropagation();
          show(idx - 1);
        });
        document.getElementById("lbNext").addEventListener("click", (e) => {
          e.stopPropagation();
          show(idx + 1);
        });
        lb.addEventListener("click", (e) => {
          if (e.target === lb) closeLB();
        });
        document.addEventListener("keydown", (e) => {
          if (!lb.classList.contains("open")) return;
          if (e.key === "Escape") closeLB();
          if (e.key === "ArrowLeft") show(idx - 1);
          if (e.key === "ArrowRight") show(idx + 1);
        });

        /* RSVP -> Google Sheet */
        const form = document.getElementById("rsvpForm"),
          thanks = document.getElementById("rsvpThanks");
        const errBox = document.getElementById("rsvpErr"),
          btn = document.getElementById("rsvpSubmit");
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          errBox.style.display = "none";
          const data = {
            name: form.name.value.trim(),
            count: form.count.value,
            which: form.which.value,
            msg: form.msg.value.trim(),
            at: new Date().toISOString(),
          };
          if (!data.name) {
            errBox.textContent = "Vui lòng nhập họ và tên.";
            errBox.style.display = "block";
            return;
          }
          btn.disabled = true;
          btn.textContent = "Đang gửi…";
          if (!RSVP_ENDPOINT) {
            try {
              const l = JSON.parse(localStorage.getItem("rsvp") || "[]");
              l.push(data);
              localStorage.setItem("rsvp", JSON.stringify(l));
            } catch (_) {}
            form.style.display = "none";
            thanks.style.display = "block";
            return;
          }
          fetch(RSVP_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(data),
          })
            .then(function (r) {
              return r.json().catch(function () {
                return { ok: true };
              });
            })
            .then(function (res) {
              if (res && res.ok === false)
                throw new Error(res.error || "server");
              form.style.display = "none";
              thanks.style.display = "block";
            })
            .catch(function () {
              btn.disabled = false;
              btn.textContent = "Gửi xác nhận";
              errBox.textContent =
                "Gửi chưa thành công, vui lòng thử lại hoặc liên hệ trực tiếp cô dâu/chú rể qua số điện thoại bên trên.";
              errBox.style.display = "block";
            });
        });
      })();
