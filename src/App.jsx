import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ─── Supabase Client ────────────────────────────────────────────────────────
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tniuauoiloavlcwpfjkl.supabase.co",
  "sb_publishable_a1Z4OZjgkVeHsPXo6JlKGQ_TWZICldX"
);

// ─── Data & Constants ───────────────────────────────────────────────────────

// ★ 번역 기능 ON/OFF 스위치 — false면 번역 UI 전체가 숨겨집니다.
// ★ 나중에 true로 바꾸면 모든 번역 기능이 그대로 복원됩니다.
const ENABLE_TRANSLATION = false;

// Logo image (circular crop, base64 embedded)
const LOGO_IMG = "data:image/png;base64,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";

const LOCK_THRESHOLD_DEFAULT = 10;
const DEFAULT_TAGS = ["규칙", "셋업", "변형규칙", "에라타", "전략", "컴포넌트", "FAQ"];

const LANGUAGES = [
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
];

// UI strings for global language switch
const UI_STRINGS = {
  ko: {
    searchPlaceholder: "질문, 답변, 태그로 검색...",
    all: "전체",
    newFaq: "새 FAQ 작성",
    editFaq: "FAQ 수정",
    game: "게임",
    question: "질문",
    questionPh: "자주 묻는 질문을 입력하세요",
    answer: "답변",
    answerPh: "답변을 작성하세요",
    tags: "태그",
    references: "레퍼런스",
    addRef: "레퍼런스 추가",
    cancel: "취소",
    save: "등록",
    saveEdit: "수정 완료",
    delete: "삭제",
    deleteConfirm: "이 FAQ를 정말 삭제하시겠습니까?",
    locked: "확정됨",
    unlock: "해제",
    admin: "관리자",
    adminOn: "관리자 ON",
    adminAuth: "관리자 인증",
    adminPw: "비밀번호",
    adminPwPh: "관리자 비밀번호 입력",
    adminPwWrong: "비밀번호가 틀렸습니다",
    adminPwHint: "프로토타입 비밀번호: admin1234",
    confirm: "확인",
    settings: "설정",
    lockThreshold: "자동 확정 추천수 기준",
    noResults: "검색 결과가 없습니다",
    noResultsSub: "새로운 FAQ를 추가해보세요!",
    toastCreated: "새 FAQ가 등록되었습니다 ✨",
    toastEdited: "FAQ가 수정되었습니다 ✏️",
    toastDeleted: "FAQ가 삭제되었습니다 🗑️",
    toastLocked: "FAQ가 확정되었습니다 🔒",
    toastUnlocked: "잠금이 해제되었습니다 🔓",
    toastAdminOn: "관리자 모드 활성화 🛡️",
    toastAdminOff: "관리자 모드 해제 👤",
    translate: "번역",
    translating: "번역 중...",
    translated: "번역됨",
    showOriginal: "원문 보기",
    translationError: "번역에 실패했습니다",
    langUrl: "URL (예: https://boardgamegeek.com/...)",
    langUrlLabel: "표시 이름 (선택)",
    langImgUrl: "이미지 URL (예: https://...jpg)",
    langImgLabel: "설명 (선택)",
    langTextPh: "출처 메모 (예: Rulebook 3p)",
    comments: "댓글",
    commentPh: "댓글을 입력하세요...",
    commentAuthorPh: "닉네임",
    commentSubmit: "등록",
    commentCount: "댓글",
    commentDelete: "삭제",
    showComments: "댓글 보기",
    hideComments: "댓글 접기",
    addGame: "게임 추가",
    gameSearch: "게임 이름 검색...",
    selectGame: "게임 선택",
    newGame: "새 게임 등록",
    gameName: "게임 이름",
    gameNamePh: "예: 카탄, 글룸헤이븐",
    gameNameEn: "영문 이름 (선택)",
    gameNameEnPh: "예: Catan",
    gameIcon: "아이콘 (이모지)",
    gameIconPh: "예: 🏝️",
    toastGameCreated: "새 게임이 등록되었습니다 🎲",
  },
  en: {
    searchPlaceholder: "Search by question, answer, or tag...",
    all: "All",
    newFaq: "New FAQ",
    editFaq: "Edit FAQ",
    game: "Game",
    question: "Question",
    questionPh: "Enter a frequently asked question",
    answer: "Answer",
    answerPh: "Write the answer",
    tags: "Tags",
    references: "References",
    addRef: "Add reference",
    cancel: "Cancel",
    save: "Save",
    saveEdit: "Save changes",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this FAQ?",
    locked: "Locked",
    unlock: "Unlock",
    admin: "Admin",
    adminOn: "Admin ON",
    adminAuth: "Admin Authentication",
    adminPw: "Password",
    adminPwPh: "Enter admin password",
    adminPwWrong: "Incorrect password",
    adminPwHint: "Prototype password: admin1234",
    confirm: "Confirm",
    settings: "Settings",
    lockThreshold: "Auto-lock like threshold",
    noResults: "No results found",
    noResultsSub: "Try adding a new FAQ!",
    toastCreated: "New FAQ created ✨",
    toastEdited: "FAQ updated ✏️",
    toastDeleted: "FAQ deleted 🗑️",
    toastLocked: "FAQ locked 🔒",
    toastUnlocked: "FAQ unlocked 🔓",
    toastAdminOn: "Admin mode activated 🛡️",
    toastAdminOff: "Admin mode deactivated 👤",
    translate: "Translate",
    translating: "Translating...",
    translated: "Translated",
    showOriginal: "Show original",
    translationError: "Translation failed",
    langUrl: "URL (e.g. https://boardgamegeek.com/...)",
    langUrlLabel: "Display name (optional)",
    langImgUrl: "Image URL (e.g. https://...jpg)",
    langImgLabel: "Description (optional)",
    langTextPh: "Source note (e.g. Rulebook 3p)",
    comments: "Comments",
    commentPh: "Write a comment...",
    commentAuthorPh: "Nickname",
    commentSubmit: "Post",
    commentCount: "comments",
    commentDelete: "Delete",
    showComments: "Show comments",
    hideComments: "Hide comments",
    addGame: "Add game",
    gameSearch: "Search games...",
    selectGame: "Select game",
    newGame: "New Game",
    gameName: "Game name",
    gameNamePh: "e.g. Catan, Gloomhaven",
    gameNameEn: "English name (optional)",
    gameNameEnPh: "e.g. Catan",
    gameIcon: "Icon (emoji)",
    gameIconPh: "e.g. 🏝️",
    toastGameCreated: "New game added 🎲",
  },
  de: {
    searchPlaceholder: "Suche nach Frage, Antwort oder Tag...",
    all: "Alle",
    newFaq: "Neues FAQ",
    editFaq: "FAQ bearbeiten",
    game: "Spiel",
    question: "Frage",
    questionPh: "Häufig gestellte Frage eingeben",
    answer: "Antwort",
    answerPh: "Antwort verfassen",
    tags: "Tags",
    references: "Referenzen",
    addRef: "Referenz hinzufügen",
    cancel: "Abbrechen",
    save: "Speichern",
    saveEdit: "Änderungen speichern",
    delete: "Löschen",
    deleteConfirm: "Möchten Sie dieses FAQ wirklich löschen?",
    locked: "Gesperrt",
    unlock: "Entsperren",
    admin: "Admin",
    adminOn: "Admin AN",
    adminAuth: "Admin-Authentifizierung",
    adminPw: "Passwort",
    adminPwPh: "Admin-Passwort eingeben",
    adminPwWrong: "Falsches Passwort",
    adminPwHint: "Prototyp-Passwort: admin1234",
    confirm: "Bestätigen",
    settings: "Einstellungen",
    lockThreshold: "Auto-Sperr-Schwelle (Likes)",
    noResults: "Keine Ergebnisse gefunden",
    noResultsSub: "Versuchen Sie, ein neues FAQ hinzuzufügen!",
    toastCreated: "Neues FAQ erstellt ✨",
    toastEdited: "FAQ aktualisiert ✏️",
    toastDeleted: "FAQ gelöscht 🗑️",
    toastLocked: "FAQ gesperrt 🔒",
    toastUnlocked: "FAQ entsperrt 🔓",
    toastAdminOn: "Admin-Modus aktiviert 🛡️",
    toastAdminOff: "Admin-Modus deaktiviert 👤",
    translate: "Übersetzen",
    translating: "Übersetze...",
    translated: "Übersetzt",
    showOriginal: "Original anzeigen",
    translationError: "Übersetzung fehlgeschlagen",
    langUrl: "URL (z.B. https://boardgamegeek.com/...)",
    langUrlLabel: "Anzeigename (optional)",
    langImgUrl: "Bild-URL (z.B. https://...jpg)",
    langImgLabel: "Beschreibung (optional)",
    langTextPh: "Quellennotiz (z.B. Regelbuch S.3)",
    comments: "Kommentare",
    commentPh: "Kommentar schreiben...",
    commentAuthorPh: "Nickname",
    commentSubmit: "Posten",
    commentCount: "Kommentare",
    commentDelete: "Löschen",
    showComments: "Kommentare anzeigen",
    hideComments: "Kommentare ausblenden",
    addGame: "Spiel hinzufügen",
    gameSearch: "Spiele suchen...",
    selectGame: "Spiel wählen",
    newGame: "Neues Spiel",
    gameName: "Spielname",
    gameNamePh: "z.B. Catan, Gloomhaven",
    gameNameEn: "Englischer Name (optional)",
    gameNameEnPh: "z.B. Catan",
    gameIcon: "Symbol (Emoji)",
    gameIconPh: "z.B. 🏝️",
    toastGameCreated: "Neues Spiel hinzugefügt 🎲",
  },
};

