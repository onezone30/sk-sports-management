import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // shared/* segments (api, assets, components, ...) are imported directly
    // across the codebase by project convention (see frontend/CLAUDE.md) —
    // there's no cross-slice boundary to protect inside `shared/`, unlike
    // features/entities/widgets, so we don't require a public API there.
    files: ['./src/shared/**'],
    rules: {
      'fsd/public-api': 'off',
      'fsd/no-public-api-sidestep': 'off',
    },
  },
  {
    // Pages in this project are intentionally thin: a single index.tsx that
    // composes widgets/features/entities, with no ui/model segments of their
    // own (see frontend/CLAUDE.md). That's a deliberate simplification, not
    // a violation.
    files: ['./src/pages/**'],
    rules: {
      'fsd/no-segmentless-slices': 'off',
    },
  },
  {
    // insignificant-slice counts references by walking segments — it can't
    // see imports made from a segmentless page's index.tsx (our pages are
    // segmentless by design, see above), so any widget/entity used only by
    // pages false-positives as "no references" forever (confirmed: widgets/
    // footer and widgets/landing-sections are both imported from pages/*
    // but still get flagged). Real entities also legitimately start with a
    // single consumer and grow from there. Not useful signal in this project.
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
  {
    // segments-by-purpose wants folder names to describe purpose rather
    // than content-type, but app/providers, shared/assets and
    // shared/components are established, documented conventions in
    // frontend/CLAUDE.md used throughout the codebase — renaming them to
    // satisfy this opinion is a bigger, unrelated churn, not a real defect.
    rules: {
      'fsd/segments-by-purpose': 'off',
    },
  },
])
