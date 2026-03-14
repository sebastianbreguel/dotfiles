---
description: Analyze UI components/pages and redesign them using ui-designer and ux-designer agents. Usage - /redesign-ui [file or component path]
---

Analyze the UI of the given file, component, or page and produce a comprehensive redesign using both UX and UI expertise.

## Input

The user has provided: $ARGUMENTS

If no arguments were provided, ask the user which file, component, or page they want to analyze and redesign.

## Process

Follow these steps precisely:

### Step 1: Identify the Target

Read the target file(s) to understand the current UI implementation. If the argument is a directory or component name, find all relevant files (templates, styles, components).

### Step 2: Parallel Analysis

Launch **two agents in parallel**:

1. **UX Designer Agent** (`ux-designer` subagent): Analyze the current implementation for:
   - User flow and interaction issues
   - Usability problems (accessibility, cognitive load, information hierarchy)
   - Navigation and discoverability concerns
   - User journey pain points
   - Missing states (empty, loading, error, edge cases)
   - Mobile/responsive considerations
   - Concrete UX improvement recommendations with rationale

2. **UI Designer Agent** (`ui-designer` subagent): Analyze the current implementation for:
   - Visual hierarchy and layout issues
   - Typography, color, and spacing inconsistencies
   - Component design and reusability problems
   - Design system alignment
   - Accessibility concerns (contrast, sizing, focus states)
   - Animation and interaction feedback gaps
   - Concrete UI improvement recommendations with specifications

Both agents should read the actual source code and provide specific, actionable feedback referencing exact lines and components.

### Step 3: Synthesize Findings

After both agents return, synthesize their findings into a unified redesign plan:

1. **Current State Summary**: Brief description of what exists today
2. **Issues Found**: Merged and deduplicated list from both agents, categorized as:
   - Critical (blocks usability or accessibility)
   - Major (significantly degrades experience)
   - Minor (polish and refinement)
3. **Redesign Proposal**: A concrete plan that addresses the findings, including:
   - Layout and structure changes
   - Component modifications or new components needed
   - Typography and color adjustments
   - Interaction and animation improvements
   - Accessibility fixes
   - Responsive behavior changes

### Step 4: Implement the Redesign

Apply the redesign by editing the existing files. For each change:
- Make the code change
- Briefly note what was changed and why (referencing the analysis)

Focus on high-impact changes first (Critical > Major > Minor). If the redesign is too large for a single pass, implement the critical and major changes, then list remaining minor improvements for the user to decide on.

### Step 5: Final Review

Launch the **ui-designer agent** one more time to review the implemented changes and confirm the redesign addresses the identified issues. If any critical issues remain, fix them.

## Output

Present the final result to the user:
- Summary of changes made
- Before/after comparison of key decisions
- Any remaining minor improvements not yet implemented
- Suggestions for further iteration
