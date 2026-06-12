// Development-only webhook receiver for lead-delivery smoke tests.
// Never deploy this or wire it into the production runtime.
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createServer } from "node:http";

if (process.env.NODE_ENV === "production") {
  console.error("test:webhook-server is a development tool and refuses to run in production.");
  process.exit(1);
}

const port = Number(process.env.TEST_WEBHOOK_PORT ?? 4567);
const secret = process.env.GENERIC_LEAD_WEBHOOK_SECRET ?? "local-test-secret";
let mode = process.argv.includes("--fail") ? "fail" : "success";

function constantTimeEquals(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function verifySignature(rawBody, request) {
  const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const signature = request.headers["x-bti-webhook-signature"];
  const bearer = request.headers.authorization?.match(/^Bearer (.+)$/i)?.[1];

  return (
    (typeof signature === "string" && constantTimeEquals(signature, expected)) ||
    (typeof bearer === "string" && constantTimeEquals(bearer, secret))
  );
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${port}`);

  if (request.method === "POST" && url.pathname === "/mode/fail") {
    mode = "fail";
    response.writeHead(200).end("mode=fail\n");
    return;
  }

  if (request.method === "POST" && url.pathname === "/mode/success") {
    mode = "success";
    response.writeHead(200).end("mode=success\n");
    return;
  }

  if (request.method === "GET" && url.pathname === "/mode") {
    response.writeHead(200).end(`mode=${mode}\n`);
    return;
  }

  if (request.method !== "POST" || url.pathname !== "/test-webhook") {
    response.writeHead(404).end("not found\n");
    return;
  }

  const rawBody = await readBody(request);

  if (!verifySignature(rawBody, request)) {
    console.warn("[webhook] rejected: signature/secret mismatch");
    response.writeHead(401).end("unauthorized\n");
    return;
  }

  // Log identifiers only — no names, phones, emails or messages.
  let summary = { publicReference: "unknown", leadType: "unknown" };
  try {
    const payload = JSON.parse(rawBody);
    summary = {
      publicReference: payload.publicReference ?? "unknown",
      leadType: payload.leadType ?? "unknown"
    };
  } catch {
    console.warn("[webhook] received non-JSON body");
  }

  if (mode === "fail") {
    console.warn(
      `[webhook] FORCED FAILURE for ${summary.publicReference} (${summary.leadType})`
    );
    response.writeHead(500).end("forced failure\n");
    return;
  }

  const deliveryId = `whk_${randomBytes(6).toString("hex")}`;
  console.info(
    `[webhook] delivered ${summary.publicReference} (${summary.leadType}) idempotency=${request.headers["idempotency-key"] ?? "none"} deliveryId=${deliveryId}`
  );
  response.writeHead(200, { "x-delivery-id": deliveryId }).end("ok\n");
});

server.listen(port, () => {
  console.info(
    `Test webhook receiver listening on http://localhost:${port}/test-webhook (mode=${mode})`
  );
  console.info(
    `Switch modes: POST http://localhost:${port}/mode/fail or /mode/success`
  );
});
