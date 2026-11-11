---
version: alpha
name: Ralf Hernandez Portfolio
description: A single-author portfolio of software and LLM-systems projects, read once and briefly by interviewers and recruiters, built to grow one project at a time without redesign.

colors:
  primary: "#F15025"
  primary-text: "#FF7A52"
  neutral: "#171917"
  surface: "#0D0E0D"
  surface-raised: "#232623"
  border: "#2A2D2A"
  border-strong: "#3A3E3A"
  on-surface: "#EDEEEA"
  body: "#D2D5CE"
  secondary: "#9A9E98"
  bar: "#8A8E87"

typography:
  display:
    fontFamily: Inter Tight
    fontSize: 136px
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: -0.05em
  hero:
    fontFamily: Inter Tight
    fontSize: 68px
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: -0.035em
  stat:
    fontFamily: Inter Tight
    fontSize: 52px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.035em
    fontFeature: "'tnum' 1"
  headline:
    fontFamily: Inter Tight
    fontSize: 30px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.02em
  title-row:
    fontFamily: Inter Tight
    fontSize: 26px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter Tight
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.65
  body-md:
    fontFamily: Inter Tight
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0.06em
  data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'tnum' 1"

rounded:
  none: 0px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  section: 104px
  sidebar: 320px

components:
  page:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
  body-text:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.body-lg}"
  text-muted:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary}"
    typography: "{typography.data}"
  section-number:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-text}"
    typography: "{typography.data}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "{spacing.xs}"
  tag-border:
    backgroundColor: "{colors.border-strong}"
    height: 1px
  panel:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.none}"
    padding: "{spacing.lg}"
  panel-muted:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.secondary}"
    typography: "{typography.data}"
  media-well:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.secondary}"
    typography: "{typography.data}"
  index-row-hover:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary-text}"
    typography: "{typography.title-row}"
    padding: "{spacing.md}"
  filter-active:
    backgroundColor: "{colors.on-surface}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "{spacing.md}"
  filter:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "{spacing.md}"
  link:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-text}"
    typography: "{typography.body-md}"
  stat:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.stat}"
  stat-highlight:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary-text}"
    typography: "{typography.stat}"
  chart-bar:
    backgroundColor: "{colors.bar}"
    height: 10px
  chart-bar-signal:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.data}"
    height: 10px
---

# Ralf Hernandez Portfolio

## Overview

This site is read once, for a few minutes, by someone deciding whether to talk to its author: an interviewer the day before a call, a recruiter between twenty tabs. They want to find the two or three projects relevant to them, see evidence, and leave with a clear picture of how this person works. The site also has to keep working as projects are added for years, by someone who will not redesign it each time.

The register is a **dark sidebar workspace**: a fixed profile column on the left (name, section links, counts, contact) and a scrolling content column on the right, on a near-black ground with one orange signal. It reads like a well-organised engineering tool rather than a brochure, which suits a portfolio whose strongest material is measured results, system diagrams, and evals. This direction was chosen on the "Portfolio Wireframes" design canvas on 2026-11-11, replacing an earlier light Swiss proposal.

What it gives up, deliberately: **light mode and softness**. There is one theme, dark, and no rounded corners or shadows. The trade buys a calm, dense surface where video, charts, and diagrams carry the colour, and where a single orange mark is enough to say "look here."

**Scalability is the hard constraint.** Every project is one object in `data/projects.js`, rendered by one index template and one case-page template. Variety between pages comes only from which optional fields a project fills in (`featured`, `figure`, `stats`, a chart under a result). Counts, the year range, the area filters, project numbering, section numbering, and figure numbering are all computed from the data, so adding a project never means editing a number by hand.

## Colors

