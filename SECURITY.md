# Security Policy

## Reporting a Vulnerability

Please do not disclose security issues in a public GitHub issue, pull request, or discussion.

Use GitHub's **Private vulnerability reporting** feature for this repository when it is enabled:

1. Open the repository's **Security** tab.
2. Select **Report a vulnerability**.
3. Include the details requested below.

If private vulnerability reporting is unavailable, contact the repository maintainers through a private channel listed in the repository's GitHub organization or project settings. Do not include credentials, patient information, API keys, or other secrets in a public report.

## Include in Your Report

- A clear description of the vulnerability and its potential impact
- The affected file, component, dependency, or version
- Reproduction steps or a minimal proof of concept
- Any required configuration or environment details
- Suggested mitigation, if known
- Whether the issue is being actively exploited, if known

Please allow maintainers reasonable time to investigate and prepare a fix before making the issue public.

## Scope

Security reports may include, but are not limited to:

- Vulnerabilities in the application or its dependencies
- Exposed credentials, tokens, or sensitive configuration
- Unsafe handling of user-provided data
- Authentication, authorization, or deployment weaknesses
- Issues that could cause incorrect or unsafe application behavior

The triage logic in this repository uses fictional data and synthetic rules. Do not submit real patient or other personal health information when reporting an issue.

## Supported Versions

This project is under active development. Security fixes are generally applied to the latest version on the default branch. Older versions may not receive security updates.

## Response

Maintainers will acknowledge valid private reports as soon as practical, investigate the report, and coordinate remediation or disclosure timing with the reporter when appropriate.