const SAMPLE_GAMES = [
  { id: "g1", name: "카탄", nameEn: "Catan", nameDe: "Catan", icon: "🏝️" },
  { id: "g2", name: "글룸헤이븐", nameEn: "Gloomhaven", nameDe: "Gloomhaven", icon: "⚔️" },
  { id: "g3", name: "팬데믹", nameEn: "Pandemic", nameDe: "Pandemie", icon: "🦠" },
  { id: "g4", name: "스플렌더", nameEn: "Splendor", nameDe: "Splendor", icon: "💎" },
  { id: "g5", name: "윙스팬", nameEn: "Wingspan", nameDe: "Flügelschlag", icon: "🐦" },
];

const SAMPLE_FAQS = [
  {
    id: "f1", gameId: "g1",
    question: "카탄에서 7이 나오면 도둑은 반드시 옮겨야 하나요?",
    answer: "네, 7이 나오면 반드시 도둑을 다른 타일로 옮겨야 합니다. 같은 자리에 둘 수 없습니다.",
    tags: ["규칙"],
    references: [
      { type: "link", value: "https://boardgamegeek.com/boardgame/13/catan", label: "BGG 카탄 페이지" },
      { type: "text", value: "공식 룰북 12페이지 참조" },
    ],
    likes: 7, locked: false, lockedBy: null,
    createdAt: "2026-03-10T09:00:00", updatedAt: "2026-03-10T09:00:00",
    comments: [
      { id: "c1", author: "BoardGamer92", text: "확장판에서도 동일한 규칙인가요?", createdAt: "2026-03-10T12:30:00" },
      { id: "c2", author: "CatanFan", text: "네, 모든 확장에서 같습니다!", createdAt: "2026-03-10T14:00:00" },
    ],
  },
  {
    id: "f2", gameId: "g1",
    question: "항구 교환 비율은 어떻게 되나요?",
    answer: "일반 항구는 3:1, 특수 항구는 해당 자원 2:1로 교환 가능합니다.",
    tags: ["규칙", "전략"],
    references: [{ type: "text", value: "Rulebook 8p" }],
    likes: 3, locked: false, lockedBy: null,
    createdAt: "2026-03-11T14:00:00", updatedAt: "2026-03-11T14:00:00",
    comments: [],
  },
  {
    id: "f3", gameId: "g2",
    question: "글룸헤이븐 시나리오 실패 시 경험치는 유지되나요?",
    answer: "네, 시나리오에 실패하더라도 해당 시나리오에서 획득한 경험치와 골드는 유지됩니다.",
    tags: ["규칙", "FAQ"],
    references: [
      { type: "text", value: "Official FAQ v2.1" },
      { type: "link", value: "https://boardgamegeek.com/boardgame/174430/gloomhaven", label: "BGG 글룸헤이븐" },
    ],
    likes: 12, locked: true, lockedBy: "auto",
    createdAt: "2026-03-09T11:00:00", updatedAt: "2026-03-09T11:00:00",
    comments: [
      { id: "c3", author: "DungeonCrawler", text: "이건 정말 중요한 정보네요. 처음에 몰라서 경험치 다 날릴 뻔했습니다.", createdAt: "2026-03-09T15:00:00" },
    ],
  },
  {
    id: "f4", gameId: "g3",
    question: "팬데믹에서 큐어와 박멸의 차이는?",
    answer: "큐어(Cure)는 치료제를 발견한 상태이고, 박멸(Eradicate)은 치료제 발견 후 해당 질병 큐브가 보드에 하나도 없는 상태입니다. 박멸되면 해당 질병은 더 이상 감염되지 않습니다.",
    tags: ["규칙", "FAQ"],
    references: [],
    likes: 5, locked: false, lockedBy: null,
    createdAt: "2026-03-12T08:00:00", updatedAt: "2026-03-12T08:00:00",
    comments: [],
  },
];

const uid = () => Math.random().toString(36).slice(2, 10);

// ─── Translation Service ────────────────────────────────────────────────────
// Cache: { "faqId:langCode": { question, answer } }
const translationCache = {};

