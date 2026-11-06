/* Authored demo reply and review rules preserved from the supplied prototype. */
(() => {
  function demoReply(message, a) {
    const count = a.messages.filter((m) => m.role === "user").length,
      sc = a.scenario;
    const supportive =
      /(sorry|tough|difficult|hard|stress|understand|hear|here for|feel|sounds|worried|must be|listen|చాలా|బాధ|అర్థం|మాట్లాడ|माफ|दुख|समझ|सुन)/i.test(
        message,
      );
    const quickAdvice =
      /(just|simply|easy|don't worry|apply|move on|forget|deal with it|you should|need to|find another|कोई बात नहीं|चिंता मत)/i.test(
        message,
      );
    if (a.moduleId === "comfort" && count === 1) {
      if (quickAdvice && !supportive)
        return "I know you mean well, but right now I am feeling pretty overwhelmed. I'm worried about everything.";
      if (supportive)
        return "Thanks for listening. It happened so suddenly, and I'm really worried about what comes next.";
    }
    if (a.moduleId === "boundaries" && count === 1) {
      if (
        /(can't|cannot|won't|unable|busy|not available|नहीं|కాదు|చేయలేను)/i.test(
          message,
        )
      )
        return "I understand. Is there another time you might be available?";
      return "Thanks, but I don't want you to feel pressured. What works for you?";
    }
    if (a.moduleId === "conversation" && count === 1) {
      return "Yeah, I’ve enjoyed it so far. I came because I wanted to meet new people and learn something different.";
    }
    return sc.followups[Math.min(count - 1, sc.followups.length - 1)];
  }
  function quote(t) {
    return String(t || "").length > 170
      ? String(t).slice(0, 170) + "…"
      : String(t || "");
  }
  function evaluateLocal(a) {
    const responses = a.messages
        .filter((m) => m.role === "user")
        .map((m) => m.text),
      first = responses[0] || "",
      all = responses.join(" "),
      issues = [],
      strengths = [];
    if (responses.length < 2)
      return {
        status: "insufficient",
        summary: "We need at least two responses to give useful feedback.",
        strengths: [],
        issues: [],
        notAssessed: ["Spoken fluency"],
      };
    if (a.moduleId === "comfort") {
      const empathy = responses.find((x) =>
        /(sorry|tough|difficult|hard|stress|understand|hear|here for|feel|sounds|worried|must be|listen|బాధ|అర్థం|మాట్లాడ|दुख|समझ|सुन)/i.test(
          x,
        ),
      );
      const advice = responses.find((x) =>
        /(don't worry|just find|just apply|move on|forget|you should|need to|चिंता मत)/i.test(
          x,
        ),
      );
      if (empathy)
        strengths.push(
          "You used language that acknowledged the other person’s concern.",
        );
      if (
        advice &&
        (!empathy || responses.indexOf(advice) <= responses.indexOf(empathy))
      )
        issues.push({
          title: "You may have moved to solutions too quickly",
          evidence: quote(advice),
          why: `${a.scenario?.name || "The character"} had just shared an emotional concern. Reassurance or advice may land better after acknowledgment.`,
          alternative:
            "That sounds stressful. Would you like to talk about what worries you most?",
          focus: "Acknowledge before advising.",
        });
      if (!empathy)
        issues.push({
          title: "Acknowledge the feeling first",
          evidence: quote(first),
          why: "Your response did not clearly recognize the concern that the character shared.",
          alternative: "I’m sorry this happened. That sounds really difficult.",
          focus: "Reflect the person’s concern.",
        });
      if (
        !responses.some(
          (x) =>
            x.includes("?") ||
            /(tell me|what happened|how are|would you like|do you want|क्या|ఎలా|ఏమి)/i.test(
              x,
            ),
        )
      )
        issues.push({
          title: "Make room for the other person to share",
          evidence: quote(first),
          why: "You could invite the other person to talk rather than carrying the conversation alone.",
          alternative: "Would you like to tell me more about what happened?",
          focus: "Ask one gentle open-ended question.",
        });
      if (responses.some((x) => x.includes("?")))
        strengths.push(
          "You invited the character to continue the conversation.",
        );
    } else if (a.moduleId === "boundaries") {
      const clear = responses.find((x) =>
        /(can't|cannot|won't|unable|not available|not possible|don't have time|नहीं|కాదు|చేయలేను)/i.test(
          x,
        ),
      );
      if (clear)
        strengths.push(
          "You expressed a boundary rather than leaving the request unanswered.",
        );
      else
        issues.push({
          title: "State your boundary more explicitly",
          evidence: quote(first),
          why: "The other person may not know whether you have accepted or declined the request.",
          alternative:
            "I can’t stay late tonight, but I can review it tomorrow.",
          focus: "Make your availability clear.",
        });
      if (/(maybe|i guess|somehow|probably|perhaps)/i.test(all))
        issues.push({
          title: "Avoid promises you may not be able to keep",
          evidence: quote(
            responses.find((x) =>
              /(maybe|i guess|somehow|probably|perhaps)/i.test(x),
            ),
          ),
          why: "Vague agreement can create expectations that are difficult to meet.",
          alternative: "I can’t take that on today.",
          focus: "Use a realistic, direct answer.",
        });
    } else {
      if (responses.some((x) => x.includes("?")))
        strengths.push(
          "You asked a question that invited the other person to respond.",
        );
      else
        issues.push({
          title: "Try a relevant follow-up question",
          evidence: quote(first),
          why: "A question about something the other person shared can keep the conversation moving.",
          alternative: "What interested you in coming to this workshop?",
          focus: "Build on a detail they mentioned.",
        });
      if (responses.every((x) => x.trim().split(/\s+/).length < 4))
        issues.push({
          title: "Share enough context to build a connection",
          evidence: quote(first),
          why: "Very brief responses may leave the other person unsure how to continue.",
          alternative:
            "I’m new here too. I came because I enjoy learning about design.",
          focus: "Add one useful detail.",
        });
    }
    return {
      status: "completed",
      summary: issues.length
        ? "You completed the conversation. Here are specific opportunities to improve your next attempt."
        : "You completed the conversation without any significant issues detected by this demo rubric.",
      strengths: strengths.slice(0, 2),
      issues: issues.slice(0, 2),
      notAssessed: ["Spoken fluency and accent"],
    };
  }

  window.SamvadPracticeLogic = Object.freeze({ demoReply, evaluateLocal });
})();
