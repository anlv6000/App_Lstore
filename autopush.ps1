$repoPath = "D:\App_react_native\LTstore"
cd $repoPath

# Đồng bộ với remote
git pull origin master

# Kiểm tra thay đổi
$changes = git status --porcelain

if ($changes) {
    git add .
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Auto commit-by LeVanAn: $timestamp"
    git push origin master
    Write-Host "xong"
} else {
    Write-Host "khong thay doi"
}