async function translateFAQ(faq, targetLang) {
  const cacheKey = `${faq.id}:${faq.updatedAt}:${targetLang}`;
  if (translationCache[cacheKey]) return translationCache[cacheKey];

  const langNames = { en: "English", de: "German" };

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Translate the following board game FAQ from Korean to ${langNames[targetLang]}. Keep board game terminology accurate. Respond ONLY with JSON, no markdown or backticks:\n{"question": "translated question", "answer": "translated answer"}\n\nQuestion: ${faq.question}\nAnswer: ${faq.answer}`,
          },
        ],
      }),
    });
    const data = await response.json();
    const text = data.content?.map((i) => i.text || "").join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    translationCache[cacheKey] = parsed;
    return parsed;
  } catch (err) {
    console.error("Translation error:", err);
    throw err;
  }
}

// ─── Icons ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d={d} />
  </svg>
);
const SearchIcon = (p) => <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" {...p} />;
const PlusIcon = (p) => <Icon d="M12 5v14M5 12h14" {...p} />;
const HeartIcon = ({ filled, ...p }) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const LockIcon = (p) => <Icon d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4" {...p} />;
const EditIcon = (p) => <Icon d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" {...p} />;
const TrashIcon = (p) => <Icon d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" {...p} />;
const XIcon = (p) => <Icon d="M18 6L6 18M6 6l12 12" {...p} />;
const ShieldIcon = (p) => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...p} />;
const LinkIcon = (p) => <Icon d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" {...p} />;
const ImageIcon = (p) => <Icon d="M21 15l-5-5L5 21M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" {...p} />;
const FileTextIcon = (p) => <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" {...p} />;
const SettingsIcon = (p) => <Icon d="M12 8a4 4 0 100 8 4 4 0 000-8zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" {...p} />;
const GlobeIcon = (p) => <Icon d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10A15.3 15.3 0 0112 2z" {...p} />;
const CheckIcon = (p) => <Icon d="M20 6L9 17l-5-5" {...p} />;
const SunIcon = (p) => <Icon d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 100 10 5 5 0 000-10z" {...p} />;
const MoonIcon = (p) => <Icon d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" {...p} />;
const ChevronDownIcon = (p) => <Icon d="M6 9l6 6 6-6" {...p} />;

// ─── Styles ─────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

  :root {
    --bg-primary: #0a0a0f;
    --bg-secondary: #12121a;
    --bg-card: #16161f;
    --bg-card-hover: #1c1c28;
    --bg-input: #1a1a26;
    --border: #2a2a3a;
    --border-focus: #8B6914;
    --text-primary: #e8e8f0;
    --text-secondary: #8888a0;
    --text-muted: #55556a;
    --accent: #8B6914;
    --accent-hover: #A47D1A;
    --accent-subtle: rgba(139, 105, 20, 0.15);
    --danger: #ef4444;
    --danger-subtle: rgba(239, 68, 68, 0.12);
    --success: #10b981;
    --success-subtle: rgba(16, 185, 129, 0.12);
    --warning: #f59e0b;
    --warning-subtle: rgba(245, 158, 11, 0.12);
    --like: #f472b6;
    --like-subtle: rgba(244, 114, 182, 0.12);
    --locked-bg: rgba(245, 158, 11, 0.06);
    --locked-border: rgba(245, 158, 11, 0.25);
    --translate-color: #38bdf8;
    --translate-subtle: rgba(56, 189, 248, 0.12);
    --radius-sm: 6px;
    --radius: 10px;
    --radius-lg: 14px;
    --radius-xl: 18px;
    --shadow: 0 2px 12px rgba(0,0,0,0.3);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.4);
    --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @media (prefers-color-scheme: light) {
    :root:not([data-theme="dark"]) {
      --bg-primary: #FAF6F0;
      --bg-secondary: #FFFFFF;
      --bg-card: #FFFFFF;
      --bg-card-hover: #F5EFE6;
      --bg-input: #F0EAE0;
      --border: #D4C4A8;
      --border-focus: #8B6914;
      --text-primary: #1A1A1A;
      --text-secondary: #5C5040;
      --text-muted: #9C8E78;
      --accent: #8B6914;
      --accent-hover: #6B5010;
      --accent-subtle: rgba(139, 105, 20, 0.10);
      --danger: #DC2626;
      --danger-subtle: rgba(220, 38, 38, 0.08);
      --success: #059669;
      --success-subtle: rgba(5, 150, 105, 0.08);
      --warning: #D97706;
      --warning-subtle: rgba(217, 119, 6, 0.08);
      --like: #E11D48;
      --like-subtle: rgba(225, 29, 72, 0.08);
      --locked-bg: rgba(217, 119, 6, 0.06);
      --locked-border: rgba(217, 119, 6, 0.3);
      --translate-color: #0284C7;
      --translate-subtle: rgba(2, 132, 199, 0.08);
      --shadow: 0 2px 8px rgba(139, 105, 20, 0.08);
      --shadow-lg: 0 8px 24px rgba(139, 105, 20, 0.12);
    }
    :root:not([data-theme="dark"]) .faq-card { box-shadow: var(--shadow); }
    :root:not([data-theme="dark"]) .modal-overlay { background: rgba(0,0,0,0.3); }
    :root:not([data-theme="dark"]) .logo-img { border-color: #C4963A; }
  }

  [data-theme="light"] {
    --bg-primary: #FAF6F0;
    --bg-secondary: #FFFFFF;
    --bg-card: #FFFFFF;
    --bg-card-hover: #F5EFE6;
    --bg-input: #F0EAE0;
    --border: #D4C4A8;
    --border-focus: #8B6914;
    --text-primary: #1A1A1A;
    --text-secondary: #5C5040;
    --text-muted: #9C8E78;
    --accent: #8B6914;
    --accent-hover: #6B5010;
    --accent-subtle: rgba(139, 105, 20, 0.10);
    --danger: #DC2626;
    --danger-subtle: rgba(220, 38, 38, 0.08);
    --success: #059669;
    --success-subtle: rgba(5, 150, 105, 0.08);
    --warning: #D97706;
    --warning-subtle: rgba(217, 119, 6, 0.08);
    --like: #E11D48;
    --like-subtle: rgba(225, 29, 72, 0.08);
    --locked-bg: rgba(217, 119, 6, 0.06);
    --locked-border: rgba(217, 119, 6, 0.3);
    --translate-color: #0284C7;
    --translate-subtle: rgba(2, 132, 199, 0.08);
    --shadow: 0 2px 8px rgba(139, 105, 20, 0.08);
    --shadow-lg: 0 8px 24px rgba(139, 105, 20, 0.12);
  }
  [data-theme="light"] .faq-card { box-shadow: var(--shadow); }
  [data-theme="light"] .modal-overlay { background: rgba(0,0,0,0.3); }
  [data-theme="light"] .logo-img { border-color: #C4963A; }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: var(--bg-primary); color: var(--text-primary);
    font-family: 'Noto Sans KR', 'Outfit', sans-serif;
    line-height: 1.6; -webkit-font-smoothing: antialiased;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes scaleIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
  @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.15); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .animate-fade { animation: fadeIn 0.3s ease-out; }
  .animate-slide { animation: slideUp 0.4s ease-out; }
  .animate-scale { animation: scaleIn 0.25s ease-out; }

  .app-container { max-width:1080px; margin:0 auto; padding:0 20px; min-height:100vh; }

  /* Header */
  .header { padding:28px 0 20px; border-bottom:1px solid var(--border); margin-bottom:24px; }
  .header-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
  .logo { display:flex; align-items:center; gap:12px; }
  .logo-img { width:42px; height:42px; border-radius:50%; object-fit:cover; border:2px solid var(--border); }
  .logo h1 { font-family:'Outfit',sans-serif; font-size:22px; font-weight:700; letter-spacing:-0.5px; background:linear-gradient(135deg, #8B6914, #C4963A, #8B6914); -webkit-background-clip:text; -webkit-text-fill-color:transparent; line-height:1.2; }
  .logo-subtitle { font-size:11px; color:var(--text-muted); letter-spacing:0.5px; }
  .header-controls { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }

  .ctrl-btn {
    display:flex; align-items:center; gap:8px; padding:7px 14px; border-radius:var(--radius);
    border:1px solid var(--border); background:transparent; color:var(--text-secondary);
    cursor:pointer; font-size:13px; font-family:inherit; transition:all var(--transition); white-space:nowrap;
  }
  .ctrl-btn:hover { border-color:var(--accent); color:var(--accent); }
  .ctrl-btn.active { background:var(--accent-subtle); border-color:var(--accent); color:var(--accent); }

  /* Language Switcher */
  .lang-switcher { position:relative; }
  .lang-dropdown {
    position:absolute; top:calc(100% + 6px); right:0; background:var(--bg-secondary);
    border:1px solid var(--border); border-radius:var(--radius); padding:4px;
    box-shadow:var(--shadow-lg); z-index:60; animation:scaleIn 0.15s ease-out; min-width:140px;
  }
  .lang-option {
    display:flex; align-items:center; gap:8px; width:100%; padding:8px 12px; border:none;
    background:transparent; color:var(--text-secondary); font-size:13px; font-family:inherit;
    cursor:pointer; border-radius:var(--radius-sm); transition:all var(--transition);
  }
  .lang-option:hover { background:var(--bg-card); color:var(--text-primary); }
  .lang-option.active { color:var(--accent); background:var(--accent-subtle); }
  .lang-option .lang-check { width:16px; display:flex; justify-content:center; }

  /* Search */
  .search-bar { position:relative; margin-bottom:4px; }
  .search-bar svg { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); }
  .search-bar input {
    width:100%; padding:11px 16px 11px 42px; background:var(--bg-input);
    border:1px solid var(--border); border-radius:var(--radius); color:var(--text-primary);
    font-size:14px; font-family:inherit; outline:none; transition:all var(--transition);
  }
  .search-bar input::placeholder { color:var(--text-muted); }
  .search-bar input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-subtle); }

  /* Game Selector */
  .game-selector-row { display:flex; align-items:center; gap:8px; padding:8px 0; }
  .game-selector-btn {
    display:flex; align-items:center; gap:8px; padding:9px 14px; border-radius:var(--radius);
    border:1px solid var(--border); background:var(--bg-card); color:var(--text-primary);
    font-size:14px; font-family:inherit; cursor:pointer; transition:all var(--transition); flex:1; min-width:0;
  }
  .game-selector-btn:hover { border-color:var(--accent); color:var(--accent); }
  .game-selector-btn .game-selector-name { flex:1; text-align:left; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:500; }
  .game-selector-btn .game-selector-count { background:var(--accent); color:white; padding:1px 8px; border-radius:99px; font-size:11px; font-weight:600; flex-shrink:0; }

  /* Game Drawer */
  .game-drawer-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:200;
    animation:fadeIn 0.2s ease-out;
  }
  .game-drawer {
    position:fixed; top:0; left:0; bottom:0; width:300px; max-width:85vw;
    background:var(--bg-secondary); border-right:1px solid var(--border);
    display:flex; flex-direction:column; z-index:201;
    animation:slideInLeft 0.25s cubic-bezier(0.4,0,0.2,1);
  }
  @keyframes slideInLeft { from { transform:translateX(-100%); } to { transform:translateX(0); } }
  .game-drawer-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:18px 16px 14px; border-bottom:1px solid var(--border); flex-shrink:0;
  }
  .game-drawer-title { font-size:15px; font-weight:700; color:var(--text-primary); }
  .game-drawer-close {
    display:flex; align-items:center; justify-content:center; width:32px; height:32px;
    border-radius:var(--radius-sm); border:none; background:transparent;
    color:var(--text-muted); cursor:pointer; transition:all var(--transition);
  }
  .game-drawer-close:hover { background:var(--bg-card); color:var(--text-primary); }
  .game-drawer-search-wrap { padding:12px 16px; flex-shrink:0; border-bottom:1px solid var(--border); }
  .game-drawer-search { position:relative; }
  .game-drawer-search svg { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; }
  .game-drawer-search input {
    width:100%; padding:9px 12px 9px 36px; background:var(--bg-input);
    border:1px solid var(--border); border-radius:var(--radius); color:var(--text-primary);
    font-size:13px; font-family:inherit; outline:none; transition:all var(--transition);
  }
  .game-drawer-search input::placeholder { color:var(--text-muted); }
  .game-drawer-search input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-subtle); }
  .game-drawer-list { flex:1; overflow-y:auto; padding:8px; }
  .game-drawer-item {
    display:flex; align-items:center; gap:10px; width:100%; padding:10px 12px;
    border-radius:var(--radius); border:none; background:transparent; color:var(--text-secondary);
    font-size:13px; font-family:inherit; cursor:pointer; transition:all var(--transition); text-align:left;
  }
  .game-drawer-item:hover { background:var(--bg-card); color:var(--text-primary); }
  .game-drawer-item.active { background:var(--accent-subtle); color:var(--accent); font-weight:600; }
  .game-drawer-item .item-name { flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .game-drawer-item .item-count { background:var(--bg-input); padding:1px 7px; border-radius:99px; font-size:11px; font-weight:600; color:var(--text-muted); flex-shrink:0; }
  .game-drawer-item.active .item-count { background:var(--accent); color:white; }
  .game-drawer-footer { padding:12px 16px; border-top:1px solid var(--border); flex-shrink:0; }
  .game-drawer-add {
    display:flex; align-items:center; justify-content:center; gap:6px; width:100%;
    padding:9px 14px; border-radius:var(--radius); border:1px dashed var(--border);
    background:transparent; color:var(--text-muted); font-size:13px; font-family:inherit;
    cursor:pointer; transition:all var(--transition);
  }
  .game-drawer-add:hover { border-color:var(--accent); color:var(--accent); }

  /* Tag Filters */
  .tag-filters { display:flex; gap:6px; padding:12px 0; flex-wrap:wrap; }
  .tag-chip {
    padding:4px 12px; border-radius:99px; border:1px solid var(--border); background:transparent;
    color:var(--text-secondary); font-size:12px; font-family:inherit; cursor:pointer; transition:all var(--transition);
  }
  .tag-chip:hover { border-color:var(--text-muted); }
  .tag-chip.active { background:var(--accent-subtle); border-color:var(--accent); color:var(--accent); }

  /* FAQ List */
  .faq-list { display:flex; flex-direction:column; gap:10px; padding:8px 0 40px; }
  .faq-empty { text-align:center; padding:60px 20px; color:var(--text-muted); }
  .faq-empty-icon { font-size:40px; margin-bottom:12px; }
  .faq-empty p { font-size:14px; }

  /* FAQ Card */
  .faq-card {
    background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg);
    padding:18px 20px; transition:all var(--transition); animation:fadeIn 0.3s ease-out;
  }
  .faq-card:hover { background:var(--bg-card-hover); }
  .faq-card.locked { background:var(--locked-bg); border-color:var(--locked-border); }
  .faq-card-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
  .faq-question { font-size:15px; font-weight:600; color:var(--text-primary); line-height:1.5; flex:1; }
  .faq-card-badges { display:flex; align-items:center; gap:6px; flex-shrink:0; }
  .badge { display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:600; }
  .badge-locked { background:var(--warning-subtle); color:var(--warning); }
  .badge-translated { background:var(--translate-subtle); color:var(--translate-color); }
  .faq-answer { margin-top:10px; font-size:14px; color:var(--text-secondary); line-height:1.7; padding-left:2px; }

  /* Translation display */
  .faq-translation {
    margin-top:12px; padding:12px 14px; background:var(--translate-subtle);
    border:1px solid rgba(56,189,248,0.2); border-radius:var(--radius); animation:fadeIn 0.3s ease-out;
  }
  .faq-translation-label {
    font-size:11px; font-weight:600; color:var(--translate-color);
    text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;
    display:flex; align-items:center; gap:6px;
  }
  .faq-translation-q { font-size:14px; font-weight:600; color:var(--text-primary); margin-bottom:6px; }
  .faq-translation-a { font-size:13px; color:var(--text-secondary); line-height:1.6; }

  /* References */
  .faq-refs { margin-top:12px; display:flex; flex-direction:column; gap:6px; }
  .faq-refs-title { font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; }
  .ref-item {
    display:inline-flex; align-items:center; gap:6px; padding:5px 10px; background:var(--bg-input);
    border-radius:var(--radius-sm); font-size:12px; color:var(--text-secondary); text-decoration:none;
    transition:all var(--transition); border:1px solid transparent;
  }
  .ref-item:hover { border-color:var(--border); }
  a.ref-item { color:var(--accent); cursor:pointer; }
  a.ref-item:hover { color:var(--accent-hover); }
  .ref-item img { max-width:120px; max-height:80px; border-radius:4px; object-fit:cover; }

  /* FAQ Footer */
  .faq-footer { margin-top:14px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; }
  .faq-tags { display:flex; gap:5px; flex-wrap:wrap; }
  .faq-tag { padding:2px 9px; border-radius:99px; background:var(--accent-subtle); color:var(--accent); font-size:11px; font-weight:500; }
  .faq-actions { display:flex; align-items:center; gap:4px; flex-wrap:wrap; }
  .action-btn {
    display:inline-flex; align-items:center; gap:5px; padding:6px 10px; border-radius:var(--radius-sm);
    border:none; background:transparent; color:var(--text-muted); font-size:12px;
    font-family:inherit; cursor:pointer; transition:all var(--transition);
  }
  .action-btn:hover { background:var(--bg-input); color:var(--text-secondary); }
  .action-btn.like-btn:hover { color:var(--like); background:var(--like-subtle); }
  .action-btn.like-btn.liked { color:var(--like); }
  .action-btn.edit-btn:hover { color:var(--accent); background:var(--accent-subtle); }
  .action-btn.delete-btn:hover { color:var(--danger); background:var(--danger-subtle); }
  .action-btn.lock-btn:hover { color:var(--warning); background:var(--warning-subtle); }
  .action-btn.unlock-btn { color:var(--warning); }
  .action-btn.unlock-btn:hover { background:var(--warning-subtle); }
  .action-btn.translate-btn { color:var(--translate-color); }
  .action-btn.translate-btn:hover { background:var(--translate-subtle); }
  .action-btn.translate-btn.translating { opacity:0.6; cursor:wait; }

  /* Translate dropdown */
  .translate-dropdown-wrap { position:relative; display:inline-flex; }
  .translate-dropdown {
    position:absolute; bottom:calc(100% + 6px); right:0; background:var(--bg-secondary);
    border:1px solid var(--border); border-radius:var(--radius); padding:4px;
    box-shadow:var(--shadow-lg); z-index:30; animation:scaleIn 0.15s ease-out; min-width:120px;
  }
  .translate-option {
    display:flex; align-items:center; gap:8px; width:100%; padding:7px 10px; border:none;
    background:transparent; color:var(--text-secondary); font-size:12px; font-family:inherit;
    cursor:pointer; border-radius:var(--radius-sm); transition:all var(--transition);
  }
  .translate-option:hover { background:var(--bg-card); color:var(--text-primary); }

  /* Spinner */
  .spinner { width:14px; height:14px; border:2px solid var(--border); border-top-color:var(--translate-color); border-radius:50%; animation:spin 0.6s linear infinite; }

  /* FAB */
  .fab {
    position:fixed; bottom:28px; right:28px; width:52px; height:52px; border-radius:50%; border:none;
    background:var(--accent); color:white; display:flex; align-items:center; justify-content:center;
    cursor:pointer; box-shadow:0 4px 20px rgba(139,105,20,0.4); transition:all var(--transition); z-index:50;
  }
  .fab:hover { background:var(--accent-hover); transform:scale(1.08); }

  /* Modal */
  .modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(4px);
    display:flex; align-items:center; justify-content:center; z-index:100; padding:20px;
    animation:fadeIn 0.15s ease-out;
  }
  .modal {
    background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-xl);
    width:100%; max-width:580px; max-height:85vh; overflow-y:auto; padding:28px;
    animation:scaleIn 0.25s ease-out;
  }
  .modal-title { font-size:18px; font-weight:700; margin-bottom:22px; }

  /* Form */
  .form-group { margin-bottom:18px; }
  .form-label { display:block; font-size:12px; font-weight:600; color:var(--text-secondary); margin-bottom:6px; text-transform:uppercase; letter-spacing:0.3px; }
  .form-input, .form-textarea, .form-select {
    width:100%; padding:10px 14px; background:var(--bg-input); border:1px solid var(--border);
    border-radius:var(--radius); color:var(--text-primary); font-size:14px; font-family:inherit; outline:none; transition:all var(--transition);
  }
  .form-input:focus, .form-textarea:focus, .form-select:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-subtle); }
  .form-textarea { resize:vertical; min-height:90px; line-height:1.6; }
  .form-select { cursor:pointer; appearance:none; }
  .form-select option { background:var(--bg-secondary); }
  .form-tags { display:flex; gap:6px; flex-wrap:wrap; }
  .form-tag-btn {
    padding:5px 12px; border-radius:99px; border:1px solid var(--border); background:transparent;
    color:var(--text-secondary); font-size:12px; font-family:inherit; cursor:pointer; transition:all var(--transition);
  }
  .form-tag-btn.active { background:var(--accent-subtle); border-color:var(--accent); color:var(--accent); }

  /* Ref form */
  .ref-form-list { display:flex; flex-direction:column; gap:10px; }
  .ref-form-item { display:flex; gap:8px; align-items:flex-start; padding:10px; background:var(--bg-input); border-radius:var(--radius); border:1px solid var(--border); }
  .ref-type-btns { display:flex; gap:4px; flex-shrink:0; }
  .ref-type-btn {
    padding:5px 8px; border-radius:var(--radius-sm); border:1px solid var(--border); background:transparent;
    color:var(--text-muted); cursor:pointer; font-size:12px; font-family:inherit; display:flex;
    align-items:center; gap:4px; transition:all var(--transition);
  }
  .ref-type-btn.active { background:var(--accent-subtle); border-color:var(--accent); color:var(--accent); }
  .ref-form-inputs { flex:1; display:flex; flex-direction:column; gap:6px; }
  .ref-form-inputs input {
    width:100%; padding:7px 10px; background:var(--bg-card); border:1px solid var(--border);
    border-radius:var(--radius-sm); color:var(--text-primary); font-size:13px; font-family:inherit; outline:none;
  }
  .ref-form-inputs input:focus { border-color:var(--accent); }
  .ref-remove { padding:5px; border:none; background:transparent; color:var(--text-muted); cursor:pointer; border-radius:var(--radius-sm); transition:all var(--transition); }
  .ref-remove:hover { color:var(--danger); background:var(--danger-subtle); }
  .add-ref-btn {
    display:inline-flex; align-items:center; gap:5px; padding:7px 14px; border-radius:var(--radius);
    border:1px dashed var(--border); background:transparent; color:var(--text-muted);
    font-size:12px; font-family:inherit; cursor:pointer; transition:all var(--transition);
  }
  .add-ref-btn:hover { border-color:var(--accent); color:var(--accent); }

  /* Buttons */
  .btn-row { display:flex; gap:8px; justify-content:flex-end; margin-top:24px; }
  .btn {
    padding:9px 20px; border-radius:var(--radius); border:1px solid var(--border); background:transparent;
    color:var(--text-primary); font-size:14px; font-family:inherit; font-weight:500; cursor:pointer; transition:all var(--transition);
  }
  .btn:hover { background:var(--bg-card); }
  .btn-primary { background:var(--accent); border-color:var(--accent); color:white; }
  .btn-primary:hover { background:var(--accent-hover); }
  .btn-danger { border-color:var(--danger); color:var(--danger); }
  .btn-danger:hover { background:var(--danger-subtle); }

  /* Settings */
  .settings-panel { margin-top:16px; padding:16px 20px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); animation:fadeIn 0.3s ease-out; }
  .settings-row { display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .settings-label { font-size:13px; color:var(--text-secondary); }
  .settings-input {
    width:70px; padding:6px 10px; background:var(--bg-input); border:1px solid var(--border);
    border-radius:var(--radius-sm); color:var(--text-primary); font-size:14px; font-family:inherit; text-align:center; outline:none;
  }
  .settings-input:focus { border-color:var(--accent); }

  /* Confirm */
  .confirm-dialog { text-align:center; padding:8px 0; }
  .confirm-dialog p { font-size:14px; color:var(--text-secondary); margin-bottom:20px; }
  .confirm-actions { display:flex; gap:8px; justify-content:center; }

  /* Toast */
  .toast-container { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); z-index:200; display:flex; flex-direction:column; gap:8px; }
  .toast { padding:10px 20px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius); color:var(--text-primary); font-size:13px; box-shadow:var(--shadow-lg); animation:slideUp 0.3s ease-out; white-space:nowrap; }

  .admin-pw-hint { font-size:12px; color:var(--text-muted); margin-top:6px; }

  /* Comments */
  .comments-section { margin-top:14px; border-top:1px solid var(--border); padding-top:12px; }
  .comments-toggle {
    display:inline-flex; align-items:center; gap:6px; padding:5px 0; border:none; background:transparent;
    color:var(--text-muted); font-size:12px; font-family:inherit; cursor:pointer; transition:all var(--transition);
  }
  .comments-toggle:hover { color:var(--text-secondary); }
  .comments-toggle .comment-count-badge {
    background:var(--bg-input); padding:1px 7px; border-radius:99px; font-size:11px; font-weight:600;
  }
  .comments-list { margin-top:10px; display:flex; flex-direction:column; gap:8px; animation:fadeIn 0.2s ease-out; }
  .comment-item {
    display:flex; gap:10px; padding:10px 12px; background:var(--bg-input); border-radius:var(--radius);
    border:1px solid transparent; transition:all var(--transition);
  }
  .comment-item:hover { border-color:var(--border); }
  .comment-avatar {
    width:30px; height:30px; border-radius:50%; background:var(--accent-subtle);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    font-size:13px; font-weight:700; color:var(--accent);
  }
  .comment-body { flex:1; min-width:0; }
  .comment-header { display:flex; align-items:center; gap:8px; margin-bottom:3px; }
  .comment-author { font-size:12px; font-weight:600; color:var(--text-primary); }
  .comment-time { font-size:11px; color:var(--text-muted); }
  .comment-text { font-size:13px; color:var(--text-secondary); line-height:1.5; word-break:break-word; }
  .comment-delete {
    padding:3px 6px; border:none; background:transparent; color:var(--text-muted); cursor:pointer;
    border-radius:var(--radius-sm); font-size:11px; font-family:inherit; transition:all var(--transition);
    opacity:0; flex-shrink:0; align-self:flex-start;
  }
  .comment-item:hover .comment-delete { opacity:1; }
  .comment-delete:hover { color:var(--danger); background:var(--danger-subtle); }

  .comment-form { display:flex; gap:8px; margin-top:10px; align-items:flex-start; }
  .comment-form-inputs { flex:1; display:flex; flex-direction:column; gap:6px; }
  .comment-author-input {
    width:140px; padding:6px 10px; background:var(--bg-card); border:1px solid var(--border);
    border-radius:var(--radius-sm); color:var(--text-primary); font-size:12px; font-family:inherit; outline:none;
  }
  .comment-author-input:focus { border-color:var(--accent); }
  .comment-text-row { display:flex; gap:6px; }
  .comment-text-input {
    flex:1; padding:8px 12px; background:var(--bg-card); border:1px solid var(--border);
    border-radius:var(--radius); color:var(--text-primary); font-size:13px; font-family:inherit; outline:none;
    transition:all var(--transition);
  }
  .comment-text-input:focus { border-color:var(--accent); box-shadow:0 0 0 2px var(--accent-subtle); }
  .comment-submit {
    padding:8px 14px; border-radius:var(--radius); border:none; background:var(--accent);
    color:white; font-size:12px; font-family:inherit; font-weight:600; cursor:pointer;
    transition:all var(--transition); white-space:nowrap;
  }
  .comment-submit:hover { background:var(--accent-hover); }
  .comment-submit:disabled { opacity:0.4; cursor:not-allowed; }

  @media (max-width:640px) {
    .app-container { padding:0 14px; }
    .modal { padding:20px; }
    .faq-card { padding:14px 16px; }
    .fab { bottom:20px; right:20px; }
  }
`;

// ─── Sub-Components ─────────────────────────────────────────────────────────

function Toast({ messages }) {
  if (!messages.length) return null;
  return <div className="toast-container">{messages.map((m, i) => <div key={i} className="toast">{m}</div>)}</div>;
}

function ConfirmModal({ message, onConfirm, onCancel, t }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
        <div className="confirm-dialog">
          <p>{message}</p>
          <div className="confirm-actions">
            <button className="btn" onClick={onCancel}>{t.cancel}</button>
            <button className="btn btn-danger" onClick={onConfirm}>{t.delete}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GameFormModal({ onSave, onClose, t }) {
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [icon, setIcon] = useState("🎲");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), nameEn: nameEn.trim() || null, nameDe: null, icon: icon.trim() || "🎲" });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-title">{t.newGame}</div>
        <div className="form-group">
          <label className="form-label">{t.gameName}</label>
          <input className="form-input" placeholder={t.gameNamePh} value={name}
            onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">{t.gameNameEn}</label>
          <input className="form-input" placeholder={t.gameNameEnPh} value={nameEn}
            onChange={(e) => setNameEn(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t.gameIcon}</label>
          <input className="form-input" placeholder={t.gameIconPh} value={icon}
            onChange={(e) => setIcon(e.target.value)} style={{ width: 100 }} />
        </div>
        <div className="btn-row">
          <button className="btn" onClick={onClose}>{t.cancel}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!name.trim()}>
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReferenceFormItem({ refData, index, onChange, onRemove, t }) {
  return (
    <div className="ref-form-item">
      <div className="ref-type-btns">
        {[
          { type: "link", icon: <LinkIcon size={13} /> },
          { type: "image", icon: <ImageIcon size={13} /> },
          { type: "text", icon: <FileTextIcon size={13} /> },
        ].map((tp) => (
          <button key={tp.type} className={`ref-type-btn ${refData.type === tp.type ? "active" : ""}`}
            onClick={() => onChange(index, { ...refData, type: tp.type, value: "", label: "" })} type="button">
            {tp.icon}
          </button>
        ))}
      </div>
      <div className="ref-form-inputs">
        {refData.type === "link" && (
          <>
            <input placeholder={t.langUrl} value={refData.value} onChange={(e) => onChange(index, { ...refData, value: e.target.value })} />
            <input placeholder={t.langUrlLabel} value={refData.label || ""} onChange={(e) => onChange(index, { ...refData, label: e.target.value })} />
          </>
        )}
        {refData.type === "image" && (
          <>
            <input placeholder={t.langImgUrl} value={refData.value} onChange={(e) => onChange(index, { ...refData, value: e.target.value })} />
            <input placeholder={t.langImgLabel} value={refData.label || ""} onChange={(e) => onChange(index, { ...refData, label: e.target.value })} />
          </>
        )}
        {refData.type === "text" && (
          <input placeholder={t.langTextPh} value={refData.value} onChange={(e) => onChange(index, { ...refData, value: e.target.value })} />
        )}
      </div>
      <button className="ref-remove" onClick={() => onRemove(index)} type="button"><XIcon size={14} /></button>
    </div>
  );
}

