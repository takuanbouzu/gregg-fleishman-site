# Verification Log

Date: 2026-07-10

## Local Server

Command:

```bash
python3 -m http.server 8766 --bind 127.0.0.1
```

Page:

```text
http://127.0.0.1:8766/online-exhibition.html
```

Response:

```text
HTTP/1.0 200 OK
Server: SimpleHTTP/0.6 Python/3.9.6
Content-type: text/html
Content-Length: 27340
```

## Local Reference Check

Command:

```bash
python3 -c "from pathlib import Path; import re, urllib.parse; s=Path('online-exhibition.html').read_text(); vals=re.findall(r'(?:href|src|data-src)=\\\"([^\\\"]+)\\\"', s); missing=[v for v in vals if not v.startswith(('http','data:','#')) and urllib.parse.urlparse(v).path and not Path(urllib.parse.urlparse(v).path).exists()]; print('checked', len(vals), 'references'); print('missing', missing if missing else 'none')"
```

Result:

```text
checked 38 references
missing none
```

## Worktree Status at Package Time

```text
 M truncated-octahedron.html
?? HANDOFF-CODEX-TERMINAL.md
?? assets/models/rhombi-pod.glb
?? online-exhibition.html
?? handoffs/codex-online-exhibition-2026-07-10/
```

The first three items are unrelated pre-existing branch work.

