$repoPath = "D:\App_react_native\LTstore"
cd $repoPath

# Đồng bộ với remote
git pull origin master

# Kiểm tra thay đổi
$changes = git status --porcelain

if ($changes) {
    git add .
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Auto commit: $timestamp"
    git push origin master
    Write-Host "✅ Đã commit và push lúc $timestamp"
} else {
    Write-Host ⏸️ Không có thay đổi nào để commit."
}