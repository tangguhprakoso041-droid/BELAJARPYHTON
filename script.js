(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Mobile navigation
  const menuBtn = $("#menuBtn");
  const nav = $("#nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  // Clock
  const clock = $("#clock");
  const updateClock = () => {
    if (clock) clock.textContent = new Date().toLocaleTimeString("id-ID");
  };
  updateClock();
  setInterval(updateClock, 1000);

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Lesson modal
  const lessons = {
    listrik: {
      title: "Listrik Dasar",
      body: `<p>Fondasi penting sebelum bermain dengan kontrol industri.</p>
      <ul><li><b>Tegangan (V)</b>: beda potensial listrik.</li><li><b>Arus (I)</b>: aliran muatan listrik.</li><li><b>Hambatan (R)</b>: menghambat aliran arus.</li><li><b>Daya (P)</b>: secara sederhana P = V × I.</li><li>Biasakan membaca rating komponen dan mengikuti SOP keselamatan.</li></ul>
      <div class="modal-code">Hukum Ohm: V = I × R</div>`
    },
    sensor: {
      title: "Sensor",
      body: `<p>Sensor mengubah kondisi fisik menjadi sinyal yang dapat dibaca sistem kontrol.</p>
      <ul><li>Proximity: mendeteksi objek tertentu tanpa kontak langsung.</li><li>Limit switch: mendeteksi posisi melalui kontak mekanis.</li><li>LDR: perubahan intensitas cahaya.</li><li>Sensor suhu: mengukur perubahan temperatur.</li></ul>
      <div class="modal-code">INPUT → PROGRAM/LOGIC → OUTPUT</div>`
    },
    aktuator: {
      title: "Aktuator",
      body: `<p>Aktuator melakukan aksi berdasarkan perintah kontrol.</p>
      <ul><li>Motor: menghasilkan gerakan putar.</li><li>Servo: mengatur posisi sudut.</li><li>Solenoid: menghasilkan gerakan linear.</li><li>Relay: mengendalikan rangkaian melalui kontak sakelar.</li></ul>`
    },
    plc: {
      title: "PLC",
      body: `<p>PLC membaca input, menjalankan program, lalu memperbarui output dalam siklus kerja.</p>
      <ul><li>Input: tombol, sensor, limit switch.</li><li>Logic: program ladder atau bahasa PLC lain.</li><li>Output: motor, lampu, valve, relay.</li><li>Konsep dasar: NO, NC, coil, timer, counter.</li></ul>
      <div class="modal-code">|--[ START ]--[/ STOP ]--( MOTOR )--|</div>`
    },
    arduino: {
      title: "Arduino",
      body: `<p>Arduino cocok untuk belajar mikrokontroler dan prototyping.</p>
      <div class="modal-code">const int led = 13;
void setup() {
  pinMode(led, OUTPUT);
}
void loop() {
  digitalWrite(led, HIGH);
}</div>
      <p>Selalu sesuaikan tegangan dan arus dengan kemampuan pin serta gunakan driver/relay yang sesuai untuk beban.</p>`
    },
    coding: {
      title: "Coding",
      body: `<p>Mulai dari logika sederhana dan biasakan melakukan debugging.</p>
      <ul><li>Variabel → menyimpan data.</li><li>if/else → membuat keputusan.</li><li>loop → menjalankan proses berulang.</li><li>function → memecah program menjadi bagian yang rapi.</li><li>Debugging → cari masalah dari input, proses, lalu output.</li></ul>`
    }
  };

  const modal = $("#lessonModal"), modalTitle = $("#modalTitle"), modalBody = $("#modalBody");
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  };
  $$(".lesson").forEach(card => card.addEventListener("click", () => {
    const data = lessons[card.dataset.topic];
    if (!data || !modal) return;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.body;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }));
  $("#modalClose")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // PLC simulator
  let motorOn = false;
  const setMotor = value => {
    motorOn = Boolean(value);
    $("#plcState")?.classList.toggle("off", !motorOn);
    if ($("#plcState")) $("#plcState").textContent = motorOn ? "RUN" : "STOP";
    $("#motorLamp")?.classList.toggle("active", motorOn);
    $("#motorCoil")?.classList.toggle("on", motorOn);
    $("#startContact")?.classList.toggle("on", motorOn);
  };
  $("#startBtn")?.addEventListener("click", () => setMotor(true));
  $("#stopBtn")?.addEventListener("click", () => setMotor(false));

  // Sensor simulator
  let sensorOn = false;
  const setSensor = value => {
    sensorOn = Boolean(value);
    $("#sensorState").textContent = sensorOn ? "HIGH" : "LOW";
    $("#sensorState").classList.toggle("off", !sensorOn);
    $("#sensorPad").classList.toggle("active", sensorOn);
    $("#outputLamp").classList.toggle("on", sensorOn);
  };
  $("#sensorPad")?.addEventListener("click", () => setSensor(!sensorOn));

  // Ohm calculator
  $("#calcBtn")?.addEventListener("click", () => {
    const v = Number($("#volt")?.value);
    const r = Number($("#ohm")?.value);
    const result = $("#calcResult");
    if (!result) return;
    if (!Number.isFinite(v) || !Number.isFinite(r) || v < 0 || r <= 0) {
      result.textContent = "Masukkan V ≥ 0 dan R > 0.";
      return;
    }
    const i = v / r;
    result.textContent = `I = ${Number(i.toFixed(6))} A`;
  });

  // Quiz
  const questions = [
    ["Apa fungsi sensor dalam sistem otomasi?", ["Memberi informasi kondisi ke sistem kontrol", "Menghasilkan listrik dari udara", "Menghapus program PLC", "Mengganti semua aktuator"], 0],
    ["Hukum Ohm yang benar adalah...", ["P = V × I", "V = I × R", "I = P × R", "R = V × P"], 1],
    ["Contoh aktuator adalah...", ["Sensor proximity", "Motor", "Tombol", "LDR"], 1],
    ["PLC umumnya bekerja dengan pola...", ["Input → proses/logic → output", "Output → kabel → input saja", "Monitor → keyboard → printer", "Baterai → internet → kamera"], 0],
    ["Arduino memiliki fungsi utama sebagai...", ["Mikrokontroler untuk prototyping", "Transformator daya besar", "Sensor mekanik", "Sekring"], 0],
    ["Apa fungsi if/else dalam coding?", ["Membuat keputusan berdasarkan kondisi", "Mengukur tegangan", "Mengganti kabel", "Mengubah resistor menjadi sensor"], 0],
    ["Kontak NC secara konsep berarti...", ["Normally Closed", "New Controller", "No Current", "Network Cable"], 0],
    ["Motor listrik termasuk...", ["Input", "Aktuator/output", "Database", "Compiler"], 1],
    ["Debugging adalah kegiatan...", ["Mencari dan memperbaiki masalah program", "Membuat komponen terbakar", "Menghapus semua kabel", "Mengganti nama komputer"], 0],
    ["Sebelum praktik listrik, hal penting adalah...", ["Mengikuti SOP keselamatan", "Menyentuh terminal sembarang", "Mengabaikan rating komponen", "Menyalakan semua sumber"], 0]
  ];
  let qIndex = 0, score = 0, answered = false;
  const quizBox = $("#quizBox");

  const renderQuiz = () => {
    if (!quizBox) return;
    const q = questions[qIndex];
    quizBox.innerHTML = `
      <div class="question">${qIndex + 1}. ${q[0]}</div>
      <div class="answers">${q[1].map((a,i)=>`<button class="answer" data-index="${i}">${a}</button>`).join("")}</div>
      <div class="quiz-bottom"><span class="quiz-result">Skor: ${score}</span><button class="btn secondary" id="nextQ" disabled>${qIndex === questions.length-1 ? "Lihat Hasil" : "Soal Berikutnya →"}</button></div>`;
    answered = false;
    $$(".answer", quizBox).forEach(btn => btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      const selected = Number(btn.dataset.index);
      const buttons = $$(".answer", quizBox);
      buttons.forEach((b,i) => {
        b.disabled = true;
        if (i === q[2]) b.classList.add("correct");
      });
      if (selected === q[2]) score++;
      else btn.classList.add("wrong");
      const next = $("#nextQ");
      if (next) next.disabled = false;
      $(".quiz-result", quizBox).textContent = `Skor: ${score}`;
    }));
    $("#nextQ")?.addEventListener("click", () => {
      if (!answered) return;
      if (qIndex === questions.length - 1) {
        quizBox.innerHTML = `<div class="question">🎉 Kuis selesai!</div><p>Kamu mendapat <strong>${score}/${questions.length}</strong>.</p><div class="quiz-bottom"><span>${score >= 8 ? "Materi dasar sudah cukup kuat. Lanjut ke proyek!" : "Coba ulangi materi dasar dan simulator, lalu ulangi kuis."}</span><button class="btn primary" id="restartQuiz">Ulangi</button></div>`;
        $("#restartQuiz")?.addEventListener("click", () => { qIndex=0; score=0; renderQuiz(); });
      } else {
        qIndex++;
        renderQuiz();
      }
    });
  };
  renderQuiz();
})();
