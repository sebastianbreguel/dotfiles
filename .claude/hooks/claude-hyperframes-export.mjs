#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      args[key] = "true";
      continue;
    }
    args[key] = value;
    i += 1;
  }
  return args;
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value
    .replace(/\u001b\[[0-9;]*m/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, maxLen) {
  if (text.length <= maxLen) {
    return text;
  }
  return `${text.slice(0, maxLen - 1)}…`;
}

function asItems(content) {
  if (Array.isArray(content)) {
    return content;
  }
  if (typeof content === "string") {
    return [{ type: "text", text: content }];
  }
  return [];
}

function extractUserText(record) {
  const items = asItems(record?.message?.content);
  const chunks = [];
  for (const item of items) {
    if (item?.type === "text") {
      const text = normalizeText(item?.text ?? item?.content ?? "");
      if (text) {
        chunks.push(text);
      }
    }
  }
  return normalizeText(chunks.join(" "));
}

function extractAssistantPayload(record) {
  const message = record?.message;
  const items = asItems(message?.content);
  const toolNames = [];
  const textChunks = [];

  for (const item of items) {
    if (item?.type === "tool_use") {
      if (typeof item?.name === "string" && item.name.trim()) {
        toolNames.push(item.name.trim());
      }
      continue;
    }
    if (item?.type === "text") {
      const text = normalizeText(item?.text ?? "");
      if (text) {
        textChunks.push(text);
      }
    }
  }

  return {
    text: normalizeText(textChunks.join(" ")),
    toolNames,
  };
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "n/a";
  }
  const rounded = Math.round(seconds);
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;
  return `${mins}m ${secs}s`;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildTimelineMarkdown(summary) {
  const lines = [];
  lines.push("# Claude Session Timeline");
  lines.push("");
  lines.push(`- Session ID: \`${summary.sessionId}\``);
  lines.push(`- Project CWD: \`${summary.cwd}\``);
  lines.push(`- Transcript: \`${summary.transcriptPath}\``);
  lines.push(`- Started: ${summary.startedAt ?? "n/a"}`);
  lines.push(`- Ended: ${summary.endedAt ?? "n/a"}`);
  lines.push(`- Duration: ${summary.durationHuman}`);
  lines.push(`- User prompts: ${summary.totals.userPrompts}`);
  lines.push(`- Assistant messages: ${summary.totals.assistantMessages}`);
  lines.push(`- Tool calls: ${summary.totals.toolCalls}`);
  lines.push("");
  lines.push("## Top Tools");
  if (summary.topTools.length === 0) {
    lines.push("- none");
  } else {
    for (const tool of summary.topTools) {
      lines.push(`- ${tool.name}: ${tool.count}`);
    }
  }
  lines.push("");
  lines.push("## Highlights");
  if (summary.turns.length === 0) {
    lines.push("- No text turns captured.");
  } else {
    for (let i = 0; i < summary.turns.length; i += 1) {
      const turn = summary.turns[i];
      lines.push(`${i + 1}. User: ${turn.user}`);
      lines.push(`${i + 1}. Assistant: ${turn.assistant}`);
    }
  }
  lines.push("");
  return lines.join("\n");
}

function buildDesignFile() {
  return [
    "# DESIGN",
    "",
    "## Style Prompt",
    "Editorial dashboard mood with midnight gradient, cyan accents, and high contrast cards that read like a session replay.",
    "",
    "## Colors",
    "- Canvas: `#071226`",
    "- Secondary canvas: `#102b4d`",
    "- Accent cyan: `#00d4ff`",
    "- Accent mint: `#6ef3d6`",
    "- Text primary: `#f5fbff`",
    "",
    "## Typography",
    "- `Inter, Segoe UI, sans-serif`",
    "",
    "## What NOT to Do",
    "- No default blue gradients",
    "- No low-contrast gray-on-gray text",
    "- No dense paragraphs without card structure",
  ].join("\n");
}

function buildHyperframesIndex(summary) {
  const compositionId = `claude-session-${summary.sessionId.slice(0, 8)}`;
  const introDuration = 3.2;
  const cardStep = 2.8;
  const cardDuration = 2.75;
  const outroDuration = 1.8;
  const turns = summary.turns.length > 0
    ? summary.turns
    : [{ user: "No prompt text captured.", assistant: "Session ended without assistant text output." }];
  const totalDuration = introDuration + turns.length * cardStep + outroDuration;
  const totalDurationStr = totalDuration.toFixed(2);

  const cardsHtml = [];
  const cardsAnim = [];

  for (let i = 0; i < turns.length; i += 1) {
    const turn = turns[i];
    const start = introDuration + i * cardStep;
    const startStr = start.toFixed(2);
    const exitStart = (start + cardDuration - 0.45).toFixed(2);
    const cardId = `turn-${i + 1}`;

    cardsHtml.push(
      `      <section id="${cardId}" class="clip turn-card" data-start="${startStr}" data-duration="${cardDuration.toFixed(2)}" data-track-index="3">`,
      `        <p class="turn-label">Turn ${i + 1}</p>`,
      `        <p class="turn-user"><span>User:</span> ${escapeHtml(turn.user)}</p>`,
      `        <p class="turn-assistant"><span>Assistant:</span> ${escapeHtml(turn.assistant)}</p>`,
      "      </section>",
    );

    cardsAnim.push(
      `      tl.from("#${cardId}", { opacity: 0, x: 80, duration: 0.45, ease: "power3.out" }, ${startStr});`,
      `      tl.to("#${cardId}", { opacity: 0, x: -60, duration: 0.35, ease: "power2.in" }, ${exitStart});`,
    );
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Claude Session Replay</title>
    <style>
      body {
        margin: 0;
        font-family: "Inter", "Segoe UI", sans-serif;
        background: #071226;
        color: #f5fbff;
      }
      [data-composition-id="${compositionId}"] {
        position: relative;
        width: 1920px;
        height: 1080px;
        overflow: hidden;
        background: radial-gradient(1200px 680px at 12% 12%, #133865 0%, #071226 68%);
      }
      .clip {
        position: absolute;
        box-sizing: border-box;
      }
      .bg {
        inset: 0;
        background:
          radial-gradient(900px 500px at 90% 20%, rgba(0, 212, 255, 0.18), transparent 62%),
          linear-gradient(140deg, #071226 0%, #102b4d 48%, #071226 100%);
      }
      .header {
        left: 84px;
        top: 74px;
        width: 1180px;
      }
      .title {
        margin: 0;
        font-size: 72px;
        line-height: 1.02;
        letter-spacing: -0.03em;
      }
      .subtitle {
        margin: 16px 0 0;
        font-size: 30px;
        color: #92d6ff;
      }
      .metrics {
        right: 82px;
        top: 86px;
        width: 690px;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }
      .metric {
        border: 1px solid rgba(0, 212, 255, 0.36);
        background: rgba(8, 30, 54, 0.8);
        border-radius: 18px;
        padding: 16px 20px;
      }
      .metric-label {
        margin: 0;
        font-size: 18px;
        color: #9dc9ff;
      }
      .metric-value {
        margin: 8px 0 0;
        font-size: 38px;
        font-weight: 700;
        color: #f5fbff;
      }
      .turn-card {
        left: 84px;
        top: 320px;
        width: 1752px;
        min-height: 520px;
        padding: 36px 42px 32px;
        border-radius: 24px;
        border: 1px solid rgba(110, 243, 214, 0.35);
        background: linear-gradient(160deg, rgba(4, 16, 35, 0.94) 0%, rgba(15, 46, 78, 0.92) 100%);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
      }
      .turn-label {
        margin: 0;
        font-size: 22px;
        color: #6ef3d6;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      .turn-user,
      .turn-assistant {
        margin: 22px 0 0;
        font-size: 37px;
        line-height: 1.35;
      }
      .turn-user span,
      .turn-assistant span {
        color: #8fd8ff;
        font-weight: 700;
      }
      .outro {
        left: 84px;
        bottom: 70px;
        width: 1752px;
        font-size: 28px;
        color: #a5cbff;
      }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="${compositionId}" data-start="0" data-duration="${totalDurationStr}" data-width="1920" data-height="1080">
      <div id="bg" class="clip bg" data-start="0" data-duration="${totalDurationStr}" data-track-index="0"></div>

      <header id="header" class="clip header" data-start="0" data-duration="3.20" data-track-index="1">
        <h1 class="title">Claude Session Replay</h1>
        <p class="subtitle">${escapeHtml(path.basename(summary.cwd || "workspace"))} · ${escapeHtml(summary.durationHuman)}</p>
      </header>

      <section id="metrics" class="clip metrics" data-start="0.20" data-duration="${(totalDuration - 0.2).toFixed(2)}" data-track-index="2">
        <article class="metric">
          <p class="metric-label">User Prompts</p>
          <p class="metric-value">${summary.totals.userPrompts}</p>
        </article>
        <article class="metric">
          <p class="metric-label">Assistant Messages</p>
          <p class="metric-value">${summary.totals.assistantMessages}</p>
        </article>
        <article class="metric">
          <p class="metric-label">Tool Calls</p>
          <p class="metric-value">${summary.totals.toolCalls}</p>
        </article>
        <article class="metric">
          <p class="metric-label">Top Tool</p>
          <p class="metric-value">${escapeHtml(summary.topTools[0]?.name ?? "none")}</p>
        </article>
      </section>

${cardsHtml.join("\n")}

      <p id="outro" class="clip outro" data-start="${(totalDuration - outroDuration).toFixed(2)}" data-duration="${outroDuration.toFixed(2)}" data-track-index="4">
        Rendered from transcript ${escapeHtml(path.basename(summary.transcriptPath))}
      </p>

      <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
      <script>
        window.__timelines = window.__timelines || {};
        const tl = gsap.timeline({ paused: true });
        tl.from("#header", { opacity: 0, y: -40, duration: 0.6, ease: "power3.out" }, 0);
        tl.from("#metrics .metric", { opacity: 0, y: 26, duration: 0.45, stagger: 0.08, ease: "power2.out" }, 0.2);
${cardsAnim.join("\n")}
        tl.from("#outro", { opacity: 0, y: 18, duration: 0.35, ease: "power2.out" }, ${(totalDuration - outroDuration).toFixed(2)});
        window.__timelines["${compositionId}"] = tl;
      </script>
    </div>
  </body>
</html>
`;
}

function toDate(value) {
  if (typeof value !== "string") {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  let hookInput = {};
  if (args["hook-input"]) {
    const raw = fs.readFileSync(args["hook-input"], "utf8");
    hookInput = JSON.parse(raw);
  }

  const transcriptPath = args.transcript || hookInput.transcript_path;
  const sessionId = args["session-id"] || hookInput.session_id || path.basename(transcriptPath || "", ".jsonl") || "unknown-session";
  const cwd = args.cwd || hookInput.cwd || "";
  const reason = args.reason || hookInput.reason || "other";

  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    throw new Error(`Transcript not found: ${transcriptPath ?? "(missing)"}`);
  }

  const lines = fs.readFileSync(transcriptPath, "utf8").split(/\r?\n/);
  const toolCounts = new Map();
  const pendingUsers = [];
  const turns = [];

  let recordCount = 0;
  let userPrompts = 0;
  let assistantMessages = 0;
  let toolCalls = 0;
  let startedAt = null;
  let endedAt = null;

  function absorbTimestamp(value) {
    const asDate = toDate(value);
    if (!asDate) {
      return;
    }
    if (!startedAt || asDate < startedAt) {
      startedAt = asDate;
    }
    if (!endedAt || asDate > endedAt) {
      endedAt = asDate;
    }
  }

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    let record;
    try {
      record = JSON.parse(line);
    } catch {
      continue;
    }

    recordCount += 1;
    absorbTimestamp(record.timestamp);

    if (record.type === "user") {
      const text = extractUserText(record);
      if (text) {
        userPrompts += 1;
        pendingUsers.push({
          timestamp: record.timestamp ?? null,
          text,
        });
      }
      continue;
    }

    const isAssistant = record.type === "assistant" || record?.message?.role === "assistant";
    if (!isAssistant) {
      continue;
    }

    const payload = extractAssistantPayload(record);

    for (const toolName of payload.toolNames) {
      toolCalls += 1;
      toolCounts.set(toolName, (toolCounts.get(toolName) ?? 0) + 1);
    }

    if (!payload.text) {
      continue;
    }

    assistantMessages += 1;
    const userTurn = pendingUsers.shift();
    if (!userTurn) {
      continue;
    }

    turns.push({
      timestamp: record.timestamp ?? userTurn.timestamp ?? null,
      user: truncate(userTurn.text, 260),
      assistant: truncate(payload.text, 300),
    });
  }

  const durationSeconds = startedAt && endedAt ? Math.max(0, (endedAt.getTime() - startedAt.getTime()) / 1000) : null;
  const durationHuman = formatDuration(durationSeconds);
  const topTools = [...toolCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  const selectedTurns = turns.slice(-6);

  const summary = {
    sessionId,
    reason,
    cwd,
    transcriptPath,
    startedAt: startedAt ? startedAt.toISOString() : null,
    endedAt: endedAt ? endedAt.toISOString() : null,
    durationSeconds: durationSeconds !== null ? Math.round(durationSeconds * 100) / 100 : null,
    durationHuman,
    totals: {
      records: recordCount,
      userPrompts,
      assistantMessages,
      toolCalls,
    },
    topTools,
    turns: selectedTurns,
  };

  const outRoot = process.env.CLAUDE_HYPERFRAMES_OUT_DIR || path.join(os.homedir(), ".claude", "hyperframes");
  const projectsDir = path.join(outRoot, "projects");
  const sessionsDir = path.join(outRoot, "sessions");
  const projectDir = path.join(projectsDir, sessionId);
  fs.mkdirSync(projectDir, { recursive: true });
  fs.mkdirSync(sessionsDir, { recursive: true });

  const summaryPath = path.join(projectDir, "summary.json");
  const timelinePath = path.join(projectDir, "timeline.md");
  const designPath = path.join(projectDir, "DESIGN.md");
  const metaPath = path.join(projectDir, "meta.json");
  const indexPath = path.join(projectDir, "index.html");
  const renderScriptPath = path.join(projectDir, "render.sh");
  const sessionStamp = (summary.endedAt ?? new Date().toISOString()).replace(/[:.]/g, "-");
  const archiveSummaryPath = path.join(sessionsDir, `${sessionStamp}-${sessionId}.json`);

  fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  fs.writeFileSync(archiveSummaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  fs.writeFileSync(timelinePath, buildTimelineMarkdown(summary), "utf8");
  fs.writeFileSync(designPath, buildDesignFile(), "utf8");
  fs.writeFileSync(
    metaPath,
    `${JSON.stringify(
      {
        id: sessionId,
        name: `Claude session ${sessionId.slice(0, 8)}`,
        createdAt: new Date().toISOString(),
        source: "claude-hyperframes-export",
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  fs.writeFileSync(indexPath, buildHyperframesIndex(summary), "utf8");
  fs.writeFileSync(
    renderScriptPath,
    "#!/usr/bin/env bash\nset -euo pipefail\nnpx hyperframes render --output output.mp4\n",
    "utf8",
  );
  try {
    fs.chmodSync(renderScriptPath, 0o755);
  } catch {
    // Non-fatal on restricted filesystems.
  }

  const output = {
    ok: true,
    sessionId,
    reason,
    projectDir,
    files: {
      summaryPath,
      timelinePath,
      designPath,
      indexPath,
      archiveSummaryPath,
    },
  };

  process.stdout.write(`${JSON.stringify(output)}\n`);
}

main();
