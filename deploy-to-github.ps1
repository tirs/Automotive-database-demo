# Script to help push project to GitHub for deployment

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Prepare for GitHub Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
    Write-Host ""
}

# Check if .env files exist and warn
if (Test-Path "demo\.env") {
    Write-Host "⚠️  WARNING: demo/.env file exists!" -ForegroundColor Yellow
    Write-Host "Make sure it's in .gitignore (it should be)" -ForegroundColor White
    Write-Host ""
}

# Check git status
Write-Host "Current Git status:" -ForegroundColor Yellow
git status --short
Write-Host ""

$addFiles = Read-Host "Add all files to Git? (y/n)"
if ($addFiles -eq "y" -or $addFiles -eq "Y") {
    git add .
    Write-Host "✅ Files added to Git" -ForegroundColor Green
    Write-Host ""
}

$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Automotive database schema with React demo"
}

git commit -m $commitMessage
Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create a repository on GitHub (if not exists)" -ForegroundColor White
Write-Host "2. Add remote (if not added):" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Gray
Write-Host "3. Push to GitHub:" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "Then deploy to Vercel or Netlify (see DEPLOYMENT.md)" -ForegroundColor Yellow
Write-Host ""

$pushNow = Read-Host "Do you want to push to GitHub now? (y/n)"
if ($pushNow -eq "y" -or $pushNow -eq "Y") {
    $remoteUrl = Read-Host "Enter your GitHub repository URL (or press Enter to skip)"
    if (-not [string]::IsNullOrWhiteSpace($remoteUrl)) {
        # Check if remote exists
        $remoteExists = git remote get-url origin 2>$null
        if ($LASTEXITCODE -ne 0) {
            git remote add origin $remoteUrl
            Write-Host "✅ Remote added" -ForegroundColor Green
        } else {
            Write-Host "Remote already exists: $remoteExists" -ForegroundColor Yellow
            $updateRemote = Read-Host "Update remote URL? (y/n)"
            if ($updateRemote -eq "y" -or $updateRemote -eq "Y") {
                git remote set-url origin $remoteUrl
                Write-Host "✅ Remote updated" -ForegroundColor Green
            }
        }
        
        Write-Host ""
        Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Now deploy to Vercel or Netlify:" -ForegroundColor Cyan
            Write-Host "1. Go to https://vercel.com or https://netlify.com" -ForegroundColor White
            Write-Host "2. Import your GitHub repository" -ForegroundColor White
            Write-Host "3. Set root directory to 'demo'" -ForegroundColor White
            Write-Host "4. Add environment variables" -ForegroundColor White
            Write-Host "5. Deploy!" -ForegroundColor White
        } else {
            Write-Host ""
            Write-Host "❌ Push failed. Check the error above." -ForegroundColor Red
        }
    }
}

Write-Host ""