function FAQFormModal({ faq, games, onSave, onClose, lang, t }) {
  const isEdit = !!faq;
  const [gameId, setGameId] = useState(faq?.gameId || games[0]?.id || "");
  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");
  const [tags, setTags] = useState(faq?.tags || []);
  const [refs, setRefs] = useState(faq?.references || []);

  const toggleTag = (tg) => setTags((prev) => prev.includes(tg) ? prev.filter((x) => x !== tg) : [...prev, tg]);
  const updateRef = (i, newRef) => setRefs((prev) => prev.map((r, idx) => (idx === i ? newRef : r)));
  const removeRef = (i) => setRefs((prev) => prev.filter((_, idx) => idx !== i));
  const addRef = () => setRefs((prev) => [...prev, { type: "text", value: "", label: "" }]);

  const getGameName = (g) => {
    if (lang === "en") return g.nameEn || g.name;
    if (lang === "de") return g.nameDe || g.name;
    return g.name;
  };

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) return;
    onSave({
      ...(faq || {}),
      id: faq?.id || uid(),
      gameId, question: question.trim(), answer: answer.trim(), tags,
      references: refs.filter((r) => r.value.trim()),
      comments: faq?.comments || [],
      likes: faq?.likes || 0, locked: faq?.locked || false, lockedBy: faq?.lockedBy || null,
      createdAt: faq?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{isEdit ? t.editFaq : t.newFaq}</div>
        <div className="form-group">
          <label className="form-label">{t.game}</label>
          <select className="form-select" value={gameId} onChange={(e) => setGameId(e.target.value)}>
            {games.map((g) => <option key={g.id} value={g.id}>{g.icon} {getGameName(g)}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">{t.question}</label>
          <input className="form-input" placeholder={t.questionPh} value={question} onChange={(e) => setQuestion(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t.answer}</label>
          <textarea className="form-textarea" placeholder={t.answerPh} value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">{t.tags}</label>
          <div className="form-tags">
            {DEFAULT_TAGS.map((tg) => (
              <button key={tg} className={`form-tag-btn ${tags.includes(tg) ? "active" : ""}`} onClick={() => toggleTag(tg)} type="button">#{tg}</button>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">{t.references}</label>
          <div className="ref-form-list">
            {refs.map((r, i) => <ReferenceFormItem key={i} refData={r} index={i} onChange={updateRef} onRemove={removeRef} t={t} />)}
            <button className="add-ref-btn" onClick={addRef} type="button"><PlusIcon size={14} /> {t.addRef}</button>
          </div>
        </div>
        <div className="btn-row">
          <button className="btn" onClick={onClose}>{t.cancel}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!question.trim() || !answer.trim()}>
            {isEdit ? t.saveEdit : t.save}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPasswordModal({ onSuccess, onClose, t }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = () => {
    if (pw === "admin1234") { onSuccess(); }
    else { setError(true); setTimeout(() => setError(false), 1500); }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
        <div className="modal-title">{t.adminAuth}</div>
        <div className="form-group">
          <label className="form-label">{t.adminPw}</label>
          <input className="form-input" type="password" placeholder={t.adminPwPh} value={pw}
            onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} autoFocus
            style={error ? { borderColor: "var(--danger)" } : {}} />
          {error && <div style={{ color: "var(--danger)", fontSize: 12, marginTop: 6 }}>{t.adminPwWrong}</div>}
          <div className="admin-pw-hint">{t.adminPwHint}</div>
        </div>
        <div className="btn-row">
          <button className="btn" onClick={onClose}>{t.cancel}</button>
          <button className="btn btn-primary" onClick={handleSubmit}>{t.confirm}</button>
        </div>
      </div>
    </div>
  );
}

const ChatIcon = (p) => <Icon d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" {...p} />;

function CommentSection({ comments, faqId, onAdd, onDelete, isAdmin, t }) {
  const [open, setOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || !author.trim()) return;
    onAdd(faqId, {
      id: uid(),
      author: author.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    });
    setText("");
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const hours = d.getHours().toString().padStart(2, "0");
      const mins = d.getMinutes().toString().padStart(2, "0");
      return `${month}/${day} ${hours}:${mins}`;
    } catch { return ""; }
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div className="comments-section">
      <button className="comments-toggle" onClick={() => setOpen(!open)}>
        <ChatIcon size={14} />
        {open ? t.hideComments : t.showComments}
        <span className="comment-count-badge">{comments.length}</span>
      </button>

      {open && (
        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-avatar">{getInitial(c.author)}</div>
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-author">{c.author}</span>
                  <span className="comment-time">{formatTime(c.createdAt)}</span>
                </div>
                <div className="comment-text">{c.text}</div>
              </div>
              {isAdmin && (
                <button className="comment-delete" onClick={() => onDelete(faqId, c.id)}>
                  {t.commentDelete}
                </button>
              )}
            </div>
          ))}

          <div className="comment-form">
            <div className="comment-form-inputs">
              <input className="comment-author-input" placeholder={t.commentAuthorPh} value={author}
                onChange={(e) => setAuthor(e.target.value)} />
              <div className="comment-text-row">
                <input className="comment-text-input" placeholder={t.commentPh} value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
                <button className="comment-submit" onClick={handleSubmit}
                  disabled={!text.trim() || !author.trim()}>
                  {t.commentSubmit}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TranslateButton({ faq, currentLang, onTranslated, t }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null); // lang code being translated
  const [translated, setTranslated] = useState(null); // { lang, question, answer }
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const targetLangs = LANGUAGES.filter((l) => l.code !== "ko"); // always translate from Korean

  const handleTranslate = async (langCode) => {
    setOpen(false);
    if (translated?.lang === langCode) {
      // toggle off
      setTranslated(null);
      onTranslated(null);
      return;
    }
    setLoading(langCode);
    try {
      const result = await translateFAQ(faq, langCode);
      const tData = { lang: langCode, ...result };
      setTranslated(tData);
      onTranslated(tData);
    } catch {
      onTranslated(null);
    }
    setLoading(null);
  };

  if (loading) {
    return (
      <button className="action-btn translate-btn translating" disabled>
        <span className="spinner" /> {t.translating}
      </button>
    );
  }

  return (
    <div className="translate-dropdown-wrap" ref={wrapRef}>
      <button className={`action-btn translate-btn ${translated ? "active" : ""}`}
        onClick={() => {
          if (translated) { setTranslated(null); onTranslated(null); }
          else setOpen(!open);
        }}>
        <GlobeIcon size={14} />
        {translated ? t.showOriginal : t.translate}
      </button>
      {open && (
        <div className="translate-dropdown">
          {targetLangs.map((l) => (
            <button key={l.code} className="translate-option" onClick={() => handleTranslate(l.code)}>
              <span>{l.flag}</span> {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FAQCard({ faq, game, isAdmin, lockThreshold, onLike, onEdit, onDelete, onLock, onUnlock, onAddComment, onDeleteComment, lang, t, globalTranslation }) {
  const canEdit = isAdmin && !faq.locked;
  const [cardTranslation, setCardTranslation] = useState(null);

  // Use global translation if available, otherwise use card-level translation
  const translation = ENABLE_TRANSLATION ? (globalTranslation || cardTranslation) : null;
  const isGloballyTranslated = ENABLE_TRANSLATION && !!globalTranslation;

  const isAutoLocked = faq.likes >= lockThreshold && !faq.locked;
  useEffect(() => { if (isAutoLocked) onLock(faq.id, "auto"); }, [isAutoLocked]);

  // Clear card translation when global translation changes
  useEffect(() => { if (globalTranslation) setCardTranslation(null); }, [globalTranslation]);

  const getGameName = (g) => {
    if (lang === "en") return g?.nameEn || g?.name;
    if (lang === "de") return g?.nameDe || g?.name;
    return g?.name;
  };

  return (
    <div className={`faq-card ${faq.locked ? "locked" : ""}`}>
      <div className="faq-card-header">
        <div className="faq-question">
          <span style={{ color: "var(--accent)", marginRight: 6 }}>Q.</span>
          {translation ? translation.question : faq.question}
        </div>
        <div className="faq-card-badges">
          {translation && <span className="badge badge-translated"><GlobeIcon size={11} /> {LANGUAGES.find((l) => l.code === translation.lang)?.flag}</span>}
          {faq.locked && <span className="badge badge-locked"><LockIcon size={11} /> {t.locked}</span>}
        </div>
      </div>
      <div className="faq-answer">
        <span style={{ color: "var(--success)", fontWeight: 600, marginRight: 6 }}>A.</span>
        {translation ? translation.answer : faq.answer}
      </div>

      {translation && (
        <div className="faq-translation">
          <div className="faq-translation-label">
            <GlobeIcon size={13} />
            {LANGUAGES.find((l) => l.code === translation.lang)?.flag} {LANGUAGES.find((l) => l.code === translation.lang)?.label} {t.translated}
          </div>
          <div className="faq-translation-q" style={{ fontSize: 12, color: "var(--text-muted)" }}>원문 Q. {faq.question}</div>
          <div className="faq-translation-a" style={{ fontSize: 12, color: "var(--text-muted)" }}>원문 A. {faq.answer}</div>
        </div>
      )}

      {faq.references?.length > 0 && (
        <div className="faq-refs">
          <div className="faq-refs-title">{t.references}</div>
          {faq.references.map((ref, i) => {
            if (ref.type === "link") return <a key={i} className="ref-item" href={ref.value} target="_blank" rel="noopener noreferrer"><LinkIcon size={13} />{ref.label || ref.value}</a>;
            if (ref.type === "image") return (
              <div key={i} className="ref-item" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}><ImageIcon size={13} />{ref.label || "이미지"}</div>
                {ref.value && <img src={ref.value} alt={ref.label || "reference"} />}
              </div>
            );
            return <div key={i} className="ref-item"><FileTextIcon size={13} />{ref.value}</div>;
          })}
        </div>
      )}

      <div className="faq-footer">
        <div className="faq-tags">
          {game && <span className="faq-tag">{game.icon} {getGameName(game)}</span>}
          {faq.tags.map((tg) => <span key={tg} className="faq-tag">#{tg}</span>)}
        </div>
        <div className="faq-actions">
          {ENABLE_TRANSLATION && !isGloballyTranslated && <TranslateButton faq={faq} currentLang={lang} onTranslated={setCardTranslation} t={t} />}
          {ENABLE_TRANSLATION && isGloballyTranslated && (
            <button className="action-btn translate-btn active" style={{ cursor: "default", opacity: 0.7 }}>
              <GlobeIcon size={14} /> {t.translated}
            </button>
          )}
          <button className={`action-btn like-btn ${faq._liked ? "liked" : ""}`} onClick={() => onLike(faq.id)}>
            <HeartIcon filled={faq._liked} size={14} /> {faq.likes}
          </button>
          {canEdit && (
            <>
              <button className="action-btn edit-btn" onClick={() => onEdit(faq)}><EditIcon size={14} /></button>
              <button className="action-btn delete-btn" onClick={() => onDelete(faq.id)}><TrashIcon size={14} /></button>
            </>
          )}
          {isAdmin && !faq.locked && <button className="action-btn lock-btn" onClick={() => onLock(faq.id, "admin")}><LockIcon size={14} /></button>}
          {isAdmin && faq.locked && <button className="action-btn unlock-btn" onClick={() => onUnlock(faq.id)}><LockIcon size={14} /> {t.unlock}</button>}
        </div>
      </div>

      <CommentSection
        comments={faq.comments || []}
        faqId={faq.id}
        onAdd={onAddComment}
        onDelete={onDeleteComment}
        isAdmin={isAdmin}
        t={t}
      />
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [games, setGames] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("all");
  const [selectedTag, setSelectedTag] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRevealed, setAdminRevealed] = useState(false);
  const [showAdminPw, setShowAdminPw] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lockThreshold, setLockThreshold] = useState(LOCK_THRESHOLD_DEFAULT);
  const [editingFaq, setEditingFaq] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showGameForm, setShowGameForm] = useState(false);
  const [gameDrawerOpen, setGameDrawerOpen] = useState(false);
  const [gameSearch, setGameSearch] = useState("");
  const [toasts, setToasts] = useState([]);
  const [lang, setLang] = useState("ko");
  const [langDropOpen, setLangDropOpen] = useState(false);
  const langRef = useRef(null);
  const [globalTranslations, setGlobalTranslations] = useState({});
  const [batchTranslating, setBatchTranslating] = useState(false);
  const [theme, setTheme] = useState("auto");
  // Track which FAQs the current user liked (in-memory per session)
  const [likedIds, setLikedIds] = useState(new Set());

  // ─── Supabase: Load data ─────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch games
      const { data: gamesData } = await supabase.from("games").select("*").order("created_at");
      // Fetch FAQs with references and comments
      const { data: faqsData } = await supabase.from("faqs").select("*").order("likes", { ascending: false });
      const { data: refsData } = await supabase.from("faq_references").select("*");
      const { data: commentsData } = await supabase.from("comments").select("*").order("created_at");

      // Map games to frontend format
      const mappedGames = (gamesData || []).map((g) => ({
        id: g.id, name: g.name, nameEn: g.name_en, nameDe: g.name_de, icon: g.icon,
      }));

      // Group refs and comments by faq_id
      const refsByFaq = {};
      (refsData || []).forEach((r) => {
        if (!refsByFaq[r.faq_id]) refsByFaq[r.faq_id] = [];
        refsByFaq[r.faq_id].push({ type: r.type, value: r.value, label: r.label });
      });
      const commentsByFaq = {};
      (commentsData || []).forEach((c) => {
        if (!commentsByFaq[c.faq_id]) commentsByFaq[c.faq_id] = [];
        commentsByFaq[c.faq_id].push({ id: c.id, author: c.author, text: c.text, createdAt: c.created_at });
      });

      // Map FAQs to frontend format
      const mappedFaqs = (faqsData || []).map((f) => ({
        id: f.id, gameId: f.game_id, question: f.question, answer: f.answer,
        tags: f.tags || [], likes: f.likes || 0, locked: f.locked || false,
        lockedBy: f.locked_by, createdAt: f.created_at, updatedAt: f.updated_at,
        references: refsByFaq[f.id] || [],
        comments: commentsByFaq[f.id] || [],
        _liked: likedIds.has(f.id),
      }));

      setGames(mappedGames);
      setFaqs(mappedFaqs);
    } catch (err) {
      console.error("Failed to load data:", err);
      // Fallback to sample data
      setGames(SAMPLE_GAMES);
      setFaqs(SAMPLE_FAQS.map((f) => ({ ...f, _liked: false })));
    }
    setLoading(false);
  }, [likedIds]);

  useEffect(() => { fetchData(); }, []);

  // ─── Theme ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
    return () => root.removeAttribute("data-theme");
  }, [theme]);

  const resolvedTheme = useMemo(() => {
    if (theme !== "auto") return theme;
    if (typeof window !== "undefined" && window.matchMedia)
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return "dark";
  }, [theme]);

  const cycleTheme = () => {
    if (theme === "auto") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("auto");
  };

  const ADMIN_SECRET = "ZombieCooKiE";
  const t = UI_STRINGS[lang];

  useEffect(() => {
    if (search === ADMIN_SECRET) { setAdminRevealed(true); setSearch(""); showToast("🔓 Admin mode unlocked!"); }
  }, [search]);

  useEffect(() => {
    const handler = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Batch translate
  useEffect(() => {
    if (!ENABLE_TRANSLATION) return;
    if (lang === "ko") { setGlobalTranslations({}); return; }
    let cancelled = false;
    const translateAll = async () => {
      setBatchTranslating(true);
      const newTranslations = {};
      for (const faq of faqs) {
        if (cancelled) break;
        try {
          const result = await translateFAQ(faq, lang);
          newTranslations[faq.id] = { lang, ...result };
          if (!cancelled) setGlobalTranslations({ ...newTranslations });
        } catch { /* skip */ }
      }
      if (!cancelled) setBatchTranslating(false);
    };
    translateAll();
    return () => { cancelled = true; };
  }, [lang, faqs.length]);

  const showToast = (msg) => {
    setToasts((prev) => [...prev, msg]);
    setTimeout(() => setToasts((prev) => prev.slice(1)), 2200);
  };

  const getGameName = (g) => {
    if (lang === "en") return g.nameEn || g.name;
    if (lang === "de") return g.nameDe || g.name;
    return g.name;
  };

  // ─── Supabase Handlers ───────────────────────────────────────────────────

  const handleLike = async (id) => {
    const faq = faqs.find((f) => f.id === id);
    if (!faq) return;
    const wasLiked = likedIds.has(id);
    const newLikes = wasLiked ? faq.likes - 1 : faq.likes + 1;

    // Optimistic update
    setFaqs((prev) => prev.map((f) => f.id === id ? { ...f, likes: newLikes, _liked: !wasLiked } : f));
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(id); else next.add(id);
      return next;
    });

    await supabase.from("faqs").update({ likes: newLikes }).eq("id", id);
  };

  const handleSave = async (faqData) => {
    const isEdit = faqs.some((f) => f.id === faqData.id);

    if (isEdit) {
      // Update FAQ
      await supabase.from("faqs").update({
        game_id: faqData.gameId, question: faqData.question, answer: faqData.answer,
        tags: faqData.tags, updated_at: new Date().toISOString(),
      }).eq("id", faqData.id);
      // Replace references: delete old, insert new
      await supabase.from("faq_references").delete().eq("faq_id", faqData.id);
      if (faqData.references?.length) {
        await supabase.from("faq_references").insert(
          faqData.references.map((r) => ({ faq_id: faqData.id, type: r.type, value: r.value, label: r.label || null }))
        );
      }
      showToast(t.toastEdited);
    } else {
      // Insert new FAQ
      const { data: inserted } = await supabase.from("faqs").insert({
        game_id: faqData.gameId, question: faqData.question, answer: faqData.answer,
        tags: faqData.tags,
      }).select().single();
      // Insert references
      if (inserted && faqData.references?.length) {
        await supabase.from("faq_references").insert(
          faqData.references.map((r) => ({ faq_id: inserted.id, type: r.type, value: r.value, label: r.label || null }))
        );
      }
      showToast(t.toastCreated);
    }
    setShowForm(false);
    setEditingFaq(null);
    fetchData(); // Reload from DB
  };

  const handleDelete = async (id) => {
    await supabase.from("faqs").delete().eq("id", id);
    setDeletingId(null);
    showToast(t.toastDeleted);
    fetchData();
  };

  const handleLock = async (id, by) => {
    await supabase.from("faqs").update({ locked: true, locked_by: by }).eq("id", id);
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, locked: true, lockedBy: by } : f)));
    if (by === "admin") showToast(t.toastLocked);
  };

  const handleUnlock = async (id) => {
    await supabase.from("faqs").update({ locked: false, locked_by: null }).eq("id", id);
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, locked: false, lockedBy: null } : f)));
    showToast(t.toastUnlocked);
  };

  const handleAddComment = async (faqId, comment) => {
    await supabase.from("comments").insert({ faq_id: faqId, author: comment.author, text: comment.text });
    // Optimistic update
    setFaqs((prev) => prev.map((f) => f.id === faqId ? { ...f, comments: [...(f.comments || []), comment] } : f));
  };

  const handleDeleteComment = async (faqId, commentId) => {
    await supabase.from("comments").delete().eq("id", commentId);
    setFaqs((prev) => prev.map((f) => f.id === faqId ? { ...f, comments: (f.comments || []).filter((c) => c.id !== commentId) } : f));
  };

  const handleAddGame = async (gameData) => {
    const { data: inserted } = await supabase.from("games").insert({
      name: gameData.name, name_en: gameData.nameEn, name_de: gameData.nameDe, icon: gameData.icon,
    }).select().single();
    if (inserted) {
      setGames((prev) => [...prev, { id: inserted.id, name: inserted.name, nameEn: inserted.name_en, nameDe: inserted.name_de, icon: inserted.icon }]);
    }
    setShowGameForm(false);
    showToast(t.toastGameCreated);
  };

  const handleAdminToggle = () => {
    if (isAdmin) { setIsAdmin(false); setShowSettings(false); showToast(t.toastAdminOff); }
    else setShowAdminPw(true);
  };

  const filteredFaqs = useMemo(() => {
    return faqs
      .filter((f) => {
        if (selectedGame !== "all" && f.gameId !== selectedGame) return false;
        if (selectedTag && !f.tags.includes(selectedTag)) return false;
        if (search.trim()) {
          const s = search.toLowerCase();
          if (!f.question.toLowerCase().includes(s) && !f.answer.toLowerCase().includes(s) && !f.tags.some((tg) => tg.toLowerCase().includes(s))) return false;
        }
        return true;
      })
      .sort((a, b) => b.likes - a.likes);
  }, [faqs, selectedGame, selectedTag, search]);

  const gameCountMap = useMemo(() => {
    const m = {};
    faqs.forEach((f) => { m[f.gameId] = (m[f.gameId] || 0) + 1; });
    return m;
  }, [faqs]);

  const activeTags = useMemo(() => {
    const tagSet = new Set();
    filteredFaqs.forEach((f) => f.tags.forEach((tg) => tagSet.add(tg)));
    return [...tagSet].sort();
  }, [filteredFaqs]);

  const currentLangInfo = LANGUAGES.find((l) => l.code === lang);

  return (
    <>
      <style>{css}</style>
      <div className="app-container">
        <header className="header">
          <div className="header-top">
            <div className="logo">
              <img src={LOGO_IMG} alt="Meeple Court" className="logo-img" />
              <div>
                <h1>Meeple Court</h1>
                <span className="logo-subtitle">미플 법정</span>
              </div>
            </div>
            <div className="header-controls">
              {/* Theme Toggle */}
              <button className="ctrl-btn" onClick={cycleTheme} title={theme === "auto" ? "Auto" : theme === "light" ? "Light" : "Dark"}>
                {resolvedTheme === "dark" ? <MoonIcon size={15} /> : <SunIcon size={15} />}
                {theme === "auto" && <span style={{ fontSize: 10, opacity: 0.6 }}>A</span>}
              </button>
              {/* Language Switcher */}
              {ENABLE_TRANSLATION && (
              <div className="lang-switcher" ref={langRef}>
                <button className="ctrl-btn" onClick={() => setLangDropOpen(!langDropOpen)}>
                  <GlobeIcon size={15} />
                  {currentLangInfo?.flag} {currentLangInfo?.label}
                  {batchTranslating && <span className="spinner" style={{ marginLeft: 4 }} />}
                </button>
                {langDropOpen && (
                  <div className="lang-dropdown">
                    {LANGUAGES.map((l) => (
                      <button key={l.code} className={`lang-option ${lang === l.code ? "active" : ""}`}
                        onClick={() => { setLang(l.code); setLangDropOpen(false); }}>
                        <span>{l.flag}</span>
                        <span style={{ flex: 1 }}>{l.label}</span>
                        <span className="lang-check">{lang === l.code && <CheckIcon size={14} />}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              )}
              {adminRevealed && isAdmin && (
                <button className="ctrl-btn" onClick={() => setShowSettings(!showSettings)}
                  style={showSettings ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}}>
                  <SettingsIcon size={15} /> {t.settings}
                </button>
              )}
              {adminRevealed && (
                <button className={`ctrl-btn ${isAdmin ? "active" : ""}`} onClick={handleAdminToggle}>
                  <ShieldIcon size={15} /> {isAdmin ? t.adminOn : t.admin}
                </button>
              )}
            </div>
          </div>

          <div className="search-bar">
            <SearchIcon size={17} />
            <input placeholder={t.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {isAdmin && showSettings && (
            <div className="settings-panel">
              <div className="settings-row">
                <span className="settings-label">{t.lockThreshold}</span>
                <input className="settings-input" type="number" min={1} value={lockThreshold}
                  onChange={(e) => setLockThreshold(Math.max(1, parseInt(e.target.value) || 1))} />
              </div>
            </div>
          )}
        </header>

        <div className="game-selector-row">
          <button className="game-selector-btn" onClick={() => setGameDrawerOpen(true)}>
            <span>{selectedGame === "all" ? "📋" : (games.find(g => g.id === selectedGame)?.icon ?? "🎲")}</span>
            <span className="game-selector-name">
              {selectedGame === "all" ? t.all : (games.find(g => g.id === selectedGame) ? getGameName(games.find(g => g.id === selectedGame)) : t.selectGame)}
            </span>
            <span className="game-selector-count">
              {selectedGame === "all" ? faqs.length : (gameCountMap[selectedGame] || 0)}
            </span>
            <ChevronDownIcon size={15} />
          </button>
        </div>

        {gameDrawerOpen && (
          <>
            <div className="game-drawer-overlay" onClick={() => setGameDrawerOpen(false)} />
            <div className="game-drawer">
              <div className="game-drawer-header">
                <span className="game-drawer-title">🎲 {t.selectGame}</span>
                <button className="game-drawer-close" onClick={() => setGameDrawerOpen(false)}><XIcon size={17} /></button>
              </div>
              <div className="game-drawer-search-wrap">
                <div className="game-drawer-search">
                  <SearchIcon size={15} />
                  <input
                    placeholder={t.gameSearch}
                    value={gameSearch}
                    onChange={(e) => setGameSearch(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="game-drawer-list">
                {!gameSearch && (
                  <button
                    className={`game-drawer-item ${selectedGame === "all" ? "active" : ""}`}
                    onClick={() => { setSelectedGame("all"); setGameDrawerOpen(false); setGameSearch(""); }}
                  >
                    <span>📋</span>
                    <span className="item-name">{t.all}</span>
                    <span className="item-count">{faqs.length}</span>
                  </button>
                )}
                {games
                  .filter(g => !gameSearch || getGameName(g).toLowerCase().includes(gameSearch.toLowerCase()) || (g.nameEn || "").toLowerCase().includes(gameSearch.toLowerCase()))
                  .map((g) => (
                    <button
                      key={g.id}
                      className={`game-drawer-item ${selectedGame === g.id ? "active" : ""}`}
                      onClick={() => { setSelectedGame(g.id); setGameDrawerOpen(false); setGameSearch(""); }}
                    >
                      <span>{g.icon}</span>
                      <span className="item-name">{getGameName(g)}</span>
                      <span className="item-count">{gameCountMap[g.id] || 0}</span>
                    </button>
                  ))
                }
                {gameSearch && games.filter(g => getGameName(g).toLowerCase().includes(gameSearch.toLowerCase()) || (g.nameEn || "").toLowerCase().includes(gameSearch.toLowerCase())).length === 0 && (
                  <div style={{ padding: "20px 12px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>검색 결과 없음</div>
                )}
              </div>
              <div className="game-drawer-footer">
                <button className="game-drawer-add" onClick={() => { setShowGameForm(true); setGameDrawerOpen(false); }}>
                  <PlusIcon size={14} /> {t.addGame}
                </button>
              </div>
            </div>
          </>
        )}

        {activeTags.length > 0 && (
          <div className="tag-filters">
            {activeTags.map((tg) => (
              <button key={tg} className={`tag-chip ${selectedTag === tg ? "active" : ""}`}
                onClick={() => setSelectedTag(selectedTag === tg ? null : tg)}>
                #{tg}
              </button>
            ))}
          </div>
        )}

        <div className="faq-list">
          {loading ? (
            <div className="faq-empty">
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><span className="spinner" style={{ width: 24, height: 24 }} /></div>
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : filteredFaqs.length === 0 ? (
            <div className="faq-empty">
              <div className="faq-empty-icon">🔍</div>
              <p>{t.noResults}</p>
              <p style={{ marginTop: 4 }}>{t.noResultsSub}</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <FAQCard key={faq.id} faq={faq} game={games.find((g) => g.id === faq.gameId)}
                isAdmin={isAdmin} lockThreshold={lockThreshold}
                onLike={handleLike} onEdit={(f) => { setEditingFaq(f); setShowForm(true); }}
                onDelete={(id) => setDeletingId(id)} onLock={handleLock} onUnlock={handleUnlock}
                onAddComment={handleAddComment} onDeleteComment={handleDeleteComment}
                lang={lang} t={t} globalTranslation={globalTranslations[faq.id] || null} />
            ))
          )}
        </div>

        <button className="fab" onClick={() => { setEditingFaq(null); setShowForm(true); }} title={t.newFaq}>
          <PlusIcon size={24} />
        </button>
      </div>

      {showForm && <FAQFormModal faq={editingFaq} games={games} onSave={handleSave} onClose={() => { setShowForm(false); setEditingFaq(null); }} lang={lang} t={t} />}
      {showGameForm && <GameFormModal onSave={handleAddGame} onClose={() => setShowGameForm(false)} t={t} />}
      {showAdminPw && <AdminPasswordModal onSuccess={() => { setIsAdmin(true); setShowAdminPw(false); showToast(t.toastAdminOn); }} onClose={() => setShowAdminPw(false)} t={t} />}
      {deletingId && <ConfirmModal message={t.deleteConfirm} onConfirm={() => handleDelete(deletingId)} onCancel={() => setDeletingId(null)} t={t} />}
      <Toast messages={toasts} />
    </>
  );
}
