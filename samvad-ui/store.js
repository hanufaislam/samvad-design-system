/* One local product state, with conservative migration of the earlier preview. */
(() => {
  const KEY = "samvad.review.v1";
  const defaults = () => ({
    schema: 2,
    name: "Learner",
    language: "en",
    captions: true,
    voice: true,
    goals: [],
    confidence: "",
    completed: [],
    deepCompleted: [],
    sessions: [],
    activity: [],
    legacyCompleted: [],
    draft: "",
    startedAt: Date.now(),
  });
  const languageCode = (value) =>
    ({
      English: "en",
      Hindi: "hi",
      Telugu: "te",
      en: "en",
      hi: "hi",
      te: "te",
    })[value] || "en";
  const array = (value) => (Array.isArray(value) ? value : []);
  const strings = (value) => [
    ...new Set(array(value).filter((x) => typeof x === "string")),
  ];
  function normalize(raw = {}) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) raw = {};
    const pref =
      raw.preferences && typeof raw.preferences === "object"
        ? raw.preferences
        : {};
    const content = window.SAMVAD_DATA;
    return {
      ...defaults(),
      name: typeof raw.name === "string" ? raw.name.slice(0, 80) : "Learner",
      language: languageCode(pref.language || raw.language),
      captions:
        typeof raw.captions === "boolean"
          ? raw.captions
          : pref.subtitles !== "Subtitles off",
      voice: typeof raw.voice === "boolean" ? raw.voice : true,
      goals: strings(pref.goals || raw.goals).slice(0, 3),
      confidence:
        typeof (pref.confidence || raw.confidence) === "string"
          ? pref.confidence || raw.confidence
          : "",
      completed: strings(raw.completed).filter((id) => content.lessons[id]),
      deepCompleted: strings(raw.deepCompleted).filter(
        (id) => content.deep[id],
      ),
      sessions: array(raw.sessions)
        .filter(
          (s) =>
            s &&
            typeof s.id === "string" &&
            content.modules.some((m) => m.id === s.moduleId) &&
            Array.isArray(s.messages) &&
            s.review,
        )
        .slice(0, 30),
      activity: strings(raw.activity).filter((d) =>
        /^\d{4}-\d{2}-\d{2}$/.test(d),
      ),
      legacyCompleted: strings([
        ...(raw.schema === 2
          ? array(raw.legacyCompleted)
          : array(raw.completed).filter((id) => !content.lessons[id])),
        ...array(raw.legacyCompleted),
      ]).filter((id) =>
        ["first-move", "clear-message", "listen-closely"].includes(id),
      ),
      draft: typeof raw.draft === "string" ? raw.draft.slice(0, 10000) : "",
      currentLesson:
        raw.currentLesson && content.lessons[raw.currentLesson.lessonId]
          ? {
              view: "lesson",
              lessonId: raw.currentLesson.lessonId,
              moduleId: content.modules.find((m) =>
                m.lessons.includes(raw.currentLesson.lessonId),
              ).id,
              segment: ["watch", "learn", "examples", "check"].includes(
                raw.currentLesson.segment,
              )
                ? raw.currentLesson.segment
                : "watch",
              line: Math.max(
                0,
                Math.min(2, Number(raw.currentLesson.line) || 0),
              ),
              ...(Number.isInteger(raw.currentLesson.choice)
                ? { choice: raw.currentLesson.choice }
                : {}),
            }
          : undefined,
      lastModule: content.modules.some(
        (m) => m.id === raw.lastModule && !m.comingSoon,
      )
        ? raw.lastModule
        : undefined,
      startedAt: Number.isFinite(raw.startedAt) ? raw.startedAt : Date.now(),
    };
  }
  const load = () => {
    try {
      const current = localStorage.getItem(KEY);
      if (current) return normalize(JSON.parse(current));
      return normalize(JSON.parse(localStorage.getItem("samvad-v1") || "{}"));
    } catch {
      return defaults();
    }
  };
  const save = (user) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...user, schema: 2 }));
      return true;
    } catch {
      return false;
    }
  };
  window.SamvadStore = { KEY, defaults, normalize, load, save, languageCode };
})();
