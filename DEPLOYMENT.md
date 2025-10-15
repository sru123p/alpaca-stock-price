# AWS Amplify Deployment Guide

## Prerequisites
- AWS Account
- GitHub account (optional but recommended)
- Alpaca API credentials

## Step 1: Prepare Your Repository

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

## Step 2: Set Up AWS Amplify

1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. Search for "Amplify" in the services search bar
3. Click "Get Started" under "Amplify Hosting"

## Step 3: Connect Your Repository

1. Select your Git provider (GitHub/GitLab/Bitbucket)
2. Authorize AWS Amplify to access your repositories
3. Select the repository containing your stock analysis app
4. Select the branch you want to deploy (usually `main` or `master`)

## Step 4: Configure Build Settings

AWS Amplify should auto-detect your build settings. Verify they match:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Step 5: Advanced Settings (Optional)

- Add environment variables if needed (though this app stores API keys in localStorage)
- Configure custom domain if desired
- Set up branch-based deployments

## Step 6: Deploy

1. Click "Save and Deploy"
2. AWS Amplify will:
   - Clone your repository
   - Install dependencies
   - Build your application
   - Deploy to a CDN

Deployment typically takes 3-5 minutes.

## Step 7: Access Your App

Once deployed, AWS Amplify provides:
- A unique URL (e.g., `https://main.d1234abcd.amplifyapp.com`)
- Automatic HTTPS
- Global CDN distribution
- Automatic redeployment on git push

## Custom Domain Setup

1. In Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (5-10 minutes)

## Environment Variables (If Needed Later)

While this app stores API keys in localStorage, you can add environment variables:

1. Go to App Settings > Environment variables
2. Add variables with `VITE_` prefix:
   - `VITE_API_URL`
   - etc.
3. Redeploy the app

## Continuous Deployment

AWS Amplify automatically:
- Rebuilds on every git push to connected branch
- Supports PR previews
- Provides build history and rollback options

## Monitoring & Logs

- Access build logs in the Amplify Console
- Monitor traffic and performance
- Set up CloudWatch alarms if needed

## Cost Considerations

AWS Amplify pricing:
- Build minutes: First 1,000 minutes/month free
- Storage: First 5 GB stored free
- Data transfer: First 15 GB/month free

For most small applications, you'll stay within the free tier.

## Troubleshooting

### Build Fails
- Check build logs in Amplify Console
- Verify `package.json` has correct scripts
- Ensure all dependencies are listed

### App Not Loading
- Check browser console for errors
- Verify API keys are configured in the app
- Check CORS settings if calling external APIs

### Performance Issues
- Enable AWS CloudFront caching
- Optimize bundle size
- Use code splitting if needed

## Alternative: Manual Deployment

If you prefer manual deployment:

1. Build locally:
   ```bash
   npm run build
   ```

2. Upload `dist` folder to S3 bucket configured for static hosting
3. Set up CloudFront distribution pointing to S3 bucket
4. Configure Route53 for custom domain (optional)

## Support

For issues specific to:
- **AWS Amplify**: AWS Support or AWS Forums
- **Application Logic**: Check your repository issues
- **Alpaca API**: Alpaca Documentation
