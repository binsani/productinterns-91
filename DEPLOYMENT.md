# Production Deployment Guide

## Pre-Deployment Security Checklist

### ✅ Completed
- [x] Fixed email exposure vulnerability in profiles table
- [x] Implemented proper RLS policies with role-based access
- [x] Secured database functions with search_path

### ⚠️ Manual Configuration Required in Supabase Dashboard

1. **Auth OTP Expiry** (Priority: High)
   - Go to: https://supabase.com/dashboard/project/zwzqedkkvdjlwzqmvdsd/auth/providers
   - Set OTP expiry to recommended threshold (60 seconds)
   - [Documentation](https://supabase.com/docs/guides/platform/going-into-prod#security)

2. **Leaked Password Protection** (Priority: High)
   - Go to: https://supabase.com/dashboard/project/zwzqedkkvdjlwzqmvdsd/auth/providers
   - Enable password strength and leaked password protection
   - [Documentation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

3. **PostgreSQL Version Upgrade** (Priority: Medium)
   - Go to: https://supabase.com/dashboard/project/zwzqedkkvdjlwzqmvdsd/settings/infrastructure
   - Upgrade to latest PostgreSQL version for security patches
   - [Documentation](https://supabase.com/docs/guides/platform/upgrading)

4. **Auth Redirect URLs** (Priority: High)
   - Go to: https://supabase.com/dashboard/project/zwzqedkkvdjlwzqmvdsd/auth/url-configuration
   - Set Site URL to your production domain
   - Add all production domains to Redirect URLs
   - Add staging domain: `https://[your-project].lovable.app`

## Environment Configuration

### Production Environment Variables
Already configured in `.env.production`:
```
VITE_SUPABASE_URL=https://zwzqedkkvdjlwzqmvdsd.supabase.co
VITE_SUPABASE_ANON_KEY=[configured]
```

### Security Headers
Configured in `public/_headers`:
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ Strict-Transport-Security enabled
- ✅ Content-Security-Policy configured
- ✅ Cache-Control for static assets

## Deployment Steps

### 1. Pre-Deployment Testing
```bash
# Run production build locally
npm run build
npm run preview
```

### 2. Deploy to Lovable
1. Click "Publish" button in Lovable editor
2. Verify preview deployment works
3. Test all critical user flows:
   - User registration and login
   - Intern application submission
   - Employer internship posting
   - Admin moderation features

### 3. Custom Domain Setup (Optional)
1. Go to Project Settings → Domains in Lovable
2. Add your custom domain
3. Configure DNS records:
   - A record for @ → 185.158.133.1
   - A record for www → 185.158.133.1
   - TXT record for verification
4. Wait for DNS propagation (up to 72 hours)
5. SSL will be automatically provisioned

### 4. Post-Deployment Verification
- [ ] Test authentication flows
- [ ] Verify RLS policies are working
- [ ] Check that emails are not publicly visible
- [ ] Test file uploads (resumes, avatars, logos)
- [ ] Verify real-time updates work
- [ ] Check notification system
- [ ] Test messaging between users
- [ ] Verify admin controls work properly

## Monitoring & Maintenance

### Supabase Dashboard Links
- Database: https://supabase.com/dashboard/project/zwzqedkkvdjlwzqmvdsd/editor
- Auth Users: https://supabase.com/dashboard/project/zwzqedkkvdjlwzqmvdsd/auth/users
- Storage: https://supabase.com/dashboard/project/zwzqedkkvdjlwzqmvdsd/storage/buckets
- SQL Editor: https://supabase.com/dashboard/project/zwzqedkkvdjlwzqmvdsd/sql/new
- Logs: https://supabase.com/dashboard/project/zwzqedkkvdjlwzqmvdsd/logs/explorer

### Regular Security Checks
1. Review RLS policies monthly
2. Monitor authentication logs for suspicious activity
3. Keep PostgreSQL version updated
4. Review and rotate API keys if exposed
5. Monitor error logs for security issues

## Performance Optimization

Already configured:
- ✅ Code splitting with manual chunks
- ✅ Terser minification
- ✅ CSS minification
- ✅ Static asset caching (1 year)
- ✅ Image lazy loading
- ✅ React Query optimized caching

## Rollback Procedure

If issues arise after deployment:
1. Click project name → Settings → Version History in Lovable
2. Select a previous working version
3. Click "Restore"
4. Verify functionality
5. Investigate and fix issues before redeploying

## Support & Resources

- Lovable Docs: https://docs.lovable.dev
- Lovable Discord: https://discord.com/channels/1119885301872070706
- Supabase Docs: https://supabase.com/docs
- Security Guide: https://docs.lovable.dev/features/security
