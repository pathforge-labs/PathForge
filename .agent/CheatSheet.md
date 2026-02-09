# 🚀 Antigravity AI Kit — CheatSheet

> **Version**: v2.0.0 | **Capabilities**: 17 Agents · 31 Commands · 27 Skills · 13 Workflows
> **Hızlı Başlangıç**: Her oturum `/status` ile başlar, Session End Checklist ile biter.

---

## 📋 Session Lifecycle (Günlük Akış)

### 🟢 Session Start

```
/status
```

Bu komut otomatik olarak:

1. `session-context.md` yükler (son oturum özeti, open items)
2. `session-state.json` okur (son commit, aktif branch)
3. Git durumu kontrol eder
4. Aktif task'ı gösterir

**İlk iş olarak kontrol et:**

```bash
git status          # Temiz mi?
git branch          # Doğru branch'te misin?
npm install         # Dependencies güncel mi?
npm run dev         # Çalışıyor mu?
```

> 📌 Detay: `.agent/checklists/session-start.md`

---

### 🔴 Session End

Her oturum bitiminde şu adımları takip et:

1. **Testler/Build geçiyor mu?**

   ```bash
   npm test
   npm run build
   npm run lint
   ```

2. **Context güncelle:**
   - `session-context.md` → Ne yapıldı, ne kaldı, blocker var mı?
   - `session-state.json` → Otomatik/manuel güncelleme

3. **Commit ve push:**
   ```bash
   git add -A
   git commit -m "chore(session): end session - [özet]"
   git push origin [branch]
   ```

> 📌 Detay: `.agent/checklists/session-end.md`

---

## ⚡ Komut Referansı — Tam Liste (31 Komut)

### 🔵 Çekirdek İş Akışı (En Sık Kullanılan)

| Komut        | Ne Yapar                                  | Örnek Kullanım                                   |
| :----------- | :---------------------------------------- | :----------------------------------------------- |
| `/status`    | Oturum durumunu gösterir                  | `/status`                                        |
| `/plan`      | Uygulama planı oluşturur                  | `/plan Add JWT authentication`                   |
| `/implement` | Onaylanmış planı uygular                  | `/implement` veya `/implement user registration` |
| `/verify`    | Build + lint + test + security çalıştırır | `/verify` veya `/verify --fix`                   |

**Tipik akış:**

```
/plan User authentication with JWT
  → Plan onayı al
/implement
  → Kodla
/verify
  → Kalite kontrolü
```

---

### 🟢 Geliştirme Komutları

| Komut       | Ne Yapar                                     | Örnek                                   |
| :---------- | :------------------------------------------- | :-------------------------------------- |
| `/build`    | Sıfırdan özellik inşa et                     | `/build product listing page`           |
| `/fix`      | Lint, type veya build hatalarını düzelt      | `/fix TypeScript errors in auth module` |
| `/debug`    | Sistematik hata ayıklama                     | `/debug login fails on mobile`          |
| `/refactor` | Kod kalitesini iyileştir                     | `/refactor extract service layer`       |
| `/cook`     | **Tam iş akışı** (plan→code→test→doc→verify) | `/cook payment checkout flow`           |

> 💡 **`/cook` = En güçlü komut.** Sıfırdan bitmiş ürüne tek komutla.

---

### 📝 Dokümantasyon & Git

| Komut        | Ne Yapar                         | Örnek                                   |
| :----------- | :------------------------------- | :-------------------------------------- |
| `/doc`       | Dokümantasyon oluştur            | `/doc API reference for auth endpoints` |
| `/adr`       | Mimari Karar Kaydı (ADR) oluştur | `/adr Switch from REST to GraphQL`      |
| `/changelog` | Commit'lerden changelog oluştur  | `/changelog`                            |
| `/git`       | Git işlemleri (best practices)   | `/git merge feature/auth into develop`  |
| `/pr`        | Pull request oluştur/yönet       | `/pr create for feature/auth`           |

---

### 🔍 Keşif & Araştırma

| Komut       | Ne Yapar                    | Örnek                                     |
| :---------- | :-------------------------- | :---------------------------------------- |
| `/scout`    | Codebase yapısını analiz et | `/scout src/services`                     |
| `/research` | Teknoloji/çözüm araştır     | `/research best auth library for Next.js` |
| `/ask`      | Kod hakkında soru sor       | `/ask How does the auth middleware work?` |

> 💡 **Yeni bir projede ilk iş**: `/scout` ile codebase'i keşfet.

---

### 🛡️ Kalite & Güvenlik

