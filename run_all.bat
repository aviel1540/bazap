@echo off
start cmd /c "cd bazap-ui && npm install && npm run dev"
start cmd /c "cd server && npm install && npm start"
start cmd /c "cd VoucherExcel && dotnet run"