# Security Policy

## Supported Versions

| Version | Supported          |
| :------ | :----------------- |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously at PathForge. If you discover a security vulnerability, please report it responsibly.

### How to Report

- **Email**: [security@pathforge.eu](mailto:security@pathforge.eu)
- **Response Time**: We aim to acknowledge reports within 48 hours
- **Resolution**: Critical vulnerabilities are prioritized and patched within 7 days

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Suggested fix (if any)

### What to Expect

1. **Acknowledgment** within 48 hours
2. **Assessment** and severity classification within 5 business days
3. **Fix and disclosure** coordinated with the reporter

### Scope

- PathForge API (`api.pathforge.eu`)
- PathForge Web (`pathforge.eu`)
- GitHub repository and CI/CD pipelines

### Out of Scope

- Social engineering attacks
- Denial of service attacks
- Issues in third-party dependencies (report upstream)

## Security Practices

- OWASP-compliant security headers on all API responses
- HSTS enforcement in production
- JWT token blacklisting on logout
- Rate limiting on sensitive endpoints
- Input sanitization with OWASP LLM01 prompt injection defense
- Redis-backed session management
- Environment-based secret management (never hardcoded)

## Security Contact

- **Email**: security@pathforge.eu
- **security.txt**: [https://api.pathforge.eu/.well-known/security.txt](https://api.pathforge.eu/.well-known/security.txt)