| Komut            | Ne Yapar                            | Örnek                     |
| :--------------- | :---------------------------------- | :------------------------ |
| `/code-review`   | Kod incelemesi çalıştır             | `/code-review src/auth/`  |
| `/tdd`           | Test-driven development akışı       | `/tdd user service`       |
| `/security-scan` | Güvenlik denetimi ve zafiyet tarama | `/security-scan`          |
| `/perf`          | Performans analizi ve optimizasyon  | `/perf API response time` |

---

### 🔧 Entegrasyon & Altyapı

| Komut        | Ne Yapar                          | Örnek                                      |
| :----------- | :-------------------------------- | :----------------------------------------- |
| `/integrate` | 3. parti servis entegrasyonu      | `/integrate Stripe payments`               |
| `/db`        | Veritabanı şema ve migration'ları | `/db add users table with email, password` |
| `/deploy`    | Hedef ortama deploy et            | `/deploy staging`                          |
| `/design`    | UI/UX tasarım spesifikasyonları   | `/design login page mobile-first`          |

---

### 🧠 Bağlam Yönetimi

| Komut         | Ne Yapar                             | Örnek                         |
| :------------ | :----------------------------------- | :---------------------------- |
| `/checkpoint` | İlerleme kaydet (save point)         | `/checkpoint before-refactor` |
| `/compact`    | Context'i sıkıştır (bellek yönetimi) | `/compact`                    |
| `/learn`      | Oturumdan pattern çıkar              | `/learn`                      |
| `/eval`       | Metrikleri değerlendir               | `/eval`                       |
| `/setup`      | Projeyi kit ile yapılandır           | `/setup`                      |
| `/help`       | Kullanılabilir komutları listele     | `/help`                       |

> 💡 **Uzun oturumlarda**: `/compact` ile context'i sıkıştır, performansı koru.
> 💡 **Riskli değişiklik öncesi**: `/checkpoint before-refactor` ile kaydet.

---

## 🤖 Agent'lar (17 Uzman)

Agent'lar komutlar tarafından otomatik çağrılır. Manuel olarak da referans verebilirsin:

| Agent                   | Uzmanlık Alanı                         |
| :---------------------- | :------------------------------------- |
| `planner`               | Uygulama planlaması                    |
| `architect`             | Sistem mimarisi                        |
| `frontend-specialist`   | 🆕 React/Next.js, deep design thinking |
| `backend-specialist`    | 🆕 API, güvenlik, veritabanı           |
| `mobile-developer`      | React Native / Expo                    |
| `database-architect`    | Veritabanı tasarımı                    |
| `security-reviewer`     | Güvenlik denetimi                      |
| `code-reviewer`         | Kod kalitesi                           |
| `tdd-guide`             | Test-driven development                |
| `devops-engineer`       | CI/CD, Docker, deployment              |
| `performance-optimizer` | Performans iyileştirme                 |
| `build-error-resolver`  | Build hata çözümü                      |
| `refactor-cleaner`      | Refactoring                            |
| `doc-updater`           | Dokümantasyon                          |
| `explorer-agent`        | Codebase keşfi                         |
| `knowledge-agent`       | Bilgi yönetimi                         |
| `e2e-runner`            | End-to-end testler                     |

---

## 🛠️ Skill'ler (27 Kabiliyet)

Skill'ler agent'lara detaylı rehberlik sağlar:

| Kategori         | Skill'ler                                                                                                |
| :--------------- | :------------------------------------------------------------------------------------------------------- |
| **Geliştirme**   | `clean-code`, `typescript-expert`, `nodejs-patterns`, `frontend-patterns`, `api-patterns`, `app-builder` |
| **Mimari**       | `architecture`, `database-design`, `docker-patterns`                                                     |
| **Kalite**       | `testing-patterns`, `webapp-testing`, `verification-loop`, `security-practices`, `performance-profiling` |
| **Operasyonel**  | `debugging-strategies`, `deployment-procedures`, `git-workflow`                                          |
| **Planlama**     | `plan-writing`, `brainstorming`, `strategic-compact`, `eval-harness`                                     |
| **Orkestrasyon** | `intelligent-routing`, `parallel-agents`, `behavioral-modes`, `continuous-learning`                      |
| **Domain**       | `mobile-design`, `i18n-localization` 🆕                                                                  |

---

## 📐 Workflow'lar (13 İş Akışı)

Workflow'lar birden fazla komutu zincirler:

