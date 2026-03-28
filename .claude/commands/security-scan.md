Run a security audit of the Claude Code configuration for this project.

## Steps

1. Run AgentShield scan:
```bash
npx ecc-agentshield scan
```

2. If the grade is below B, also run the deep scan:
```bash
npx ecc-agentshield scan --fix
```

3. Review the findings and present:
   - Overall grade and score
   - Critical and high findings with remediation steps
   - Medium/low findings summarized
   - Comparison with previous scan if available

4. For any critical or high findings, propose specific fixes to settings.json, CLAUDE.md, or hooks configuration.

5. If $ARGUMENTS contains "deep" or "opus", run the advanced scan:
```bash
npx ecc-agentshield scan --opus --stream
```
