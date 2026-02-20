fetch("/api/generate", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ topic }) })
fetch("/api/publish", ...)
fetch("/api/index", ...)
