@REM This batch contains all of the parts of the project that need to be tested on the build server.
@REM This is not limitted to pure tests, but also includes building of documentation, static analysis, code coverage, etc.
@REM This file should be used as a sanity check of the developer's code before pushing to the build server.
@SETLOCAL
@set /a ERRORS=0
@set LOGFILE=%TEMP%\test.bat.log
@echo ********************************************************************************>%LOGFILE%

@call npm install

@echo Node Version:
@call node --version

@echo NPM Version:
@call npm --version

@echo Locally installed
@call npm list

@echo Globally installed
@call npm -g list

@call :runcheckerror call npm run gulp

@type %LOGFILE%
@del %LOGFILE%
@ENDLOCAL & IF %ERRORS% NEQ 0 EXIT /b %ERRORS%
@goto:eof

:runcheckerror
%*
@if %ERRORLEVEL% NEQ 0 (
  @set /a ERRORS=%ERRORS%+1
  @echo Error Level: %ERRORLEVEL%
  @REM Clear the error level
  @cmd /c "exit /b 0"
  @echo FAILED: %*>>%LOGFILE%
) else (
  @echo SUCCESS: %*>>%LOGFILE%
)
@goto:eof
