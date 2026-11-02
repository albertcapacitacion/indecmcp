# Privacy policy draft — publisher review required

Publisher: **PUBLISHER_NAME_PENDING**. Contact: **PUBLISHER_CONTACT_PENDING**. Effective date: **PENDING**.

INDEC MCP retrieves official statistical observations. It does not request chat histories, user files, names, emails or precise user locations. Tool arguments contain only dataset selections, reference periods and limits.

The service uses the Site-scoped authenticated user ID in request memory and stores its SHA-256 digest in rate-limit bucket keys. It ignores the email/name headers provided by Sites. Rate counters contain pseudonymous bucket keys, windows, counts and expiry values. Expired counters become eligible for bounded cleanup after 24 hours; cleanup occurs during tool traffic, so inactive services have no guaranteed deletion deadline. These counters are operational records, not statistics archives.

Official observations and their source/retrieval metadata are cached for one hour. Expired cache entries are removed during subsequent tool traffic. No INDEC credentials are stored in the cache. The upstream receives only statistical queries and the server's INDEC credential; it does not receive the ChatGPT user ID or chat history.

Application logs contain fixed events, tool names and sanitized error codes, not request bodies, identities, tokens or raw upstream errors. Sites/OpenAI infrastructure may process connection metadata under its own applicable terms; the publisher must confirm those terms and retention obligations before public launch.

This draft must be completed, reviewed and published under the verified publisher's identity before directory submission.
