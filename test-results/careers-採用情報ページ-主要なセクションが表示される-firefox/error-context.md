# Page snapshot

```yaml
- dialog "Unhandled Runtime Error":
  - navigation:
    - button "previous" [disabled]:
      - img "previous"
    - button "next" [disabled]:
      - img "next"
    - text: 1 of 1 unhandled error
  - button "Close"
  - heading "Unhandled Runtime Error" [level=1]
  - paragraph: "Error: Event handlers cannot be passed to Client Component props. <form className=... onSubmit={function} children=...> ^^^^^^^^^^ If you need interactivity, consider converting part of this to a Client Component."
  - heading "Call Stack" [level=2]
  - heading "<unknown>" [level=3]
  - text: /Users/unson/Documents/Github/Unson-LLC/unson_os/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js (35:280237)
  - heading "Object.toJSON" [level=3]
  - text: /Users/unson/Documents/Github/Unson-LLC/unson_os/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js (35:281132)
  - heading "stringify" [level=3]
  - text: <anonymous>
  - heading "<unknown>" [level=3]
  - text: /Users/unson/Documents/Github/Unson-LLC/unson_os/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js (35:267488)
  - heading "ez" [level=3]
  - text: /Users/unson/Documents/Github/Unson-LLC/unson_os/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js (35:267567)
  - heading "eH" [level=3]
  - text: /Users/unson/Documents/Github/Unson-LLC/unson_os/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js (35:267968)
  - heading "Timeout._onTimeout" [level=3]
  - text: /Users/unson/Documents/Github/Unson-LLC/unson_os/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js (35:264466)
  - heading "listOnTimeout" [level=3]
  - text: node:internal/timers (611:17)
  - heading "process.processTimers" [level=3]
  - text: node:internal/timers (546:7)
```