| Workflow         | Açıklama                                                         |
| :--------------- | :--------------------------------------------------------------- |
| `/plan`          | Planlama iş akışı                                                |
| `/create`        | Sıfırdan özellik oluşturma                                       |
| `/debug`         | Sistematik hata ayıklama                                         |
| `/deploy`        | Deployment pipeline                                              |
| `/enhance`       | Mevcut kodu iyileştirme                                          |
| `/orchestrate`   | Multi-agent orkestrasyon                                         |
| `/preview`       | Görsel önizleme                                                  |
| `/test`          | Test iş akışı                                                    |
| `/brainstorm`    | Beyin fırtınası                                                  |
| `/status`        | Durum raporu                                                     |
| `/ui-ux-pro-max` | Gelişmiş UI/UX tasarım akışı                                     |
| `/quality-gate`  | 🆕 Zorunlu görev-öncesi araştırma ve doğrulama protokolü         |
| `/retrospective` | 🆕 Tier-1 retrospektif kalite denetimi — tam ürün yüzey taraması |

---

## 📋 Checklist'ler (3 Kalite Kapısı)

| Checklist         | Ne Zaman           | Dosya                         |
| :---------------- | :----------------- | :---------------------------- |
| **Session Start** | Her oturum başında | `checklists/session-start.md` |
| **Pre-Commit**    | Her commit öncesi  | `checklists/pre-commit.md`    |
| **Session End**   | Her oturum sonunda | `checklists/session-end.md`   |

### Pre-Commit Checklist (Kısa Özet)

```
✅ Debug kodu yok (console.log, debugger)
✅ Testler geçiyor (npm test)
✅ Build başarılı (npm run build)
✅ Lint temiz (npm run lint)
✅ Secret yok (API key, password)
✅ Conventional commit mesajı
```

**Commit format:**

```bash
git commit -m "feat(auth): add JWT refresh token support"
git commit -m "fix(api): handle null user in profile endpoint"
git commit -m "docs(readme): add installation instructions"
```

**Types**: `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore` · `perf` · `ci`

---

## ⚖️ Governance Kuralları

| Dosya                   | İçerik                                                |
| :---------------------- | :---------------------------------------------------- |
| `rules.md`              | Ana yönetim kuralları                                 |
| `rules/coding-style.md` | Kodlama stili                                         |
| `rules/git-workflow.md` | Git iş akışı                                          |
| `rules/security.md`     | Güvenlik kuralları                                    |
| `rules/testing.md`      | Test standartları                                     |
| `rules/quality-gate.md` | 🆕 Tier-1 kalite kapısı — zorunlu araştırma protokolü |

### Trust-Grade Kısıtları

```
Trust > Optimization    → Kullanıcı güveni hiçbir zaman feda edilmez
Safety > Growth         → Güvenlik iş hedeflerinin önünde gelir
Completion > Suggestion → Yeni iş önermeden önce mevcut işi bitir
```

---

## 🎯 Sık Kullanılan Senaryolar

### Senaryo 1: Yeni Özellik Geliştirme

```
/status                              # Oturum durumu
/plan Add user profile page          # Planlama
  → Plan onayla
/implement                           # Uygulama
/verify                              # Kalite kontrol
/code-review                         # Kod inceleme
git commit -m "feat(profile): add user profile page"
git push origin feature/profile
```

### Senaryo 2: Bug Fix

```
/status                              # Context yükle
/debug login fails after token expiry # Sistematik debug
/fix                                 # Düzelt
/verify                              # Doğrula
git commit -m "fix(auth): handle expired JWT refresh"
```

### Senaryo 3: Codebase Keşfi (Yeni Proje)

```
/scout                               # Genel yapı
/scout src/services                   # Servis katmanı
/ask How does authentication work?    # Detay sor
```

### Senaryo 4: Tam İş Akışı (Sıfırdan Bitmiş)

```
/cook payment checkout flow           # Plan→Code→Test→Doc→Verify
```

### Senaryo 5: Refactoring

```
/checkpoint before-refactor           # Save point
/refactor extract repository pattern  # Refactor
/verify                              # Her şey çalışıyor mu?
/code-review                         # Kalite kontrol
```

---

## 📁 Dizin Yapısı

```
.agent/
├── README.md              # Genel bakış
├── CheatSheet.md          # ← Bu dosya
├── rules.md               # Ana governance kuralları
├── session-context.md     # El ile güncellenen oturum bağlamı
├── session-state.json     # Makine tarafından okunan durum
│
├── agents/          (18)  # Uzman agent tanımları
├── commands/        (32)  # Slash komut tanımları
├── skills/          (27)  # Kabiliyet modülleri
├── workflows/       (14)  # İş akışı zincirleri (README dahil)
├── checklists/      (4)   # Kalite kapıları
├── hooks/           (3)   # Event-driven otomasyon
└── rules/           (5)   # Modüler governance kuralları
```

---

> **Kaynak**: [besync-labs/antigravity-ai-kit](https://github.com/besync-labs/antigravity-ai-kit) v2.0.0
> **Güncellenme**: 2026-02-09
