# run-integration.ps1
Remove-Item -Path .\dev-server.log -ErrorAction SilentlyContinue
Remove-Item -Path .\desktop-test.log -ErrorAction SilentlyContinue

$start = Start-Process -FilePath npm -ArgumentList 'run','dev' -NoNewWindow -RedirectStandardOutput 'dev-server.log' -RedirectStandardError 'dev-server.log' -PassThru
Write-Host "Started dev server (PID $($start.Id)). Waiting for http://localhost:3000/api/products..."

$timeout = 60
$elapsed = 0
$ready = $false
while ($elapsed -lt $timeout) {
  try {
    $r = Invoke-WebRequest -UseBasicParsing -Uri http://localhost:3000/api/products -TimeoutSec 5 -ErrorAction Stop
    if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 400) { $ready = $true; break }
  } catch { Start-Sleep -Seconds 1; $elapsed += 1 }
}
if (-not $ready) {
  Write-Warning "Dev server did not respond within $timeout seconds. Proceeding anyway."
} else {
  Write-Host "Dev server is up."
}

$env:API_BASE = 'http://localhost:3000'
Write-Host "Running integration test (node run-desktop-integration-test.js)..."
node .\run-desktop-integration-test.js 2>&1 | Tee-Object -FilePath desktop-test.log

Write-Host "Integration test finished. Reports:"
if (Test-Path .\desktop-test-report.json) { Get-Content .\desktop-test-report.json -Raw }
Write-Host "Tail of dev-server.log:"
Get-Content .\dev-server.log -Tail 40 -ErrorAction SilentlyContinue
