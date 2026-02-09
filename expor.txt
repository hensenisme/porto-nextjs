@echo off
setlocal EnableDelayedExpansion

rem ==== Simpan path root project ====
set "basePath=%CD%"

echo Membuat nextjs_code.md ...
echo. > nextjs_code.md

rem ==== Loop semua ekstensi ====
for %%x in (js jsx json css) do (
    for /R %%f in (*.%%x) do (
        rem ==== Skip node_modules ====
        echo %%f | findstr /I "\\node_modules\\" >nul
        if errorlevel 1 (
            rem ==== Skip .next ====
            echo %%f | findstr /I "\\.next\\" >nul
            if errorlevel 1 (
                rem ==== Skip public\assets ====
                echo %%f | findstr /I "\\public\\assets\\" >nul
                if errorlevel 1 (
                    rem ==== Skip package-lock.json ====
                    if /I "%%~nxf"=="package-lock.json" (
                        echo Melewati %%f
                    ) else (
                        set "fullPath=%%f"

                        rem ==== Buat path relatif dari root project ====
                        set "relPath=!fullPath:%basePath%\=!"
                        set "relPath=!relPath:\=/!"

                        rem ==== Escape karakter bermasalah minimal (hanya ^) ====
                        set "relPath=!relPath:^=^^!"

                        rem ==== Tentukan bahasa syntax highlight berdasarkan ekstensi ====
                        set "lang=plaintext"
                        if /I "%%x"=="js" set "lang=javascript"
                        if /I "%%x"=="jsx" set "lang=javascript"
                        if /I "%%x"=="json" set "lang=json"
                        if /I "%%x"=="css" set "lang=css"

                        rem ==== Tulis ke markdown ====
                        >> nextjs_code.md echo ## File: !relPath!
                        >> nextjs_code.md echo.
                        >> nextjs_code.md echo ```!lang!
                        >> nextjs_code.md type "%%f"
                        >> nextjs_code.md echo ```
                        >> nextjs_code.md echo.
                    )
                )
            )
        )
    )
)

echo Membuat PDF...
pandoc nextjs_code.md -o nextjs_project.pdf --highlight-style=tango --pdf-engine=lualatex -V geometry:margin=1in

echo ✅ PDF berhasil dibuat: nextjs_project.pdf
pause
