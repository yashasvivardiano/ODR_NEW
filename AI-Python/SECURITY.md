# Security Guide - ODR AI System

## 🔒 Security Overview

This document outlines security best practices for the ODR AI System. Follow these guidelines to ensure secure deployment and operation.

## 🚨 Critical Security Requirements

### 1. Environment Variables
- **NEVER** commit `.env` files to version control
- Use strong, unique API keys for each environment
- Rotate API keys regularly
- Use environment-specific configurations

### 2. API Keys Management
```bash
# Generate secure secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Store API keys securely
export OPENAI_API_KEY="your-actual-key"
export GROQ_API_KEY="your-actual-key"
export GEMINI_API_KEY="your-actual-key"
```

### 3. Production Deployment
- Set `PRODUCTION=true` in production
- Use specific CORS origins instead of `*`
- Enable HTTPS only
- Use strong database passwords
- Implement rate limiting

## 🛡️ Security Checklist

### Before Deployment
- [ ] Remove all placeholder API keys
- [ ] Generate secure SECRET_KEY
- [ ] Configure proper CORS origins
- [ ] Set up HTTPS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging

### Environment Security
- [ ] Use environment-specific `.env` files
- [ ] Never log sensitive information
- [ ] Use secure database connections
- [ ] Implement proper backup strategies

### API Security
- [ ] Implement authentication (JWT tokens)
- [ ] Add rate limiting
- [ ] Validate all input data
- [ ] Sanitize file uploads
- [ ] Implement request logging

## 🔐 File Upload Security

### Validation
- File type validation using MIME types
- File size limits (100MB default)
- Virus scanning (recommended)
- Content validation

### Storage
- Files stored outside web root
- Unique file names to prevent conflicts
- Automatic cleanup of old files
- Secure file permissions

## 🚫 What NOT to Do

### Never Commit
- `.env` files
- API keys
- Database passwords
- Private certificates
- User data

### Never Use in Production
- Default passwords
- `DEBUG=true`
- `ALLOWED_ORIGINS=*`
- Weak secret keys
- HTTP without HTTPS

## 🔍 Monitoring & Logging

### Security Logging
- Failed authentication attempts
- File upload attempts
- API rate limit violations
- Error patterns

### Monitoring
- API response times
- Error rates
- File processing metrics
- Resource usage

## 🚨 Incident Response

### If API Keys are Compromised
1. Immediately rotate all API keys
2. Check logs for unauthorized usage
3. Update environment variables
4. Monitor for suspicious activity

### If Files are Compromised
1. Stop file processing
2. Check uploaded files
3. Review access logs
4. Implement additional validation

## 📋 Security Configuration Examples

### Production Environment
```env
PRODUCTION=true
DEBUG=false
ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
SECRET_KEY=your-super-secure-32-character-key
```

### Development Environment
```env
PRODUCTION=false
DEBUG=true
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
SECRET_KEY=dev-secret-key-not-for-production
```

## 🔧 Security Tools

### Recommended Tools
- **Secrets Management**: HashiCorp Vault, AWS Secrets Manager
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack, Splunk
- **Security Scanning**: OWASP ZAP, Snyk

### Code Security
- Use `bandit` for Python security scanning
- Regular dependency updates
- Code reviews for security issues
- Automated security testing

## 📞 Security Contacts

- **Security Issues**: Report to security team
- **API Key Issues**: Contact API provider support
- **Infrastructure**: Contact DevOps team

---

**Remember**: Security is an ongoing process. Regularly review and update your security measures.