- **Primary (#F15025):** *Blazing Flame,* the site's signal colour, chosen by the author. Used as a *fill or line*: the logo square, the footer square, the one highlighted bar in a chart, a diagram's centre outline, and the one orange ring behind the hero. Anything set on it is the near-black ground (5.5:1). The active filter is deliberately *not* Flame: it is a light chip, so Flame stays rare.
- **Primary-text (#FF7A52):** Flame lifted for text on the dark ground (7.7:1). Section numbers, links, the hero kicker, paper venues, a highlighted key number, and a hovered row's number. It is the only coloured text.
- **Surface (#0D0E0D):** the page ground, a near-black with the faintest green cast so it never reads as a blue-black "dark mode." It carries a faint 28px dot grid (7% light dots), the only texture in the system, drawn on a fixed layer behind the page rather than as the body background. A portrait (phone) video sits directly on this ground with no panel or frame, centred above its caption. The sidebar sits one step lighter at #111211.
- **Neutral (#171917):** the raised panel: featured cards, numbered build cards, chart boxes, figure frames, and the hovered table row. One step up from the ground, never more.
- **Surface-raised (#232623):** the media well inside a card and the empty track behind a chart bar.
- **Border (#2A2D2A) and Border-strong (#3A3E3A):** 1px rules between rows and sections, and the outline of tags, filters, and cards on hover.
- **On-surface (#EDEEEA):** headings and primary text. **Body (#D2D5CE):** long-form paragraphs, a half-step softer to reduce glare. **Secondary (#9A9E98):** labels, metadata, captions (7.1:1).
- **Bar (#8A8E87):** plain chart bars, so the Flame bar is the only coloured one.

Flame stays under roughly 5% of any screen. No other hue exists in the system; screenshots and video bring their own colour.

## Typography

**Inter Tight** carries the voice: name, hero line, project titles, section headings, body copy, and the big key numbers. Its tight default spacing suits the very large display sizes this design uses. **JetBrains Mono** carries the apparatus: labels, section and project numbers, years, kinds, stack tags, captions, chart values. The split is constant: if it is a measurement, an identifier, or a label, it is mono.

Weights are **400, 500, and 700**, used lightly: 500 for project titles, section headings, and table titles; 400 for the hero line, key numbers, and everything else; 700 only for the name in the sidebar. Display sizes scale with the viewport (`clamp`) and use heavy negative tracking; mono labels are uppercase with +0.06em tracking. Body measure is capped at about 64 characters.

## Layout

**Desktop:** a 320px sidebar, sticky to the viewport, beside a fluid content column with 72px side padding and 104px between major blocks. The index sidebar holds brand, numbered section links (01 Work, 02 Papers, 03 Contact), three computed counts, and contact pinned to the bottom. The case-page sidebar holds the back link, project details (case number, context, year, stack, source, paper), and numbered on-this-page links that highlight the section being read.

**Index content:** kicker with the computed year range, hero line, Featured cards (projects with `featured: true`, a media well plus number, kind, year, title, one-liner), then All projects as a numbered table (No., Project, Area, Kind, Year) with area filter buttons, then Papers.

**Case content:** kicker (area / kind, plus a Featured tag), a very large title, the one-liner, the figure, key numbers as a ruled grid, then numbered sections: Problem as a paragraph, What I built as numbered cards (01.1, 01.2...), Results as paragraphs with chart boxes between them, and a previous / next pager.

**Phone (900px and below):** the index sidebar collapses into a header bar (logo square, name, horizontal section links); the counts move under the hero as a three-cell grid; filters scroll sideways; table rows become number plus title plus kind and year; contact becomes a card at the end. Case pages stack the details above the content.

Spacing runs on a 4px base. Nothing is centred except the right-aligned year column and the right-aligned "Next" cell of the pager.

## Elevation & Depth

Flat. No shadows anywhere. Depth comes from the ground step (Surface to Neutral to Surface-raised) and 1px Border rules. Grids of cells (key numbers, pager) use a 1px gap over a Border-coloured background, so the rules are the gaps.

## Shapes

Radius is zero everywhere: cards, tags, filters, figures, video, diagrams, the logo square. Borders are 1px; the diagram centre outline is 2px Flame.

## Components

**Featured card:** Neutral panel with a 16:10 media well. Video plays muted on hover or focus (not under reduced motion); a chart figure renders inside the well; a project with no figure shows its kind in the corner. Hover lifts the card 2px and strengthens the border.

**Hero rings:** concentric hairline circles anchored at the top-right of the index hero and each case header, one of them Flame at 45% opacity. Decorative, behind the text, hidden from assistive tech.

**Featured tag (case page):** outlined in a dark Flame (#6B3A28) with Primary-text lettering, not a solid fill.

**Project table row:** hover lifts the row to Neutral, turns its number Primary-text, and slides the title 6px right. No fading of neighbours.

**Filters:** one button per area that has projects, plus All. Active is a light chip (#E6E7E2) with dark text; inactive is outlined in Border with soft text. If an area's only projects are featured, the table shows a one-line note pointing to Featured.

**Key numbers:** a ruled grid of cells, number in 60px Inter Tight, label in mono under it; labels reserve two lines so numbers align. `highlight: true` colours one number Primary-text.

**Charts:** label, track, value; plain bars in Bar, the finding in Flame; caption with a figure number. Inside a build card, the chart box sits on the ground colour instead.

**Diagrams:** inline SVG coloured by the same tokens: ground-coloured boxes with Border-strong outlines, mono subtitles, wire-grey connectors, Flame outline on the centre box.

## Do's and Don'ts

- **Do** add a project by adding one object to `data/projects.js` with an `area` from `AREAS`. If it seems to need its own layout, add an optional field every project could use instead, and document it at the top of that file.
- **Don't** hard-code a count, a year range, a project number, a section number, or a figure number. They are all derived from the data.
- **Don't** add a second accent colour or use Flame as small text. Flame fills; Primary-text (#FF7A52) is the only coloured text.
- **Don't** add a light theme, a shadow, a rounded corner, or a gradient.
- **Do** set years, counts, percentages, IDs, and labels in JetBrains Mono, and titles and prose in Inter Tight.
- **Do** keep motion quiet and on one easing (`cubic-bezier(.16, 1, .3, 1)`): the sidebar and content rise 14px into place on load with a short stagger, blocks below the fold rise as they scroll in (scroll-driven where the browser supports it), chart bars grow from the left, the hero rings scale in and the orange ring slowly breathes, and the diagram's centre outline slowly pulses. Hovers are 200 to 400ms. All of it is off under `prefers-reduced-motion`.
- **Don't** add motion that moves content the reader is in the middle of reading, or anything that loops besides the ring and the diagram outline.
- **Do** keep at most two featured projects; a third card pushes the table below the first screen on laptops.
