---
name: usage
description: Show agent, skill, and plugin invocation counts across all sessions
---

Run engram usage command and display results:

```bash
uv run ${CLAUDE_PLUGIN_ROOT}/tools/engram.py usage
```

Display output to user. Format shows:
- Agent invocations by subagent_type
- Skill invocations by skill name  
- Plugin/MCP invocations by plugin name
- Sorted by stalest first (least recently used)
