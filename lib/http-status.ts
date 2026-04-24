export type HTTPStatusInfo = {
  title: string;
  detail: string;
  category: string;
  examples: string[];
  mitigation: string[];
};

export const statusMap: Record<string, HTTPStatusInfo> = {
  "100": {
    title: "Continue",
    detail: "The server received the request headers and the client can keep sending the body.",
    category: "Informational",
    examples: ["Large uploads that wait for an `Expect: 100-continue` approval before sending the file body."],
    mitigation: ["If this stalls, verify the client and proxy agree on `Expect: 100-continue` handling."]
  },
  "101": {
    title: "Switching Protocols",
    detail: "The server accepted the protocol change requested by the client.",
    category: "Informational",
    examples: ["A WebSocket handshake upgrading an HTTP connection to the `websocket` protocol."],
    mitigation: ["If the upgrade fails, confirm the `Upgrade` and `Connection` headers survive every proxy hop."]
  },
  "102": {
    title: "Processing",
    detail: "The server accepted the request and is still working on it, avoiding a client timeout.",
    category: "Informational",
    examples: ["A WebDAV server processing a large recursive file operation."],
    mitigation: ["If clients still time out, move the work to an async job and return 202 with a status endpoint."]
  },
  "103": {
    title: "Early Hints",
    detail: "The server is sending preliminary headers so the client can start loading linked resources sooner.",
    category: "Informational",
    examples: ["Sending `Link: rel=preload` headers for critical CSS before the final HTML response."],
    mitigation: ["If browsers ignore the hint, check that the final response still includes the needed cache and preload headers."]
  },
  "200": {
    title: "OK",
    detail: "The request succeeded and the response contains the expected result.",
    category: "Success",
    examples: ["A `GET /users/42` request returns the user document successfully."],
    mitigation: ["If the payload is wrong, inspect server-side business logic and verify the selected resource identifiers."]
  },
  "201": {
    title: "Created",
    detail: "The request created a new resource successfully.",
    category: "Success",
    examples: ["A `POST /orders` call creates a new order and returns its location."],
    mitigation: ["If creation is expected but you see another code, validate required fields and persistence-layer writes."]
  },
  "202": {
    title: "Accepted",
    detail: "The server accepted the request for later processing, but the work is not finished yet.",
    category: "Success",
    examples: ["Submitting a video transcoding job that will be processed in the background."],
    mitigation: ["If clients need completion status, return a job ID and document the polling or webhook flow."]
  },
  "203": {
    title: "Non-Authoritative Information",
    detail: "The response succeeded, but the payload was modified by a transforming proxy.",
    category: "Success",
    examples: ["A proxy compresses or rewrites metadata before forwarding a cached response."],
    mitigation: ["If the transformed payload is a problem, bypass the intermediary or review proxy rewrite rules."]
  },
  "204": {
    title: "No Content",
    detail: "The request succeeded and there is no response body to return.",
    category: "Success",
    examples: ["A `DELETE /sessions/current` request succeeds and does not need to return JSON."],
    mitigation: ["If clients expect content, update the contract or switch to 200 with a response body."]
  },
  "205": {
    title: "Reset Content",
    detail: "The request succeeded and the client should reset the current document or form.",
    category: "Success",
    examples: ["A browser form submission completes and the UI should clear the edited fields."],
    mitigation: ["If the client ignores the reset intent, make the UI behavior explicit in frontend code after success."]
  },
  "206": {
    title: "Partial Content",
    detail: "The server is returning only the requested byte range of the representation.",
    category: "Success",
    examples: ["Streaming part of a video file after receiving a valid `Range` header."],
    mitigation: ["If resumable downloads fail, verify `Range`, `Content-Range`, and total length calculations."]
  },
  "207": {
    title: "Multi-Status",
    detail: "The response reports separate outcomes for multiple resources in one request.",
    category: "Success",
    examples: ["A WebDAV batch request returns per-file results for a directory operation."],
    mitigation: ["If troubleshooting is hard, log and surface the per-resource statuses instead of only the top-level code."]
  },
  "208": {
    title: "Already Reported",
    detail: "The server already listed this resource earlier in the same WebDAV response.",
    category: "Success",
    examples: ["A WebDAV `PROPFIND` response suppresses duplicate entries caused by bindings."],
    mitigation: ["If clients misread the response, ensure they understand WebDAV binding semantics and deduplicate correctly."]
  },
  "226": {
    title: "IM Used",
    detail: "The server fulfilled the request using an instance-manipulation delta representation.",
    category: "Success",
    examples: ["Returning a delta-encoded document update instead of the full resource."],
    mitigation: ["If the client cannot apply the delta, disable instance manipulations or fall back to a full 200 response."]
  },
  "300": {
    title: "Multiple Choices",
    detail: "The resource has more than one representation and the client should choose one.",
    category: "Redirect",
    examples: ["Offering both HTML and PDF versions of the same document."],
    mitigation: ["If clients cannot choose automatically, provide canonical links or content negotiation defaults."]
  },
  "301": {
    title: "Moved Permanently",
    detail: "The resource now has a permanent new URL.",
    category: "Redirect",
    examples: ["Redirecting `http://` traffic to a canonical `https://` URL."],
    mitigation: ["If SEO or caches are wrong, confirm the destination is stable before using a permanent redirect."]
  },
  "302": {
    title: "Found",
    detail: "The resource is temporarily available at a different URL.",
    category: "Redirect",
    examples: ["Sending a user to a temporary maintenance page during a short rollout."],
    mitigation: ["If the redirect should preserve the method, use 307 or 308 instead."]
  },
  "303": {
    title: "See Other",
    detail: "The client should retrieve the result from another URL using GET.",
    category: "Redirect",
    examples: ["Redirecting after a form POST to a receipt page to avoid resubmission."],
    mitigation: ["If clients repeat the POST unexpectedly, prefer 303 over 302 for post-redirect-get flows."]
  },
  "304": {
    title: "Not Modified",
    detail: "The cached representation is still valid, so the client can reuse it.",
    category: "Redirect",
    examples: ["A browser revalidates a CSS file with `If-None-Match` and receives no new body."],
    mitigation: ["If stale content persists, review `ETag`, `Last-Modified`, and cache invalidation behavior."]
  },
  "305": {
    title: "Use Proxy",
    detail: "The requested resource was historically expected to be accessed through a proxy.",
    category: "Redirect",
    examples: ["Legacy systems documenting an explicit proxy requirement for a protected network."],
    mitigation: ["Avoid using this deprecated code in new systems; configure the proxy outside the HTTP response instead."]
  },
  "307": {
    title: "Temporary Redirect",
    detail: "The client should repeat the same request at another URL without changing the method.",
    category: "Redirect",
    examples: ["Temporarily moving an upload endpoint while keeping the original POST semantics."],
    mitigation: ["If clients downgrade the request to GET, verify they support 307 rather than relying on 302 behavior."]
  },
  "308": {
    title: "Permanent Redirect",
    detail: "The client should use a new permanent URL and keep the original method.",
    category: "Redirect",
    examples: ["Moving an API route permanently while preserving POST or PUT requests."],
    mitigation: ["If integrations break, confirm clients and caches understand 308 before replacing older redirects."]
  },
  "400": {
    title: "Bad Request",
    detail: "The server could not process the request because the syntax or framing was invalid.",
    category: "Client Error",
    examples: ["Malformed JSON, invalid query strings, or missing required body fields."],
    mitigation: ["Validate request schemas on the client, log parser errors, and return field-level hints where possible."]
  },
  "401": {
    title: "Unauthorized",
    detail: "Authentication is required or the supplied credentials were rejected.",
    category: "Client Error",
    examples: ["A request uses an expired bearer token or omits the `Authorization` header."],
    mitigation: ["Refresh or reissue credentials and include a clear `WWW-Authenticate` challenge when appropriate."]
  },
  "402": {
    title: "Payment Required",
    detail: "The request cannot proceed until a payment-related condition is satisfied.",
    category: "Client Error",
    examples: ["A reserved or experimental billing flow blocks access until an account is funded."],
    mitigation: ["Document the billing requirement clearly because many clients do not implement special 402 handling."]
  },
  "403": {
    title: "Forbidden",
    detail: "The client is authenticated but does not have permission to perform the action.",
    category: "Client Error",
    examples: ["A user token is valid but lacks the admin scope needed to access a protected endpoint."],
    mitigation: ["Review authorization rules, scopes, and tenant ownership checks rather than prompting for re-login."]
  },
  "404": {
    title: "Not Found",
    detail: "The target resource does not exist at the requested URL.",
    category: "Client Error",
    examples: ["An API consumer requests `/users/9999` after the record has been deleted."],
    mitigation: ["Check route spelling, resource identifiers, and whether the object was moved or soft-deleted."]
  },
  "405": {
    title: "Method Not Allowed",
    detail: "The route exists, but that HTTP method is not supported for it.",
    category: "Client Error",
    examples: ["Sending `POST` to an endpoint that only exposes `GET` and `HEAD`."],
    mitigation: ["Inspect the `Allow` header and update the client to use a supported method."]
  },
  "406": {
    title: "Not Acceptable",
    detail: "The server cannot produce a representation matching the request's `Accept` headers.",
    category: "Client Error",
    examples: ["Requesting only `application/xml` from a JSON-only API."],
    mitigation: ["Relax the `Accept` header or add the missing representation on the server."]
  },
  "407": {
    title: "Proxy Authentication Required",
    detail: "The client must authenticate with the intermediary proxy before the request can continue.",
    category: "Client Error",
    examples: ["A corporate proxy blocks outbound traffic until proxy credentials are supplied."],
    mitigation: ["Configure proxy credentials separately from origin-server credentials and return `Proxy-Authenticate` details."]
  },
  "408": {
    title: "Request Timeout",
    detail: "The server gave up waiting for the client to finish sending the request.",
    category: "Client Error",
    examples: ["A slow upload stalls and never finishes transmitting the body."],
    mitigation: ["Tune client timeouts, reduce payload size, and check whether a proxy is terminating slow connections."]
  },
  "409": {
    title: "Conflict",
    detail: "The request conflicts with the current state of the target resource.",
    category: "Client Error",
    examples: ["Two editors update the same record and the second save fails on a version check."],
    mitigation: ["Use optimistic locking with version fields and guide the user through conflict resolution."]
  },
  "410": {
    title: "Gone",
    detail: "The resource used to exist but was intentionally removed and is not expected to return.",
    category: "Client Error",
    examples: ["An old API version endpoint has been permanently retired."],
    mitigation: ["Update links and clients to the replacement resource instead of retrying the removed URL."]
  },
  "411": {
    title: "Length Required",
    detail: "The server requires a valid `Content-Length` header for this request.",
    category: "Client Error",
    examples: ["An upload endpoint rejects a body sent without an explicit content length."],
    mitigation: ["Set `Content-Length` correctly or switch to a transfer mode the server supports."]
  },
  "412": {
    title: "Precondition Failed",
    detail: "A conditional request header evaluated to false for the current resource state.",
    category: "Client Error",
    examples: ["An `If-Match` header uses an outdated ETag during an update."],
    mitigation: ["Re-fetch the latest representation, then retry with refreshed ETags or timestamps."]
  },
  "413": {
    title: "Content Too Large",
    detail: "The request body exceeds the size limit accepted by the server.",
    category: "Client Error",
    examples: ["Uploading a video larger than the API gateway's maximum body size."],
    mitigation: ["Increase the configured limit, chunk the upload, or move large transfers to object storage."]
  },
  "414": {
    title: "URI Too Long",
    detail: "The target URL is longer than the server is willing to process.",
    category: "Client Error",
    examples: ["Encoding a large filter object directly into the query string."],
    mitigation: ["Move bulky parameters into the request body and shorten generated URLs."]
  },
  "415": {
    title: "Unsupported Media Type",
    detail: "The server does not support the request body's media type.",
    category: "Client Error",
    examples: ["Posting XML to an endpoint that only accepts `application/json`."],
    mitigation: ["Send the correct `Content-Type` header and verify the payload matches that format."]
  },
  "416": {
    title: "Range Not Satisfiable",
    detail: "The requested byte range does not overlap the current representation.",
    category: "Client Error",
    examples: ["A download resume request asks for bytes past the end of the file."],
    mitigation: ["Re-check the current file size and restart the transfer with a valid range."]
  },
  "417": {
    title: "Expectation Failed",
    detail: "The server cannot meet the requirements expressed by the `Expect` header.",
    category: "Client Error",
    examples: ["A client sends `Expect: 100-continue` but the server does not support the flow."],
    mitigation: ["Remove unsupported expectations or add intermediary support for the expected behavior."]
  },
  "418": {
    title: "I'm a Teapot",
    detail: "A playful status code that occasionally appears in demos, tests, or novelty APIs.",
    category: "Client Error",
    examples: ["Mock APIs and test suites use 418 to verify client-side error handling paths."],
    mitigation: ["Treat it like any other client error in code, but avoid depending on it in production contracts."]
  },
  "421": {
    title: "Misdirected Request",
    detail: "The request was sent to a server that is not able to produce a response for that authority.",
    category: "Client Error",
    examples: ["An HTTP/2 connection is reused for the wrong virtual host behind TLS."],
    mitigation: ["Check SNI, host routing, and connection reuse settings on clients, CDNs, and reverse proxies."]
  },
  "422": {
    title: "Unprocessable Content",
    detail: "The request syntax is valid, but the server cannot apply the semantic instructions.",
    category: "Client Error",
    examples: ["A JSON payload passes schema validation but fails a business rule like duplicate email."],
    mitigation: ["Return field-specific validation messages so callers can correct the data and retry."]
  },
  "423": {
    title: "Locked",
    detail: "The target resource is locked and cannot be modified right now.",
    category: "Client Error",
    examples: ["A WebDAV document is checked out or locked by another editor."],
    mitigation: ["Expose lock ownership details and provide an unlock or retry path when the lock expires."]
  },
  "424": {
    title: "Failed Dependency",
    detail: "The request failed because an earlier dependent action in the same sequence failed.",
    category: "Client Error",
    examples: ["A WebDAV batch operation aborts because one prerequisite property update failed."],
    mitigation: ["Inspect earlier operation results first; fixing the root failure usually clears the dependent one."]
  },
  "425": {
    title: "Too Early",
    detail: "The server is unwilling to risk processing a request that might be replayed.",
    category: "Client Error",
    examples: ["A TLS early-data request tries to perform a non-idempotent payment action."],
    mitigation: ["Retry after the handshake completes normally or disable early data for sensitive endpoints."]
  },
  "426": {
    title: "Upgrade Required",
    detail: "The server requires the client to switch to a different protocol before retrying.",
    category: "Client Error",
    examples: ["An endpoint only accepts HTTPS or a newer protocol version such as HTTP/2."],
    mitigation: ["Honor the `Upgrade` guidance and update client transport settings before retrying."]
  },
  "428": {
    title: "Precondition Required",
    detail: "The origin server requires a conditional request to avoid lost updates.",
    category: "Client Error",
    examples: ["A write endpoint refuses updates unless the request includes `If-Match`."],
    mitigation: ["Fetch the latest resource version first and send the required precondition headers."]
  },
  "429": {
    title: "Too Many Requests",
    detail: "The client has sent more requests than the server allows in the current time window.",
    category: "Client Error",
    examples: ["An API token exceeds the allowed request rate for its plan or tenant."],
    mitigation: ["Back off with exponential retry logic, respect `Retry-After`, and reduce bursty traffic."]
  },
  "431": {
    title: "Request Header Fields Too Large",
    detail: "One or more request headers are too large for the server to accept.",
    category: "Client Error",
    examples: ["Oversized cookies or forwarded auth headers exceed proxy limits."],
    mitigation: ["Trim cookies, shorten custom headers, and review proxy header-size limits."]
  },
  "451": {
    title: "Unavailable For Legal Reasons",
    detail: "The server is denying access to the resource due to a legal demand or restriction.",
    category: "Client Error",
    examples: ["Content is blocked in a region after receiving a court order or takedown notice."],
    mitigation: ["Document the restriction transparently and separate legal blocking from regular authorization failures."]
  },
  "500": {
    title: "Internal Server Error",
    detail: "The server encountered an unexpected condition and could not complete the request.",
    category: "Server Error",
    examples: ["An unhandled exception escapes the request handler and triggers a generic error response."],
    mitigation: ["Inspect server logs, add structured error handling, and surface safe diagnostics for operators."]
  },
  "501": {
    title: "Not Implemented",
    detail: "The server does not support the functionality required to fulfill the request.",
    category: "Server Error",
    examples: ["An endpoint receives an HTTP method or feature that the application never implemented."],
    mitigation: ["Implement the missing capability or return a clearer contract to clients about unsupported features."]
  },
  "502": {
    title: "Bad Gateway",
    detail: "A gateway or proxy received an invalid response from an upstream service.",
    category: "Server Error",
    examples: ["A reverse proxy gets malformed headers from the application server behind it."],
    mitigation: ["Check upstream health, proxy timeouts, TLS settings, and malformed backend responses."]
  },
  "503": {
    title: "Service Unavailable",
    detail: "The service is temporarily unavailable, often due to overload or maintenance.",
    category: "Server Error",
    examples: ["A deployment drains traffic or a database outage makes the API temporarily unavailable."],
    mitigation: ["Scale capacity, add graceful maintenance messaging, and include `Retry-After` when you know recovery timing."]
  },
  "504": {
    title: "Gateway Timeout",
    detail: "A gateway or proxy waited too long for an upstream service to respond.",
    category: "Server Error",
    examples: ["An API gateway times out while waiting for a slow microservice or database-backed request."],
    mitigation: ["Reduce upstream latency, tune timeout budgets, and break long work into async jobs."]
  },
  "505": {
    title: "HTTP Version Not Supported",
    detail: "The server does not support the HTTP protocol version used by the request.",
    category: "Server Error",
    examples: ["A client sends an obsolete or unsupported HTTP version to a strict server."],
    mitigation: ["Upgrade the client stack or adjust server compatibility settings for the required HTTP version."]
  },
  "506": {
    title: "Variant Also Negotiates",
    detail: "The server has an internal configuration error involving transparent content negotiation.",
    category: "Server Error",
    examples: ["A negotiated resource points back to itself and creates a variant resolution loop."],
    mitigation: ["Review content-negotiation rules and remove recursive or circular variant mappings."]
  },
  "507": {
    title: "Insufficient Storage",
    detail: "The server cannot store the representation needed to complete the request.",
    category: "Server Error",
    examples: ["A WebDAV or object-storage backend runs out of space during an upload."],
    mitigation: ["Free capacity, increase quotas, and alert operators before storage exhaustion impacts users."]
  },
  "508": {
    title: "Loop Detected",
    detail: "The server detected an infinite loop while processing the request.",
    category: "Server Error",
    examples: ["A WebDAV binding or recursive operation loops over the same collection repeatedly."],
    mitigation: ["Inspect traversal logic and break recursive references or cyclical resource graphs."]
  },
  "510": {
    title: "Not Extended",
    detail: "The server requires further extensions to the request before it can fulfill it.",
    category: "Server Error",
    examples: ["A policy-driven API expects mandatory extension declarations or additional request metadata."],
    mitigation: ["Review server extension requirements and include the missing request options explicitly."]
  },
  "511": {
    title: "Network Authentication Required",
    detail: "The client must authenticate to gain network access before reaching the origin server.",
    category: "Server Error",
    examples: ["A captive portal intercepts traffic until the user signs in to the network."],
    mitigation: ["Complete network sign-in first and make sure apps distinguish captive-portal auth from app auth."]
  }
};

export const popularCodes = ["200", "201", "400", "401", "403", "404", "422", "429", "500", "503"] as const;

export function filterHTTPStatuses(query: string) {
  const normalized = query.trim().toLowerCase();

  return Object.entries(statusMap).filter(([code, info]) => {
    if (!normalized) {
      return true;
    }

    const searchable = [
      code,
      info.title,
      info.category,
      info.detail,
      ...info.examples,
      ...info.mitigation
    ].join(" ").toLowerCase();

    return searchable.includes(normalized);
  });
}
